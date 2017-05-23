'use strict'

const fp = require('lodash/fp')

function transformContainers (inputValues, inputChart, scope = '') {
  const valuesPrefix = scope ? `.Values.${scope}` : '.Values'
  const values = Object.assign({}, inputValues)
  const chart = Object.assign({}, inputChart)

  chart.spec.containers = chart.spec.containers.map((container, key) => {
    const containerName = fp.camelCase(container.name) || key.toString()
    let templateValuePathPrefix
    let containerValues

    // Simplify with one container
    if (chart.spec.containers.length > 1) {
      templateValuePathPrefix = `${valuesPrefix}.containers.${containerName}`

      values.containers = values.containers || {}
      values.containers[containerName] = values.containers[containerName] || {}
      containerValues = values.containers[containerName]
    } else {
      templateValuePathPrefix = `${valuesPrefix}`
      containerValues = values
    }

    // Image
    const tmp = container.image.split(':')
    const image = tmp[0]
    const imageTag = tmp[1]

    containerValues.image = image
    containerValues.imageTag = imageTag.toString()  // prevent casting to Number

    container.image = `"{{ ${templateValuePathPrefix}.image }}:`
       + `{{ ${templateValuePathPrefix}.imageTag }}"`

    // Environment variables
    if (container.env) {
      container.env = container.env.map((env) => {
        if (!env.value) {
          return env
        }

        const envName = fp.camelCase(`env_${env.name}`)

        containerValues[envName] = env.value

        return Object.assign({}, env, {
          value: `{{ ${templateValuePathPrefix}.${envName} | quote }}`
        })
      })
    }

    // Resources
    if (container.resources) {
      if (container.resources.limits) {
        if (container.resources.limits.cpu) {
          containerValues.resourcesLimitsCPU = container.resources.limits.cpu
          container.resources.limits.cpu = `{{ ${templateValuePathPrefix}`
            + `.resourcesLimitsCPU | default "${container.resources.limits.cpu}" }}`
        }
        if (container.resources.limits.memory) {
          containerValues.resourcesLimitsMemory = container.resources.limits.memory
          container.resources.limits.memory = `{{ ${templateValuePathPrefix}`
            + `.resourcesLimitsMemory | default "${container.resources.limits.memory}" }}`
        }
      }

      if (container.resources.requests) {
        if (container.resources.requests.cpu) {
          containerValues.resourcesRequestsCPU = container.resources.requests.cpu
          container.resources.requests.cpu = `{{ ${templateValuePathPrefix}`
            + `.resourcesRequestsCPU | default "${container.resources.requests.cpu}" }}`
        }
        if (container.resources.requests.memory) {
          containerValues.resourcesRequestsMemory = container.resources.requests.memory
          container.resources.requests.memory = `{{ ${templateValuePathPrefix}`
            + `.resourcesRequestsMemory | default "${container.resources.requests.memory}" }}`
        }
      }
    }

    return container
  })

  if (chart.metadata) {
    chart.metadata.creationTimestamp = undefined
  }

  return {
    values,
    chart
  }
}

function transform (inputValues, inputChart, scope = '') {
  const containers = transformContainers(inputValues, inputChart, scope)
  const values = Object.assign({}, containers.values)
  const chart = Object.assign({}, containers.chart)

  return {
    values,
    chart
  }
}

module.exports = transform
module.exports.transform = transform
