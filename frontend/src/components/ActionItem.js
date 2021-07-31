import React, { Component } from 'react'
import classNames from 'classnames'
import openDialog from '../functions/openDialog'
import MessageBox from '../components/messageBox'
import BottomSheet from '../components/bottomSheet'
import DeviceConfig from '../components/deviceConfig'
import { makeRequest } from '../functions/communication'

export default class ActionItem extends Component{
  constructor(props){
    super(props)
    this.state = {
      loading: 0,
    }
    this.state.waitingState = !this.on
    this.handleClick = this.handleClick.bind(this)
    this.switchesUpdateListener = e => {
      if(this.loadingMs+4000 < Date.now()){        
        this.setState({
          loading: 0
        })
      }
    }
  }

  get disabled(){
    return this.state.disabled === undefined ? !!this.props.disabled : !!this.state.disabled
  }

  get on(){
    return this.state.on === undefined ? !!this.props.on : !!this.state.on
  }

  componentDidMount(){
    window.addEventListener('switcheschange', this.switchesUpdateListener)
  }

  componentWillUnmount(){
    window.removeEventListener('switcheschange', this.switchesUpdateListener)
  }

  async handleClick(){
    const disabled = this.disabled
    const on = this.state.on === undefined ? !!this.props.on : !!this.state.on

    //TEST
    // this.setState({
    //   disabled: true,
    //   on: !on,
    // })

    if(!disabled){
      const s = !on
      this.setState({
        loading: this.state.loading+1,
        waitingState: s
      })
      this.loadingMs = Date.now()
      try {
        const ok = (await makeRequest('set switch state', {id:this.props.id,state:s})).result
      } catch (e) {

      } finally {
        if(this.state.loading > 0){
          this.setState({
            loading: this.state.loading-1
          })
        }
      }
    }
  }

  render(){
    const id = this.props.id
    const on = this.state.loading ? this.state.waitingState : this.on
    const disabled = this.disabled
    return <div className={classNames('item', {on:on})} disabled={disabled} onClick={this.handleClick}>
      <h3>
        {this.props.title || "Unnamed"}
      </h3>
      <i className={classNames('material-icons',{rotate:this.state.loading})} onClick={e => {
        e.stopPropagation()
        openDialog("opciones", props => {
        return <BottomSheet {...props}>
          <DeviceConfig id={id} close={props.close}/>
        </BottomSheet>
      })}}>{this.state.loading ? 'sync' : 'more_vert'}</i>
    </div>
  }
}
