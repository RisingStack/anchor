'use strict'

const yaml = require('js-yaml')

function toYAML (data) {
  const output = yaml.dump(data, {
    lineWidth: Infinity // prevent line breaks
  })
  return fixYAML(output)
}

// Remove unnecessary qoutes
function fixYAML (str) {
  return str
    .replace(/'{{/g, '{{')
    .replace(/}}'/g, '}}')
}

module.exports = {
  toYAML
}
