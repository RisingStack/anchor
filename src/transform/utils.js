'use strict'

function toChart (transformers, inputChart, scope = '') {
  const result = transformers.reduce((result, transformer) => {
    const transformResult = transformer(result.values, result.chart, scope)

    const values = Object.assign(result.values, transformResult.values)
    const chart = Object.assign(result.chart, transformResult.chart)

    return { values, chart }
  }, {
    values: {},
    chart: inputChart
  })

  return result
}

module.exports = {
  toChart
}
