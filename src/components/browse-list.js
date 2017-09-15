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

import Paging from './paging'

// This is the library for all the cool progress indicator components
import Halogen from 'halogen';

import $ from 'jquery';

import Checkbox from 'material-ui/Checkbox';


class BrowseList extends Component {

    constructor(props) {
      super()

      this.state = {
        allContent : props.allContent,
        pagesAvailable : props.pagesAvailable,
        currentPage : props.currentPage,
        pageLimit: props.pageLimit,
        // isAMobile: (navigator.userAgent.indexOf('Mobile') > -1)? true : false,
        linkRoot: props.linkRoot,
        sorting: props.sorting,
        advSearchParameters : props.advSearchParameters,
        toggleFilter : props.toggleFilter,
      };
    }

    componentWillReceiveProps(next){

      this.setState({
        allContent : next.allContent,
        pagesAvailable : next.pagesAvailable,
        currentPage : next.currentPage,
        pageLimit: next.pageLimit,
        linkRoot: next.linkRoot,
        sorting: next.sorting,
        advSearchParameters : next.advSearchParameters,
        toggleFilter : next.toggleFilter,
      });
    }

     processEntriesFromXML (xmlcontent) {
      //  console.log ( xmlcontent)

       var htm = $.parseHTML(xmlcontent)

       var entries = htm[0].getElementsByTagName("entry")

       var toReturn = []
       for ( var i = 0; i < entries.length; i++){
        //  for ( var j = 0; j < length; j++){
        //    var itemsLength = xmlQuery(ast).find('entry').eq(i).find('item').length
        //    console.log(xmlQuery(ast).find('entry').eq(i).find('item').eq(j).text())
        //
        //  }
        // Awesome XML searching and use of JSX to build the nodes ;)
        //console.log(entries[i]);
         toReturn.push(<EntryPreview key={i} entryData={entries[i]}></EntryPreview>)
       }
      return toReturn;
     }

    handleFilterClick(item){


      var dat = this.state
      //dat.loading = true;

      this.setState({loading:true})

      console.log(this.state.loading)
      dat[item] = dat[item] ? false : true
// <<<<<<< HEAD
// =======
//       dat["isLoading"] = true;
//       this.setState(dat)
// >>>>>>> 84d174fb78f7e35aed47ffc1a4cb96eba1ee55d8

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

      this.props.toggleFilter(enabledFilters)
      this.setState({loading:false})
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
      console.log(this.state.loading)
      return (

        <div style={{height:"100%", width:"100%",position: "relative",paddingTop:8}}>

              <div style={{backgroundColor: "#dcdcdc", padding:8, minHeight:"75vh",height:"99%",width:"20%",position:"absolute"}}>

                  <div style={{marginLeft:"10%"}}>

                  <h4>Date:</h4>
                  {["1570-1580","1581-1590","1591-1600","1670-1680","1681-1690","1691-1700","1770-1780","1781-1790","1791-1800"].map((item,i) =>
                                              <Checkbox label={item}
                                                        labelPosition="left"
                                                        key={i}
                                                        value={this.state["filter_date_"+item]}
                                                        onClick={ () => { this.handleFilterClick("filter_date_"+item) }}
                                                />) }

                  <h4>Volume:</h4>
                  {["1","2","3","4"].map((item,i) => <Checkbox label={item}
                            labelPosition="left"
                            key={i}
                            value={this.state["filter_volume_"+item]}
                            onClick={ () => { this.handleFilterClick("filter_volume_"+item) }}
                    />) }

                  <h4>Entry type:</h4>
                  {["Entered","Stock"].map((item,i) => <Checkbox label={item}
                            labelPosition="left"
                            key={i}
                            value={this.state["filter_entryType_"+item]}
                            onClick={ () => { this.handleFilterClick("filter_entryType_"+item) }}
                    />) }

                  <h4>Enterer Role:</h4>
                  {["Stationer","Non-Stationer"].map((item,i) => <Checkbox label={item}
                            labelPosition="left"
                            key={i}
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
    iradondequiero: (url) => dispatch(push(url))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowseList);
