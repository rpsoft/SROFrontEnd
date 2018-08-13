//System imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import { templateListSet } from '../actions/actions';
import fetchData from '../network/fetch-data';
import { push } from 'react-router-redux'
import ReactTooltip from 'react-tooltip'
// Material UI imports
import RaisedButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';

//URL relative references kept in one place.
import { URL_CATEGORIES_LIST, URL_BASE_MULTIMEDIA_IMAGES} from '../links';

//Static storage class.
import QueryStore from './QueryStore';
import BrowseList from './browse-list'

// This is the library for all the cool progress indicator components
import Halogen from 'halogen';

import { browserHistory } from 'react-router';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import urlUtils from './urlUtils'

class SearchControls extends Component {

    constructor(props) {
      super()
      if ( props.location.query && props.location.query.query && props.location.query.query.length > 0){
        this.state = { query : props.location.query.query}
      } else {
        this.state = { query : ""}
      }
    }


    async componentWillReceiveProps(next) {
        //debugger
        this.setState({ query: next.location.query.query || ""})
    }

    // componentWillMount() {
    //   var props = this.props
    //   if ( props.location.query && props.location.query.query && props.location.query.query.length > 0){
    //       //props.changeQuery({value: props.location.query.query} )
    //   }
    //  }

    handleQueryElement = (name,value,preventUpdate) => {
      this.setState({query: value})
    //  debugger
      this.props.changeQuery(value)
    }

    prepareURLVariables = () => {
      var adVar = this.state.advancedSearch
      let fetch = new fetchData();
      return fetch.objectToGetVariables(adVar)
    }

    // switchToSearch (props,enabled) {
    //   // debugger
    //   var newUrlQuery = props.location.query
    //   if ( this.state.query ){
    //     newUrlQuery.query = this.state.query
    //   } else {
    //     if ( newUrlQuery.query ){
    //       delete newUrlQuery.query
    //     }
    //   }
    //
    //   //newUrlQuery.adv = enabled
    //
    //   var parameters = []
    //
    //   for (var k in newUrlQuery ){
    //     parameters.push(k+"="+newUrlQuery[k])
    //   }
    //
    //   var pathname = props.location.pathname.indexOf("search") < 0 ? "/search" : props.location.pathname
    //
    //   var properURL = pathname + (parameters.length > 0 ? "?"+parameters.join("&") : "")
    //   //console.log("SCONT: "+properURL)
    //   props.goToUrl(properURL);
    // }

    handleToggleAdvancedSearch () {
      this.props.toggleAdvancedSearch()
    }


    render() {

      let buttonColor = "#e6e6e6"
      let buttonHoverColor = "#b5b5b5"
// <p data-tip="Searches all Register text and notes" ><img height="20" src="/assets/lilQ.png" /></p><ReactTooltip />
      let standardSearch = <span><span style={{marginLeft:95}} data-tip="Searches all Register text and notes" ><img height="20" src="/assets/lilQ.png" />Search:</span><ReactTooltip />
                            <TextField
                              id='query'
                              hintText='Full Text'
                              style={{width: 180,marginLeft:5, marginTop:-5}}
                              value = {this.state.query}
                              onChange={(event,value) => {this.handleQueryElement("query",value,true)}}
                              onKeyPress={(event,value,e) => {
                                if (event.key === 'Enter'){
                                    this.handleQueryElement("query",this.state.query,false);
                                    this.props.runSearch();
                                    console.log("searchControls: "+this.state.query)
                                    //this.switchToSearch (this.props,this.state.enabled);
                                  //  handleToggleAdvancedSearch ();
                                }
                              }}

                            /></span>

      return (


          <span style={{marginLeft:5, paddingLeft:10, width:480, height: 36, display: "inline-block"}}>

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
