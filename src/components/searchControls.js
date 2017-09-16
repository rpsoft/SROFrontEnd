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

import urlUtils from './urlUtils'

class SearchControls extends Component {

    constructor(props) {
      super()

      this.state = { query : ""  }

    }


    async componentWillReceiveProps(next) {
      //  this.loadPageFromProps(next)
    }

    async componentWillMount() {
    //    this.loadPageFromProps(this.props)
     }

    async loadPageFromProps(props){
  //    await this.handleAdvancedSearch(props)
    }

    handleQueryElement = (name,value) => {


      this.setState({query: value})
    //  console.log(JSON.stringify(this.state.advancedSearch))
    }

    prepareURLVariables = () => {
      var adVar = this.state.advancedSearch
      let fetch = new fetchData();
      return fetch.objectToGetVariables(adVar)
    }

    handleAdvancedSearchButton () {
        var advSearch = {query: this.state.query}
      var url = urlUtils.formatUrl("search"
                                      ,this.state.currentPage ? this.state.currentPage : 1
                                      ,this.state.pageLimit ? this.state.pageLimit : 20
                                      ,this.state.sorting
                                      ,advSearch);
      console.log("GOTO gfdgfds: "+url);
      this.props.goToUrl(url);
    }

    render() {

      let standardSearch = <span><span>Search text:</span>
                            <TextField
                              id='query'
                              hintText='Type here your search'
                              style={{width: 200,marginLeft:5}}
                              value = {this.state.query}
                              onChange={(event,value) => {this.handleQueryElement("query",value)}}
                              onKeyPress={(event,value,e) => { if (event.key === 'Enter'){this.handleAdvancedSearchButton(); this.props.changeQuery(this.state.query) }}}
                            /></span>

      return (


          <span style={{paddingLeft:10, width:500, height: 40, display: "inline-block"}}>

            <RaisedButton label='Advanced options'
                          style={{float:"right",marginTop:5,marginRight:5,height:37}}
                          onClick={ () => { this.props.toggleAdvancedSearch() }
                          }/>

            { standardSearch }

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
