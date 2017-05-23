'use strict'

const _ = require('lodash')

function transform (inputValues, inputChart, scope) {
  const valuesPrefix = scope ? `.${scope}` : ''
  const values = Object.assign({}, inputValues)
  const chart = Object.assign({}, inputChart)

  chart.data = _.reduce(chart.data, (data, dataValue, dataKey) => {
    const key = _.camelCase(dataKey)

    values[key] = new Buffer(dataValue, 'base64').toString('utf-8')
    data[dataKey] = `{{ .Values${valuesPrefix}.${key} | b64enc }}`

    return data
  }, {})

  chart.metadata.selfLink = undefined
  chart.metadata.creationTimestamp = undefined

  return {
    values,
    chart
  }
}

module.exports = transform
