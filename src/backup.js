'use strict'

const fp = require('lodash/fp')
const kubernetes = require('./kubernetes')
const transform = require('./transform')
const chart = require('./chart')

function backup ({
  outputPath,
  name,
  description,
  version,
  namespace,
  resources
}) {
  const getAndTransformResources = resources.map((resource) =>
    kubernetes.getResource(namespace, resource)
      .then((data) => {
        const resourceTmp = resource.split('/')
        const resourceType = resourceTmp[0]
        const resourceName = resourceTmp[1]
        const scope = fp.camelCase(resource)
        const resourceTransformer = transform[resourceType] || transform.noop
        const chart = transform.toChart([resourceTransformer], data, scope)
        // FIXME: workaround to skip undefined values
        const output = JSON.parse(JSON.stringify(chart))

        return Promise.resolve(Object.assign(output, {
          resource,
          resourceType,
          resourceName,
          scope
        }))
      })
  )

  return Promise.all(getAndTransformResources)
    .then((chartResources) => chart.init(outputPath, { name, description, version })
      .then(() => chartResources)
    )
    .then((chartResources) => {
      const values = chartResources.reduce((values, chartResource) =>
        // Support both scoped and unscoped values (sub-charts)
        Object.assign(values, chartResource.scope
          ? {
            [chartResource.scope]: chartResource.values
          }
          : chartResource.values
        )
      , {})

      const saveTemplates = chartResources.map((chartResource) =>
        chart.saveTemplate(outputPath, chartResource)
      )

      return Promise.all([
        chart.saveValues(outputPath, values),
        saveTemplates
      ])
      .then(() => chartResources)
    })
}

module.exports = backup
