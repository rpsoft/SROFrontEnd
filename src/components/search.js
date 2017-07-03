//System imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import { templateListSet } from '../actions/actions';
import fetchData from '../network/fetch-data';

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

// DAte picker
import 'react-date-picker/index.css'

import { DateField, DatePicker } from 'react-date-picker'



class Search extends Component {

    constructor(props) {
      super()
      this.state = {
        query: props.params.query,
        searchType:'normal',
        advancedSearch : {enabled:false},
        sorting:{sortField: "date", direction: "ascending"}
        // isAMobile: (navigator.userAgent.indexOf('Mobile') > -1)? true : false,
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

       var data;

       var xmlField = ''
       switch (props.params.sortField){
         case 'id':
          xmlField = '@xml:id'
          break;
         case 'date':
          xmlField = 'date//text()[last()]'
          break;
         default:
          xmlField = '@xml:id'
      }

       var direction = props.params.direction ? props.params.direction : 'ascending'

       if ( props.params.sortField && props.params.direction){
         data = await fetch.getEntriesForQueryWithSorting(props.params.query,currentPage,pageLimit,xmlField, direction); //getAllEntriesPaged(currentPage,pageLimit);
       } else {
         data = await fetch.getEntriesForQuery(props.params.query,currentPage,pageLimit); //getAllEntriesPaged(currentPage,pageLimit);
       }

       var ast = XmlReader.parseSync(data);
       var pagesAvailable = xmlQuery(ast).find('paging').find('last').text();

       this.setState({sorting:{sortField: props.params.sortField, direction: direction}, allContent : data, pagesAvailable : parseInt(pagesAvailable), currentPage : parseInt(currentPage), pageLimit: parseInt(pageLimit), query: props.params.query})
      // console.log(this.state)
     }

    handleQueryElement = (name,value) => {

      var adSearch = this.state.advancedSearch

      adSearch.enabled = true

      adSearch[name] = value

      this.setState({advancedSearch: adSearch})

      console.log(JSON.stringify(this.state.advancedSearch))

    }

    handleDisableAdv = () => {
      var adSearch = this.state.advancedSearch
      adSearch.enabled = false;
      this.setState({advancedSearch: adSearch})
      console.log(JSON.stringify(this.state.advancedSearch))
    }

    async handleAdvancedSearch () {
      let fetch = new fetchData();
      var props = this.props
      var currentPage = props.params.page ? props.params.page : 1
      var pageLimit = props.params.pageLimit ? props.params.pageLimit : 20

      var xmlField = ''
      switch (props.params.sortField){
        case 'id':
         xmlField = '@xml:id'
         break;
        case 'date':
         xmlField = 'date//text()[last()]'
         break;
        default:
         xmlField = '@xml:id'
      }

      var direction = props.params.direction ? props.params.direction : 'ascending'

      var data = await fetch.getEntriesAdvancedSearch(this.state.advancedSearch, currentPage, pageLimit, xmlField, direction);
      var ast = XmlReader.parseSync(data);
      var pagesAvailable = xmlQuery(ast).find('paging').find('last').text();

      this.setState({sorting:{sortField: props.params.sortField, direction: direction}, allContent : data, pagesAvailable : parseInt(pagesAvailable), currentPage : parseInt(currentPage), pageLimit: parseInt(pageLimit), query: props.params.query})
    }

    handleChangeSearchType = (value, i, type ) => {
      //console.log(type) // Search type
      this.setState({searchType:type})
    }

    onDateChange = (dateString, { dateMoment, timestamp }) => {
      console.log(dateString)
    }

    render() {


      var args = JSON.stringify(this.state.advancedSearch)
      var linkRoot = this.state.advancedSearch.enabled ? 'advSearch/'+args : 'search/'+this.state.query


      var loadingIndicator = (<Halogen.MoonLoader color={'blue'}/>)

      if (!this.state.allContent ){
        return <div style={{width:100,height:100, marginLeft: 'auto', marginRight: 'auto' ,paddingTop: 30}}>{loadingIndicator}</div>
      }

      var pageResults = <div></div>
      if( this.state.pagesAvailable ){
          pageResults = <BrowseList allContent={this.state.allContent}
                                    pagesAvailable={this.state.pagesAvailable}
                                    pageLimit={this.state.pageLimit}
                                    currentPage={this.state.currentPage}
                                    linkRoot={linkRoot}
                                    sorting={this.state.sorting}/>
      }

      let sortLinkStyle = {marginRight:10}
      let sortbuttonStyle = {height:25,marginBottom:5}

      let date = '2017-04-24'

      let advSearchFieldStyle = {display:"block"}

      let advancedSearch = <span>
        <span style={advSearchFieldStyle}>Person Names: <TextField
            hintText={this.state.advancedSearch.person ? "" : 'Text within person names'}
            style={{width: 250}}
            value = {this.state.advancedSearch.person}
            onChange={(event,value) => {this.handleQueryElement("person",value)}}
            onKeyPress={(event,value,e) => { if (event.key === 'Enter'){browserHistory.push('/search/'+this.state.query)}}}
            id='personName'
          /></span>
        <span style={advSearchFieldStyle}>Copies: <TextField
            hintText={this.state.advancedSearch.copies ? "" : 'Text in titles within register entries'}
            style={{width: 250}}
            value = {this.state.advancedSearch.copies}
            onChange={(event,value) => {this.handleQueryElement("copies",value)}}
            onKeyPress={(event,value,e) => { if (event.key === 'Enter'){browserHistory.push('/search/'+this.state.query)}}}
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
            hintText={this.state.advancedSearch.minFees ? "" : 'Min'}
            style={{width: 40}}
            value = {this.state.advancedSearch.minFees}
            onChange={(event,value) => {this.handleQueryElement("minFees",value)}}
            onKeyPress={(event,value,e) => { if (event.key === 'Enter'){browserHistory.push('/search/'+this.state.query)}}}
            id='minFees'
          />
          <TextField
              hintText={this.state.advancedSearch.maxFees ? "" : 'Max'}
              style={{width: 40,marginLeft:10}}
              value = {this.state.advancedSearch.maxFees}
              onChange={(event,value) => {this.handleQueryElement("maxFees",value)}}
              onKeyPress={(event,value,e) => { if (event.key === 'Enter'){browserHistory.push('/search/'+this.state.query)}}}
              id='maxFees'
            />

        </span>

        <span style={{...advSearchFieldStyle,width:"100%",textAlign:"right"}}>
            <div style={{float:"left"}}>Entry ID: <TextField
              hintText={this.state.advancedSearch.entry ? "" : 'SRO ID Code (allows partial codes)' }
              style={{width: 250}}
              value = {this.state.advancedSearch.entry}
              onChange={(event,value) => {this.handleQueryElement("entry",value)}}
              onKeyPress={(event,value,e) => { if (event.key === 'Enter'){browserHistory.push('/search/'+this.state.query)}}}
              id='entry'
            /></div>
            <RaisedButton label='Go Search' style={{marginRight:10}} onClick={ () => {this.handleAdvancedSearch()}}/>
        </span>

        <div style={{height:10}}></div>
      </span>

      let standardSearch = <span><span>Search text:</span>
                            <TextField
                              hintText='Type here your search terms'
                              style={{width: 250}}
                              value = {this.state.query}
                              onChange={(event,value) => {this.setState({query: value})}}
                              onKeyPress={(event,value,e) => { if (event.key === 'Enter'){browserHistory.push('/search/'+this.state.query)}}}
                            /></span>


      return (
        <div style={{ padding:8, height:'100%'}}>
          {/* <span>YOU ARE IN: SEARCH</span> */}

          <Card style={{marginTop:10,marginBottom:10,paddingLeft:10}}>

            <RaisedButton label='Advanced options'
                          style={{float:"right",marginTop:10,marginRight:5,height:30}}
                          onClick={ () => {
                            (this.state.searchType === 'normal') ?
                            this.setState({searchType : "advanced"} ) :
                            this.setState({searchType : "normal"});this.handleDisableAdv() }
                          }/>

            {
              this.state.searchType == "advanced" ? advancedSearch : standardSearch
            }


          </Card>

          <Card style={{paddingTop:5,paddingLeft:5,paddingRight:5,textAlign:'center'}}>
            <Link to={'/search/'+this.state.query+'/'+this.state.currentPage+'/'+this.state.pageLimit+'/date/ascending'} style={sortLinkStyle}>
              <RaisedButton label='Date (earliest)' style={sortbuttonStyle}/>
            </Link>
            <Link to={'/search/'+this.state.query+'/'+this.state.currentPage+'/'+this.state.pageLimit+'/date/descending'} style={sortLinkStyle}>
              <RaisedButton label='Date (latest)' style={sortbuttonStyle}/>
            </Link>
            <Link to={'/search/'+this.state.query+'/'+this.state.currentPage+'/'+this.state.pageLimit+'/date/descending'} style={sortLinkStyle}>
              <RaisedButton label='Volume/page'  style={sortbuttonStyle}/>
            </Link>
            <Link to={'/search/'+this.state.query+'/'+this.state.currentPage+'/'+this.state.pageLimit+'/date/descending'} style={sortLinkStyle}>
              <RaisedButton label='Copies (A-Z)'  style={sortbuttonStyle}/>
            </Link>
            <Link to={'/search/'+this.state.query+'/'+this.state.currentPage+'/'+this.state.pageLimit+'/date/descending'} style={sortLinkStyle}>
              <RaisedButton label='Enterers (A-Z)'  style={sortbuttonStyle}/>
            </Link>
            <Link to={'/search/'+this.state.query+'/'+this.state.currentPage+'/'+this.state.pageLimit+'/date/descending'} style={sortLinkStyle}>
              <RaisedButton label='All names (A-Z)'  style={sortbuttonStyle}/>
            </Link>
          </Card>

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
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
