import { socket } from '../functions/communication'

let _dataManager = null

function subscribeChanges(dataManager){
  _dataManager = dataManager
}

socket.on('switches', data => {
  _dataManager.updateSwitches(data)
})

socket.on('switch state', data => {
  const id = data.id
  const state = data.state

  const updato = {}
  updato[id] = {
    ..._dataManager.getSwitch(id),
    state,
  }
  _dataManager.updateSwitches(updato)
})

socket.on('groups', data => {
  _dataManager.updateGroups(data)
})

socket.on('title', title => {
  _dataManager.updateMultiple({title})
})

socket.on('settings', settings => {
  _dataManager.updateMultiple({settings})
})

socket.on('physical devices', settings => {
  _dataManager.updatePhysicalDevices({settings})
})

export default subscribeChanges
