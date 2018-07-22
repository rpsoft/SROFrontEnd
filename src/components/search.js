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
import TextField from 'material-ui/TextField';

//URL relative references kept in one place.
import { URL_CATEGORIES_LIST, URL_BASE_MULTIMEDIA_IMAGES} from '../links';

//Static storage class.
import QueryStore from './QueryStore';

import EntryPreview from './record/entry-preview'

// Allows processing and using XML input.
import XmlReader from 'xml-reader'
import xmlQuery from 'xml-query'

import BrowseList from './browse-list'
// import Paging from './paging'

// This is the library for all the cool progress indicator components
import Halogen from 'halogen';

import { browserHistory } from 'react-router';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import urlUtils from './urlUtils'
import searchTools from './searchTools'

class Search extends Component {

    constructor(props) {
      super()
      var advSearch = props.advancedSearch
    //  debugger
      var allFields = ["person","minDate","maxDate","minFees","maxFees","entry","query"] //"copies",

      for (var i in allFields){
        advSearch[allFields[i]] = advSearch[allFields[i]] ? advSearch[allFields[i]] : ""
      }

      advSearch.query = advSearch.query ? advSearch.query : props.advancedSearch.query;
      advSearch.enabled = props.enabled

      var newState = {
        searchType:'normal',
        linkRoot: 'search',
        advancedSearch : advSearch,
        sorting:{sortField: "date", direction: "ascending"}
      }

      newState.query = advSearch.query;
      newState.sorting = {
                          sortField: props.params.sortField ? props.params.sortField : "date",
                          direction: props.params.direction ? props.params.direction : "ascending"
                         }

      newState.currentPage = parseInt(props.params.page) ? parseInt(props.params.page) : 1
      newState.pageLimit = parseInt(props.params.pageLimit) ? parseInt(props.params.pageLimit) : 10  // Entries per page limit.

      if ( newState.advancedSearch.maxDate ){
        newState.maxDate_day = newState.advancedSearch.maxDate.day
        newState.maxDate_month = newState.advancedSearch.maxDate.month
        newState.maxDate_year = newState.advancedSearch.maxDate.year
      }

      if ( newState.advancedSearch.minDate ){
        newState.minDate_day = newState.advancedSearch.minDate.day
        newState.minDate_month = newState.advancedSearch.minDate.month
        newState.minDate_year = newState.advancedSearch.minDate.year
      }

      this.state = newState
    }


    componentWillReceiveProps(next) {
        var nextState = this.state

        // debugger
        //console.log("SEARCH QUERY : "+next.query)

        nextState.query = next.query

        var allFields = ["person","minDate","maxDate","minFees","maxFees","entry","query"]
        if ( Object.keys(next.advancedSearch).length == 1 && Object.keys(next.advancedSearch)[0] == "query" && !next.advancedSearch.query ){

          for ( var a in allFields){
              var k = allFields[a]
              if ( k.indexOf("Date") > -1 ){
                  nextState[k+"_year"] = ""
                  nextState[k+"_month"] = ""
                  nextState[k+"_day"] = ""
              } else {
                  nextState[k] = ""
              }

          }
        }

        // debugger

        var prepareAdSearchVars = {}

        for ( var a in allFields){
          var k = allFields[a]
          prepareAdSearchVars[k] = next.advancedSearch[k] ? next.advancedSearch[k] : ""
        }

        nextState.enabled = next.enabled
        prepareAdSearchVars.enabled = next.enabled

        nextState.advancedSearch = prepareAdSearchVars
        nextState.allContent = next.data
        nextState.pagesAvailable = next.pagesAvailable
        nextState.currentPage = parseInt(next.params.page) ? parseInt(next.params.page) : 1
        nextState.pageLimit = parseInt(next.params.pageLimitt) ? parseInt(next.params.pageLimit) : 10  // Entries per page limit.

        nextState.sorting = {
                            sortField: next.params.sortField ? next.params.sortField : "date",
                            direction: next.params.direction ? next.params.direction : "ascending"
                           }

                    //       debugger
        // if ( JSON.stringify(nextState.advancedSearch).indexOf(JSON.stringify(this.state.advancedSearch)) == -1 ){
        //   this.props.updateAdvancedSearch(nextState.advancedSearch)
        // }
        //debugger
        this.setState(nextState)
    }

    async componentWillMount() {
      this.setState({advancedSearch : this.props.advancedSearch})
    }


    handleQueryElement = (name,value) => {
      //debugger
      var adSearch = this.state.advancedSearch
      adSearch[name] = value
      adSearch.enabled = this.state.enabled
      this.setState({advancedSearch: adSearch})
      this.props.updateAdvancedSearch(adSearch)
    }

    handleDateQueryElement = (name,value) => {
      var state = this.state
      var adSearch = this.state.advancedSearch

      var dateKey = name.split("_")[0]
      var dateElement = name.split("_")[1]
      //debugger

      if ( dateElement == "year" && value.length > 4){
          return
      } else if ( dateElement != "year" && value.length > 2 ) {
         return
      }

      if ( !adSearch[dateKey] ){
        switch (dateKey) {
          case "minDate":
            adSearch[dateKey] = {year:"1400",month:"01",day:"01"}
            break;
          default: // Assume maxDate.
            adSearch[dateKey] = {year:"1900",month:"12",day:"31"}
        }
      }

      adSearch[dateKey][dateElement] = value

      state.advancedSearch = adSearch
      state[name] = value  // This is the value of the textfield to keep track of the input.

      this.setState(state)
    }

    async handleAdvancedSearch (pps) {

    }

    handleChangeSearchType = (value, i, type ) => {
      this.setState({searchType:type})
    }

    // prepareURLVariables = () => {
    //   var adVar = this.state.advancedSearch
    //   let fetch = new fetchData();
    //   return fetch.objectToGetVariables(adVar)
    // }

    toggleFilters = (filters) => {
      console.log(JSON.stringify(filters))
      this.handleAdvancedSearch(null)
    }

    clearAdvancedSearch () {
      var advSearch = {}
      var allFields = ["person","minDate","maxDate","minFees","maxFees","entry","query"] //"copies",

      for (var i in allFields){
        advSearch[allFields[i]] = ""
      }

      advSearch.query = ""
      advSearch.enabled = true

      var st = this.state

      var dateElemnts = ["maxDate_day","maxDate_month","maxDate_year","minDate_day","minDate_month","minDate_year"]
      dateElemnts.map( (a) => {st[a] = ""})
      st.advancedSearch = advSearch
      this.setState(st)

      this.props.goToUrl(this.props.location.pathname)
    }

    handleAdvancedSearchButton () {
      var adSearch = this.state.advancedSearch
          adSearch.enabled = this.state.enabled
      var url = searchTools.formatUrlAndGoto(adSearch, this.props, "search");
      console.log(url)
      this.props.goToUrl(url);
    }

    render() {

      var pageResults = <BrowseList allContent={this.state.allContent}
                                    pagesAvailable={this.state.pagesAvailable}
                                    pageLimit={this.state.pageLimit}
                                    currentPage={this.state.currentPage}
                                    linkRoot={this.state.linkRoot}
                                    sorting={this.state.sorting}
                                    advSearchParameters={this.state.advancedSearch}
                                    toggleFilter={(filter) => { this.toggleFilters(filter) }}
                                    location={this.props.location}
                                    loading= {this.props.loading} />

      let sortLinkStyle = {marginRight:10}
      let sortbuttonStyle = {height:25,marginBottom:5,marginRight:5}

      let advSearchFieldStyle = {display:"block"}

      let dateInputStyle= {marginLeft: 5,width: 40}

      let advancedSearch = <span>
        <span style={advSearchFieldStyle}>Names: <TextField
            hintText={'Text within person names'}
            style={{width: 250}}
            value = {this.state.advancedSearch.person}
            onChange={(event,value) => {this.handleQueryElement("person",value)}}
            onKeyPress={(event,value,e) => { if (event.key === 'Enter'){this.handleAdvancedSearchButton()}}}
            id='personName'
          /></span>

        <span style={advSearchFieldStyle}>
            Earliest:

            <TextField
                hintText={'YYYY'}
                style={dateInputStyle}
                value = {this.state.minDate_year}
                onChange={(event,value) => {this.handleDateQueryElement("minDate_year",value)}}
                onKeyPress={(event,value,e) => { if (event.key === 'Enter'){this.handleAdvancedSearchButton()}}}
                id='minDate_year'
              />
              -
            <TextField
                hintText={'MM'}
                style={{...dateInputStyle,width:30}}
                value = {this.state.minDate_month}
                onChange={(event,value) => {this.handleDateQueryElement("minDate_month",value)}}
                onKeyPress={(event,value,e) => { if (event.key === 'Enter'){this.handleAdvancedSearchButton()}}}
                id='minDate_month'
              />
              -
            <TextField
                hintText={'DD'}
                style={{...dateInputStyle,width:30}}
                value = {this.state.minDate_day}
                onChange={(event,value) => {this.handleDateQueryElement("minDate_day",value)}}
                onKeyPress={(event,value,e) => { if (event.key === 'Enter'){this.handleAdvancedSearchButton()}}}
                id='minDate_day'
              />

            Latest:
            <TextField
                hintText={'YYYY'}
                style={dateInputStyle}
                //defaultValue={2017}
                value = {this.state.maxDate_year}
                onChange={(event,value) => {this.handleDateQueryElement("maxDate_year",value)}}
                onKeyPress={(event,value,e) => { if (event.key === 'Enter'){this.handleAdvancedSearchButton()}}}
                id='maxDate_year'
              />
              -
            <TextField
                hintText={'MM'}
                //defaultValue = {12}
                style={{...dateInputStyle,width:30}}
                value = {this.state.maxDate_month}
                onChange={(event,value) => {this.handleDateQueryElement("maxDate_month",value)}}
                onKeyPress={(event,value,e) => { if (event.key === 'Enter'){this.handleAdvancedSearchButton()}}}
                id='maxDate_month'
              />
              -
            <TextField
                hintText={'DD'}
                style={{...dateInputStyle,width:30}}
              //  defaultValue={31}
                value = {this.state.maxDate_day}
                onChange={(event,value) => {this.handleDateQueryElement("maxDate_day",value)}}
                onKeyPress={(event,value,e) => { if (event.key === 'Enter'){this.handleAdvancedSearchButton()}}}
                id='maxDate_day'
              />

        </span>
        <span style={advSearchFieldStyle}>Fees (in pence): <TextField
            hintText={'Min'}
            style={{width: 40}}
            value = {this.state.advancedSearch.minFees}
            onChange={(event,value) => {this.handleQueryElement("minFees",value)}}
            onKeyPress={(event,value,e) => { if (event.key === 'Enter'){this.handleAdvancedSearchButton()}}}
            id='minFees'
          />
          <TextField
              hintText={'Max'}
              style={{width: 40,marginLeft:10}}
              value = {this.state.advancedSearch.maxFees}
              onChange={(event,value) => {this.handleQueryElement("maxFees",value)}}
              onKeyPress={(event,value,e) => { if (event.key === 'Enter'){this.handleAdvancedSearchButton()}}}
              id='maxFees'
            />

        </span>

        <span style={{...advSearchFieldStyle,width:"100%",textAlign:"right"}}>
            <div style={{float:"left"}}>Entry ID: <TextField
              hintText={'SRO ID Code' }
              style={{width: 250}}
              value = {this.state.advancedSearch.entry}
              onChange={(event,value) => {this.handleQueryElement("entry",value)}}
              onKeyPress={(event,value,e) => { if (event.key === 'Enter'){this.handleAdvancedSearchButton()}}}
              id='entry'
            /></div>
            <RaisedButton label='Clear' style={{marginRight:10}} onClick={ () => {this.clearAdvancedSearch()}}/>
            <RaisedButton label='Search' style={{marginRight:10}} onClick={ () => {this.handleAdvancedSearchButton()}}/>
        </span>

        <div style={{height:10}}></div>
      </span>

      // console.log("ADV SEARCH: "+ this.state.advancedSearch.enabled)

      return (
        <div style={{ padding:0, height:'100%'}}>

          <Card style={{marginTop:10, marginBottom: this.state.enabled ? 10 : 0,paddingLeft:10}}>

            {
              this.state.enabled ? advancedSearch : <span></span>
            }

          </Card>

          {/* <div>{JSON.stringify(this.state.advancedSearch) || ""}</div> */}

          {pageResults}

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
)(Search);
