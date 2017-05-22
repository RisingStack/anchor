'use strict'

const fp = require('lodash/fp')
const pod = require('./pod')

function transform (inputValues, inputChart, scope) {
  const valuesPrefix = scope ? `.${scope}` : ''
  let values = Object.assign({}, inputValues)
  let chart = Object.assign({}, inputChart)

  // Pod
  const deploymentPod = pod.transform(inputValues, inputChart.spec.template, scope)

  values = fp.merge(values)(deploymentPod.values)
  chart = fp.merge(chart)({
    spec: {
      template: deploymentPod.chart
    }
  })

  // Replicas
  if (chart.spec.replicas) {
    values.replicas = chart.spec.replicas
    chart.spec.replicas = `{{ .Values${valuesPrefix}.replicas | default ${values.replicas} }}`
  }

  chart.status = undefined
  chart.metadata.selfLink = undefined
  chart.metadata.creationTimestamp = undefined

  return {
    values,
    chart
  }
}

module.exports = transform
module.exports.transform = transform
