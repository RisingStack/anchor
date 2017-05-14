'use strict'

const childProcess = require('child_process')

// TODO: use API
function getResource (namespace, resource) {
  const output = childProcess.execSync(
    `kubectl --namespace=${namespace} get ${resource} --output=json --export`
  )
  let data

  try {
    data = JSON.parse(output)
  } catch (err) {
    return Promise.reject(err)
  }

  return Promise.resolve(data)
}

module.exports = {
  getResource
}
