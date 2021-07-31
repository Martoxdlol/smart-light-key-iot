const { db, dbmem } = require('../../shared/database')

module.exports = async function updateBuilding(code, data){
  const result = await dbmem.collection('buildings').doc(code).update(data)
  return result
}
