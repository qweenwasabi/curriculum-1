const { getDigest } = require('../../digest')

module.exports = app => {

  app.use((request, response, next) => {
    getDigest()
      .then(digest => {
        response.digest = digest
        response.locals.digest = digest
      })
      .then(next)
      .catch(next)
  })

  app.get('/digest.json', (request, response, next) => {
    response.json(response.digest)
  })

}
