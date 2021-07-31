const { checkSocketSession, endSession } = require('./credentials')

module.exports = function(callback,options){
  const defaultOptions = {
    ignoreFailToVerifyCredentials: false
  }
  options = {...defaultOptions,...options}

  const socket = options.socket

  return async function(data){
    data = {...data}
    const req_id = data.req_id
    const code = data.code
    const pin = data.pin
    const sessionKey = data.sessionKey
    const switchId = data.switchId
    const body = data.data

    //await checkCredentials
    await checkSocketSession(socket, code, sessionKey)
    const credentialsVerified = await checkSocketSession(socket, code, sessionKey)
    if(credentialsVerified && options.endSession === true){
      endSession(sessionKey)
    }

    if(!socket){
      console.error("Error on request ("+req_id+"): NO SOCKET")
      return false
    }
    //do stuff, callback
    if(!options.ignoreFailToVerifyCredentials && !credentialsVerified){
      socket.emit("request response",{req_id,status: "error", error:true,error_code:"INVALID_CREDENTIALS",error_message:"Credenciales incorrectas",credentialsVerified})
    }else{
      let result
      try {
        result = await callback({credentialsVerified,code,switchId,data:body,req_id,sessionKey,pin})
        if(result === undefined) result = {}
        if(result.error) throw result
        if(typeof result === "object"){
          socket.emit("request response",{req_id,status:result.status || "ok", error:false,error_code:null,error_message:null, result,credentialsVerified})
        }else{
          socket.emit("request response",{req_id,status: "ok", error:false,error_code:null,error_message:null, result: result,credentialsVerified})
        }
      } catch (e) {
        console.error("Error en ("+code+","+req_id+","+credentialsVerified+")", e)
        if(result === undefined) result = {}
        socket.emit("request response",{req_id,status:result.status || "error", error:true,error_code:(e.code || e.error_code),error_message:(e.error_message || e.message || e.toString()),credentialsVerified})
      }
    }
  }
}
