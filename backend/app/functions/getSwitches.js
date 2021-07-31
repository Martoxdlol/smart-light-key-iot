const { db, dbmem } = require('../../shared/database')

module.exports = async function getSwitches(code){
  const docs = (await db.collection('physical_devices').where('belongs','==',code).get()).docs
  const switches = {}
  for(doc of docs){
    const data = doc.data()
    const id = doc.id
    const switchesKeys = Object.keys(data.switches)
    for(const key of switchesKeys){
      _switch = data.switches[key]
      const sid = id+'_'+_switch.physical
      switches[sid] = {
        ..._switch,
        id: sid,
        code: id,
        belongs: code,
      }
    }
  }
  return switches
}


// let res = {
//   title: 'Estanislao del Campo 1260',
//   settings: {}
// }
// res.groups = {
//   living: {
//     title: "Living"
//   },
//   kitchen: {
//     title: "Cocina"
//   },
//   bedroom: {
//     title: "Habitación"
//   },
//   restroom: {
//     title: "Baño"
//   }
// }
//
// res.switches = {
//   "3EJ5epfn_A":{
//     name: "Luz general",
//     code:"3EJ5epfn",
//     group: "living",
//     physical: "A",
//     belongs: this.id,
//     state: true,
//   },
//   "3EJ5epfn_B":{
//     name: "Luz techo",
//     code: "3EJ5epfn",
//     group: "kitchen",
//     physical: "B",
//     belongs: this.id,
//     state: true,
//   },
//   "3EJ5epfn_C":{
//     name: "Luz mesada",
//     code: "3EJ5epfn",
//     physical: "C",
//     group: "kitchen",
//     belongs: this.id,
//     state: false,
//   },
//   "2ajeYep7_A":{
//     name: "Luz general",
//     code:"2ajeYep7r",
//     group: "restroom",
//     physical: "A",
//     belongs: this.id,
//     state: false,
//   },
//   "2ajeYep7_B":{
//     name: "Luz espejo",
//     code: "2ajeYep7r",
//     group: "restroom",
//     physical: "B",
//     belongs: this.id,
//     state: false,
//   },
//   "2ajeYep7_C":{
//     name: "Extractor",
//     code: "2ajeYep7r",
//     physical: "C",
//     group: "restroom",
//     belongs: this.id,
//     state: false,
//   },
// }
