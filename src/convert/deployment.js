'use strict'

function convert (inputValues, inputChart) {
  const values = Object.assign({}, inputValues)
  const chart = Object.assign({}, inputChart)

  if (chart.spec.replicas) {
    values.replicas = chart.spec.replicas
    chart.spec.replicas = `{{ .Values.replicas | default ${values.replicas} }}`
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

module.exports = convert
