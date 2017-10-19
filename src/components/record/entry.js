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

    //debugger
    data = xmlTranslator(data)
    //debugger
    //
    // var htm = $.parseHTML(data)
    // var doc = htm[0]

    this.setState({rawContent: data, preTranslation: preTranslation})
   }

  getDownloadable (){
    var link = document.createElement('a');
    link.download = "SRO-Entry-"+this.props.params.entryID+".xml";
    link.href = 'data:,' + encodeURIComponent(this.state.preTranslation);
    link.click();

    // var downloadData = "data:application/octet-stream,"
    // window.open(downloadData, 'SRO-document.xml');
  }



  render() {

        if ( !this.state.rawContent) {
          return <div>Loading record</div>
        }


        console.log(":::: "+this.state.rawContent)
        var doc = $.parseHTML(this.state.rawContent)
        var head = $(".head",doc)[0]
        var paragraphs = $("p",doc)
        var metadata = $(".ab[type=metadata]", doc)[0]
        var date = $(".ab[type=metadata] > span[type=Register]", doc)[0]
        var RegisterRef = $(".ab[type=metadata] > span[type=RegisterRef]", doc)[0]
        var ArberRef = $(".ab[type=metadata] > span[type=ArberRef]", doc)[0]
        var RegisterID = $(".ab[type=metadata] > span[type=RegisterID]", doc)[0]
        var works = $(".ab[type=metadata] > span[type=works]", doc)[0]
        var status = $(".ab[type=metadata] > span[type=status]", doc)[0]
        var price = $(".num[type=totalPence]", doc) ? $(".num[type=totalPence]", doc).attr("value") : ""

        var wardens = $(".ab[type=metadata] > .persName[role=warden]", doc)
        var masters = $(".ab[type=metadata] > .persName[role=master]", doc)


      //  debugger
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
                      <div><span className="metadataTitle">Date: </span><span dangerouslySetInnerHTML={{__html: date ? date.innerHTML : ""}}></span></div>
                      <div><span className="metadataTitle">RegisterRef: </span><span dangerouslySetInnerHTML={{__html: RegisterRef ? RegisterRef.innerHTML : ""}}></span></div>
                      <div><span className="metadataTitle">ArberRef: </span><span dangerouslySetInnerHTML={{__html: ArberRef ? ArberRef.innerHTML : ""}}></span></div>
                      {/* <div><span className="metadataTitle">RegisterID: </span><span dangerouslySetInnerHTML={{__html: RegisterID ? RegisterID.innerHTML : ""}}></span></div> */}
                      <div><span className="metadataTitle">Works: </span><span dangerouslySetInnerHTML={{__html: works ? works.innerHTML : ""}}></span></div>
                      <div><span className="metadataTitle">Status: </span><span dangerouslySetInnerHTML={{__html: status ? status.innerHTML : ""}}></span></div>
                      <div><span className="metadataTitle">Price: </span><span className="fee" dangerouslySetInnerHTML={{__html: price ? price : ""}}></span></div>
                      <div><span className="metadataTitle">Wardens: </span>{wardens.map( (i,v) => <span key={i} dangerouslySetInnerHTML={{__html: v ? v.innerHTML : ""}}></span> )}</div>
                      <div><span className="metadataTitle">Master: </span>{masters.map( (i,v) => <span key={i} dangerouslySetInnerHTML={{__html: v ? v.innerHTML : ""}}></span> )}</div>
                    </div>

                    <RaisedButton style={{float:"right", position:"relative", bottom: 30}}onClick={() => this.getDownloadable()} label={"Download XML"} />
                </Card>


              </div>
  }
}
