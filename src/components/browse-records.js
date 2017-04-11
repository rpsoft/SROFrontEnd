import React, { Component } from 'react';
import { connect } from 'react-redux'

import { Link } from 'react-router'

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';


import {GridList, GridTile} from 'material-ui/GridList';

import {grey700} from 'material-ui/styles/colors';
import SearchIcon from 'material-ui/svg-icons/action/search';

import { URL_CATEGORIES_LIST, URL_BASE_MULTIMEDIA_IMAGES} from '../links';

import QueryStore from './QueryStore';

class BrowseRecords extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isAMobile: (navigator.userAgent.indexOf('Mobile') > -1)? true : false,
      searchbox: QueryStore.getQuery()
    };
  }

  render() {
    const style = {
      margin: 12,
    };


  return (
        <Card style = {{paddingTop:20,paddingBottom:10}}>
                Browse records
        </Card>
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
)(BrowseRecords);
