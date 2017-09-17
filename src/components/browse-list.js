//System imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import { templateListSet } from '../actions/actions';
import fetchData from '../network/fetch-data';
import { push } from 'react-router-redux'

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
import urlUtils from './urlUtils'


// This is the library for all the cool progress indicator components
import Halogen from 'halogen';

import $ from 'jquery';

import Checkbox from 'material-ui/Checkbox';



class BrowseList extends Component {

    constructor(props) {
      super()

      //debugger
      var filters = props.location.query.filters ? props.location.query.filters.split(",") : [];

      var newState = {
        allContent : props.allContent,
        pagesAvailable : props.pagesAvailable,
        currentPage : props.currentPage,
        pageLimit: props.pageLimit,
        linkRoot: props.linkRoot,
        sorting: props.sorting,
        advSearchParameters : props.advSearchParameters,
      }

      for ( var f in filters){
        newState["filter_"+filters[f]] = true
      }

      this.state = newState;

    }

    componentWillReceiveProps(next){

        var filters = next.location.query.filters ? next.location.query.filters.split(",") : [];

        var newState = {
          allContent : next.allContent,
          pagesAvailable : next.pagesAvailable,
          currentPage : next.currentPage,
          pageLimit: next.pageLimit,
          linkRoot: next.linkRoot,
          sorting: next.sorting,
          advSearchParameters : next.advSearchParameters,
          toggleFilter : next.toggleFilter,
        }

        for ( var f in filters){
          newState["filter_"+filters[f]] = true
        }
        // debugger
      this.setState(newState);
    }

     processEntriesFromXML (xmlcontent) {

       var htm = $.parseHTML(xmlcontent)
      //  debugger
       var entries
       try{
         entries = htm[0].getElementsByTagName("entry")
       } catch (e){
         entries = []
       }
       var toReturn = []

       for ( var i = 0; i < entries.length; i++){
         toReturn.push(<EntryPreview key={i} entryData={entries[i]}></EntryPreview>)
       }

      return toReturn;
     }

    handleFilterClick(item){

      var dat = this.state
      dat[item] = dat[item] ? false : true

      var enabledFilters = []
      for ( var k in Object.keys(dat) ){
        var key = Object.keys(dat)[k]
        if ( key.indexOf("filter") == 0 ){
            var kitems = key.split("_")
            if ( dat[key] ){
              enabledFilters.push(kitems[1]+"_"+kitems[2])
            }
        }
      }

      var advParams = this.state.advSearchParameters

      if ( !advParams ){
        advParams = {}
      }

      advParams.filters = enabledFilters

      var url = urlUtils.formatUrl(this.state.linkRoot,this.state.currentPage,this.state.pageLimit,this.state.sorting,advParams);
      console.log(url);

      this.props.goToUrl(url);
    }

    render() {
      var loadingIndicator = (<Halogen.MoonLoader color={"blue"}/>)

      var resultsToShow ;


      if ( !this.state.allContent || this.state.loading){
        
        resultsToShow = <div style={{width:100,height:100, marginLeft: "auto", marginRight: "auto" ,paddingTop: 30}}>{loadingIndicator}<br/> <span style={{fontWeight:"bold"}}>loading... please wait</span></div>
      } else {
        resultsToShow = <span>
                        <Paging pages={this.state.pagesAvailable} entriesPerPage={this.state.pageLimit} currentPage={this.state.currentPage} linkRoot={this.state.linkRoot} sorting={this.state.sorting} advSearchParameters={this.state.advSearchParameters}/>
                        {this.processEntriesFromXML(this.state.allContent).map( (e) => e)}
                        <Paging pages={this.state.pagesAvailable} entriesPerPage={this.state.pageLimit} currentPage={this.state.currentPage} linkRoot={this.state.linkRoot} sorting={this.state.sorting} advSearchParameters={this.state.advSearchParameters}/>
                        </span>
      }


      return (


        <div style={{height:"100%", width:"100%",position: "relative",paddingTop:8}}>

              <div style={{backgroundColor: "#dcdcdc", padding:8, minHeight:"75vh",height:"99%",width:"20%",position:"absolute"}}>

                  <div style={{marginLeft:"10%"}}>

                  <h4>Date:</h4>
                  {["1570-1580","1581-1590","1591-1600","1670-1680"].map((item,i) => <Checkbox label={item}
                            labelPosition="left"
                            key={i}
                            checked={this.state["filter_date_"+item]}
                            value={this.state["filter_date_"+item]}
                            onClick={ () => { this.handleFilterClick("filter_date_"+item) }}
                    />) }

                  <h4>Volume:</h4>
                  {["A","B","C"].map((item,i) => <Checkbox label={item}
                            labelPosition="left"
                            key={i}
                            checked={this.state["filter_volume_"+item]}
                            value={this.state["filter_volume_"+item]}
                            onClick={ () => { this.handleFilterClick("filter_volume_"+item) }}
                    />) }

                  <h4>Entry type:</h4>
                  {["Entered","Stock"].map((item,i) => <Checkbox label={item}
                            labelPosition="left"
                            key={i}
                            checked={this.state["filter_entryType_"+item]}
                            value={this.state["filter_entryType_"+item]}
                            onClick={ () => { this.handleFilterClick("filter_entryType_"+item) }}
                    />) }

                  <h4>Enterer Role:</h4>
                  {["Stationer","Non-Stationer"].map((item,i) => <Checkbox label={item}
                            labelPosition="left"
                            key={i}
                            checked={this.state["filter_entererRole_"+item]}
                            value={this.state["filter_entererRole_"+item]}
                            onClick={ () => { this.handleFilterClick("filter_entererRole_"+item) }}
                    />) }
                  </div>
              </div>
              <div style={{ padding:8, height:"100%", width:"75%", marginLeft: "23%",paddingTop:0}}>

                {resultsToShow}

              </div>
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
    goToUrl: (url) => dispatch(push(url))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowseList);
