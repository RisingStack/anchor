'use strict'

const helmBackup = require('../src')

const NAMESPACE = 'staging'
const DEPLOYMENT = 'access-web'

helmBackup.backup.deployment(NAMESPACE, DEPLOYMENT)
  .then(() => console.info('Backup finished'))
  .catch((err) => console.error('Backup error', err))
