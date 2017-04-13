import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'

import { templateListSet } from '../actions/actions';
import fetchData from '../network/fetch-data';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import {URL_BASE} from '../links'

import Entry from './record/entry'

import XmlReader from 'xml-reader'
import xmlQuery from 'xml-query'


class CommonView extends Component {

  constructor() {
    super()
    this.state = {
      isAMobile: (navigator.userAgent.indexOf('Mobile') > -1)? true : false,
    };
  }

  render() {
    return <div style={{ padding:8, height:"100%"}}>
      <Card>THIS IS THE HEADER!</Card>
          {this.props.children}
     </div>
  }
}

const mapStateToProps = (state, ownProps) => ({
  templateList: state.templateList || null,
  // if route contains params
  params: ownProps.params,
  location: ownProps.location
})

const mapDispatchToProps = (dispatch) => ({
  setTemplateList: (templateList) => {
    dispatch(templateListSet(templateList))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommonView);
