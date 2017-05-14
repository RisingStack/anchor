'use strict'

function container (inputValues, inputChart) {
  const values = Object.assign({}, inputValues)
  const chart = Object.assign({}, inputChart)

  chart.spec.template.spec.containers = chart.spec.template.spec.containers.map((container) => {
    // Image
    const tmp = container.image.split(':')
    const image = tmp[0]
    const imageTag = tmp[1]

    values.containers = values.containers || {}
    values.containers[container.name] = Object.assign(values.containers[container.name] || {}, {
      image,
      imageTag
    })

    container.image = `{{ .Values.containers.${container.name}.image }}:`
       + `{{ .Values.containers.${container.name}.imageTag }}`

    return container
  })

  return {
    values,
    chart
  }
}

function convert (inputValues, inputChart) {
  const containers = container(inputValues, inputChart)
  const values = Object.assign({}, containers.values)
  const chart = Object.assign({}, containers.chart)

  return {
    values,
    chart
  }
}

module.exports = convert
