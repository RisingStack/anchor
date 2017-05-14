'use strict'

const winston = require('winston')
const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')

before(() => {
  chai.use(sinonChai)
  winston.remove(winston.transports.Console)
})

beforeEach(function beforeEach () {
  this.sandbox = sinon.sandbox.create()
})

afterEach(function afterEach () {
  this.sandbox.restore()
})
