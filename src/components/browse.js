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

import BrowseList from './browse-list'
import Paging from './paging'

// This is the library for all the cool progress indicator components
import Halogen from 'halogen';

class Browse extends Component {

    constructor() {
      super()
      this.state = {
        isAMobile: (navigator.userAgent.indexOf('Mobile') > -1)? true : false,
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
       var currentPage = props.params.page ? props.params.page : 1
       var pageLimit = props.params.pageLimit ? props.params.pageLimit : 20

       var data = await fetch.getAllEntriesPaged(currentPage,pageLimit);
       var ast = XmlReader.parseSync(data);
       var pagesAvailable = xmlQuery(ast).find('paging').find('last').text();

       this.setState({allContent : data, pagesAvailable : parseInt(pagesAvailable), currentPage : parseInt(currentPage), pageLimit: parseInt(pageLimit)})
     }
     //
    //  processEntriesFromXML (xmlcontent) {
    //    var ast = XmlReader.parseSync(xmlcontent);
    //    var xq = xmlQuery(ast);
    //    var length = xmlQuery(ast).find('entry').length
    //    var toReturn = []
    //    for ( var i = 0; i < length; i++){
    //     //  for ( var j = 0; j < length; j++){
    //     //    var itemsLength = xmlQuery(ast).find('entry').eq(i).find('item').length
    //     //    console.log(xmlQuery(ast).find('entry').eq(i).find('item').eq(j).text())
    //     //
    //     //  }
     //
    //     // Awesome XML searching and use of JSX to build the nodes ;)
    //      toReturn.push(<EntryPreview key={i} entryData={xmlQuery(ast).find('entry').eq(i).find('item').text()}></EntryPreview>)
    //    }
    //   return toReturn;
    //  }

    render() {
      var loadingIndicator = (<Halogen.MoonLoader color={"blue"}/>)

      if (!this.state.allContent){
        return <div style={{width:100,height:100, marginLeft: "auto", marginRight: "auto" ,paddingTop: 30}}>{loadingIndicator}</div>
      }

      return (
        <div style={{ padding:8, height:"100%"}}>
                <span>YOU ARE IN: BROWSE</span>
                <BrowseList allContent={this.state.allContent} pagesAvailable={this.state.pagesAvailable} pageLimit={this.state.pageLimit} currentPage={this.state.currentPage} linkRoot={"browser"}/>
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
)(Browse);
