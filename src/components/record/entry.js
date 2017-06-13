import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import XmlReader from 'xml-reader'
import xmlQuery from 'xml-query'

import fetchData from '../../network/fetch-data';

import style from './entryStyle.css'

import $ from 'jquery'

import xmlTranslator from '../../tools/xmlTranslator'

function traverseAllNodes (xmlNode) {
    var res = '';

    if (xmlNode.type == 'text'){
      res += xmlNode.value+" "
    } else {
      res += xmlNode.children.map(node => traverseAllNodes(node)).join(" ")
    }
    return res;
}

export default class Entry extends Component {

  constructor() {
    super()
    this.state = {
      //isAMobile: (navigator.userAgent.indexOf('Mobile') > -1)? true : false,
    };
  }

  async componentWillReceiveProps(next) {
      this.loadPageFromProps(next)
  }

  async componentWillMount() {
      this.loadPageFromProps(this.props)
   }

  async loadPageFromProps(props){
     let fetch = new fetchData();

     var data = await fetch.getEntry(props.params.entryID);

    var htm = $.parseHTML(data)

    var doc = htm[0].getElementsByTagName("doc")[0]

    console.log(doc)
    this.setState({rawContent: doc.innerHTML})
   }


  render() {

        if ( !this.state.rawContent) {
          return <div>Loading record</div>
        }

        console.log(this.state.rawContent)

        console.log(xmlTranslator(this.state.rawContent) )

        return <div style={{marginTop:10}}>
                <span>Entry: {this.props.params.entryID}</span>
                <Card className="entryContainer" style={{marginTop:10,padding:15}}>
                        <div dangerouslySetInnerHTML={{__html: xmlTranslator(this.state.rawContent) }}>
                          {/* {
                            this.state.textContent.map( (content,v) => <div key={v} style={{marginTop:5}}>{content}</div>)//this.props.entryData.find('item').map( node => traverseAllNodes(node))
                          } */}
                        </div>
                </Card>
              </div>
  }
}
