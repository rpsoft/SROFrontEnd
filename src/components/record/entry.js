import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

export default class Entry extends Component {

  // constructor () {
  //   super();
  //   this.state = {};
  // }
  //
  // async componentDidMount() {
  //
  // }
  //
  // componentWillReceiveProps(nextProps) {
  //
  //   this.setState({entryData : nextProps.entryData});
  //
  // }

  getItems = (items) =>{
    if ( Array.isArray(items) ){
      return items.map( (item,i) => {
        return <div key={i}> {item.p._text}</div>
      })
    } else {
      return <div> {items.p._text} </div>
    }

  }

  render() {
        return <div>
                      {
                        this.getItems(this.props.entryData.items.item)

                      }
                      <br/>
              </div>
  }
}
