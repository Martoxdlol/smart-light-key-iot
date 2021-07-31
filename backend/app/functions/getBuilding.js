const { db, dbmem } = require('../../shared/database')

module.exports = async function getBuilding(code){
  const data = (await dbmem.collection('buildings').doc(code).get()).data()
  return data
}
