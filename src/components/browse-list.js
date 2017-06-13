//System imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import { templateListSet } from '../actions/actions';
import fetchData from '../network/fetch-data';

// Material UI imports
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

//URL relative references kept in one place.
import { URL_CATEGORIES_LIST, URL_BASE_MULTIMEDIA_IMAGES} from '../links';

//Static storage class.
import QueryStore from './QueryStore';

import EntryPreview from './record/entry-preview'

// Allows processing and using XML input.
import XmlReader from 'xml-reader'
import xmlQuery from 'xml-query'

import Paging from './paging'

// This is the library for all the cool progress indicator components
import Halogen from 'halogen';


import $ from 'jquery';

class BrowseList extends Component {

    constructor(props) {
      super()
      this.state = {
        allContent : props.allContent,
        pagesAvailable : props.pagesAvailable,
        currentPage : props.currentPage,
        pageLimit: props.pageLimit,
        isAMobile: (navigator.userAgent.indexOf('Mobile') > -1)? true : false,
        linkRoot: props.linkRoot
      };
    }

    componentWillReceiveProps(next){
      this.setState({
        allContent : next.allContent,
        pagesAvailable : next.pagesAvailable,
        currentPage : next.currentPage,
        pageLimit: next.pageLimit,
        linkRoot: next.linkRoot
      });
    }

     processEntriesFromXML (xmlcontent) {
       console.log ( xmlcontent)

       var htm = $.parseHTML(xmlcontent)

       var entries = htm[0].getElementsByTagName("entry")

       var toReturn = []
       for ( var i = 0; i < entries.length; i++){
        //  for ( var j = 0; j < length; j++){
        //    var itemsLength = xmlQuery(ast).find('entry').eq(i).find('item').length
        //    console.log(xmlQuery(ast).find('entry').eq(i).find('item').eq(j).text())
        //
        //  }
        // Awesome XML searching and use of JSX to build the nodes ;)
        //console.log(entries[i]);
         toReturn.push(<EntryPreview key={i} entryData={entries[i]}></EntryPreview>)
       }
      return toReturn;
     }

    render() {
      var loadingIndicator = (<Halogen.MoonLoader color={"blue"}/>)

      if (!this.state.allContent){
        return <div style={{width:100,height:100, marginLeft: "auto", marginRight: "auto" ,paddingTop: 30}}>{loadingIndicator}</div>
      }

      return (
        <div style={{ padding:8, height:"100%"}}>
                <Paging pages={this.state.pagesAvailable} entriesPerPage={this.state.pageLimit} currentPage={this.state.currentPage} linkRoot={this.state.linkRoot}/>

                <div>Entries:</div>
                {this.processEntriesFromXML(this.state.allContent).map( (e) => e)}

                <Paging pages={this.state.pagesAvailable} entriesPerPage={this.state.pageLimit} currentPage={this.state.currentPage} linkRoot={this.state.linkRoot} />
       </div>
      );
    }
}

const mapStateToProps = (state, ownProps) => ({
  templateList: state.templateList || null,
  // if route contains params
  params: ownProps.params,
  location: ownProps.location
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowseList);
