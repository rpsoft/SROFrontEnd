import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'

import { templateListSet } from '../actions/actions';
import fetchData from '../network/fetch-data';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import {URL_BASE} from '../links'

import Entry from './record/entry'

class CommonView extends Component {

  constructor() {
    super()
    this.state = {
      isAMobile: (navigator.userAgent.indexOf('Mobile') > -1)? true : false,
    };
  }


  //
  async componentWillMount() {
    let fetch = new fetchData();
    this.setState({allContent : await fetch.getAllEntries() })
   }


  render() {

    if (!this.state.allContent){
      return <div>Loading content</div>
    }

    return (
      <div style={{ padding:8, height:"100%"}}>
              AQUI HAY LAGOs Muchos
              {this.state.allContent.entries.entry.map( (entry, i ) => {
                return <Entry key={i} entryData={entry}></Entry>
              })}


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
  setTemplateList: (templateList) => {
    dispatch(templateListSet(templateList))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommonView);
