import { makeid } from '../functions/util.js'
import { getSessionKey, getBuildingId, checkCredentials } from '../functions/credentials.js'
import { launchEvent } from './util'

const socket = io()

let isConnected = false

socket.on('connect', () => {
  isConnected = true
  sendCredentials()
  launchEvent('connect')
})

socket.on('disconnect', () => {
  isConnected = false
  launchEvent('disconnect')
})

socket.on('reconnect', () => {
  isConnected = true
  sendCredentials()
  launchEvent('connect')
})

async function sendCredentials(){
  await checkCredentials()
}

const requestList = {}

exports.socket = socket

function makeRequest(dir = '', data = {}, options){
  const requestId = makeid(20)
  options = {
    ...options
  }
  const req = {
    req_id: requestId,
    data,
    switchId: options.switchId,
    pin: options.pin,
    code: options.code || getBuildingId(),
    data,
    sessionKey: options.sessionKey || getSessionKey(),
    timestamp: Date.now(),
  }

  return new Promise((resolve, reject) => {
    requestList[requestId] = {
      ...req,
      resolve,
      reject,
      timeout: setTimeout(function () {
        requestList[requestId].ended = true
        delete requestList[requestId]
        reject({error:true,error_code:"TIMEOUT",error_message:"Server never responded",data:undefined})
      }, 25000)
    }
    socket.emit(dir, req)
  })
}

socket.on('request response', function(msg) {
  const req_id = msg.req_id
  const req = requestList[req_id]
  if(req) clearTimeout(req.timeout)
  if(req && !req.ended){
    if(msg.error){
      let authError = false
      if(msg.error_code == "INCORRECT_CREDENTIALS" || msg.error_code == "INVALID_CREDENTIALS" || msg.error_code == "PREMISSION_DENEID" || msg.error_code == "INCORRECT_PIN") authError = true
      req.reject({authError,...msg})
    }else{
      req.resolve(msg)
    }
  }
})

exports.makeRequest = makeRequest
exports.isConnected = function(){
  return isConnected
}

// Debug only
// window.makeRequest = makeRequest
