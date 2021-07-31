import React, { Component } from 'react'
import OptionsBar from '../components/optionsBar'
import { makeRequest } from '../functions/communication'
import DataManager, { loadLocal } from '../data-manager/dataManager'


export default class AddGroup extends Component{
  constructor(props){
    super(props)
    this.state = {
      name: (props.update && props.update.title) || ''
    }
    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(e){
    if(e && e.preventDefault){
      e.preventDefault()
    }
    try {
      if(this.props.update){
        const r = await makeRequest('update group',{name:this.state.name,id:this.props.update.id})
        if(this.props.onUpdated){
          this.props.onUpdated(r.result)
        }
      }else{
        const r = await makeRequest('create group',{name:this.state.name})
        if(this.props.onCreated){
          this.props.onCreated(r.result)
        }
      }
      this.props.close()

    } catch (e) {
      console.error(e)
    }
  }

  handleChangeName(e){
    this.setState({name:e.target.value})
  }

  render(){
    return <div className="modal-box-container with-bottom-bar black-inputs">
      <form action="" onSubmit={this.handleSubmit}>
        <label>Crear habitación o grupo de interruptores</label>
        <input type="text" placeholder="Nombre" value={this.state.name} onChange={this.handleChangeName}/>
      </form>
      <OptionsBar
        left={<a onClick={this.props.close}>Cerrar</a>}
        right={<a onClick={this.handleSubmit}>Guardar</a>}
      />
    </div>
  }
}
