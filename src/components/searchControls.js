//System imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import { templateListSet } from '../actions/actions';
import fetchData from '../network/fetch-data';
import { push } from 'react-router-redux'

// Material UI imports
import RaisedButton from 'material-ui/FlatButton';
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

class SearchControls extends Component {

    constructor(props) {
      super()
      //debugger
      if ( props.location.query && props.location.query.query && props.location.query.query.length > 0){
        //debugger
        this.state = { query : props.location.query.query , enabled: false}

      } else {
        this.state = { query : "", enabled: false}
      }
    }


    // async componentWillReceiveProps(next) {
    //
    // }
    //
    componentWillMount() {
      var props = this.props
      if ( props.location.query && props.location.query.query && props.location.query.query.length > 0){
          props.changeQuery({value: props.location.query.query, preventUpdate: false} )
      }
     }
    //
    // async loadPageFromProps(props){
    //
    // }

    handleQueryElement = (name,value,preventUpdate) => {

      this.setState({query: value})

      if ( this.props.location.pathname.indexOf("/search/") > -1 ){
        this.props.changeQuery({value: value, preventUpdate: preventUpdate})
      }
    //  console.log(JSON.stringify(this.state.advancedSearch))
    }

    prepareURLVariables = () => {
      var adVar = this.state.advancedSearch
      let fetch = new fetchData();
      return fetch.objectToGetVariables(adVar)
    }

    switchToSearch (props) {

      if ( props.location.pathname.indexOf("/search/") < 0 ){

      var advSearch = {query: this.state.query}

      var  url = urlUtils.formatUrl("search"
                                        ,this.state.currentPage ? this.state.currentPage : 1
                                        ,this.state.pageLimit ? this.state.pageLimit : 10
                                        ,this.state.sorting
                                        ,advSearch);

    // debugger
      props.goToUrl(url);
      }
    }

    handleToggleAdvancedSearch () {
      // this.setState({enabled: this.state.enabled ? false : true})
      this.props.toggleAdvancedSearch(this.state.query)
      this.switchToSearch (this.props)
    }


    render() {

      let buttonColor = "#e6e6e6"
      let buttonHoverColor = "#b5b5b5"

      let standardSearch = <span><span>Search:</span>
                            <TextField
                              id='query'
                              hintText=''
                              style={{width: 200,marginLeft:5, marginTop:-5}}
                              value = {this.state.query}
                              onChange={(event,value) => {this.handleQueryElement("query",value,true)}}
                              onKeyPress={(event,value,e) => {
                                if (event.key === 'Enter'){
                                  if ( this.state.query.trim().indexOf("SRO") == 0 ){
                                    var number = this.state.query.trim()
                                  } else {
                                    this.handleQueryElement("query",this.state.query,false);
                                    this.switchToSearch (this.props);
                                  }
                                }
                              }}
                            /></span>

      return (


          <span style={{paddingLeft:10, width:480, height: 36, display: "inline-block"}}>

            { standardSearch }

            <RaisedButton hoverColor={buttonHoverColor}  backgroundColor={buttonColor}
                          label='Advanced'
                          // backgroundColor= {this.state.enabled ? "rgb(220, 220, 220)" : "white"}
                          style={{float:"right", position:"relative", marginTop: 5}}
                          className="mui-btn mui-btn--small mui-btn--primary"
                          onClick={ () => { this.handleToggleAdvancedSearch() }


                          }/>

          </span>

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
)(SearchControls);
