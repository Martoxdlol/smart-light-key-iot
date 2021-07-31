import React, { Component } from 'react'
import classNames from 'classnames'
export default class MessageBox extends Component{
  constructor(props){
    super(props)
    this.state = {}
    this.boxRefTop = React.createRef()
    this.boxRef = React.createRef()
  }

  componentWillUnmount(){

  }

  componentDidMount(){
    this.props.addCloseListener(()=>{
      this.boxRef.current.style.opacity = 0
    })
    // this.props.removeCloseListener(f)
    setTimeout(() => {
      this.boxRef.current.style.opacity = 1
    }, 10);
  }

  render(){
      return <div className="message-box-top" ref={this.boxRefTop} onClick={e => {
        if(this.boxRefTop.current == e.target && !this.props.preventClose) this.props.close()
      }}>
        <div className="message-box" ref={this.boxRef}>
          {this.props.children}
        </div>
      </div>
  }
}
