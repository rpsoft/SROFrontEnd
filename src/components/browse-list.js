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
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ReactTooltip from 'react-tooltip'

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

import DownloadIcon from 'material-ui/svg-icons/file/file-download';

class BrowseList extends Component {

    constructor(props) {
      super()

      var filters = props.location.query.filters ? props.location.query.filters.split(",") : [];

      var advSearch = props.advSearchParameters

      if ( !advSearch ){
        advSearch = {}
      }

      if(filters.length > 0)
      advSearch.filters = filters;

      var sortDefaultString = ""

      switch (props.sorting.sortField) {
        case "date":
          sortDefaultString += "date"
          break;
        case "volume":
          sortDefaultString += "vol"
          break;
        case "relevance":
          sortDefaultString += "relevance"
          break;
        default:

      }

      if ( props.sorting.direction && sortDefaultString.length > 0 && sortDefaultString.indexOf("relevance") < 0){
        if ( props.sorting.direction == "descending") {
          sortDefaultString += "Desc"
        } else {
          sortDefaultString += "Asc"
        }
      }

      if ( props.linkRoot != "search" && sortDefaultString.indexOf("relevance") > -1 ){
          sortDefaultString = "dateAsc" // default value for Browse option. Cannot be relevance.
      }

      var newState = {
        allContent : props.allContent,
        pagesAvailable : props.pagesAvailable,
        currentPage : props.currentPage,
        pageLimit: props.pageLimit,
        linkRoot: props.linkRoot,
        sorting: props.sorting,
        advSearchParameters : advSearch,
        loading : props.loading,
        sortingFieldControl : sortDefaultString
      }
      // debugger
      for ( var f in filters){
        newState["filter_"+filters[f]] = true
      }

      this.state = newState;

    }

    handleSortingChange = (event, index, value) => {
      var sorting
      switch (value) {
        case "dateAsc":
          sorting ={sortField: "date", direction: "ascending"}
          break;
        case "dateDesc":
          sorting ={sortField: "date", direction: "descending"}
          break;
        case "volAsc":
          sorting ={sortField: "volume", direction: "ascending"}
          break;
        case "volDesc":
          sorting ={sortField: "volume", direction: "descending"}
          break;
        case "relevance":
            sorting ={sortField: "relevance", direction: "descending"}
            break;
        default:

      }

      this.setState({sorting : sorting, sortingFieldControl : value})


      var url = urlUtils.formatUrl(this.state.linkRoot,this.state.currentPage,this.state.pageLimit,sorting, this.state.advSearchParameters)

      console.log("BROWSSE: "+url)
      this.props.goToUrl(url)

    }

    handlePageLimitChange = (v,i,j,m) => {

      this.setState({pageLimit : j})

      var url = urlUtils.formatUrl(this.state.linkRoot,this.state.currentPage,j,this.state.sorting, this.state.advSearchParameters)

      console.log(url)
      this.props.goToUrl(url)
    }

    componentWillReceiveProps(next){
       //debugger
      var filters = next.location.query.filters ? next.location.query.filters.split(",") : [];
      var advSearch = next.advSearchParameters

      if ( !advSearch ){
        advSearch = {}
      }

      if ( filters.length > 0 )
      advSearch.filters = filters;
      // debugger
      var newState = {
        allContent : next.allContent,
        pagesAvailable : next.pagesAvailable,
        currentPage : next.currentPage,
        pageLimit: next.pageLimit,
        linkRoot: next.linkRoot,
        sorting: next.sorting,
        advSearchParameters : advSearch,
        toggleFilter : next.toggleFilter,
        loading : next.loading,
      }
      // debugger
      for ( var f in filters){
        newState["filter_"+filters[f]] = true
      }

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
// sortingFieldControl
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

      var url = urlUtils.formatUrl(this.state.linkRoot,1,this.state.pageLimit,this.state.sorting,advParams);

      this.props.goToUrl(url);
    }

    getDownloadableXML (){
      if ( this.state.allContent ){
        var link = document.createElement('a');
        link.download = "SRO-Page-"+this.state.currentPage+".xml";
        link.href = 'data:,' + encodeURIComponent(this.state.allContent);
        //debugger
        link.click();
      }
      // var downloadData = "data:application/octet-stream," + encodeURIComponent(this.state.allContent);
      // window.open(downloadData, 'SRO-document.xml');
    }

    getDownloadableTXT (){
      var link = document.createElement('a');
      link.download = "SRO-Page-"+this.state.currentPage+".txt";
      var plainText = this.state.allContent.replace(/<\/?[^>]+(>|$)/g, "");
      link.href = 'data:,' + encodeURIComponent(plainText);
      link.click();
      // console.log (this.state);
      // var downloadData = "data:application/octet-stream,"
      // window.open(downloadData, 'SRO-document.xml');
    }

    render() {
      let loadingStyle= {
              display: '-webkit-flex',
              display: 'flex',
              WebkitFlex: '0 1 auto',
              flex: '0 1 auto',
              WebkitFlexDirection: 'column',
              flexDirection: 'column',
              WebkitFlexGrow: 1,
              flexGrow: 1,
              WebkitFlexShrink: 0,
              flexShrink: 0,
              WebkitFlexBasis: '25%',
              flexBasis: '25%',
              maxWidth: '25%',
              height: '200px',
              width: '400px',
              WebkitAlignItems: 'center',
              alignItems: 'center',
              WebkitJustifyContent: 'center',
              justifyContent: 'center'
          }
      var loadingIndicator = (<div style={loadingStyle}><Halogen.MoonLoader color={"#5c626d"} margin="4px"/><span style={{fontWeight:"bold"}}>loading...</span></div>)

      var resultsToShow ;

      var haveResults;

      if ( this.state.loading ){
        resultsToShow = <div style={{width:100,height:100, marginLeft: "auto", marginRight: "auto" ,paddingTop: 30}}>{loadingIndicator}</div>
      } else {
        // debugger
        if (!this.state.allContent
                || this.state.allContent.indexOf("<exception><path>/db</path><message>") > -1  // This happens when there is an error at the server level, and no results are retrieved
                || this.state.allContent.indexOf("<returned>0</returned>") > -1 ) { // And this when no results exist for the current search.
          resultsToShow = <Card style={{padding:10, height:65}}><span>  </span></Card>

        } else {
          if (this.state.allContent.length === 206) {
          // Hide 'Download page' option if results empty
          haveResults = false
          } else {
          haveResults = true;
          }
          resultsToShow = <span >
                          <Card style={{marginBottom:10}}><Paging pages={this.state.pagesAvailable} entriesPerPage={this.state.pageLimit} currentPage={this.state.currentPage} linkRoot={this.state.linkRoot} sorting={this.state.sorting} advSearchParameters={this.state.advSearchParameters}/></Card>
                          {this.processEntriesFromXML(this.state.allContent).map( (e) => e)}
                          <Card style={{marginBottom:10}}><Paging pages={this.state.pagesAvailable} entriesPerPage={this.state.pageLimit} currentPage={this.state.currentPage} linkRoot={this.state.linkRoot} sorting={this.state.sorting} advSearchParameters={this.state.advSearchParameters}/></Card>
                          </span>
        }
      }

    let sortLinkStyle = {marginRight:10}
    let sortbuttonStyle = {height:25,marginBottom:5,marginRight:5}


    let haveFullTextQuery = this.state.advSearchParameters && this.state.advSearchParameters.query && (this.state.advSearchParameters.query.length > 0)
    let orderingValue = (this.props.location.pathname.indexOf("scending") < 0) && haveFullTextQuery ? "relevance" : this.state.sortingFieldControl


    let orderingBar = <Card style={{position: "relative", float: "right", top: 10,paddingLeft:10, paddingRight: 5, marginRight:5,height:45}}>
                          <SelectField
                          // floatingLabelText="Sorting options"
                          value={orderingValue}
                          onChange={this.handleSortingChange}
                          >
                          { (this.state.linkRoot == "search") && haveFullTextQuery ? <MenuItem value={"relevance"} primaryText="Best Match" /> : ""}
                          <MenuItem value={"dateAsc"} primaryText="Date (earliest)" />
                          <MenuItem value={"dateDesc"} primaryText="Date (latest)" />
                          <MenuItem value={"volAsc"} primaryText="Register page (ascending)" />
                          <MenuItem value={"volDesc"} primaryText="Register page (descending)" />

                          </SelectField>
                  </Card>

      let numbering = [10,20,50,100]
      let pageLimitBar = <Card style={{position: "relative", float: "right", top: 10,paddingLeft:10,marginRight:15,height:45,width:70}}>
                            <SelectField
                            // floatingLabelText="Sorting options"
                            style={{width:55}}
                            value={parseInt(this.state.pageLimit)}
                            onChange={this.handlePageLimitChange}
                            >
                            {numbering.map( (v,i) => <MenuItem key={i} value={v} primaryText={v} />)}
                            </SelectField>
                    </Card>

      let filterTitleStyles = {fontWeight:"600",fontSize:16, display:"inline", float:"left"}

      let filterYears = ["1557-1560"]//["1557-1560","1561-1565","1566-1570","1571-1580","1581-1590","1591-1595","1596-1600","1601-1605","1606-1610","1611-1615","1616-1620"]

      for ( var i = 1565; i <= 1640; i = i+5){
         filterYears.push((i-4) + "-" + i);
      }


      return (


        <div style={{height:"100%", width:"100%",position: "relative",display:"flex"}}>

              {/* <span style={{position: "absolute", float: "right", left: 0, bottom: -47 ,height:50, width:210}}>
              <RaisedButton
                icon={<DownloadIcon/>}
                label="Download Page"
                style={{width:"100%",height:"100%",zIndex:100000}}
                onClick={()=> {this.getDownloadable()}}
                          />
                          </span> */}


                <Card style={{ padding:15,paddingRight:5, width:"23%",borderRight:"",height:"auto",marginBottom:10, paddingLeft: 25}}>

                    <h4 style={filterTitleStyles}>Date:</h4><h4 data-tip="Select Date Range" style={{fontWeight:"600",fontSize:16, float:"right", display:"inline"}}><img height="20" src="/assets/lilQ.png" /></h4><ReactTooltip />
                    {filterYears.map((item,i) => <Checkbox label={item}
                              labelPosition="left"
                              key={i}
                              checked={this.state["filter_date_"+item]}
                              value={this.state["filter_date_"+item]}
                              onClick={ () => { this.handleFilterClick("filter_date_"+item) }}
                      />) }

                    <h4 style={filterTitleStyles}>Volume:</h4><h4 data-tip="Original Register volumes, in chronological order" style={{fontWeight:"600",fontSize:16, float:"right", display:"inline"}}><img height="20" src="/assets/lilQ.png" /></h4><ReactTooltip />
                    {["A","B","C","D"].map((item,i) => <Checkbox label={item}
                              labelPosition="left"
                              key={i}
                              checked={this.state["filter_volume_"+item]}
                              value={this.state["filter_volume_"+item]}
                              onClick={ () => { this.handleFilterClick("filter_volume_"+item) }}
                      />) }
//
                    <h4 style={filterTitleStyles}>Entry type:</h4><h4 data-tip="Select Entry Type" style={{fontWeight:"600",fontSize:16, float:"right", display:"inline"}}><img height="20" src="/assets/lilQ.png" /></h4><ReactTooltip />
                    {["Annotated","Cancelled", "Incomplete", "Shared", "Stock"].map((item,i) => <Checkbox label={item}
                              labelPosition="left"
                              key={i}
                              checked={this.state["filter_entryType_"+item]}
                              value={this.state["filter_entryType_"+item]}
                              onClick={ () => { this.handleFilterClick("filter_entryType_"+item) }}
                      />) }


                </Card>
                <div style={{ paddingLeft:10, height:"100%", minHeight:1000, width:"80%",paddingTop:0}}>

                  {pageLimitBar} {orderingBar} {resultsToShow}

                  {
                    (haveResults) ? <RaisedButton
                    icon={<DownloadIcon/>}
                    label="Download XML"
                    style={{width:"49%"}}
                    labelStyle={{fontSize:13}}
                    onClick={()=> {this.getDownloadableXML()}}
                  /> : <span></span>
                  }
                  {
                    (haveResults) ? <RaisedButton
                    icon={<DownloadIcon/>}
                    label="Download Text"
                    style={{width:"49%", float:"right"}}
                    labelStyle={{fontSize:13}}
                    onClick={()=> {this.getDownloadableTXT()}}
                  /> : <span></span>
                  }
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
