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
        sorting:{sortField: "date", direction: "ascending"},
        loading: false,
      };
    }

    async componentWillReceiveProps(next) {

      var nextRequest = next.location.pathname+next.location.search
      var currentRequest = this.props.location.pathname+this.props.location.search

      // Prevents multiple reloading, due to change in props after running "loadPageFromProps", probably not the best way to do it, but it does the job.
      if ( nextRequest === currentRequest ){
        return;
      }

      var advSearch = this.state.advancedSearch
      for( var k in advSearch ){
        if ( k == "enabled" || k == "query"){
          continue
        }
        if ( advSearch[k] && JSON.stringify(advSearch[k]).length > 0){
          anyActive = true;
          break;
        }
      }


      this.loadPageFromProps(next)
    }

    async componentWillMount() {

        this.loadPageFromProps(this.props)
     }

    async loadPageFromProps(pps,filters){
      let fetch = new fetchData();
      var props = pps ? pps : this.props
      var currentPage = props.params.page ? props.params.page : 1
      var pageLimit = props.params.pageLimit ? props.params.pageLimit : 10
      var xmlField = props.params.sortField
      var direction = props.params.direction ? props.params.direction : 'ascending'

      var filters = props.location.query.filters ? props.location.query.filters.split(",") : []




      this.setState({allContent : null})
      console.log(JSON.stringify(filters))

      var readyData = {query: ""}

      this.setState({loading : true})

      var data = await fetch.getEntriesAdvancedSearch("browser",readyData, currentPage, pageLimit, xmlField, direction, filters);

      var ast = XmlReader.parseSync(data);
      var pagesAvailable = xmlQuery(ast).find('paging').find('last').text();


      var advSearch = this.state.advancedSearch

      this.setState({ loading : false,
                      sorting:{sortField: props.params.sortField,
                      direction: direction},
                      allContent : data,
                      pagesAvailable : parseInt(pagesAvailable),
                      currentPage : parseInt(currentPage),
                      pageLimit: parseInt(pageLimit),
                      advancedSearch: advSearch })


     }


    render() {
      var loadingIndicator = (<Halogen.MoonLoader color={"blue"}/>)

      var browseListResults;



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
                            loading= {this.state.loading }
                          />


      return (
        <div style={{ marginTop:10, height:"100%",minHeight:"1000px"}}>
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
