import React, { Component } from 'react'
import classNames from 'classnames'
import openDialog from '../functions/openDialog'
import MessageBox from '../components/messageBox'
import BottomSheet from '../components/bottomSheet'
import DeviceConfig from '../components/deviceConfig'
import OptionsBar from '../components/optionsBar'
import Dropdown from 'react-dropdown'
import DataManager, { loadLocal } from '../data-manager/dataManager'
import { makeRequest } from '../functions/communication'
import AddRoom from '../components/addRoom'

export default class ActionItem extends Component{
  constructor(props){
    super(props)
    const dataManager = DataManager.instance
    const switchDevice = dataManager.getSwitch(props.id) || {}
    const groupsList = dataManager.groupsList
    let groupsOptions = []
    for (var i = 0; i < groupsList.length; i++) {
      groupsOptions.push({
        value: groupsList[i].id,
        label: groupsList[i].title,
      })
    }
    groupsOptions.push({ value: "add_room", label: '+ Agregar'})


    this.state = {
      name: switchDevice.name || "",
      code: switchDevice.code,
      group: switchDevice.group,
      physical: switchDevice.physical,
      groupsOptions: groupsOptions
    }

    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(e){
    if(e && e.preventDefault){
      e.preventDefault()
    }
    try {
      const r = await makeRequest('update switch data',{id:this.props.id,name:this.state.name,group:this.state.group})
      this.props.close()
    } catch (e) {
      console.error(e)
    }
  }

  handleChangeName(e){
    this.setState({name:e.target.value})
  }

  render(){
    const options = this.state.groupsOptions
    let defaultOption = this.state.group

    return <div className="container device-config-container">
      <OptionsBar
        left={<a onClick={this.props.close}>Cerrar</a>}
        right={<a onClick={this.handleSubmit}>Guardar</a>}
      />
      <form action="" onSubmit={this.handleSubmit}>
        <label>Nombre del interruptor</label>
        <input type="text" placeholder="Nombre" value={this.state.name} onChange={this.handleChangeName}/>
        <label>Ubicación del interruptor</label>
        <Dropdown options={options} value={defaultOption} placeholder="Select an option" onChange={e => {
          if(e.value == "add_room"){
            openDialog("agregar-habitacion", props => {
              return <MessageBox {...props}>
                <AddRoom {...props} onCreated={group => {
                  this.setState({groupsOptions:[...this.state.groupsOptions,{label: group.name, value: group.id}],group:group.id})
                }}/>
              </MessageBox>
            })
          }else{
            this.setState({group:e.value})
          }
        }}/>
      </form>
      <label>Pertenece a</label>
      <input type="text" disabled value={this.state.code}/>
      <label>Interruptor físico</label>
      <input type="text" disabled value={this.state.physical}/>
    </div>
  }
}
