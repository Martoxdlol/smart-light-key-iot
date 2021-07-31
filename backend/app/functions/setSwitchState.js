const { db, dbmem, firestore } = require('../../shared/database')

module.exports = async function setSwitchState(code,state,physical){

  const m = (code || '').match(/^([A-Za-z0-9]{2,100})(_([ABC]))*$/)
  if(!m) return false
  const phys = (physical || m[3] || '').toUpperCase()
  const _code = m[1]
  if(!phys.match(/^[ABC]$/)) return false

  // await dbmem.collection('buildings').doc(code).get()
  const updata = {}
  updata['switches.'+phys+'.state'] = state
  await dbmem.collection('physical_devices').doc(_code).update(updata)
  return true
}

// dbmem.collection('physical_devices').doc('2ajeYep7').update({
//   'switches.A.state': false
// })

// var washingtonRef = db.collection("cities").doc("DC");
//
// // Atomically add a new region to the "regions" array field.
// washingtonRef.update({
//     regions: firebase.firestore.FieldValue.arrayUnion("greater_virginia")
// });
//
// // Atomically remove a region from the "regions" array field.
// washingtonRef.update({
//     regions: firebase.firestore.FieldValue.arrayRemove("east_coast")
// });


//firestore.FieldValue.arrayUnion({a:1})
// group
// "living"
// (string)
// name
// "Luz general"
// physical
// "A"
// state
// true
