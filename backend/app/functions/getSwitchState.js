const { db, dbmem, firestore } = require('../../shared/database')

module.exports = async function(code, physical){
  try {
    const m = (code || '').match(/^([A-Za-z0-9]{2,100})(_([ABC]))*$/)
    if(!m) return {error:true}
    const phys = (physical || m[3] || '').toUpperCase()
    const _code = m[1]
    if(!phys.match(/^[ABC]$/)) return {error:true}
    const data = (await dbmem.collection('physical_devices').doc(_code).get()).data()
    if(!data) return {error:true}
    if(!data.switches) return {error:true}
    if(!data.switches[phys]) return {error:true}
    return data.switches[phys]
  } catch (e) {
    return {error:true}
  }
}
