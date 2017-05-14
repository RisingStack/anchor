'use strict'

function convertToChart (converters, inputChart) {
  const result = converters.reduce((result, converter) => {
    const convertResult = converter(result.values, result.chart)

    const values = Object.assign(result.values, convertResult.values)
    const chart = Object.assign(result.chart, convertResult.chart)

    return { values, chart }
  }, {
    values: {},
    chart: inputChart
  })

  return result
}

module.exports = {
  convertToChart
}
