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

  async componentWillMount() {
         let fetch = new fetchData();

         var pageToRequest = ""

         switch (this.props.location.pathname) {
           case "/":
            pageToRequest = "home"
           break;
           case "/project":
            pageToRequest = "project"
           break;
           case "/about":
            pageToRequest = "about"
           break;
           default:
             pageToRequest = "home"
         }


         var rawHtml = await fetch.getStaticPage(pageToRequest)
         this.setState({rawHtml})
   }


  render() {

        var rawContent = this.state.rawHtml ? this.state.rawHtml : ""


        return <Card style={{marginTop:20,marginBottom:10,padding:15,textAlign:"left"}}>
            <span>{this.props.location.pathname}</span>
                    <div dangerouslySetInnerHTML={{__html: rawContent }}></div>
                     {this.props.children}
              </Card>
  }
}