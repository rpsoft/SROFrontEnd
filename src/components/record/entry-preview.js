import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import xmlQuery from 'xml-query'

import { Link } from 'react-router'

import style from './entryPreviewStyle.css'

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

export default class EntryPreview extends Component {



  render() {
        let data = this.props.entryData

        let summaries = [];

        if ( data.getElementsByTagName("sum").length > 0 ){
          for ( var i = 0 ; i < data.getElementsByTagName("sum")[0].getElementsByTagName("p").length; i++){
            summaries.push(data.getElementsByTagName("sum")[0].getElementsByTagName("p")[i])
          }
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

        return <Link to={'/entry/'+data.getElementsByTagName("docid")[0].innerText} style={{textDecoration:"none"}}>
                  <Card style={{marginBottom:10,padding:10}}>
                    <span>
                      <span>{data.getElementsByTagName("docid")[0].innerText}</span>
                      <span className={"viewFull"}>View Full</span>
                      <span style={{marginLeft:5,marginRight:5,fontSize:10}}>(Testing: {data.getElementsByTagName("date")[1].innerText})</span><br/>
                      <span className={"previewEnterer"} >{enterer}</span>
                      {
                      summaries.map( (n,i) => i < maxPreviewElements ? <span key={i} className={"previewEntry"} dangerouslySetInnerHTML={{__html: xmlTranslator(n.innerHTML)}} ></span> : "")
                      }
                    </span>
                  </Card>
              </Link>
  }
}
