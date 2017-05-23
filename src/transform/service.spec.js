'use strict'

const { expect } = require('chai')
const serviceTransform = require('./service')

describe('Transform Service', () => {
  let serviceChart

  beforeEach(() => {
    serviceChart = {
      name: 'my-service',
      metadata: {
        creationTimestamp: 1234,
        selfLink: '/self/service'
      },
      spec: {
        type: 'LoadBalancer',
        clusterIP: '1.2.3.4'
      },
      status: ''
    }
  })

  describe('spec.data transform', () => {
    it('should extract data', () => {
      const { values, chart } = serviceTransform({}, serviceChart)

      expect(values).to.be.eql({
        type: 'LoadBalancer'
      })

      expect(chart.spec.type).to.be.equal('{{ .Values.type | default "LoadBalancer" }}')
    })

    it('should respect scope', () => {
      const { chart } = serviceTransform({}, serviceChart, 'myService')

      expect(chart.spec.type).to.be.equal('{{ .Values.myService.type | default "LoadBalancer" }}')
    })
  })

  describe('meta, status', () => {
    it('should cleanup meta, clusterIP and status', () => {
      const { chart } = serviceTransform({}, serviceChart)

      expect(chart.metadata.selfLink).to.be.equal(undefined)
      expect(chart.metadata.creationTimestamp).to.be.equal(undefined)
      expect(chart.spec.clusterIP).to.be.equal(undefined)
      expect(chart.status).to.be.equal(undefined)
    })
  })
})
