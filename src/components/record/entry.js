import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import XmlReader from 'xml-reader'
import xmlQuery from 'xml-query'

import fetchData from '../../network/fetch-data';

import {URL_BASE} from '../../links'

import style from './entryStyle.css'

import $ from 'jquery'

import xmlTranslator from '../../tools/xmlTranslator'
import docStyler from '../../tools/docStyler.js'
import Popover from 'material-ui/Popover';
import DropDownMenu from 'material-ui/DropDownMenu';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

import { push } from 'react-router-redux'

import RaisedButton from 'material-ui/FlatButton';
import DownArrow from 'material-ui/svg-icons/navigation/arrow-drop-down';

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

  getDownloadableTXT (){
    var link = document.createElement('a');
    link.download = "SRO-Entry-"+this.props.params.entryID+".txt";

    var xml = this.state.rawContent,
    xmlDoc = $.parseXML( xml ),
    $xml = $( xmlDoc ),
    $sroid = $xml.find("div:first"),
    $entry = $xml.find("p"),
    $date = $xml.find( "span.date" ).attr("when"),
    $fee = $xml.find("span.num[type=totalPence]"),
    $regRef = $xml.find("span.idno[type=RegisterRef]"),
    $arberRef = $xml.find("span.idno[type=ArberRef]"),
    $master = $xml.find("span.persName[role=master]"),
    $wardens = $xml.find("span.persName[role=warden]"),
    $enterers = $xml.find("span.persName[role='stationer enterer']");

    var baseURI = $entry[0].baseURI
    var urlParts = baseURI.split("/", -1);
    // get SROID
    var sroid = urlParts[urlParts.length-1];
    // Get full date
    var fullDate = $date;
    // Fix fee spacing
    $("span.num[type=pence]",$entry).each(function() {
      var text = $(this).text();
      $(this).text(text.replace(/\s{2,}/g,''));
    });
    $("span.num[type=shillingsAsPence]",$entry).each(function() {
      var text = $(this).text();
      $(this).text(text.replace(/\s{2,}/g,''));
    });
    // Get entry text
    var entryText = $entry.text().replace(/\s{2,}/g,' ');
    // Get Fee
    var totalFee = $fee.attr("value") + " pence";
    // Get Register details [NB suppress the <idno type=""RegisterID"">
    var registerRef = $regRef[0].innerHTML;
    // Get Arber details [With 'Arber' as prefix]
    var arberRef = $arberRef[0].innerHTML;
    // Image number [With 'Image' as prefix]

    // 'Enterer's
    var enterersText = "";
    var enterers = $.each($enterers, function (index, value)
    {
      enterersText += value.textContent.trim() + ", ";
    });
    enterersText = enterersText.substring(0, enterersText.length -2);
    enterersText = enterersText.replace(/\s{2,}/g,' ');
    // Master [with 'Master' as prefix]
    var master = $master[0].textContent;
    master = master.replace(/\s{2,}/g,' ');
    // Wardens [with 'Wardens' as prefix], names separated by commas
    var wardensText = "";
    var wardens = $.each($wardens, function (index,value)
    {
      wardensText += value.textContent.trim() + ", ";
    });
    wardensText = wardensText.substring(0, wardensText.length -2);
    wardensText = wardensText.replace(/\s{2,}/g,' ');

    // get final text to return
    var finalText =
      "SROID: " + sroid + "\n\n" +
      "Full Date: " + fullDate + "\n\n" +
      "Enterers: " + enterersText + "\n\n" +
      "Entry Text: " + entryText + "\n\n" +
      "Fee: " + totalFee + "\n\n" +
      "Register Details: " + registerRef + "\n\n" +
      "Arber Reference: " + arberRef + "\n\n" +
      "Master: " + master + "\n\n" +
      "Wardens: " + wardensText;
    link.href = 'data:,' + finalText;

    link.click();
  }

  getDownloadableXML (){
    var link = document.createElement('a');
    link.download = "SRO-Entry-"+this.props.params.entryID+".xml";
    link.href = 'data:,' + encodeURIComponent(this.state.preTranslation);
    link.click();
    // console.log (this.state);
    // var downloadData = "data:application/octet-stream,"
    // window.open(downloadData, 'SRO-document.xml');
  }

  handleTouchTap = (event,target) => {
    // This prevents ghost click.
    event.preventDefault();
    var newstate = {
        anchorEl: event.currentTarget,
      }

    newstate[target] = true

    this.setState(newstate);
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
      open2: false,
    });
  };

  render() {
        // styles for dropdown
        let buttonColor = "#e6e6e6"
        let buttonHoverColor = "#b5b5b5"
        let dividerFormat = {width:"90%",marginLeft:"5%"}

        if ( !this.state.rawContent) {
          return <div>Loading record</div>
        }

        var doc = $.parseHTML(this.state.rawContent.replace(/\s{2,}/g,' '))

        docStyler(doc);

        var head = $(".head",doc)[0]
        var paragraphs = $("p",doc)
        var metadata = $(".ab[type=metadata]", doc)[0]
        var date = $(".ab[type=metadata] > span[type=Register]", doc)[0]
        var RegisterRef = $(".ab[type=metadata] > span[type=RegisterRef]", doc)[0]
        var ArberRef = $(".ab[type=metadata] > span[type=ArberRef]", doc)[0]
        // var RegisterID = $(".ab[type=metadata] > span[type=RegisterID]", doc)[0]
        var works = $(".ab[type=metadata] > span[type=works]", doc)[0]
        var status = ""
        for ( var j = 0; j < $(".ab[type=metadata] > span[type=status]", doc).length; j++){
          status = status+ " "+$(".ab[type=metadata] > span[type=status]", doc)[j].getAttribute("subtype")
        }
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


                    <RaisedButton hoverColor={buttonHoverColor} backgroundColor={buttonColor}  className="mui-btn mui-btn--small mui-btn--primary"
                    onClick={(event) => {this.handleTouchTap(event,"open2")}}
                    label={<span style={{display:"inline-flex",top:0, position:"relative",paddingLeft: 0}}>Download <DownArrow style={{display:"inline-flex",top:3, position:"relative",marginRight:-10, marginLeft: 6, paddingLeft: 4, borderLeft: "#d2d2d2 1px solid"}}/></span>}
                    style={{float:"right", position:"relative", bottom: 30}}
                    />

                    <Popover
                      open={this.state.open2}
                      anchorEl={this.state.anchorEl}
                      anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                      targetOrigin={{horizontal: 'left', vertical: 'top'}}
                      onRequestClose={this.handleRequestClose}
                    >
                      <Menu>
                        <MenuItem value={2} primaryText="Download Text" onClick={() => this.getDownloadableTXT()} />
                        <MenuItem value={1} primaryText="Download XML" onClick={() => this.getDownloadableXML()} />
                      </Menu>
                    </Popover>


                </Card>


              </div>
  }
}
