'use strict'

const childProcess = require('child_process')

// TODO: use API
function getDeployment (namespace, deployment) {
  const output = childProcess.execSync(
    `kubectl --namespace=${namespace} get deployment ${deployment} --output=json --export`
  )
  const data = JSON.parse(output)
  return Promise.resolve(data)
}

module.exports = {
  getDeployment
}
