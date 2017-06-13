import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import { Link } from 'react-router'
import RaisedButton from 'material-ui/RaisedButton';

export default class Home extends Component {


  render() {

        return <Card style={{marginTop:20,marginBottom:10,padding:15,textAlign:"center"}}>
                    <div>This is Home.</div>
                     {this.props.children}
              </Card>
  }
}
