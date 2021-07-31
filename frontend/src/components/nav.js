import React, { Component } from 'react'
import classNames from 'classnames'
import contextmenu from '../functions/contextmenu'
import openDialog from '../functions/openDialog'
import MessageBox from '../components/messageBox'
import AddGroup from '../components/addRoom'
import GroupsAdmin from '../pages/groups'
import PhysicalDevicesPage from '../pages/physicalDevicesPage'
import BottomSheet from '../components/bottomSheet'
import FullScreenPage from '../components/fullScreenPage'
import BuildingSettings from '../components/buildingSettings'
export default class Nav extends Component{
  constructor(props){
    super(props)
    this.state = {}
    this.updateTitlePos = () => {
      const scrollY = window.scrollY || window.pageYOffset
      this.title1.current.style.marginTop = (scrollY/1.14)+"px"
      if(scrollY > 245 && !this.state.navFixed){
        this.setState({
          navFixed:true
        })
      }else if(scrollY <= 245 && this.state.navFixed){
        this.setState({
          navFixed:false
        })
      }
    }
    this.title1 = React.createRef()
  }

  componentDidMount(){
    window.addEventListener('scroll',this.updateTitlePos)
    this.updateTitlePos()
  }

  componentWillUnmount(){
    window.removeEventListener('scroll',this.updateTitlePos)
  }

  render(){
    return <nav>
      <div className={classNames({bottom45:this.state.navFixed})}>
        <h1 ref={this.title1}>{this.props.title}</h1>
      </div>
      <ul className={classNames({fixed:this.state.navFixed})}>
        <li className="ul-title" style={{opacity:this.state.navFixed ? 1 : 0}}><h1>{this.props.title}</h1></li>
        <li><i className="material-icons" onClick={e => contextmenu(e, [
          {label:"Grupo de interruptores",action:openAddGrooup},
          {label:"Configurar nuevo dispositivo",action:openConfigDevice},
        ])}>add</i></li>
        <li><i className="material-icons" onClick={e => {openDialog("configuracion", props => {
          return <BottomSheet {...props}>
            <BuildingSettings {...props}/>
          </BottomSheet>
        })}}>settings</i></li>
        <li><i className="material-icons" onClick={e => contextmenu(e, [
          {label:"Todos los grupos",action:openGroups},
          {label:"Dispositivos físicos",action:openDevices},
          {label:"Ayuda",action:openHelp},
          {label:"Página de la empresa"},
        ])}>more_vert</i></li>
      </ul>
    </nav>
  }
}

function openAddGrooup(e){
  openDialog("crear-grupo", props => {
    return <MessageBox {...props}>
      <AddGroup {...props}/>
    </MessageBox>
  })
}

function openConfigDevice(e){
  openDialog("configurar-dispositivo", props => {
    return <FullScreenPage {...props} title='Configurar dispositivo'>
      ...
    </FullScreenPage>
  })
}

function openHelp(e){
  openDialog("ayuda", props => {
    return <FullScreenPage {...props} title='Ayuda'>
      ...
    </FullScreenPage>
  })
}

function openGroups(e){
  openDialog("grupos", props => {
    return <FullScreenPage {...props} title='Grupos de interruptores'>
      <GroupsAdmin {...props}/>
    </FullScreenPage>
  })
}

function openDevices(e){
  openDialog("dispositivos", props => {
    return <FullScreenPage {...props} title='Dispositivos registrados'>
      <PhysicalDevicesPage {...props}/>
    </FullScreenPage>
  })
}
