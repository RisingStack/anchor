'use strict'

const yaml = require('js-yaml')

function toYAML (data) {
  const output = yaml.dump(data, {
    lineWidth: 999999
  })
  return fixYAML(output)
}

function fixYAML (str) {
  return str
    .replace(/'{{/g, '{{')
    .replace(/}}'/g, '}}')
}

module.exports = {
  toYAML
}
