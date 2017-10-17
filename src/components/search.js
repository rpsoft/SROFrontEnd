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
import Paging from './paging'

// This is the library for all the cool progress indicator components
import Halogen from 'halogen';

import { browserHistory } from 'react-router';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

// Date picker
// import 'react-date-picker/index.css'
// import { DateField, DatePicker } from 'react-date-picker'

import urlUtils from './urlUtils'

class Search extends Component {

    constructor(props) {
      super()
      var advSearch = {enabled : props.advancedSearchEnabled, query : props.query ? props.query.value : ""}

      if (Object.keys(props.location.query) ){

        for ( var k in props.location.query ){
          advSearch[k] = props.location.query[k]
        }
      }

      var allFields = ["person","minDate","maxDate","minFees","maxFees","entry","query"] //"copies",

      for (var i in allFields){
        advSearch[allFields[i]] = advSearch[allFields[i]] ? advSearch[allFields[i]] : ""
      }

      advSearch.query = advSearch.query ? advSearch.query : props.routeParams.query;
      advSearch.enabled = advSearch.enabled ? true : false;

      var newState = {
        searchType:'normal',
        linkRoot: 'search',
        advancedSearch : advSearch,
        sorting:{sortField: "date", direction: "ascending"}
      }

      newState.query = advSearch.query;
      newState.sorting = {sorting:{sortField: props.routeParams.sortField, direction: props.routeParams.direction ? props.routeParams.direction : "date"}}
      newState.currentPage = parseInt(props.routeParams.page) ? parseInt(props.routeParams.page) : 1
      newState.pageLimit = parseInt(props.routeParams.pageLimit) ? parseInt(props.routeParams.pageLimit) : 10  // Entries per page limit.

      this.state = newState
    }


    async componentWillReceiveProps(next) {
          this.loadPageFromProps(next)
    }

    async componentWillMount() {
        this.loadPageFromProps(this.props)
     }

    async loadPageFromProps(props){
      await this.handleAdvancedSearch(props)
    }

    handleQueryElement = (name,value) => {
      var adSearch = this.state.advancedSearch
    //  adSearch.enabled = true
      adSearch[name] = value
      this.setState({advancedSearch: adSearch})
    }

    handleDateQueryElement = (name,value) => {
      var state = this.state
      var adSearch = this.state.advancedSearch

      var dateKey = name.split("_")[0]
      var dateElement = name.split("_")[1]

      if ( !adSearch[dateKey] ){
        switch (dateKey) {
          case "minDate":
            adSearch[dateKey] = {year:"1400",month:"01",day:"01"}
            break;
          default: // Assume maxDate.
            adSearch[dateKey] = {year:"1900",month:"12",day:"31"}
        }
      }

      //debugger

      adSearch[dateKey][dateElement] = value < 10 ? ( Number.isInteger(Number(value)) && (Number(value) > 0) ? "0"+value : "" ) : ""+value

      console.log(adSearch[dateKey])

      state.advancedSearch = adSearch

      state[name] = value  // This is the value of the textfield to keep track of the input.

      // "minDate": {"year":"1400","month":"10","day":"20"},"maxDate":{"year":"1900","month":"05","day":"20"},"minFees":"","maxFees":"","entry":"","filters":[]}

      this.setState(state)
      console.log(JSON.stringify(this.state.advancedSearch))
    }

    // toggleAdvancedSearch = () => {
    //   var adSearch = this.state.advancedSearch
    //   if ( adSearch.enabled ){
    //     adSearch.enabled = false
    //   } else {
    //     adSearch.enabled = true;
    //   }
    //   this.setState({advancedSearch: adSearch})
    //
    // }

    async handleAdvancedSearch (pps,filters) {
      let fetch = new fetchData();
      var props = pps ? pps : this.props
      var currentPage = props.params.page ? props.params.page : 1
      var pageLimit = props.params.pageLimit ? props.params.pageLimit : 10
      var xmlField = props.params.sortField ? props.params.sortField : 'date'
      var direction = props.params.direction ? props.params.direction : 'ascending'
      var filters = props.location.query.filters ? props.location.query.filters.split(",") : []

      var query = props.query ? props.query.value : ""


      var advSearch = this.state.advancedSearch
      advSearch.query = query;

      advSearch.enabled =   props.advancedSearchEnabled

      if ( props.query && props.query.value.length > 0 && props.query.preventUpdate ){
        this.setState({advancedSearch: advSearch})
        return {};
      }

      this.setState({loading : true, query: query, advancedSearch: advSearch, allContent : null})

      var anyActive = false;

      for( var k in advSearch ){
        if ( k == "enabled" || k == "filters"){
          continue
        }

        if ( advSearch[k] && JSON.stringify(advSearch[k]).length > 0){
          anyActive = true;
          break;
        }
      }

      anyActive = anyActive || (filters && filters.length > 0)

      if(!anyActive){
        this.setState({loading : false})
        return;
      }

      console.log(JSON.stringify(advSearch))

      var readyData = this.state.advancedSearch

      var data = await fetch.getEntriesAdvancedSearch(readyData, currentPage, pageLimit, xmlField, direction, filters);
      var ast = XmlReader.parseSync(data);
      var pagesAvailable = xmlQuery(ast).find('paging').find('last').text();

      this.setState({ loading : false,
                      sorting:{sortField: props.params.sortField,
                      direction: direction},
                      allContent : data,
                      pagesAvailable : parseInt(pagesAvailable),
                      currentPage : parseInt(currentPage),
                      pageLimit: parseInt(pageLimit),
                      advancedSearch: advSearch,
                      linkRoot: 'search', })

    }

    handleChangeSearchType = (value, i, type ) => {
      this.setState({searchType:type})
    }

    onDateChange = (dateString, { dateMoment, timestamp }) => {
      console.log(dateString)
    }

    prepareURLVariables = () => {
      var adVar = this.state.advancedSearch
      let fetch = new fetchData();
      return fetch.objectToGetVariables(adVar)
    }

    toggleFilters = (filters) => {
      // this.setState({filters: filters})
      //console.log("filters:: "+filters)
      this.handleAdvancedSearch(null,filters)
    }

    clearAdvancedSearch () {
      var advSearch = {}
      var allFields = ["person","minDate","maxDate","minFees","maxFees","entry","query"] //"copies",

      for (var i in allFields){
        advSearch[allFields[i]] = ""
      }
      advSearch.query = ""
      advSearch.enabled = true

      this.setState({advancedSearch : advSearch,
                      maxDate_day : "",
                      maxDate_month : "",
                      maxDate_year : "",
                      minDate_day : "",
                      minDate_month : "",
                      minDate_year : ""
                    })
    }

    handleAdvancedSearchButton () {
      this.setState({loading: true, allContent: null})
      var url = urlUtils.formatUrl(this.state.linkRoot
                                      ,this.state.currentPage ? this.state.currentPage : 1
                                      ,this.state.pageLimit ? this.state.pageLimit : 20
                                      ,this.state.sorting
                                      ,this.state.advancedSearch)
      this.props.goToUrl(url);
    }

    render() {
      // debugger
      var args = JSON.stringify(this.state.advancedSearch)

      var pageResults = <BrowseList allContent={this.state.allContent}
                                    pagesAvailable={this.state.pagesAvailable}
                                    pageLimit={this.state.pageLimit}
                                    currentPage={this.state.currentPage}
                                    linkRoot={this.state.linkRoot}
                                    sorting={this.state.sorting}
                                    advSearchParameters={this.state.advancedSearch}
                                    toggleFilter={(filter) => { this.toggleFilters(filter) }}
                                    location={this.props.location}
                                    loading= {this.state.loading } />
      // } else {
      //   console.log("BLAAHH")
      // }

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
            Min Date:

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

            Max Date:
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



      return (
        <div style={{ padding:0, height:'100%'}}>

          <Card style={{marginTop:10, marginBottom: this.state.advancedSearch.enabled ? 10 : 0,paddingLeft:10}}>


            {
              this.state.advancedSearch.enabled ? advancedSearch : <span></span>
            }

          </Card>



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
