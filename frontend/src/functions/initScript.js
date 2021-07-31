import React, { Component } from 'react'
import DataManager, { loadLocal } from '../data-manager/dataManager'
import MessageBox from '../components/messageBox'
import AskCredentials from '../components/askCredentials'
import openDialog from '../functions/openDialog'
import { getBuildingId, checkLocalCredentials } from '../functions/credentials'

window.initScriptCounter = 0

async function initScript(home){
  window.initScriptCounter++
  loadLocal()
  const dataManager = DataManager.instance
  if(dataManager.buildingValid()){
    //Check credentials
    if(!(await checkLocalCredentials())){
      history.replaceState({authError:true},"Acceder","/?code="+getBuildingId())
      initScript(home)
    }else{
      //load data
      home.setState({
        separatedGroupsListswitches: dataManager.separatedGroupsList,
        offline: dataManager.offline,
        buildingName: dataManager.buildingName,
      })
    }

  }else{
    //ask for credentials
    openDialog("acceder", props => {
      return <MessageBox {...props}>
        <AskCredentials {...props}/>
      </MessageBox>
    }, {preventClose:true})

    let replaceStateListener

    replaceStateListener = () => {
      if(history.state && history.state.newCode){
        window.removeEventListener('replacestate',replaceStateListener)
        initScript(home)
      }
    }
    window.addEventListener('replacestate',replaceStateListener)

  }
  window.initScriptCounter--
}

export default initScript
