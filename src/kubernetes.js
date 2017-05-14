'use strict'

const childProcess = require('child_process')

// TODO: use API
function getResource (namespace, resource) {
  const output = childProcess.execSync(
    `kubectl --namespace=${namespace} get ${resource} --output=json --export`
  )
  const data = JSON.parse(output)
  return Promise.resolve(data)
}

module.exports = {
  getResource
}
