'use strict'

const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const { toYAML } = require('./yaml')

const DEFAULT_OUTPUT_PATH = path.join(__dirname, '../output')

function init ({
  overwrite = false,
  outputPath = DEFAULT_OUTPUT_PATH,
  name = 'my-chart',
  description = '',
  version = '0.1.0'
}) {
  const outputTemplatePath = path.join(outputPath, 'templates')
  const filePath = path.join(outputPath, 'Chart.yaml')
  const chart = {
    apiVersion: 'v1',
    description,
    name,
    version
  }

  // Recreate folder
  if (overwrite) {
    rimraf.sync(outputPath)
    mkdirp.sync(outputPath)
  }
  mkdirp.sync(outputTemplatePath)

  return saveToYAMLFile(filePath, chart)
}

function saveTemplate (outputPath = DEFAULT_OUTPUT_PATH, chartResource) {
  const fileName = `templates/${chartResource.resourceType}-${chartResource.resourceName}.yaml`
  const filePath = path.join(outputPath, fileName)
  return saveToYAMLFile(filePath, chartResource.chart)
}

function saveValues (outputPath = DEFAULT_OUTPUT_PATH, values) {
  const filePath = path.join(outputPath, 'values.yaml')
  return saveToYAMLFile(filePath, values)
}

function saveToYAMLFile (filePath, data) {
  const output = toYAML(data)
  return saveToFile(filePath, output)
}

function saveToFile (filePath, output) {
  fs.writeFileSync(filePath, output, 'utf-8')
  return Promise.resolve()
}

module.exports = {
  init,
  saveTemplate,
  saveValues
}
