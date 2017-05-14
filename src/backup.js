'use strict'

const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')
const transform = require('./transform')
const kubernetes = require('./kubernetes')
const { toYAML } = require('./yaml')

const OUTPUT = '../output'

function initChart () {
  const outputPath = path.join(__dirname, OUTPUT)
  const outputTemplatePath = path.join(outputPath, 'templates')
  const fileName = path.join(outputPath, 'Chart.yaml')
  const chart = {
    apiVersion: 'v1',
    description: 'Backup of my-chart',
    name: 'my-chart',
    version: '0.1.0'
  }

  // Recreate folder
  rimraf.sync(outputPath)
  fs.mkdirSync(outputPath)
  fs.mkdirSync(outputTemplatePath)

  const output = toYAML(chart)
  return saveToFile(fileName, output)
}

function saveDeployment (chart, deployment) {
  const fileName = path.join(__dirname, OUTPUT, `templates/${deployment}.yaml`)
  const output = toYAML(chart)
  return saveToFile(fileName, output)
}

function saveValues (values) {
  const fileName = path.join(__dirname, OUTPUT, 'values.yaml')
  const output = toYAML(values)
  return saveToFile(fileName, output)
}

function saveToFile (fileName, output) {
  fs.writeFileSync(fileName, output, 'utf-8')
  return Promise.resolve()
}

function backupDeployment (namespace, deployment) {
  return initChart()
    .then(() => kubernetes.getDeployment(namespace, deployment))
    .then((data) => {
      const output = transform.toChart([transform.pod, transform.deployment], data)
      return Promise.resolve(output)
    })
    .then(({ values, chart }) => Promise.all([
      saveValues(values),
      saveDeployment(chart, deployment)
    ]))
}

module.exports = {
  deployment: backupDeployment
}
