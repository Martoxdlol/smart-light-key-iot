// Import net module.
const net = require('net')
const { dbmem } = require('../../shared/database')
const { ClientError } = require('../../shared/error_class')
const Command = require('../../shared/command')
const sha1 = require('sha1')
const commandsRoutes = require('./commands')
// Create and return a net.Server object, the function will be invoked when client connect to this server.
const server = net.createServer(function(client) {

    console.log('Client connect. Client local address : ' + client.localAddress + ':' + client.localPort + '. client remote address : ' + client.remoteAddress + ':' + client.remotePort)

    client.setEncoding('utf-8')

    client.setTimeout(50000)

    //TEST
    // client.write("\n{\"command\":\"SET_STATE\",\"from\":\"_server\",\"to\":\"2ajeYep7\",\"content\":\"{\\\"a\\\":1,\\\"b\\\":0,\\\"c\\\":0}\",\"hash\":\"122bcd8316156db9f59729698492c98a20e27c5c\"}\n")

    //Buffer of lines sent by client
    let lines = []
    // When receive client data.
    client.on('data', function (data) {

      // if(data.trim() != ""){
      //   console.log("DATA (",data.trim(),")")
      // }
      // client.write(data)

      //Buffer to string
      const strdata = data.toString()

      //String to lines
      const dataLines = strdata.split("\n")

      //Add to last not finished line
      if(lines.length == 0) lines.push("")
      lines[lines.length-1] += dataLines[0]

      //Add the other lines
      for (let i = 1; i < dataLines.length; i++) {
        lines.push(dataLines[i])
      }

      //Send lines to the processor
      while(lines.length > 0){
        //Test if lines is non-valid JSON or isn't finished
        try {
          //Convert line to command
          const c = JSON.parse(lines[0])
          processCommand(c,client)
          //Delete allready processed line
          lines.splice(0,1)
        } catch (e) {
          //Delete line only if isn't the last (if some intermidiate line isn't finished i'm sorry)
          if(lines.length != 1){
            lines.splice(0,1)
          }else{
            break;
          }
        }
      }
    })

    // When client send data complete.
    client.on('end', function () {
        console.log('Client disconnect.')

        // Get current connections count.
        server.getConnections(function (err, count) {
            if(!err)
            {
                // Print current connection count in server console.
                console.log("There are %d connections now. ", count)
            }else
            {
                console.error(JSON.stringify(err))
            }

        })
    })

    // When client timeout.
    client.on('timeout', function () {
        console.log('Client request time out. ')
    })

    client.on('close', function () {

    })

    client.on('end', function () {

    })

    client.on('error', function (err) {
        console.error(err)
    })
})


server.on('error', err =>  {
  console.error(err)
})

server.on('close', () =>  {

})

server.on('end', () =>  {

})


//Useless copy-paste stuff
// Make the server a TCP server listening on port 22002.
server.listen(22003, function () {

    // Get server address info.
    const serverInfo = server.address()

    const serverInfoJson = JSON.stringify(serverInfo)

    console.log('TCP server listen on address : ' + serverInfoJson)

    server.on('close', function () {
        console.log('TCP server socket is closed.')
    })

    server.on('error', function (error) {
        console.error(JSON.stringify(error))
    })

})

//Sockets of clients
// "d3v1c3C0d3" [Socket]
// Multiple devices can reference the same socket
const clients = {}

//Save commands instance reference for later use when device response
const commandsQueue = {}



async function processCommand(command,socket){
  //Validate auth (use hash)
  //Add to client database
  //If request register for response
  //If response do registered request callback

  //
  try {
    //Validate input data
    if(typeof command.from != 'string') throw new Error("Invalid from")
    if(typeof command.commandID != 'string') throw new Error("Invalid command id")
    if(command.to != '_server') throw new Error("Invalid to")
    //Find device
    const data = (await dbmem.collection('physical_devices').doc(command.from).get()).data()
    if(!data) throw new Error("Device not found")
    //Auth device
    const hash = sha1(command.content+data.key)
    if(hash != command.hash) throw new Error("Auth error")

    //device is verfied

    clients[command.from] = socket

    const cont = command.isContentJSON ? safeParse(command.content) : command.content
    if(command.command == "RESPONSE"){
      //Is response for server sent command
      if(commandsQueue[command.commandID] && commandsQueue[command.commandID].returnCallback){
        //If found original request
        commandsQueue[command.commandID].returnCallback(cont)
      }
    }else{
      //Send to command processor
      commandProcessor({from:command.from,content:cont,command:command.command},async responseContent=>{
        return await _sendCommand(command.from,"RESPONSE",responseContent,command.commandID)
      })
    }

  } catch (e) {
    //Ignore command
    // console.log("Ignoring: ",command," err: ",e)
  }
}

function commandProcessor(req,res){
  const callback = commandsRoutes[req.command]
  if(typeof callback == 'function'){
    callback(req,res)
  }else{
    res({error:true,error_code:"COMMAND_NOT_FOUND"})
  }
}

function _sendCommand(id,_command,content,commandID){
  return new Promise(async (resolve,reject) => {
    //Check device and get key
    const data = (await dbmem.collection('physical_devices').doc(id).get()).data()
    if(!data) reject(new TypeError("Device doesn't exist"))

    //Create command
    const command = new Command({
      command: _command,
      from: '_server',
      to: id,
      deviceKey: data.key,
      content: content || "",
      commandID,
    },_command != "RESPONSE" ? response=>{
      resolve(response)
    } : ()=>{})




    //Save command id for later
    const cid = command.commandID

    //If is not an end command
    if(_command != "RESPONSE"){
      //Add command to response queue
      commandsQueue[cid] = command

      //Register timeout function
      setTimeout(() => {
        const c = commandsQueue[cid]
        if(c && !c.done){
          commandsQueue[cid].done = true
          delete commandsQueue[cid]
          reject(new ClientError("Client timeout","TIMEOUT"))
        }
      }, 25000)
    }


    //Get client socket
    const client = clients[id]

    //if command has been sent
    let sent = false

    //interval reference
    let int = -1

    //send to socket function
    function send(){
      if(client){
        client.write("\n\r"+command.toString()+"\n\r")
        sent = true
        if(_command == "RESPONSE") resolve(true)
        return true
      }else{
        return false
      }
    }

    //If socket not registered try every 50ms if it connects
    let j = 0
    int = setInterval(() => {
      if(!sent && j < 24500 && !send()){
        j+=50
      }else{
        clearInterval(int)
      }
    }, 50)

    //Initial send try
    send()

    //If never sends
    setTimeout(function () {
      if(!sent) reject(new ClientError("Cannot send command","SEND_TIMEOUT"))
    }, 25100)

  })
}

// async function test(){
//   _sendCommand("2ajeYep7","GET_STATE",{asd:1}).then(res => {
//     console.log("Respuesta de 2ajeYep7: ", res)
//   }).catch(err => {
//     console.log("Error al enviar comando a 2ajeYep7: ", err.code)
//   })
//
//   _sendCommand("2ajeYep7","SET_STATE",{a:"true",b:"true",c:"true"}).then(res => {
//     console.log("Respuesta de 2ajeYep7 a SET_STATE: ", res)
//   }).catch(err => {
//     console.log("Error al enviar comando a 2ajeYep7: ", err.code)
//   })
//   setTimeout(function () {
//     test()
//   }, 30000)
// }
//
//
// test()

function safeParse(i){
  try {
    return JSON.parse(i)
  } catch (e) {
    return i
  }
}

exports.sendCommand = _sendCommand
