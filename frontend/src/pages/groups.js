import React, { Component } from 'react'
import { makeRequest } from '../functions/communication'
import OptionsBar from '../components/optionsBar'
import DataManager, { loadLocal } from '../data-manager/dataManager'
import { Link, pushUrl, MenuButton } from '../functions/util'
import openDialog from '../functions/openDialog'
import MessageBox from '../components/messageBox'
import AddGroup from '../components/addRoom'

export default class GroupsAdmin extends Component{
  constructor(props){
    super(props)
    this.state = {
      groupsList: DataManager.instance.groupsList,
    }
  }

  componentDidMount(){
    window.addEventListener('groupschange', e => {
      this.setState({
        groupsList: DataManager.instance.groupsList,
      })
    })
  }

  async deleteGroup(id){
    try {
      const r = await makeRequest('delete group',{id})
    } catch (e) {
      console.error(e)
    }
  }
  // <OptionsBar
  // right={<a href="">Agregar</a>}
  // />
  render(){
    return <div>
    <div className="negative-container">
      {this.state.groupsList.map(group => {
        const isDefault = !group.id.match(/^\_[A-Za-z0-9\_]{1,100}$/)
        return <MenuButton
          key={group.id}
          action={!isDefault && <i className="material-icons">clear</i>}
          onAction={!isDefault && (e => this.deleteGroup(group.id))}
          disabled={isDefault}
          onClick={e => {
            if(isDefault) return
            openDialog("modificar-grupo", props => {
              return <MessageBox {...props}>
              <AddGroup {...props} update={group}/>
              </MessageBox>
            })
        }}>{group.title}</MenuButton>
      })}
      </div>
      <MenuButton key={'add_group'} icon={<i className="material-icons">add</i>} onClick={e => {
        openDialog("crear-grupo", props => {
          return <MessageBox {...props}>
          <AddGroup {...props}/>
          </MessageBox>
        })
      }}>Crear grupo</MenuButton>
    </div>
  }
}
