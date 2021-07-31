const { sendCommand } = require('./tcp_server.js')

const express = require('express')

const axios = require('axios')

const app = express()

app.listen(9005)

app.get('/send_command', autoResponse(async (req,res)=>{
  r = await sendCommand(req.query.code || req.query.id, req.query.command, req.query.content)
  return r
}))

app.get('/set_state', autoResponse(async (req,res)=>{
  const state = {}
  if(req.query.a == "true" || req.query.a == "1") state.a = "true"
  if(req.query.a == "false" || req.query.a == "0") state.a = "false"
  if(req.query.b == "true" || req.query.b == "1") state.b = "true"
  if(req.query.b == "false" || req.query.b == "0") state.b = "false"
  if(req.query.c == "true" || req.query.c == "1") state.c = "true"
  if(req.query.c == "false" || req.query.c == "0") state.c = "false"
  r = await sendCommand(req.query.code || req.query.id, "SET_STATE", state)
  return r
}))

app.get('/get_info', autoResponse(async (req,res)=>{
  r = await sendCommand(req.query.code || req.query.id, "GET_INFO")
  return r
}))


function autoResponse(func){
  return async function(req, res) {
    try {
      const r = await func(req, res)
      res.json(r || {status:"empty",empty:true})
    } catch (e) {
      errorResponse(e,req,res)
    }
  }
}

function errorResponse(e,req,res){
  console.log("Error on request:",req.url)
  console.error(e)
  res.status(200)
  res.json({
    error:e,
  })
}
