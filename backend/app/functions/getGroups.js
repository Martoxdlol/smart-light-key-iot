const { db, dbmem } = require('../../shared/database')
const getBuilding = require('./getBuilding')

module.exports = async function getGroups(code){
  return (await getBuilding(code)).groups
}
