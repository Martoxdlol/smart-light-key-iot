const Command = require('../../shared/command')

const net = require('net')

const client = net.Socket()

client.connect(22002,'devices.iot.abcd.ar', ()=>{
  const c = new Command({deviceKey:"a01aNcamlAlUfTU81knXCJqxqiFuDol5",to:"_server",from:"2ajeYep7",command:"REPORT_STATE",content:{state:"XD"}})
  console.log("SENDING TEST COMMAND: ",c.toString())
  client.write(`\n${c.toString()}\n`)
})

client.on('data', function(data) {
	console.log('Received: ' + data)
	client.destroy()
})

client.on('close', function() {
	console.log('Connection closed')
})

client.on('end', function() {
  console.log('Connection ended')
})

client.on('ready', function() {

})

client.on('timeout', function() {

})

client.on('error', function(err) {
  console.log("Error ", err, " exiting")
  process.exit()
})
