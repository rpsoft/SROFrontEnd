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
        var doc = $.parseHTML(this.state.rawContent.replace(/\n/g, " ").replace(/\#/g,""))

        // add the struckThrough style and add square brackets to rend="struckThrough"
        $("[rend=struck-through]",doc).addClass( "struckThrough" );
        $("[rend=struck-through]",doc).each(function() {
            var text = $(this).text();
            $(this).text("[CANCELLED "+text.trim()+"]");
        });

        // add square brackets and CANCELLED string to <del>
        $("span.del",doc).each(function() {
            var text = $(this).text();
            $(this).text("[CANCELLED "+text.trim()+"]");
        });

        // add square brackets to <supplied>. or <span class="supplied"> if you prefer.
        $("span.supplied",doc).each(function() {
            var text = $(this).text() ;



            $(this).text("["+text.trim()+"]");

            // var prev = $("span .supplied",doc).prev()
            // //prev
            // var next = $("span .supplied",doc).next()
            //$(this).parent().css("white-space", "nowrap")
            // next.text(next.text().trim())
        });

        // This one hides the <sic> inside a <choice> block if <corr> is present.
        $("span.sic",doc).each(function() {
            var text = $(this).text();
            $(this).text("["+text.trim()+"]");
            var next = $(this).next()
            if ( next.hasClass("corr") ){
              $(this).css("display","none")
            }
        });

        $("span.supplied",doc).addClass( "removeMargin" ) //.css("margin-Left:-1px; margin-Right:-1px")

        $("span.note[resp=arber]",doc).each(function() {
            var text = $(this).text() ;
            $(this).text("["+text.trim()+"]");
        });

        $("span.persName[role~=enterer]",doc).css( "font-weight", "bold" )

 //console.log(":::: "+this.state.rawContent)
   //debugger
        var head = $(".head",doc)[0]
        var paragraphs = $("p",doc)
        var metadata = $(".ab[type=metadata]", doc)[0]
        var date = $(".ab[type=metadata] > span[type=Register]", doc)[0]
        var RegisterRef = $(".ab[type=metadata] > span[type=RegisterRef]", doc)[0]
        var ArberRef = $(".ab[type=metadata] > span[type=ArberRef]", doc)[0]
        var RegisterID = $(".ab[type=metadata] > span[type=RegisterID]", doc)[0]
        var works = $(".ab[type=metadata] > span[type=works]", doc)[0]
        var status = $(".ab[type=metadata] > span[type=status]", doc)[0].getAttribute("subtype")
        var price = $(".num[type=totalEntryPence]", doc) ? $(".num[type=totalEntryPence]", doc).attr("value") : ""

        var wardens = $(".ab[type=metadata] > .persName[role=warden]", doc)
        var masters = $(".ab[type=metadata] > .persName[role=master]", doc)


      //  debugger
        // para.innerText.replace(/(\r\n|\n|\r)/gm,"").replace(/ +(?= )/g,'')
        var isCancelled = status.toLowerCase().indexOf("cancelled") > -1 ? true : false

        var mastersHTML = masters.map( (i,v) => <span key={i}> { i > 0 ? <span>, </span> : <span></span> }  <span dangerouslySetInnerHTML={{__html: v ? v.innerText.trim() : ""}}></span> </span> )
        var wardensHTML = wardens.map( (i,v) => <span key={i}> { i > 0 ? <span>, </span> : <span></span> }  <span dangerouslySetInnerHTML={{__html: v ? v.innerText.trim() : ""}}></span> </span> )

        return <div style={{marginTop:10}}>

                <Card className="entryContainer" style={{marginTop:10,padding:15}}>
                    <span style={{float:"right",fontWeight:"bold"}} ><span dangerouslySetInnerHTML={{__html: date ? date.innerHTML : ""}}></span></span>
                    <div className="entryID" style={{color: isCancelled ? "red" : "black"}} >Entry: {this.props.params.entryID}</div>
                    {isCancelled ? <div style={{color: "red",fontWeight:"bold"}}> [ Cancelled </div> : ""}
                    <span className="persName" style={{color: isCancelled ? "red" : "black"}} dangerouslySetInnerHTML={{__html: head ? head.innerHTML : ""  }}></span>

                    <span style={{color: isCancelled ? "red" : "black"}}>
                        {
                          paragraphs.map( (i,para) => { return <div className="item" key={i} dangerouslySetInnerHTML={{__html: para.outerHTML }}></div> } )
                        }
                    </span>
                    {isCancelled ? <span style={{color: "red",fontWeight:"bold"}}> ] </span> : ""}
                    <div className="metadata">

                      <div><span className="metadataTitle">Register: </span><span dangerouslySetInnerHTML={{__html: RegisterRef ? RegisterRef.innerHTML : ""}}></span></div>
                      <div><span className="metadataTitle">Arber: </span><span dangerouslySetInnerHTML={{__html: ArberRef ? ArberRef.innerHTML : ""}}></span></div>
                      {/* <div><span className="metadataTitle">RegisterID: </span><span dangerouslySetInnerHTML={{__html: RegisterID ? RegisterID.innerHTML : ""}}></span></div> */}
                      {/* <div><span className="metadataTitle">Works: </span><span dangerouslySetInnerHTML={{__html: works ? works.innerHTML : ""}}></span></div> */}
                      <div><span className="metadataTitle">Status: </span><span dangerouslySetInnerHTML={{__html: status ? status : ""}}></span></div>
                      <div><span className="metadataTitle">Fee: </span><span className="fee" dangerouslySetInnerHTML={{__html: price ? price : ""}}></span><span style={{marginLeft:5}}>pence</span></div>
                      <div><span className="metadataTitle">Master: </span>{mastersHTML}</div>
                      <div><span className="metadataTitle">Wardens: </span>{wardensHTML}</div>
                    </div>

                    <RaisedButton style={{float:"right", position:"relative", bottom: 30}} onClick={() => this.getDownloadable()} label={"Download XML"} />
                </Card>


              </div>
  }
}
