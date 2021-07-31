import React, { Component } from 'react'
import classNames from 'classnames'
import DataManager from '../data-manager/dataManager'
import OptionsBar from '../components/optionsBar'
import { generateSession, getSavedBuildings, getBuildingId, deleteAndExitLocalBuilding } from '../functions/credentials'
import { Link, pushUrl, MenuButton } from '../functions/util'
export default class AskCredentials extends Component{
  constructor(props){
    super(props)

    let initialCode = ''
    let initialPin = ''
    try {
      initialCode = new URL(location.href).searchParams.get('code') || ''
      initialPin = new URL(location.href).searchParams.get('pin') || ''
    } catch (e) {}

    this.state = {
      pin:initialPin,
      code:initialCode,
      readyToGo: this.validateValues(initialCode,initialPin),
      savedBuildings: getSavedBuildings()
    }
    this.handleChangeCode = this.handleChangeCode.bind(this)
    this.handleChangePin = this.handleChangePin.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

  }

  handleChangeCode(e){
    const value = e.target.value
    this.setState({
      code: value,
      readyToGo: this.validateValues(value,this.state.code)
    })
  }

  handleChangePin(e){
    const value = e.target.value
    this.setState({
      pin: value,
      readyToGo: this.validateValues(this.state.code,value)
    })
  }

  validateValues(code,pin){
    return !!(DataManager.instance.checkCode(code) && DataManager.instance.checkPin(pin))
  }

  async handleSubmit(e){
    if(e && e.preventDefault) e.preventDefault()
    if(this.state.readyToGo){
      const error_code = await generateSession(this.state.code, this.state.pin)
      if(error_code){
        console.error("Error al generar sesión", error_code)
        return;
      }
      // deleteAndExitLocalBuilding(this.state.code, {serverOnly:true})
      this.props.close()
      const p = "/"+this.state.code
      pushUrl(p,{newCode:this.state.code})
    }
  }

  render(){
    return <div className="modal-box-container with-bottom-and-top-bar black-inputs">
      <h3>Ingresar con id y pin</h3>
      <form action="" onSubmit={this.handleSubmit}>
        <label>Código de edificio o casa</label>
        <input type="text" placeholder="Identificador" name="building-unique-code" id="building-unique-code" onChange={this.handleChangeCode} value={this.state.code}/>
        <label>Pin o clave de acceso</label>
        <input type="password" placeholder="PIN" name="building-access-pin" id="building-access-pin" onChange={this.handleChangePin} value={this.state.pin}/>
        <input type="submit" style={{display:'none'}}/>
        {this.state.savedBuildings.length != 0 && <h3>O ingresar a</h3>}
        {this.state.savedBuildings.map((building,i) => {
          return <Link key={building.code} to={building.code}><MenuButton
            action={<i className="material-icons">close</i>}
            onAction={e => {
              deleteAndExitLocalBuilding(building.code)
              let savedBuildings = this.state.savedBuildings
              savedBuildings.splice(i,1)
              this.setState({savedBuildings})
            }}
          >{building.title}</MenuButton></Link>
        })}
        <OptionsBar
          right={<a onClick={this.handleSubmit} disabled={!this.state.readyToGo}>Acceder</a>}
        />
      </form>
    </div>
  }
}
