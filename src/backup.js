'use strict'

const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')
const fp = require('lodash/fp')
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

function saveTemplate (chartResource) {
  const fileName = `templates/${chartResource.resourceType}-${chartResource.resourceName}.yaml`
  const filePath = path.join(__dirname, OUTPUT, fileName)
  const output = toYAML(chartResource.chart)
  return saveToFile(filePath, output)
}

function saveValues (values) {
  const filePath = path.join(__dirname, OUTPUT, 'values.yaml')
  const output = toYAML(values)
  return saveToFile(filePath, output)
}

function saveToFile (filePath, output) {
  fs.writeFileSync(filePath, output, 'utf-8')
  return Promise.resolve()
}

function backup (namespace, resources) {
  const getAndTransformResources = resources.map((resource) =>
    kubernetes.getResource(namespace, resource)
      .then((data) => {
        const resourceTmp = resource.split('/')
        const resourceType = resourceTmp[0]
        const resourceName = resourceTmp[1]
        const scope = fp.camelCase(resourceName)
        const resourceTransformer = transform[resourceType] || transform.noop
        const output = transform.toChart([resourceTransformer], data, scope)

        return Promise.resolve(Object.assign(output, {
          resource,
          resourceType,
          resourceName,
          scope
        }))
      })
  )

  return Promise.all(getAndTransformResources)
    .then((chartResources) => initChart()
      .then(() => chartResources)
    )
    .then((chartResources) => {
      const values = chartResources.reduce((values, chartResource) =>
        Object.assign(values, { [chartResource.scope]: chartResource.values })
      , {})

      const saveTemplates = chartResources.map((chartResource) =>
        saveTemplate(chartResource)
      )

      return Promise.all([
        saveValues(values),
        saveTemplates
      ])
    })
}

module.exports = backup
