import { makeRequest } from '../functions/communication'
import { getSessionKey, getBuildingId } from '../functions/credentials'
import { launchEvent } from '../functions/util'
import subscribeChanges from './subscribeChanges'

class DataManager{
  constructor({id} = {}){
    this.id = id
    this.buildingName = ""
    this.groups = {}
    this.switches = {}
    this.physicalDevices = []
    if(!this.buildingValid()) return;

    subscribeChanges(this)

    try {
      makeRequest('request complete info').then(result => this.updateMultiple(result.result))
    } catch (e) {
      console.error(e)
    }
  }

  updateMultiple({ switches, groups, title, settings} = {}){
    if(settings){
      this.settings = settings
      launchEvent('settingsupdated')
    }
    if(title){
      this.buildingName = title
      launchEvent('namechange')
    }
    if(switches){
      this.updateSwitches(switches)
    }
    if(groups){
      this.updateGroups(groups)
    }
  }

  updateSwitches(updateSwitches){
    const oldSwitches = this.switches
    let newSwitches = {...oldSwitches, ...updateSwitches}
    const keys = Object.keys(updateSwitches)
    for (let i = 0; i < keys.length; i++) {
      if(updateSwitches[keys[i]]._delete === true){
        delete newSwitches[keys[i]]
      }
      if(updateSwitches[keys[i]]._update === true){
        newSwitches[keys[i]] = {...oldSwitches[keys[i]],...newSwitches[keys[i]]}
      }
    }

    this.switches = newSwitches

    if(JSON.stringify(oldSwitches) != JSON.stringify(newSwitches)){
      launchEvent('switcheschange')
    }
  }

  updateGroups(updateGroups){
    const oldGroups = this.groups
    let newGroups = {...oldGroups, ...updateGroups}
    const keys = Object.keys(updateGroups)
    for (let i = 0; i < keys.length; i++) {
      if(updateGroups[keys[i]]._delete === true){
        delete newGroups[keys[i]]
      }else
      if(updateGroups[keys[i]]._update === true){
        newGroups[keys[i]] = {...oldGroups[keys[i]],...newGroups[keys[i]]}
      }
    }

    this.groups = newGroups

    if(JSON.stringify(oldGroups) != JSON.stringify(newGroups)){
      launchEvent('groupschange')
    }
  }

  updatePhysicalDevices(physicalDevicesList){
    // UNFINISHED FUNCTION
    this.physicalDevices = physicalDevicesList
    launchEvent('physicaldeviceschange')
  }

  buildingValid(){
    return this.checkCode(this.id)
  }

  getSavedCredentials(){

  }

  static checkPin(pin){
    if(pin.match(/^[0-9]{4,100}$/) != null) return true
    return false
  }

  static checkCode(id){
    if(typeof id != "string") return false
    if(id.match(/^[0-9A-Za-z\-]{2,100}$/) != null) return true
    return false
  }

  checkPin(...args){
    return DataManager.checkPin(...args)
  }

  checkCode(...args){
    return DataManager.checkCode(...args)
  }

  getSwitchesList(){
    let list = []
    const keys = Object.keys(this.switches)
    for (let i = 0; i < keys.length; i++) {
      list.push({id:keys[i], ...this.switches[keys[i]]})
    }
    return list
  }

  get switchesList(){
    return this.getSwitchesList()
  }

  getGroupsList(){
    let list = []
    const keys = Object.keys(this.groups)
    for (let i = 0; i < keys.length; i++) {
      list.push({id:keys[i], ...this.groups[keys[i]]})
    }
    return list
  }

  get groupsList(){
    return this.getGroupsList()
  }

  get separatedGroupsList(){
    const switchesList = this.getSwitchesList()
    const gkeys = Object.keys(this.groups)
    let list = []
    for (let i = 0; i < gkeys.length; i++) {
      const group = this.groups[gkeys[i]]
      let list2 = []
      for (let j = 0; j < switchesList.length; j++) {
        if(switchesList[j].group == gkeys[i]){
           list2.push(switchesList[j])
        }
      }
      if (list2.length) {
        list.push({id: gkeys[i], ...group, switchesList:list2})
      }
    }
    list.push({
      id: '__all',
      title: 'Todos',
      switchesList: switchesList
    })

    return list
  }

  getSwitch(id){
    return this.switches[id]
  }

  static validateGroupName(name){
    if(typeof name == "string" && name.length > 0 && name.length <= 100) return true
    return false
  }

  async createGroup(name){
    if(!DataManager.validateGroupName(name)) return false
    try {
      await makeRequest("create group",{name})
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  getGroupSwitchesList(group){
    const slist1 = this.switchesList
    let list = []
    for (let i = 0; i < slist1.length; i++) {
      if(slist1[i].group == group || group == '__all') list.push(slist1[i])
    }
    return list
  }

  static instance = new DataManager()
}

function loadLocal(){
  const buildingId = getBuildingId()
  DataManager.instance = new DataManager({id:buildingId})
}

// Debug only
// window.data = DataManager

export default DataManager

exports.loadLocal = loadLocal
