const { addSocketToBuilding } = require('./buildings')
const { db, redis, dbmem} = require('./../shared/database')
const uid = require('uid-safe')

async function createSession(code, pin){
  const building = (await db.collection('buildings').doc(code).get()).data()
  if(building && (building.pin || '').toString() == (pin || '').toString()){
    //Create session
    const newSessionKey = await uid(30)
    dbmem.collection('building_sessions').doc(newSessionKey).create({
      buildingId: code,
      created: Date.now(),
    })

    return {
      sessionKey: newSessionKey
    }
  }
  return false
}

async function checkSession(code, sessionKey){
  try {
    const data = (await dbmem.collection('building_sessions').doc(sessionKey).get()).data()
    if(!data || (data && data.buildingId && data.buildingId != code)) return false
    return true
  } catch (e) {
    return false
  }
}

async function endSession(sessionKey){
  try {
    await dbmem.collection('building_sessions').doc(sessionKey).delete()
    return true
  } catch (e) {
    return false
  }
}

async function checkSocketSession(socket, code = '', sessionKey = ''){
  if(typeof code != 'string') return false
  if(typeof sessionKey != 'string') return false
  if(!socket) return false
  if(socket.verifiedSession && socket.verifiedSession.code == code && socket.verifiedSession.sessionKey == sessionKey){
    addSocketToBuilding(code, socket)
    return true
  }else{
    const result = await checkSession(code, sessionKey)
    if(result == true){
      socket.verifiedSession = {
        code,
        sessionKey,
      }
      addSocketToBuilding(code, socket)
      return true
    }else{
      return false
    }
  }
}

exports.createSession = createSession
exports.checkSession = checkSession
exports.checkSocketSession = checkSocketSession
