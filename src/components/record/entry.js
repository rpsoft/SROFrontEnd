import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import XmlReader from 'xml-reader'
import xmlQuery from 'xml-query'

import fetchData from '../../network/fetch-data';

import style from './entryStyle.css'

import $ from 'jquery'

import xmlTranslator from '../../tools/xmlTranslator'

import RaisedButton from 'material-ui/RaisedButton';

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

    var preTranslation = data

    data = xmlTranslator(data)

    //
    // var htm = $.parseHTML(data)
    // var doc = htm[0]

    this.setState({rawContent: data, preTranslation: preTranslation})
   }

  getDownloadable (){
    var downloadData = "data:application/octet-stream," + encodeURIComponent(this.state.preTranslation);
    window.open(downloadData, 'SRO-document.xml');
  }

  render() {

        if ( !this.state.rawContent) {
          return <div>Loading record</div>
        }


        console.log(this.state.rawContent)
        var doc = $.parseHTML(this.state.rawContent)
        var head = $(".head",doc)[0]
        var paragraphs = $("p",doc)
        var metadata = $(".ab[type=metadata]", doc)[0]
        var date = $(".ab[type=metadata] > .date", doc)[0]
        var RegisterRef = $(".ab[type=metadata] > span[type=RegisterRef]", doc)[0]
        var ArberRef = $(".ab[type=metadata] > span[type=ArberRef]", doc)[0]
        var RegisterID = $(".ab[type=metadata] > span[type=RegisterID]", doc)[0]
        var works = $(".ab[type=metadata] > span[type=works]", doc)[0]
        var status = $(".ab[type=metadata] > span[type=status]", doc)[0]
        var price = $(".num[type=totalPence]", doc) ? $(".num[type=totalPence]", doc).attr("value") : ""


        // para.innerText.replace(/(\r\n|\n|\r)/gm,"").replace(/ +(?= )/g,'')
        return <div style={{marginTop:10}}>

                <Card className="entryContainer" style={{marginTop:10,padding:15}}>
                    <div className="entryID">Entry: {this.props.params.entryID}</div>

                    <div className="persName" dangerouslySetInnerHTML={{__html: head ? head.innerHTML : ""  }}></div>

                    <div>
                        {
                          paragraphs.map( (i,para) => { return <div className="item" key={i} dangerouslySetInnerHTML={{__html: para.innerHTML }}></div> } )
                        }
                    </div>

                    <div className="metadata">
                      <div dangerouslySetInnerHTML={{__html: date ? date.innerHTML : ""}}></div>
                      <div dangerouslySetInnerHTML={{__html: RegisterRef ? RegisterRef.innerHTML : ""}}></div>
                      <div dangerouslySetInnerHTML={{__html: ArberRef ? ArberRef.innerHTML : ""}}></div>
                      <div dangerouslySetInnerHTML={{__html: RegisterID ? RegisterID.innerHTML : ""}}></div>
                      <div dangerouslySetInnerHTML={{__html: works ? works.innerHTML : ""}}></div>
                      <div dangerouslySetInnerHTML={{__html: status ? status.innerHTML : ""}}></div>
                      <div dangerouslySetInnerHTML={{__html: price ? price : ""}}></div>
                    </div>

                    <RaisedButton style={{float:"right", position:"relative", bottom: 30}}onClick={() => this.getDownloadable()} label={"Download XML"} />
                </Card>


              </div>
  }
}
