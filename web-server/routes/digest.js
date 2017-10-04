const { getDigest } = require('../../digest')

module.exports = app => {

  app.use((request, response, next) => {
    getDigest()
      .then(addPathsToDigest)
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


const addPathsToDigest = digest => {

  Object.values(digest.phases).forEach(phase => {
    phase.path = `/phases/${phase.id}`
  })

  Object.values(digest.challenges).forEach(challenge => {
    challenge.path = `/challenges/${challenge.id}`
  })

  Object.values(digest.skills).forEach(skill => {
    skill.path = `/skills/${skill.id}`
  })

  Object.values(digest.modules).forEach(module => {
    module.path = `/modules/${module.id}`
  })


  return digest
}
