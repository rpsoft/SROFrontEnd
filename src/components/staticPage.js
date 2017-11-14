import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import { Link } from 'react-router'
import RaisedButton from 'material-ui/RaisedButton';

import fetchData from '../network/fetch-data';

export default class StaticPage extends Component {

  constructor(props) {
      super()
      this.state = {
        page : props.page
        //isAMobile: (navigator.userAgent.indexOf('Mobile') > -1)? true : false,
      };

    }

  async fetchPage(page) {
    let fetch = new fetchData();

    var pageToRequest = ""

    switch (page) {
      case "/":
       pageToRequest = "home"
      break;
      case "/project":
       pageToRequest = "project"
      break;
      case "/about":
       pageToRequest = "about"
      break;
      case "/help":
       pageToRequest = "help"
      break;
      default:
        pageToRequest = "home"
    }


    var rawHtml = await fetch.getStaticPage(pageToRequest)
    this.setState({rawHtml})
  }

  componentDidUpdate() {
    if ( this.props.location.query && this.props.location.query.g ){
        location.hash =  "#"+this.props.location.query.g
    }

  }

  componentWillReceiveProps(next){
      this.fetchPage(next.location.pathname)
  }

  componentWillMount() {
      this.fetchPage(this.props.location.pathname)
  }

  render() {

        var rawContent = this.state.rawHtml ? this.state.rawHtml : ""


        return <Card style={{marginTop:10,marginBottom:5,padding:15,textAlign:"left",minHeight:"51vh"}}>
                    {/* <span>{this.props.location.pathname}</span> */}
                    <div dangerouslySetInnerHTML={{__html: rawContent }}></div>
                    {/* {this.props.children} */}
              </Card>
  }
}
