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

      //debugger
      var filters = props.location.query.filters ? props.location.query.filters.split(",") : [];

      var advSearch = props.advSearchParameters

      if ( !advSearch ){
        advSearch = {}
      }

      advSearch.filters = filters;

      var newState = {
        allContent : props.allContent,
        pagesAvailable : props.pagesAvailable,
        currentPage : props.currentPage,
        pageLimit: props.pageLimit,
        linkRoot: props.linkRoot,
        sorting: props.sorting,
        advSearchParameters : advSearch,
        loading : props.loading,
        sortingFieldControl : "volAsc", // default increasing ID or volument ascending order.
      }

      for ( var f in filters){
        newState["filter_"+filters[f]] = true
      }

      this.state = newState;

    }

    handleSortingChange = (event, index, value) => {

      {/* <MenuItem value={{sortField: "date", direction: "ascending"}} primaryText="Date (earliest)" />
      <MenuItem value={{sortField: "date", direction: "descending"}} primaryText="Date (latest)" />
      <MenuItem value={{sortField: "volume", direction: "ascending"}} primaryText="Volume/page (Asc)" />
      <MenuItem value={{sortField: "volume", direction: "descending"}} primaryText="Volume/page (Desc)" /> */}
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
        default:

      }

      this.setState({sorting : sorting, sortingFieldControl : value})

      var url = urlUtils.formatUrl(this.state.linkRoot,this.state.currentPage,this.state.pageLimit,sorting, this.state.advSearchParameters)

      console.log(url)
      this.props.goToUrl(url)

    }

    handlePageLimitChange = (v,i,j,m) => {

      this.setState({pageLimit : j})

      var url = urlUtils.formatUrl(this.state.linkRoot,this.state.currentPage,j,this.state.sorting, this.state.advSearchParameters)

      console.log(url)
      this.props.goToUrl(url)
    }

    componentWillReceiveProps(next){

      var filters = next.location.query.filters ? next.location.query.filters.split(",") : [];
      var advSearch = next.advSearchParameters

      if ( !advSearch ){
        advSearch = {}
      }
      advSearch.filters = filters;

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
      console.log(url);

      this.props.goToUrl(url);
    }

    getDownloadable (){
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


      if ( this.state.loading ){
        resultsToShow = <div style={{width:100,height:100, marginLeft: "auto", marginRight: "auto" ,paddingTop: 30}}>{loadingIndicator}</div>
      } else {

        if (!this.state.allContent) {
          resultsToShow = <Card style={{padding:10}}><span> No results to show yet </span></Card>
        } else {

          resultsToShow = <span >
                          <Card style={{marginBottom:10}}><Paging pages={this.state.pagesAvailable} entriesPerPage={this.state.pageLimit} currentPage={this.state.currentPage} linkRoot={this.state.linkRoot} sorting={this.state.sorting} advSearchParameters={this.state.advSearchParameters}/></Card>
                          {this.processEntriesFromXML(this.state.allContent).map( (e) => e)}
                          <Card style={{marginBottom:10}}><Paging pages={this.state.pagesAvailable} entriesPerPage={this.state.pageLimit} currentPage={this.state.currentPage} linkRoot={this.state.linkRoot} sorting={this.state.sorting} advSearchParameters={this.state.advSearchParameters}/></Card>
                          </span>
        }
      }

    let sortLinkStyle = {marginRight:10}
    let sortbuttonStyle = {height:25,marginBottom:5,marginRight:5}




    let orderingBar = <Card style={{position: "absolute", float: "right", right: 75, top: 0,paddingLeft:10,paddingRight:5,height:50}}>
                          <SelectField
                          // floatingLabelText="Sorting options"
                          value={this.state.sortingFieldControl}
                          onChange={this.handleSortingChange}
                          >
                          <MenuItem value={"dateAsc"} primaryText="Date (earliest)" />
                          <MenuItem value={"dateDesc"} primaryText="Date (latest)" />
                          <MenuItem value={"volAsc"} primaryText="Register page (ascending)" />
                          <MenuItem value={"volDesc"} primaryText="Register page (descending)" />

                          </SelectField>
                  </Card>

      let numbering = [10,20,50,100]
      let pageLimitBar = <Card style={{position: "absolute", float: "right", right: 0, top: 0,paddingLeft:10,paddingRight:5,height:50,width:70}}>
                            <SelectField
                            // floatingLabelText="Sorting options"
                            style={{width:55}}
                            value={this.state.pageLimit}
                            onChange={this.handlePageLimitChange}
                            >
                            {numbering.map( (v,i) => <MenuItem key={i} value={v} primaryText={v} />)}
                            </SelectField>
                    </Card>

      let filterTitleStyles = {fontWeight:"600",fontSize:16}

      let filterYears = ["1557-1559"]//["1557-1560","1561-1565","1566-1570","1571-1580","1581-1590","1591-1595","1596-1600","1601-1605","1606-1610","1611-1615","1616-1620"]

      for ( var i = 1565; i <= 1620; i = i+5){
         filterYears.push((i-5) + "-" + i);
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
              {orderingBar} {pageLimitBar}

                <Card style={{ padding:15,paddingRight:5, width:"23%",borderRight:"",height:"auto",marginBottom:10, paddingLeft: 25}}>

                    <h4 style={filterTitleStyles}>Date:</h4>
                    {filterYears.map((item,i) => <Checkbox label={item}
                              labelPosition="left"
                              key={i}
                              checked={this.state["filter_date_"+item]}
                              value={this.state["filter_date_"+item]}
                              onClick={ () => { this.handleFilterClick("filter_date_"+item) }}
                      />) }

                    <h4 style={filterTitleStyles}>Volume:</h4>
                    {["A","B","C"].map((item,i) => <Checkbox label={item}
                              labelPosition="left"
                              key={i}
                              checked={this.state["filter_volume_"+item]}
                              value={this.state["filter_volume_"+item]}
                              onClick={ () => { this.handleFilterClick("filter_volume_"+item) }}
                      />) }

                    <h4 style={filterTitleStyles}>Entry type:</h4>
                    {["Annotated", "Cancelled", "Entered", "Incomplete", "NotPrinted", "Other", "Reassigned", "Shared", "Stock", "Unknown"].map((item,i) => <Checkbox label={item}
                              labelPosition="left"
                              key={i}
                              checked={this.state["filter_entryType_"+item]}
                              value={this.state["filter_entryType_"+item]}
                              onClick={ () => { this.handleFilterClick("filter_entryType_"+item) }}
                      />) }

                    <h4 style={filterTitleStyles}>Enterer Role:</h4>
                    {["Stationer","Non-Stationer"].map((item,i) => <Checkbox label={item}
                              labelPosition="left"
                              key={i}
                              checked={this.state["filter_entererRole_"+item]}
                              value={this.state["filter_entererRole_"+item]}
                              onClick={ () => { this.handleFilterClick("filter_entererRole_"+item) }}
                      />) }
                      <hr style={{marginLeft:-10,marginRight:10}}/>
                      <RaisedButton
                        icon={<DownloadIcon/>}
                        label="Download Page"
                        style={{width:"100%",marginLeft:-10}}
                        labelStyle={{fontSize:13}}
                        onClick={()=> {this.getDownloadable()}}
                                  />
                </Card>
                <div style={{ paddingLeft:10, height:"100%", minHeight:1000, width:"80%",paddingTop:60}}>

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
