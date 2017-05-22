'use strict'

const { expect } = require('chai')
const deploymentTransform = require('./deployment')
const pod = require('./pod')

describe('Transform Deployment', () => {
  let deploymentChart

  beforeEach(() => {
    deploymentChart = {
      metadata: {
        selfLink: 'self/deployment/foo',
        creationTimestamp: 1234
      },
      spec: {
        replicas: 2,
        template: {
          spec: {
            name: 'My Pod',
            containers: [
              {
                image: 'risingstack/foo:v1'
              }
            ]
          }
        }
      }
    }
  })

  describe('spec.template transform', () => {
    it('should call pod transform with default values', function () {
      this.sandbox.spy(pod, 'transform')

      deploymentTransform({}, deploymentChart)
      expect(pod.transform).to.be.calledWith({}, deploymentChart.spec.template, undefined)
    })

    it('should call pod transform with initial values', function () {
      this.sandbox.spy(pod, 'transform')

      deploymentTransform({ foo: 'bar' }, deploymentChart)
      expect(pod.transform).to.be.calledWith({ foo: 'bar' }, deploymentChart.spec.template, undefined)
    })

    it('should call pod transform with scope', function () {
      this.sandbox.spy(pod, 'transform')

      deploymentTransform({}, deploymentChart, 'myScope')
      expect(pod.transform).to.be.calledWith({}, deploymentChart.spec.template, 'myScope')
    })

    it('should merge pod transform values and chart', function () {
      this.sandbox.stub(pod, 'transform').returns({
        values: { pod: 'pod-value' },
        chart: { spec: { containers: [] } }
      })

      const { values, chart } = deploymentTransform({ initial: 'initial-value' }, deploymentChart)
      expect(chart.spec.template.spec).to.be.eql({
        name: 'My Pod',
        containers: [
          {
            image: 'risingstack/foo:v1'
          }
        ]
      })
      expect(values).to.have.property('initial', 'initial-value')
      expect(values).to.have.property('pod', 'pod-value')
    })
  })

  describe('spec.replicas transform', () => {
    it('should transform replicas', () => {
      const { values, chart } = deploymentTransform({}, deploymentChart)

      expect(values.replicas).to.be.equal(2)
      expect(chart.spec.replicas).to.be.equal('{{ .Values.replicas | default 2 }}')
    })

    it('should respect scope', () => {
      const { values, chart } = deploymentTransform({}, deploymentChart, 'myDeployment')

      expect(values.replicas).to.be.equal(2)
      expect(chart.spec.replicas).to.be.equal('{{ .Values.myDeployment.replicas | default 2 }}')
    })
  })

  describe('meta and status', () => {
    it('should cleanup meta and status', () => {
      const { chart } = deploymentTransform({}, deploymentChart)

      expect(chart.metadata.selfLink).to.be.equal(undefined)
      expect(chart.metadata.creationTimestamp).to.be.equal(undefined)
    })
  })
})
