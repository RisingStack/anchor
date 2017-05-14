'use strict'

const helmBackup = require('../src')

const NAMESPACE = 'staging'
const RESOURCES_TO_BACKUP = [
  'deployment/access-web',
  'deployment/security-worker'
]

helmBackup.backup(NAMESPACE, RESOURCES_TO_BACKUP)
  .then(() => console.info('Backup finished'))
  .catch((err) => console.error('Backup error', err))
