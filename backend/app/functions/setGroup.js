const { db, dbmem, firestore } = require('../../shared/database')

//FieldValue.delete()

module.exports = async function setGroup(code,id,name,options){
  options = {
    delete:false,
    ...options
  }

  name = (name || '').toString().trim()
  const updata = {}
  updata['groups.'+id] = options.delete ? firestore.FieldValue.delete() : {title:name}
  if((name.length > 100 || name.length < 1) && !options.delete) return false
  if(!id.match(/^\_[A-Za-z0-9\_]{1,100}$/)) return false
  try {
    const r = await dbmem.collection('buildings').doc(code).update(updata)
    return true
  } catch (e) {
    return false
  }
}
