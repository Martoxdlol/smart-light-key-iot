//Linea de instrucción enviada / recibida
// JSON.stringify({command:"SEND_STATE",commandID:"aksljdfhasjkdh",from:"lqwD6bD72E",to:"_server",timestamp:Date.now(),hash:"SHA1(content+key)",content:JSON.stringify({state:{a:true,b:false,c:false}})})
// "{"command":"SEND_STATE","commandID":"aksljdfhasjkdh","from":"lqwD6bD72E","to":"_server","timestamp":1610030258663,"hash":"SHA1(content+key)","content":"{\"state\":{\"a\":true,\"b\":false,\"c\":false}}"}"
const sha1 = require("sha1")

class Command{
  constructor(data = {}, returnCallback){
    const isServer = true;
    this.command = data.command || "GENERIC";
    this.timestamp = data.timestamp || Date.now()
    this.commandID = data.commandID || makeid(32)
    this.from = data.from
    this.to = data.to
    this.done = data.done || false
    if(typeof data.content == "object"){
      this.content = JSON.stringify(data.content)
      this.isContentJSON = true;
    }else{
      this.content = data.content;
      this.isContentJSON = !!data.isContentJSON;
    }
    this.hash = sha1(this.content+(data.deviceKey || ''))

    this.returnCallback = returnCallback;
  }

  static fromJSON(data){
    return new Command(JSON.parse(data));
  }

  toString(){
    return "\n"+this.toJSON()+"\n";
  }

  toJSON(){
    return JSON.stringify({
      command: this.command,
      timestamp: this.timestamp,
      commandID: this.commandID,
      from: this.from,
      to: this.to,
      content: this.content,
      hash: this.hash,
      isContentJSON: this.isContentJSON,
    });
  }
}

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

module.exports = Command;
