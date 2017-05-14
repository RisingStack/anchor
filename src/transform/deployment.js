'use strict'

const fp = require('lodash/fp')
const podTransform = require('./pod')

function transform (inputValues, inputChart, scope) {
  const valuesPrefix = scope ? `.${scope}` : ''
  let values = Object.assign({}, inputValues)
  let chart = Object.assign({}, inputChart)

  // Pod
  const deploymentPod = podTransform(inputValues, inputChart.spec.template, scope)

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

  delete chart.status
  delete chart.metadata.selfLink
  delete chart.metadata.creationTimestamp
  delete chart.spec.template.metadata.creationTimestamp

  return {
    values,
    chart
  }
}

module.exports = transform
