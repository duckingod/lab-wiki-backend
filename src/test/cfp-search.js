const request = require('supertest')
const should = require('chai').should()
const expect = require('chai').expect
const {loginCookie} = require('./utils')
const startServer = require('../server')

describe('Test Call for Paper', function() {
  let server
  beforeEach(async function() {
    server = await startServer()
  })
  afterEach(async function() {
    server.close()
  })
  it('responds to /api/conference/search', function testCfpSearch(done) {
    request(server)
      .get('/api/conference/search')
      .set('Cookie', [loginCookie('labwiki', 'labwiki@nlg.csie.ntu.edu.tw')])
      .end((err, res) => {
        res.status.should.equal(200)
        expect(res.body).to.have.lengthOf(0)
        done()
      })
  })
  it('responds to /api/conference/search?q=coling', function testCfpSearch(done) {
    request(server)
      .get('/api/conference/search?q=coling')
      .set('Cookie', [loginCookie('labwiki', 'labwiki@nlg.csie.ntu.edu.tw')])
      .end((err, res) => {
        res.status.should.equal(200)
        expect(res.body).length.to.be.greaterThan(0)
        expect(res.body[0]).to.have.property('name')
        expect(res.body[0].name).to.have.string('COLING')
        done()
      })
  })
})
