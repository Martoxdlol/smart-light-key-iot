import { makeRequest } from '../functions/communication'
import initScript from '../functions/initScript'

function getCode(){
  const buildingId = location.pathname.split("/")[1]
  return buildingId
}

function getLocalCredentials(){
  const code = getCode()
  const sessionKey = localStorage.getItem('__sessionKey_'+code)
  const pin = localStorage.getItem('__buildingPin_'+code)
  if(sessionKey && typeof sessionKey === 'string'){
     return {
      code,
      sessionKey,
      pin,
      found:true,
      error:false
    }
  }else{
    return {
     code,
     pin,
     found:false,
     error:true
   }
  }
}

function getSessionKey() {
  const code = getCode()
  return localStorage.getItem('__sessionKey_'+code) || ''
}

function setSessionKey(key){
  const code = getCode()
  localStorage.setItem('__sessionKey_'+code,key)
}

function setSessionKeyWCode(code, key){
  localStorage.setItem('__sessionKey_'+code,key)
}

async function generateSession(code, pin){
  try {
    const result = await makeRequest("credentials",{},{pin,code})
    setSessionKeyWCode(code, result.result.newSessionKey)
    return ""
  } catch (e) {
    if(e.error_code == "TIMEOUT" || e.error_code == "INTERNET") return "INTERNET"
    if(e.error_code == "BUILDING_NOT_FOUND" || e.error_code == "NOT_FOUND") return "NOT_FOUND"
    if(e.error_code == "INCORRECT_PIN" || e.error_code == "ACCESS_DENEID") return "DENEID"
    return "ERROR"
  }
}

async function checkCredentials(code, key){
  try {
    const result = (await makeRequest("session credentials",{},{sessionKey:key,code})).result
    if(result === true) return true
    return false
  } catch (e) {
    return false
  }
}

async function checkLocalCredentials(){
  return await checkCredentials(getCode(), getSessionKey())
}

function getSavedBuildings(){
  const keys = Object.keys(localStorage)
  let list = []
  for (let i = 0; i < keys.length; i++) {
    const m = keys[i].match(/^__sessionKey_([0-9A-Za-z\-]{2,100})$/)
    if(m){
      const code = m[1]
      const title = localStorage.getItem('__savedTitle_'+code) || code
      const sessionKey = localStorage.getItem(keys[i])
      list.push({
        code,
        title,
        sessionKey,
      })
    }
  }
  return list
}

function deleteAndExitLocalBuilding(code, options = {}){
  if(!code) code = getCode()
  const key = localStorage.getItem('__sessionKey_'+code)
  if(key){
    if(!options || !options.serverOnly){
      localStorage.removeItem('__sessionKey_'+code)
    }
    makeRequest('end session',{code,sessionKey:key},{code,sessionKey:key}).then(console.log).catch(console.error)
  }
}

exports.getLocalCredentials = getLocalCredentials
exports.checkLocalCredentials = checkLocalCredentials
exports.getBuildingId = getCode
exports.getSessionKey = getSessionKey
exports.setSessionKey = setSessionKey
exports.generateSession = generateSession
exports.checkCredentials = checkCredentials
exports.getSavedBuildings = getSavedBuildings
exports.deleteAndExitLocalBuilding = deleteAndExitLocalBuilding

//DEBUG only
// window.generateSession = generateSession
// window.getSessionKey = getSessionKey
// window.checkLocalCredentials = checkLocalCredentials
// window.getSavedBuildings = getSavedBuildings
