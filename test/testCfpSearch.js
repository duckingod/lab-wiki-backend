const request = require('supertest')
const should = require('chai').should()
const expect = require('chai').expect
const {loginCookie} = require('./utils')

describe('Test Call for Paper', function() {
  let server
  beforeEach(function() {
    server = require('../backend')
  })
  it('responds to /api/cfpSearch', function testCfpSearch(done) {
    request(server)
      .get('/api/cfpSearch')
      .set('Cookie', [loginCookie('labwiki', 'labwiki@nlg.csie.ntu.edu.tw')])
      .end((err, res) => {
        res.status.should.equal(200)
        expect(res.body).to.have.lengthOf(0)
        done()
      })
  })
  it('responds to /api/cfpSearch?q=coling', function testCfpSearch(done) {
    request(server)
      .get('/api/cfpSearch?q=coling')
      .set('Cookie', [loginCookie('labwiki', 'labwiki@nlg.csie.ntu.edu.tw')])
      .end((err, res) => {
        res.status.should.equal(200)
        expect(res.body).length.to.be.greaterThan(0)
        expect(res.body[0]).to.have.property('name');
        expect(res.body[0].name).to.have.string('COLING')
        done()
      })
  })
})
