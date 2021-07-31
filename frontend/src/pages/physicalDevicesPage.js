import React, { Component } from 'react'
import { makeRequest } from '../functions/communication'
import OptionsBar from '../components/optionsBar'
import DataManager, { loadLocal } from '../data-manager/dataManager'
import { Link, pushUrl, MenuButton } from '../functions/util'
import openDialog from '../functions/openDialog'
import MessageBox from '../components/messageBox'
import AddGroup from '../components/addRoom'
import contextmenu from '../functions/contextmenu'

export default class PhysicalDevicesPage extends Component{
  constructor(props){
    super(props)
    this.state = {
      physicalDevices: DataManager.instance.physicalDevices,
    }
  }

  componentDidMount(){
    window.addEventListener('physicaldeviceschange', e => {
      this.setState({
        physicalDevices: DataManager.instance.physicalDevices,
      })
    })

    makeRequest('physical devices').then(r =>  {
      console.log(r.result);
      if(r.error) return
      this.setState({
        physicalDevices: r.result
      })
    })
  }

  render(){
    return <div>
      {this.state.physicalDevices.map(dev => {
        return <Card key={dev.id} {...dev} onClick={e => contextmenu(e, [
          {label:"Desconectar"},
          {label:"Obtener ayuda"},
        ])}/>
      })}
    </div>
  }
}

function Card(props){
  return (
    <div className="phys-dev-card">
      <div>
        <div>
        <img src={props.picture} alt="Imágen del producto"/>
        </div>
        <div>
          <h3>{props.productName}</h3>
          <span>Versión de hardware: {props.hardwareVersion}</span>
          <span>Código del dispositivo: {props.id}</span>
        </div>
        <div>
          <i className="material-icons" onClick={props.onClick}>more_vert</i>
        </div>
      </div>
      <span>Url del producto: <a href={props.productUrl} target='_blank'>{(props.productUrl || '').replace('https://','').replace('http://','').replace(/\/$/,'')}</a></span>
      <span>{props.switchesInfo}</span>
    </div>)
}
