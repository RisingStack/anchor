'use strict'

const path = require('path')
const anchor = require('../src')

const DEFAULT_OUTPUT_PATH = path.join(__dirname, '../output')

/*
* In this example we create a main chart with common resources and two sub-charts for the deployments.
*
* "Security" is our imaginary application group: with one service, one secret and two deployments.
* Our resources are: service/security, ssecret/ecurity-pg, deployment/security-web and deployment/security-worker
*/

Promise.all([
  // main-chart: security (contains common resources: secret)
  anchor.snapshot({
    outputPath: DEFAULT_OUTPUT_PATH,
    overwrite: true,
    name: 'my-chart',
    description: 'Backup of security',
    version: '1.0.0',
    namespace: 'staging',
    resources: [
      'secret/security-pg'
    ]
  }),
  // sub-chart: security/charts/web (contains web related resources: deployment and service)
  anchor.snapshot({
    outputPath: path.join(DEFAULT_OUTPUT_PATH, '/charts/web'),
    overwrite: true,
    name: 'web',
    description: 'Backup of security web',
    version: '1.0.0',
    namespace: 'staging',
    resources: [
      'service/security',
      'deployment/security-web'
    ]
  }),
  // sub-chart: security/charts/worker (contains worker related resources: deployment)
  anchor.snapshot({
    outputPath: path.join(DEFAULT_OUTPUT_PATH, '/charts/worker'),
    overwrite: true,
    name: 'worker',
    description: 'Backup of security worker',
    version: '1.0.0',
    namespace: 'staging',
    resources: [
      'deployment/security-worker'
    ]
  })
])
  .then(() => {
    // eslint-disable-next-line no-console
    console.info('Snapshot finished')
    process.exit(0)
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Snapshot error', err)
    process.exit(-1)
  })
