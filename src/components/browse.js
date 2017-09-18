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

import urlUtils from './urlUtils'

class Browse extends Component {

    constructor() {
      super()
      this.state = {
        isAMobile: (navigator.userAgent.indexOf('Mobile') > -1)? true : false,
        linkRoot: "browser",
        sorting:{sortField: "date", direction: "ascending"}
      };
    }

    async componentWillReceiveProps(next) {
        this.loadPageFromProps(next)
    }

    async componentWillMount() {
        this.loadPageFromProps(this.props)
     }

    async loadPageFromProps(pps,filters){
      let fetch = new fetchData();
      var props = pps ? pps : this.props
      var currentPage = props.params.page ? props.params.page : 1
      var pageLimit = props.params.pageLimit ? props.params.pageLimit : 20
      var xmlField = props.params.sortField
      var direction = props.params.direction ? props.params.direction : 'ascending'
      var filters = props.location.query.filters ? props.location.query.filters.split(",") : []

      // if(this.state.advancedSearch.query.length < 1){
      //
      //   return ;
      // }

      this.setState({allContent : null})
      console.log(JSON.stringify(filters))
      // here we distinguish between advanced and simple search
      var readyData = {query: ""}

      var data;
      if ( filters && filters.length > 0 ){
        // debugger
        data = await fetch.getEntriesAdvancedSearch(readyData, currentPage, pageLimit, xmlField, direction, filters);
      } else {
        data = await fetch.getAllEntriesPaged(currentPage, pageLimit);
      }

      var ast = XmlReader.parseSync(data);
      var pagesAvailable = xmlQuery(ast).find('paging').find('last').text();

    //  this.setState({loading : false})

      var advSearch = this.state.advancedSearch

      this.setState({ sorting:{sortField: props.params.sortField,
                      direction: direction},
                      allContent : data,
                      pagesAvailable : parseInt(pagesAvailable),
                      currentPage : parseInt(currentPage),
                      pageLimit: parseInt(pageLimit),
                      advancedSearch: advSearch })


     }

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
    //
    // toggleFilters = (filters) => {
    //   // this.setState({filters: filters})
    // //  this.setState({isLoading : true})
    // //  this.loadPageFromProps(this.props,filters)
    //   //this.setState({isLoading : false})


    // }

    render() {
      var loadingIndicator = (<Halogen.MoonLoader color={"blue"}/>)

      var browseListResults;
      let sortLinkStyle = {marginRight:10}
      let sortbuttonStyle = {height:25,marginBottom:5,marginRight:5}

      let orderingBar = <Card style={{paddingTop:5,paddingLeft:5,paddingRight:5,textAlign:'center'}}>
                        <Link to={urlUtils.formatUrl(this.state.linkRoot,this.state.currentPage,this.state.pageLimit, {sortField: "date", direction: "ascending"}, this.state.advancedSearch)} style={sortLinkStyle}>
                          <RaisedButton label='Date (earliest)' style={sortbuttonStyle} />
                        </Link>
                        <Link to={urlUtils.formatUrl(this.state.linkRoot,this.state.currentPage,this.state.pageLimit, {sortField: "date", direction: "descending"}, this.state.advancedSearch)} style={sortLinkStyle}>
                          <RaisedButton label='Date (latest)' style={sortbuttonStyle} />
                        </Link>
                        <Link to={urlUtils.formatUrl(this.state.linkRoot,this.state.currentPage,this.state.pageLimit, {sortField: "volume", direction: "descending"}, this.state.advancedSearch)} style={sortLinkStyle}>
                          <RaisedButton label='Volume/page'  style={sortbuttonStyle}/>
                        </Link>
                      </Card>


        browseListResults = <BrowseList
                            allContent={this.state.allContent}
                            pagesAvailable={this.state.pagesAvailable}
                            pageLimit={this.state.pageLimit}
                            currentPage={this.state.currentPage}
                            linkRoot={"browser"}
                            sorting={this.state.sorting}
                            advSearchParameters={this.state.advancedSearch}
                            //toggleFilter={(filter) => { this.toggleFilters(filter) }}
                            location={this.props.location}
                          />


      return (
        <div style={{ paddingTop:8, height:"100%",minHeight:"70vh"}}>
          {orderingBar}
          {browseListResults}

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
