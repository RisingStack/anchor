'use strict'

const { expect } = require('chai')
const podTransform = require('./pod')

describe('Transform Pod', () => {
  let podChart
  let container1
  let container2

  beforeEach(() => {
    container1 = {
      name: 'my-service',
      image: 'risingstack/my-service:v1',
      env: [
        {
          name: 'NODE_ENV',
          valur: 'production'
        },
        {
          name: 'REDIS_URI',
          valur: 'redis://myredis'
        }
      ],
      resources: {
        limits: { cpu: '50m', memory: '1536Mi' },
        requests: { cpu: '40m', memory: '256Mi' }
      }
    }

    container2 = {
      name: 'foo',
      image: 'risingstack/foo:v2',
      env: [
        {
          name: 'PG_URI',
          valur: 'postgres://mypg'
        }
      ],
      resources: {
        limits: { cpu: '100m', memory: '1536Mi' },
        requests: { cpu: '80m', memory: '128Mi' }
      }
    }

    podChart = {
      metadata: {
        creationTimestamp: 1234
      },
      spec: {
        containers: [
          container1,
          container2
        ]
      }
    }
  })

  describe('spec.containers transform', () => {
    describe('with multiple containers', () => {
      it('should extract image and resources', () => {
        const { values, chart } = podTransform({}, podChart)

        expect(values.containers).to.be.eql({
          myService: {
            image: 'risingstack/my-service',
            imageTag: 'v1',
            resourcesLimitsCPU: '50m',
            resourcesLimitsMemory: '1536Mi',
            resourcesRequestsCPU: '40m',
            resourcesRequestsMemory: '256Mi'
          },
          foo: {
            image: 'risingstack/foo',
            imageTag: 'v2',
            resourcesLimitsCPU: '100m',
            resourcesLimitsMemory: '1536Mi',
            resourcesRequestsCPU: '80m',
            resourcesRequestsMemory: '128Mi'
          }
        })

        // Container 0
        expect(chart.spec.containers[0].image).to.be
          .equal('"{{ .Values.containers.myService.image }}:{{ .Values.containers.myService.imageTag }}"')
        expect(chart.spec.containers[0].resources).to.be.eql({
          limits: {
            cpu: '{{ .Values.containers.myService.resourcesLimitsCPU | default "50m" }}',
            memory: '{{ .Values.containers.myService.resourcesLimitsMemory | default "1536Mi" }}'
          },
          requests: {
            cpu: '{{ .Values.containers.myService.resourcesRequestsCPU | default "40m" }}',
            memory: '{{ .Values.containers.myService.resourcesRequestsMemory | default "256Mi" }}'
          }
        })

        // Container 1
        expect(chart.spec.containers[1].image).to.be
          .equal('"{{ .Values.containers.foo.image }}:{{ .Values.containers.foo.imageTag }}"')
        expect(chart.spec.containers[1].resources).to.be.eql({
          limits: {
            cpu: '{{ .Values.containers.foo.resourcesLimitsCPU | default "100m" }}',
            memory: '{{ .Values.containers.foo.resourcesLimitsMemory | default "1536Mi" }}'
          },
          requests: {
            cpu: '{{ .Values.containers.foo.resourcesRequestsCPU | default "80m" }}',
            memory: '{{ .Values.containers.foo.resourcesRequestsMemory | default "128Mi" }}'
          }
        })
      })

      it('should respect scope', () => {
        const { chart } = podTransform({}, podChart, 'myPod')

        // Container 0
        expect(chart.spec.containers[0].image).to.be
          .equal('"{{ .Values.myPod.containers.myService.image }}:{{ .Values.myPod.containers.myService.imageTag }}"')
        expect(chart.spec.containers[0].resources).to.be.eql({
          limits: {
            cpu: '{{ .Values.myPod.containers.myService.resourcesLimitsCPU | default "50m" }}',
            memory: '{{ .Values.myPod.containers.myService.resourcesLimitsMemory | default "1536Mi" }}'
          },
          requests: {
            cpu: '{{ .Values.myPod.containers.myService.resourcesRequestsCPU | default "40m" }}',
            memory: '{{ .Values.myPod.containers.myService.resourcesRequestsMemory | default "256Mi" }}'
          }
        })

        // Container 1
        expect(chart.spec.containers[1].image).to.be
          .equal('"{{ .Values.myPod.containers.foo.image }}:{{ .Values.myPod.containers.foo.imageTag }}"')
        expect(chart.spec.containers[1].resources).to.be.eql({
          limits: {
            cpu: '{{ .Values.myPod.containers.foo.resourcesLimitsCPU | default "100m" }}',
            memory: '{{ .Values.myPod.containers.foo.resourcesLimitsMemory | default "1536Mi" }}'
          },
          requests: {
            cpu: '{{ .Values.myPod.containers.foo.resourcesRequestsCPU | default "80m" }}',
            memory: '{{ .Values.myPod.containers.foo.resourcesRequestsMemory | default "128Mi" }}'
          }
        })
      })
    })

    describe('with single container', () => {
      beforeEach(() => {
        podChart.spec.containers = [container1]
      })

      it('should extract image and resources', () => {
        const { values, chart } = podTransform({}, podChart)

        expect(values).to.be.eql({
          image: 'risingstack/my-service',
          imageTag: 'v1',
          resourcesLimitsCPU: '50m',
          resourcesLimitsMemory: '1536Mi',
          resourcesRequestsCPU: '40m',
          resourcesRequestsMemory: '256Mi'
        })

        expect(chart.spec.containers[0].image).to.be.equal('"{{ .Values.image }}:{{ .Values.imageTag }}"')
        expect(chart.spec.containers[0].resources).to.be.eql({
          limits: {
            cpu: '{{ .Values.resourcesLimitsCPU | default "50m" }}',
            memory: '{{ .Values.resourcesLimitsMemory | default "1536Mi" }}'
          },
          requests: {
            cpu: '{{ .Values.resourcesRequestsCPU | default "40m" }}',
            memory: '{{ .Values.resourcesRequestsMemory | default "256Mi" }}'
          }
        })
      })

      it('should respect scope', () => {
        const { chart } = podTransform({}, podChart, 'myPod')

        expect(chart.spec.containers[0].image).to.be.equal('"{{ .Values.myPod.image }}:{{ .Values.myPod.imageTag }}"')
        expect(chart.spec.containers[0].resources).to.be.eql({
          limits: {
            cpu: '{{ .Values.myPod.resourcesLimitsCPU | default "50m" }}',
            memory: '{{ .Values.myPod.resourcesLimitsMemory | default "1536Mi" }}'
          },
          requests: {
            cpu: '{{ .Values.myPod.resourcesRequestsCPU | default "40m" }}',
            memory: '{{ .Values.myPod.resourcesRequestsMemory | default "256Mi" }}'
          }
        })
      })
    })
  })

  describe('meta and status', () => {
    it('should cleanup meta and status', () => {
      const { chart } = podTransform({}, podChart)

      expect(chart.metadata.creationTimestamp).to.be.equal(undefined)
    })
  })
})
