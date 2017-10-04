const {
  promiseMap,
  nameToId,
} = require('./utils')
const loadChallenges = require('./challenges')
const loadModules = require('./modules')
const loadPhases = require('./phases')
const loadSkills = require('./skills')
const loadGlossary = require('./glossary')
const skillContexts = require('./skillContexts')
const generateReport = require('./report')

let digestPromise
const getDigest = () => {
  if (!digestPromise) {
    digestPromise = loadDigest()
    return getDigest()
  }
  return digestPromise.then(clone)
}

const clone = digest =>
  JSON.parse(JSON.stringify(digest))

const loadDigest = () =>
  promiseMap({
    skillContexts,
    challenges: loadChallenges(),
    modules: loadModules(),
    phases: loadPhases(),
    skills: loadSkills(),
    glossary: loadGlossary(),
  })
  .then(digest => {
    // do any phases link to any missing challenges?
    // do any challenges or modules reference any missing skills?

    linkSkillsToModules(digest)


    // const rawSkills = [];
    // [].concat(
    //   Object.values(digest.modules),
    //   Object.values(digest.challenges),
    // ).forEach(module => {
    //   rawSkills.push(...module.rawSkills)
    // })
    // digest.rawSkills = rawSkills


    console.log('DIGEST: done')
    return digest
  })


  // .then(digest => {
  //   const skills = [];

  //   [].concat(
  //     Object.values(digest.modules),
  //     Object.values(digest.challenges),
  //   ).map(x => {
  //     x.skills.forEach(skill => {
  //       if (!skills.includes(skill))
  //         skills.push(skill)
  //     })
  //   })

  //   digest._skills = skills.sort().map(name => ({
  //     name,
  //     id: nameToId(name),
  //   }))

  //   return digest
  // })


const linkSkillsToModules = digest => {
  Object.values(digest.skills).forEach(skill => {
    skill.modules = Object.values(digest.modules)
      .filter(module => module.skills.includes(skill.id))
      .map(module => module.id)
  })
}

module.exports = {
  getDigest,
  loadDigest,
}
