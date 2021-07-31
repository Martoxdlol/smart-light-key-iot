import React, { Component } from 'react'
import classNames from 'classnames'
export default class FullScreenPage extends Component{
  constructor(props){
    super(props)
    this.state = {}
    this.boxRefTop = React.createRef()
  }

  componentWillUnmount(){

  }

  componentDidMount(){
    this.props.addCloseListener(()=>{
      this.boxRefTop.current.style.marginLeft = '100vw'
      this.boxRefTop.current.style.boxShadow = 'none'
    })
    // this.props.removeCloseListener(f)
    setTimeout(() => {
      this.boxRefTop.current.style.marginLeft = 0
      this.boxRefTop.current.style.boxShadow = '0px 1px 7px -2px rgba(51,51,51,1)'
    }, 10);
  }

  render(){
      return <div className='fullsceen-page' ref={this.boxRefTop}>
        <nav className='fullsceen-page-nav'>
          <ul>
            <li><i className="material-icons" onClick={this.props.close}>arrow_back</i></li>
            <li>{this.props.title || ''}</li>
          </ul>
        </nav>
        <div className="pre-container">
          <div className="container">
            {this.props.children}
          </div>
        </div>
      </div>
  }
}
