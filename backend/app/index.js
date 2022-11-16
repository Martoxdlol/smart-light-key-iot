const app = require("express")()
const express = require("express")
const io = require('socket.io')(9002)
const processRequest = require('./processSocketRequest')
const { createSession } = require('./credentials')
const { broadcastToBuilding } = require('./buildings')
const { db, dbmem } = require('./../shared/database')
const getSwitches = require('./functions/getSwitches')
const getBuilding = require('./functions/getBuilding')
const updateBuilding = require('./functions/updateBuilding')
const getGroups = require('./functions/getGroups')
const setGroup = require('./functions/setGroup')
const getPhysicalDevices = require('./functions/getPhysicalDevices')
const setSwitchState = require('./functions/setSwitchState')
const setSwitchStateToDevice = require('./functions/setSwitchStateToDevice')
const updateSwitchData = require('./functions/updateSwitchData')
const backwardSetState = require('./functions/backwardSetState')
const defaults = require('./defaults')
const shortUUID = require('short-uuid')

app.listen(9001)

// app.get('/', (req, res) => {
//   res.end(`API SERVER OK`)
// })

app.get('/local-api/', (req, res) => {
  res.end(req.url)
})

app.get('/local-api/set-state', backwardSetState)

app.get('/local-api/send-action-code', (req, res) => {
  res.end(req.url)
})

app.get('/api', (req, res) => {
  res.end(req.url)
})

const staticPath = require('path').resolve(__dirname, '../../frontend/dist')

app.use(express.static(staticPath))

io.on('connection', (socket) => {
  console.log("New socket connected")
  // new client
  socket.on('credentials', processRequest(async req => {

    const newKey = await createSession(req.code, req.pin)
    if(newKey && newKey.sessionKey){
      return {newSessionKey:newKey.sessionKey}
    }else{
      return {error_code:'INCORRECT_PIN',error:true}
    }

  },{socket,ignoreFailToVerifyCredentials:true}))

  socket.on('session credentials', processRequest(req => {
    console.log("Session credentials", req.credentialsVerified);
    return req.credentialsVerified
  },{socket,ignoreFailToVerifyCredentials:true}))

  socket.on('end session', processRequest(req => {
    return true
  }),{socket,endSession:true})

  socket.on('change title', processRequest(async req => {
    const title = (req.data.title || '').trim()
    await updateBuilding(req.code,{title})
    broadcastToBuilding(req.code,'title',title)
    return true
  },{socket}))

  socket.on('update settings', processRequest(async req => {
    const settings = (req.data.settings || {}).trim()
    //VALIDATE SETTINGS
    //...

    await updateBuilding(req.code,{settings})

    return true
  },{socket}))

  socket.on('change pin', processRequest(req => {

  },{socket}))

  socket.on('request complete info', processRequest(async req => {
    const building = await getBuilding(req.code)
    const res = {
      title: building.title,
      settings: building.settings,
      groups: {...defaults.defaultGroups,...building.groups},
    }
    res.switches = await getSwitches(req.code)
    return res
  },{socket}))

  socket.on('request switch info', processRequest(req => {

  },{socket}))

  socket.on('set switch state', processRequest(async req => {
    const data = req.data || {}
    if(await setSwitchStateToDevice(data.id,!!data.state)){
      broadcastToBuilding(req.code,'switch state',{id:data.id,state:!!data.state})
      return true
    }else{
      return false
    }
  },{socket}))

  socket.on('update switch data', processRequest(async req => {
    const data = req.data || {}
    const r = await updateSwitchData(data.id,data)
    if(r){
      broadcastToBuilding(req.code,'switches',r)
    }
  },{socket}))

  socket.on('remove device', processRequest(async req => {

  },{socket}))

  socket.on('create group', processRequest(async req => {
    const data = req.data || {}
    const id = '_'+shortUUID.generate()
    if(await setGroup(req.code,id,req.data.name)){
      const updato = {}
      updato[id] = {title:(req.data.name || '').toString().trim()}
      broadcastToBuilding(req.code,'groups',updato)
      return {id,name:req.data.name}
    }else{
      return {error:true,error_code:"CANNOT_CREATE_GROUP"}
    }
  },{socket}))

  socket.on('update group', processRequest(async req => {
    const data = req.data || {}
    const id = data.id
    if(await setGroup(req.code,id,data.name)){
      const updato = {}
      updato[id] = {title:(data.name || '').toString().trim()}
      broadcastToBuilding(req.code,'groups',updato)
      return {id,name:req.data.name}
    }else{
      return {error:true,error_code:"CANNOT_UPDATE_GROUP"}
    }
  },{socket}))

  socket.on('delete group', processRequest(async req => {
    const data = req.data || {}
    const id = data.id
    if(await setGroup(req.code,id,undefined,{delete:true})){
      const updato = {}
      updato[id] = {_delete:true}
      broadcastToBuilding(req.code,'groups',updato)
      return true
    }else{
      return {error:true,error_code:"CANNOT_DELETE_GROUP"}
    }
  },{socket}))

  socket.on('create union', processRequest(req => {

  },{socket}))

  socket.on('delete union', processRequest(req => {

  },{socket}))

  socket.on('physical devices', processRequest(req => {
    return getPhysicalDevices(req.code)
  },{socket}))
})
