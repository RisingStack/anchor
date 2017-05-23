'use strict'

const { expect } = require('chai')
const secretTransform = require('./secret')

describe('Transform Secret', () => {
  let secretChart

  beforeEach(() => {
    secretChart = {
      name: 'my-secret',
      metadata: {
        creationTimestamp: 1234,
        selfLink: '/self/secret'
      },
      data: {
        'so-secret': new Buffer('so-secret').toString('base64'),
        foo_bar: new Buffer('foo-secret').toString('base64'),
        suchWow: new Buffer('such-secret').toString('base64')
      }
    }
  })

  describe('spec.data transform', () => {
    it('should extract data', () => {
      const { values, chart } = secretTransform({}, secretChart)

      expect(values).to.be.eql({
        soSecret: 'so-secret',
        fooBar: 'foo-secret',
        suchWow: 'such-secret'
      })

      expect(chart.data).to.be.eql({
        'so-secret': '{{ .Values.soSecret | b64enc }}',
        foo_bar: '{{ .Values.fooBar | b64enc }}',
        suchWow: '{{ .Values.suchWow | b64enc }}'
      })
    })

    it('should respect scope', () => {
      const { chart } = secretTransform({}, secretChart, 'mySecret')

      expect(chart.data).to.be.eql({
        'so-secret': '{{ .Values.mySecret.soSecret | b64enc }}',
        foo_bar: '{{ .Values.mySecret.fooBar | b64enc }}',
        suchWow: '{{ .Values.mySecret.suchWow | b64enc }}'
      })
    })
  })

  describe('meta', () => {
    it('should cleanup meta', () => {
      const { chart } = secretTransform({}, secretChart)

      expect(chart.metadata.selfLink).to.be.equal(undefined)
      expect(chart.metadata.creationTimestamp).to.be.equal(undefined)
    })
  })
})
