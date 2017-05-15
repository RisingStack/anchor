'use strict'

const anchor = require('../src')

/*
* In this example we create a snapshot from our resources.
*
* "Security" is our imaginary application group: with one service, one secret and two deployments.
* Our resources are: service/security, ssecret/ecurity-pg, deployment/security-web and deployment/security-worker
*/

anchor.snapshot({
  overwrite: true,
  name: 'my-chart',
  description: 'Backup of my-chart',
  version: '1.0.0',
  namespace: 'staging',
  resources: [
    'deployment/access-web',
    'deployment/security-worker',
    'secret/security-pg',
    'service/security'
  ]
})
  .then((chartResources) => {
    const resourceNames = chartResources.map((chartResource) => chartResource.resource)
    // eslint-disable-next-line no-console
    console.info(`Snapshot finished for: ${resourceNames.join(', ')}`)
  })
  // eslint-disable-next-line no-console
  .catch((err) => console.error('Snapshot error', err))
