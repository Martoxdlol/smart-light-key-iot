import React, { Component } from 'react'
import ItemsContainer from '../components/ItemsContainer'
import ActionItem from '../components/ActionItem'
import Nav from '../components/nav'
import Loader from '../components/loader'
import DataManager from '../data-manager/dataManager'
import MessageBox from '../components/messageBox'
import AskCredentials from '../components/askCredentials'
import openDialog from '../functions/openDialog'
import initScript from '../functions/initScript'
import { isConnected } from '../functions/communication'

export default class Home extends Component{
  constructor(props){
    super(props)
    this.state = {
      connected: isConnected()
    }
  }

  async componentDidMount(){
    await initScript(this)
    this.setState({
      connected: isConnected(),
    })
    window.addEventListener('locationchange', e => {
      if(window.initScriptCounter == 0 && location.pathname == '/'){
        initScript(this)
      }
    })
    window.addEventListener('groupschange', e => {
      this.setState({
        separatedGroupsListswitches: DataManager.instance.separatedGroupsList,
      })
    })
    window.addEventListener('switcheschange', e => {
      this.setState({
        separatedGroupsListswitches: DataManager.instance.separatedGroupsList,
      })
    })
    window.addEventListener('namechange', e => {
      this.setState({
        buildingName: DataManager.instance.buildingName,
      })
    })
    window.addEventListener('connect', e => {
      this.setState({
        connected: true,
      })
    })
    window.addEventListener('disconnect', e => {
      this.setState({
        connected: false,
      })
    })
  }

  render(){
    const separatedGroupsListswitches = this.state.separatedGroupsListswitches || []
    return (<div>
      <div id="main">
        <Nav title="Dispositivos inteligentes"/>
        <section>
          <span className="home-name">{this.state.buildingName}</span>
          {separatedGroupsListswitches.map(group => {
            return <ItemsContainer
              key={group.id}
              id={group.id}
              title={group.title}
            >
              {group.switchesList.map(switchitem => {
                return <ActionItem
                  key={switchitem.id}
                  id={switchitem.id}
                  code={switchitem.code}
                  title={switchitem.name}
                  on={switchitem.state === true}
                />
              })}
            </ItemsContainer>
          })}
          {!this.state.connected && <Loader/>}
        </section>
      </div>
      <footer>
      </footer>
    </div>)
  }
}
