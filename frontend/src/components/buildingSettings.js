import React, { Component } from 'react'
import classNames from 'classnames'
import openDialog from '../functions/openDialog'
import MessageBox from '../components/messageBox'
import BottomSheet from '../components/bottomSheet'
import DeviceConfig from '../components/deviceConfig'
import OptionsBar from '../components/optionsBar'
import Dropdown from 'react-dropdown'
import DataManager, { loadLocal } from '../data-manager/dataManager'
import { Link, pushUrl, MenuButton } from '../functions/util'
import { makeRequest } from '../functions/communication'
import { deleteAndExitLocalBuilding } from '../functions/credentials'
import AddRoom from '../components/addRoom'
import FullScreenPage from '../components/fullScreenPage'

export default class ActionItem extends Component{
  constructor(props){
    super(props)
    this.state = {
      title: DataManager.instance.buildingName,
      settings: DataManager.instance.settings,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChangeTitle = this.handleChangeTitle.bind(this)
    this.handleChangeSetting = this.handleChangeSetting.bind(this)
  }

  handleSubmit(e){
    if(e && e.preventDefault){
      e.preventDefault()
    }
    if(this.state.title.trim() != DataManager.instance.buildingName){
      //Update name
      const oldTitle = DataManager.instance.buildingName
      makeRequest('change title', {title:this.state.title}).catch(e => {
        DataManager.instance.updateMultiple({title:oldTitle})
      })
      DataManager.instance.updateMultiple({title:this.state.title})
    }
    if(JSON.stringify(DataManager.instance.settings) != JSON.stringify(this.state.settings)){
      //Update settings
      const oldSettings = DataManager.instance.settings
      makeRequest('change settings', {settings:this.state.settings}).catch(e => {
        DataManager.instance.updateMultiple({settings:oldSettings})
      })
      DataManager.instance.updateMultiple({settings:this.state.settings})
    }
    this.props.close()
  }

  handleChangeTitle(e){
    this.setState({
      title: e.target.value
    })
  }

  handleChangeSetting(setting){
    return e=>{
      const settings = this.state.settings
      setting[setting] = e.target.value
      this.setState({settings})
    }
  }

  render(){
    return <div className="container device-config-container">
      <form action="" onSubmit={this.handleSubmit}>
        <OptionsBar
          left={<a onClick={this.props.close}>Cerrar</a>}
          right={<a onClick={this.handleSubmit}>Guardar</a>}
        />
        <label>Nombre del edificio/casa</label>
        <input type="text" placeholder="Nombre" id="title" name="title" value={this.state.title} onChange={this.handleChangeTitle}/>
        <input type="text" placeholder="Email" id="email" name="email" value={this.state.email} disabled/>
      </form>
      <a onClick={openHelp} className='block-link'>Obtener ayuda</a>
      <a className='block-link'>Cambair email</a>
      <Link href='/' className='block-link'>Cambiar de usuario</Link>
      <Link href='/' onClick={e => deleteAndExitLocalBuilding()} className='block-link'>Salir</Link>
    </div>
  }
}

function openHelp(e){
  openDialog("ayuda", props => {
    return <FullScreenPage {...props} title='Ayuda'>
      ...
    </FullScreenPage>
  })
}
