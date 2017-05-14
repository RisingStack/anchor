'use strict'

const helmBackup = require('../src')

helmBackup.backup({
  overwrite: true,
  name: 'my-chart',
  description: 'Backup of my-chart',
  version: '1.0.0',
  namespace: 'staging',
  resources: [
    'deployment/access-web',
    'deployment/security-worker'
  ]
})
  .then((chartResources) => {
    const resourceNames = chartResources.map((chartResource) => chartResource.resource)
    // eslint-disable-next-line no-console
    console.info(`Backup finished for: ${resourceNames.join(', ')}`)
  })
  // eslint-disable-next-line no-console
  .catch((err) => console.error('Backup error', err))
