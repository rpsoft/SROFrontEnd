import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import xmlQuery from 'xml-query'

import { Link } from 'react-router'

import style from './entryPreviewStyle.css'

import xmlTranslator from '../../tools/xmlTranslator'

import $ from 'jquery'

function traverseAllNodes (xmlNode) {
    var res = '';

    if (xmlNode.type == 'text'){
      res += xmlNode.value+" "
    } else {

      res += xmlNode.children.map(node => traverseAllNodes(node)).join(" ")
    }
    return res;
}

export default class EntryPreview extends Component {



  render() {
        let data = this.props.entryData

        let summaries = [];

        if ( data.getElementsByTagName("sum").length > 0 && data.getElementsByTagName("sum")[0].getElementsByTagName("p").length > 0){

          var sumElement = data.getElementsByTagName("sum")[0].getElementsByTagName("p");

          // if (sumElement.length > 0 ){
            for ( var i = 0 ; i < sumElement.length; i++){
              summaries.push(sumElement[i])
            }
          // } else {
          //     debugger
          // }

        } else {

          for ( var i = 0 ; i < data.getElementsByTagName("doc")[0].getElementsByTagName("p").length; i++){

            var node = data.getElementsByTagName("doc")[0].getElementsByTagName("p")[i]
            node.innerText.trim().length > 0 ? summaries.push(node) : null
          }
        }

        //findEnterer


        var pers = data.getElementsByTagName("doc")[0].getElementsByTagName("persname")
        var enterer;
        try {
          for ( var i = 0 ; i < pers.length; i++){
              var person = pers[i]
              if ( person.getAttribute("role").toLowerCase().indexOf("enterer") > -1 ){
                enterer = (person.getElementsByTagName("forename")[0] ? person.getElementsByTagName("forename")[0].innerText : "")
                          + " " +
                          (person.getElementsByTagName("surname")[0] ? person.getElementsByTagName("surname")[0].innerText : "");
                break;
              }

          }
        } catch ( e ){
          enterer = " "
        }
      //  debugger;


        let maxPreviewElements = 3


        // var date = data.getElementsByTagName("date")[1].getAttribute("when")
        // date = date ? date : data.getElementsByTagName("date")[1].getAttribute("notBefore")
        // date = date ? date : data.getElementsByTagName("date")[1].getAttribute("notAfter")

        let translatedPage = xmlTranslator(data.innerHTML)

        var doc = $.parseHTML(translatedPage)
        // debugger
        var date = $(".ab[type=metadata] > span[type=Register]", doc)[0].innerHTML

        var status = $(".ab[type=metadata] > span[type=status]", doc)[0].getAttribute("subtype")
        var isCancelled = (status.toLowerCase().indexOf("cancelled") > -1 ? true : false)


        // debugger
        return <Card style={{marginBottom:10,padding:10}}>
                    <span>
                      <span style={{color: isCancelled ? "red" : "black"}}>{data.getElementsByTagName("docid")[0].innerText}</span>
                      {isCancelled ? <div style={{color: "red",fontWeight:"bold"}}> Cancelled </div> : ""}
                      <Link to={'/entry/'+data.getElementsByTagName("docid")[0].innerText} style={{textDecoration:"none",color:"black"}}><span className={"viewFull"}>View Full</span>  </Link>
                      <span style={{marginLeft:5,marginRight:5,fontSize:10}}>({date})</span><br/>
                      <span className={"previewEnterer"} >{enterer}</span>
                      {
                      summaries.map( (n,i) => i < maxPreviewElements ? <span key={i} className={"previewEntry"} dangerouslySetInnerHTML={{__html: n.innerHTML}} ></span> : "")
                      }
                    </span>
                  </Card>

  }
}
