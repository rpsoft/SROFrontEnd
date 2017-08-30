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
import 'react-date-picker/index.css'
import { DateField, DatePicker } from 'react-date-picker'


class Search extends Component {

    constructor(props) {
      super()
      var advSearch = {enabled:false}
      if (Object.keys(props.location.query).length > 0 ){
        advSearch.enabled = true
        for ( var k in props.location.query ){
          advSearch[k] = props.location.query[k]
        }
      }

      var allFields = ["person","copies","minDate","maxDate","minFees","maxFees","entry","query"]

      for (var i in allFields){
        advSearch[allFields[i]] = advSearch[allFields[i]] ? advSearch[allFields[i]] : ""
      }

      //console.log("should be: "+JSON.stringify(advSearch))

      this.state = {
        searchType:'normal',
        advancedSearch : advSearch,
        sorting:{sortField: "date", direction: "ascending"}
      }
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
    //  console.log(JSON.stringify(this.state.advancedSearch))
    }

    toggleAdvancedSearch = () => {
      var adSearch = this.state.advancedSearch
      if ( adSearch.enabled ){
        adSearch.enabled = false
      } else {
        adSearch.enabled = true;
      }
      this.setState({advancedSearch: adSearch})
  //    console.log(JSON.stringify(this.state.advancedSearch))
    }

    async handleAdvancedSearch (pps,filters) {
      let fetch = new fetchData();
      var props = pps ? pps : this.props
      var currentPage = props.params.page ? props.params.page : 1
      var pageLimit = props.params.pageLimit ? props.params.pageLimit : 20

      var xmlField = props.params.sortField


      var direction = props.params.direction ? props.params.direction : 'ascending'

      if(this.state.advancedSearch.query.length < 1){

        return ;
      }

      this.setState({loading : true})
      console.log(JSON.stringify(filters))
      // here we distinguish between advanced and simple search
      var readyData = this.state.advancedSearch.enabled ? this.state.advancedSearch : {query: this.state.advancedSearch.query}

      var data = await fetch.getEntriesAdvancedSearch(readyData, currentPage, pageLimit, xmlField, direction, filters);
      var ast = XmlReader.parseSync(data);
      var pagesAvailable = xmlQuery(ast).find('paging').find('last').text();

      this.setState({loading : false})

      var advSearch = this.state.advancedSearch

      this.setState({ sorting:{sortField: props.params.sortField,
                      direction: direction},
                      allContent : data,
                      pagesAvailable : parseInt(pagesAvailable),
                      currentPage : parseInt(currentPage),
                      pageLimit: parseInt(pageLimit),
                      advancedSearch: advSearch })

      //this.props.iradondequiero('/search/william/7/20/date/descending?query=william');
      //store.dispatch(push('/search/william/7/20/date/descending?query=william'))

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
      this.handleAdvancedSearch(null,filters)
    }

    render() {

      var args = JSON.stringify(this.state.advancedSearch)
      var linkRoot = 'search/'+this.state.advancedSearch.query

      var loadingIndicator = (<Halogen.MoonLoader color={'blue'}/>)


      var pageResults = this.state.loading ? <div style={{width:100,height:100, marginLeft: 'auto', marginRight: 'auto' ,paddingTop: 30}}>{loadingIndicator}</div> : <div></div>
      if( this.state.pagesAvailable ){
          pageResults = <BrowseList allContent={this.state.allContent}
                                    pagesAvailable={this.state.pagesAvailable}
                                    pageLimit={this.state.pageLimit}
                                    currentPage={this.state.currentPage}
                                    linkRoot={linkRoot}
                                    sorting={this.state.sorting}
                                    advSearchParameters={this.state.advancedSearch}
                                    toggleFilter={(filter) => { this.toggleFilters(filter) }}/>
      }

      let sortLinkStyle = {marginRight:10}
      let sortbuttonStyle = {height:25,marginBottom:5,marginRight:5}

      let advSearchFieldStyle = {display:"block"}

      let advancedSearch = <span>
        <span style={advSearchFieldStyle}>Person Names: <TextField
            hintText={'Text within person names'}
            style={{width: 250}}
            value = {this.state.advancedSearch.person}
            onChange={(event,value) => {this.handleQueryElement("person",value)}}
            onKeyPress={(event,value,e) => { if (event.key === 'Enter'){this.handleAdvancedSearch()}}}
            id='personName'
          /></span>
        <span style={advSearchFieldStyle}>Copies: <TextField
            hintText={'Text in titles within register entries'}
            style={{width: 250}}
            value = {this.state.advancedSearch.copies}
            onChange={(event,value) => {this.handleQueryElement("copies",value)}}
            onKeyPress={(event,value,e) => { if (event.key === 'Enter'){this.handleAdvancedSearch()}}}
            id='copies'
          /></span>
        <span style={advSearchFieldStyle}>
            Min Date
            <DateField
               dateFormat="YYYY-MM-DD"
               forceValidDate={true}
               defaultValue={-15000000000000}
               style={{marginLeft:5,marginRight:15}}
               onChange={(dateString, { dateMoment, timestamp}) => {this.handleQueryElement("minDate",dateMoment)}}
             >
               <DatePicker
                 navigation={true}
                 locale="en"
                 forceValidDate={true}
                 weekNumbers={false}
                 weekStartDay={0}
                 id='dPickMin'
               />
            </DateField>

            Max Date
            <DateField
              dateFormat="YYYY-MM-DD"
              forceValidDate={true}
              defaultValue={1000000000000}
              style={{marginLeft:5,marginRight:5}}
              onChange={(dateString, { dateMoment, timestamp}) => {this.handleQueryElement("maxDate",dateMoment)}}
            >
              <DatePicker
                navigation={true}
                locale="en"
                forceValidDate={true}
                weekNumbers={false}
                weekStartDay={0}
                id='dPickMax'
              />
            </DateField>

        </span>
        <span style={advSearchFieldStyle}>Fees (in pence): <TextField
            hintText={'Min'}
            style={{width: 40}}
            value = {this.state.advancedSearch.minFees}
            onChange={(event,value) => {this.handleQueryElement("minFees",value)}}
            onKeyPress={(event,value,e) => { if (event.key === 'Enter'){this.handleAdvancedSearch()}}}
            id='minFees'
          />
          <TextField
              hintText={'Max'}
              style={{width: 40,marginLeft:10}}
              value = {this.state.advancedSearch.maxFees}
              onChange={(event,value) => {this.handleQueryElement("maxFees",value)}}
              onKeyPress={(event,value,e) => { if (event.key === 'Enter'){this.handleAdvancedSearch()}}}
              id='maxFees'
            />

        </span>

        <span style={{...advSearchFieldStyle,width:"100%",textAlign:"right"}}>
            <div style={{float:"left"}}>Entry ID: <TextField
              hintText={'SRO ID Code (allows partial codes)' }
              style={{width: 250}}
              value = {this.state.advancedSearch.entry}
              onChange={(event,value) => {this.handleQueryElement("entry",value)}}
              onKeyPress={(event,value,e) => { if (event.key === 'Enter'){this.handleAdvancedSearch()}}}
              id='entry'
            /></div>
            <RaisedButton label='Go Search' style={{marginRight:10}} onClick={ () => {this.handleAdvancedSearch()}}/>
        </span>

        <div style={{height:10}}></div>
      </span>

      let standardSearch = <span><span>Search text:</span>
                            <TextField
                              id='query'
                              hintText='Type here your search terms'
                              style={{width: 250,marginLeft:5}}
                              value = {this.state.advancedSearch.query}
                              onChange={(event,value) => {this.handleQueryElement("query",value)}}
                              onKeyPress={(event,value,e) => { if (event.key === 'Enter'){this.handleAdvancedSearch()}}}
                            /></span>

      let orderingBar = <Card style={{paddingTop:5,paddingLeft:5,paddingRight:5,textAlign:'center'}}>
                        <Link to={'/search/'+this.state.advancedSearch.query+'/'+this.state.currentPage+'/'+this.state.pageLimit+'/date/ascending?'+this.prepareURLVariables()} style={sortLinkStyle}>
                          <RaisedButton label='Date (earliest)' style={sortbuttonStyle} />
                        </Link>
                        <Link to={'/search/'+this.state.advancedSearch.query+'/'+this.state.currentPage+'/'+this.state.pageLimit+'/date/descending?'+this.prepareURLVariables()} style={sortLinkStyle}>
                          <RaisedButton label='Date (latest)' style={sortbuttonStyle} />
                        </Link>
                        <Link to={'/search/'+this.state.advancedSearch.query+'/'+this.state.currentPage+'/'+this.state.pageLimit+'/date/descending?'+this.prepareURLVariables()} style={sortLinkStyle}>
                          <RaisedButton label='Volume/page'  style={sortbuttonStyle}/>
                        </Link>
                        {/* <Link to={'/search/'+this.state.advancedSearch.query+'/'+this.state.currentPage+'/'+this.state.pageLimit+'/date/descending?'+this.prepareURLVariables()} style={sortLinkStyle}>
                          <RaisedButton label='Copies (A-Z)'  style={sortbuttonStyle}/>
                        </Link> */}
                        {/* <Link to={'/search/'+this.state.advancedSearch.query+'/'+this.state.currentPage+'/'+this.state.pageLimit+'/date/descending?'+this.prepareURLVariables()} style={sortLinkStyle}>
                          <RaisedButton label='Enterers (A-Z)'  style={sortbuttonStyle}/>
                        </Link>
                        <Link to={'/search/'+this.state.advancedSearch.query+'/'+this.state.currentPage+'/'+this.state.pageLimit+'/date/descending?'+this.prepareURLVariables()} style={sortLinkStyle}>
                          <RaisedButton label='All names (A-Z)'  style={sortbuttonStyle}/>
                        </Link> */}
                      </Card>


      return (
        <div style={{ padding:8, height:'100%'}}>

          <Card style={{marginTop:10,marginBottom:10,paddingLeft:10}}>

            <RaisedButton label='Advanced options'
                          style={{float:"right",marginTop:10,marginRight:5,height:30}}
                          onClick={ () => { this.toggleAdvancedSearch() }
                          }/>

            {
              standardSearch
            }
            {
              this.state.advancedSearch.enabled ? advancedSearch : <span></span>
            }

          </Card>

          {this.state.pagesAvailable ? orderingBar : <span></span>}

          {pageResults || loadingIndicator}

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
  iradondequiero: (url) => dispatch(push(url))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
