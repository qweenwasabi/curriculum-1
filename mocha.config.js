process.env.NODE_ENV = 'test'
process.env.LOG_SQL_QUERIES = '1'
process.env.CURRICULUM_BASE_URL = 'http://curriculum.learnersguild.test'
process.env.IDM_BASE_URL = 'http://idm.learnersguild.test'
process.env.ECHO_BASE_URL = 'http://echo.learnersguild.test'
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/lg-curriculum-test'
process.env.HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY || 'FAKE_HUBSPOST_API_KEY'
process.env.JWT_PUBLIC_KEY = 'FAKE_PUBLIC_KEY'

const fs = require('fs-extra')
const APP_ROOT = __dirname
const chaiHttp = require('chai-http')
global.chai = require('chai')
global.AssertionError = chai.AssertionError
global.expect = chai.expect
const webServer = require('./web-server')

chai.use(chaiHttp)

let webServerAgent = null

const WebServerSession = require('./test/WebServerSession')
global.createWebServerSession = () =>
  new WebServerSession(chai.request.agent(webServer))


global.generateFakeUser = () => (
  {
    id: 'FAKE_USER_ID',
    handle: 'FakeUser',
    roles: ['learner'],
  }
)

global.whenNotLoggedIn = function(spec){
  context('when not logged in', function(){
    beforeEach(function(){
      this.currentUser = null
    })
    spec()
  })
}

global.whenLoggedIn = function(spec){
  context('when logged in', function(){
    beforeEach(function(){
      this.currentUser = this.currentUser || generateFakeUser()
      return this.webServerSession().loginAs(this.currentUser)
    })
    spec()
  })
}

// Global before each
beforeEach(function(){
  // reset the webserver agent (clear cookies)
  this.webServerSession = function(){
    return this._webServerSession || (
      this._webServerSession = createWebServerSession()
    )
  }

  'get post put patch delete'.split(' ').forEach(method => {
    this[method] = function(...args){
      return this.webServerSession()[method](...args)
    }
  })
})

// Asertions

chai.Assertion.addMethod('haveDuplicates', function() {
  const array = Array.from(this._obj)
  expect(array).to.be.an.instanceof(Array)

  const dups = []
  array.forEach((member, index) => {
    if (array.lastIndexOf(member) !== index){
      dups.push(member)
    }
  })

  this.assert(
    dups.length !== 0,
    "expected #{this} to have duplicates",
    "expected #{this} to not have duplicates",
    [],  // expected
    dups // actual
  );
})


global.readFile = path =>
  fs.readFile(APP_ROOT+path)

global.expectFilesToExists = function(paths){
  return Promise.all(
    paths.map(path =>
      fs.access(`${APP_ROOT}/${path}`).then(
        good => true,
        bad => false,
      )
    )
  ).then(results => {
    const missingPaths = paths.filter((path, index) => !results[index])
    if (missingPaths.length === 0) return
    throw new AssertionError(
      "expected the following files to exist:\n  "+
      missingPaths.join("\n  ")
    )
  })
}
