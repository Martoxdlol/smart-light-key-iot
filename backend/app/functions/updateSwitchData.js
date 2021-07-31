const { db, dbmem, firestore } = require('../../shared/database')

module.exports = async function updateSwitchData(code,data,physical){
  const _data = data || {}

  const m = (code || '').match(/^([A-Za-z0-9]{2,100})(_([ABC]))*$/)
  if(!m) return false
  const phys = physical || m[3] || ''
  const _code = m[1]
  if(!phys.match(/^[ABC]$/)) return false

  // await dbmem.collection('buildings').doc(code).get()
  const updata = {}
  const up1 = {}
  if(data.name){
    const name = (data.name || '').toString().trim()
    updata['switches.'+phys+'.name'] = name
    up1.name = name
  }
  if(data.group){
    const group = (data.group || '').toString().trim()
    updata['switches.'+phys+'.group'] = group
    up1.group = group
  }
  if(data.name || data.group){
    await dbmem.collection('physical_devices').doc(_code).update(updata)
  }

  const up2 = {}
  up2[_code+"_"+phys] = {
    ...up1,
    _update:true,
  }
  return up2
}
