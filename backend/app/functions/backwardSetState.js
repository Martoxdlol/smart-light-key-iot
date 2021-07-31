const setSwitchState = require('../functions/setSwitchState')
const getSwitchState = require('../functions/getSwitchState')
const { db, dbmem } = require('./../../shared/database')
const { broadcastToBuilding } = require('../buildings')

module.exports = async function(req,res){
  try {
    const deviceId = (req.query.id || "")
    const devicePhys = (req.query.phys || "")
    const state = (req.query.state || "").toString() === "true" || (req.query.state || "").toString() === "1"
    const data = (await dbmem.collection("physical_devices").doc(deviceId).get()).data()
    if(!data){
      res.json({error:true})
      return
    }

    getSwitchState(deviceId,devicePhys).then(r => {
      if(r.state && r.state != state){
        setSwitchState(deviceId,state,devicePhys).then(r=>{
          if(r){
            res.json({status:"ok"})
          }else{
            res.json({error:true})
          }
        }).catch(e=>{})
      }
    })

    const code = data.belongs

    if(!code) return

    const fullId = deviceId+"_"+devicePhys.toUpperCase()

    broadcastToBuilding(code,'switch state',{id:fullId,state})
  } catch (e) {
    res.json({error:true})
  }
}
