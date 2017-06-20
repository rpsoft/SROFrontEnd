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

    this.setState({rawContent: doc.innerHTML})
   }


  render() {

        if ( !this.state.rawContent) {
          return <div>Loading record</div>
        }





        let translatedhtml = xmlTranslator(this.state.rawContent)

        console.log(translatedhtml)

        var doc = $.parseHTML(translatedhtml)
        var paragraphs = $("p",doc)
        var metadata = $(".ab[type=metadata]", doc)[0]
        var date = $(".ab[type=metadata] > .date", doc)[0]
        var RegisterRef = $(".ab[type=metadata] > span[type=RegisterRef]", doc)[0]
        var ArberRef = $(".ab[type=metadata] > span[type=ArberRef]", doc)[0]
        var RegisterID = $(".ab[type=metadata] > span[type=RegisterID]", doc)[0]
        var works = $(".ab[type=metadata] > span[type=works]", doc)[0]
        var status = $(".ab[type=metadata] > span[type=status]", doc)[0]
        // para.innerText.replace(/(\r\n|\n|\r)/gm,"").replace(/ +(?= )/g,'')
        return <div style={{marginTop:10}}>
                <span>Entry: {this.props.params.entryID}</span>
                <Card className="entryContainer" style={{marginTop:10,padding:15}}>

                      <div>
                        {
                          paragraphs.map( (i,para) => { return <div className="item" key={i} dangerouslySetInnerHTML={{__html: para.innerHTML }}></div> } )
                        }
                      </div>

                      <div className="metadata">
                        <div>{date.innerHTML}</div>
                        <div>{RegisterRef.innerHTML}</div>
                        <div>{ArberRef.innerHTML}</div>
                        <div>{RegisterID.innerHTML}</div>
                        <div>{works.innerHTML}</div>
                        <div>{status.innerHTML}</div>
                      </div>
                </Card>

              </div>
  }
}
