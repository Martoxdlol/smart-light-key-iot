const axios = require('axios')
const querystring = require('querystring')

const commandsRoutes = {
  "GENERIC": commandGeneric,
  "REPORT_STATE": commandReportState,
  "SEND_ACTION_CODE": commandActionCode,
}


function commandGeneric(req,res){
  res({})
}

function commandReportState(req,res){
  const content = req.content

  if(typeof content.a != 'undefined'){
    sendOne("A",content.a)
  }
  if(typeof content.b != 'undefined'){
    sendOne("B",content.b)
  }
  if(typeof content.c != 'undefined'){
    sendOne("C",content.c)
  }

  async function sendOne(p,s){
    const qparams = {
      id:req.from,
      phys:p,
      state:s
    }
    const r = (await axios.get('http://localhost:9001/local-api/set-state?'+querystring.stringify(qparams))).data
  }

  res(r)
}

async function commandActionCode(req,res){
  console.log("AUTO ACCION CODE", req.content)
}

module.exports = commandsRoutes
