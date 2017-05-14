'use strict'

const logger = require('winston')
const backup = require('./backup')

const NAMESPACE = 'staging'
const DEPLOYMENT = 'access-web'

backup.deployment(NAMESPACE, DEPLOYMENT)
  .then(() => logger.info('Backup finished'))
  .catch((err) => logger.error('Backup error', err))
