'use strict'

function transform (inputValues, inputChart, scope) {
  const valuesPrefix = scope ? `.${scope}` : ''
  const values = Object.assign({}, inputValues)
  const chart = Object.assign({}, inputChart)

  values.type = chart.spec.type
  chart.spec.type = `{{ .Values${valuesPrefix}.type | default ${values.type} }}`

  chart.metadata.selfLink = undefined
  chart.metadata.creationTimestamp = undefined
  chart.status = undefined
  chart.spec.clusterIP = undefined

  return {
    values,
    chart
  }
}

module.exports = transform
