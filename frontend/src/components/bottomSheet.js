import React, { Component } from 'react'
import classNames from 'classnames'
export default class BottomSheet extends Component{
  constructor(props){
    super(props)
    this.state = {}
    this.boxRefTop = React.createRef()
  }

  componentWillUnmount(){

  }

  componentDidMount(){
    this.props.addCloseListener(()=>{
      this.boxRefTop.current.style.bottom = -this.height+"px"
    })
    // this.props.removeCloseListener(f)
    setTimeout(() => {
      this.boxRefTop.current.style.bottom = 0
    }, 10);
  }

  get height(){
    if(typeof window != "undefined" && Number.isInteger(window.innerHeight)){
      if(window.innerHeight > 400) return 400
      return window.innerHeight
    }
    return 400
  }

  render(){
      return <div className="bottom-sheet" ref={this.boxRefTop} style={{height:this.height+"px", bottom: -this.height+"px"}}>
        {this.props.children}
      </div>
  }
}
