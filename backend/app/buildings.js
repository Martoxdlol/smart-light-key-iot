
let buildings = {
    pepe: {
      sockets: {}
    }
}

function addSocketToBuilding(code, socket){
  if(!buildings[code]) buildings[code] = {}
  if(!buildings[code].sockets) buildings[code].sockets = {}
  buildings[code].sockets[socket.id] = socket
  if(!buildings[code].sockets[socket.id].disconnectListening){
    socket.on('disconnect', reason => {
      delete buildings[code].sockets[socket.id]
    })
  }
  buildings[code].sockets[socket.id].disconnectListening = true
}

function broadcastToBuilding(code, dir, data){
  const building = buildings[code]
  if(building && building.sockets){
    const keys = Object.keys(building.sockets)
    for(key of keys){
      const socket = building.sockets[key]
      socket.emit(dir, data)
    }
  }
}

exports.addSocketToBuilding = addSocketToBuilding
exports.broadcastToBuilding = broadcastToBuilding
