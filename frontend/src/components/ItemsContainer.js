import React, { Component } from 'react'
import classNames from 'classnames'
import DataManager from '../data-manager/dataManager'
import { makeRequest } from '../functions/communication'

export default class ItemsContainer extends Component{
  constructor(props){
    super(props)
    this.state = {}
    this.topContainer = React.createRef()
    this.container = React.createRef()
    this.containerHeight = 10000
    this.updateContainerHeight = () => {
      this.containerHeight = this.container.current.clientHeight
      if(this.collapsed){
        this.topContainer.current.style.height = 30+"px"
      }else{
        this.topContainer.current.style.height = (this.containerHeight+30)+"px"
      }
    }
    this.toggle = this.toggle.bind(this)
    this.offAll = this.offAll.bind(this)
    this.onAll = this.onAll.bind(this)
    this.setToAll = this.setToAll.bind(this)


  }

  get collapsed(){
    return this.state.collapsed === undefined ? (this.props.collapsed === undefined ? localStorage.getItem("___collapsed__"+this.props.title) === "true" : !!this.props.collapsed) : !!this.state.collapsed
  }

  componentDidMount(){
    window.addEventListener('resize',this.updateContainerHeight)
    this.updateContainerHeight()
  }

  componentDidUpdate(){
    this.updateContainerHeight()
  }

  componentWillUnmount(){
    window.removeEventListener('resize',this.updateContainerHeight)
  }

  toggle(){
    const newState = !this.collapsed
    localStorage.setItem("___collapsed__"+this.props.title,newState.toString())
    this.setState({collapsed:newState},()=>{
      this.updateContainerHeight()
    })
  }

  offAll(e){
    e.stopPropagation()
    this.setToAll(false)
  }

  setToAll(s){
    const list = DataManager.instance.getGroupSwitchesList(this.props.id)
    for (var i = 0; i < list.length; i++) {
      makeRequest('set switch state', {id:list[i].id,state:s})
    }
  }

  onAll(e){
    e.stopPropagation()
    this.setToAll(true)
  }

  render(){
    const collapsed = this.collapsed
    return (
      <div ref={this.topContainer} className="top-items-container">
        <div className="title-bar" onClick={this.toggle}>
          <i className="material-icons">{collapsed ? "keyboard_arrow_down" : "keyboard_arrow_up"}</i>
          <span>{this.props.title || ""}</span>
          <div className="right">
            <a onClick={this.offAll}>Apagar</a>
            <span>·</span>
            <a onClick={this.onAll}>Prender</a>
          </div>
        </div>
        <div className={classNames('items-container', {collapsed})} ref={this.container}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
