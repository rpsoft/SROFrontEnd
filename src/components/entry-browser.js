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

import Entry from './record/entry'

// Allows processing and using XML input.
import XmlReader from 'xml-reader'
import xmlQuery from 'xml-query'

class EntryBrowser extends Component {

    constructor() {
      super()
      this.state = {
        isAMobile: (navigator.userAgent.indexOf('Mobile') > -1)? true : false,
      };
    }

    //
    async componentWillMount() {
      let fetch = new fetchData();
      console.log(this.props.params.page)

      var currentPage = this.props.params.page ? this.props.params.page : 1
      var pageLimit = this.props.params.pageLimit ? this.props.params.pageLimit : 20
      
      var data = await fetch.getAllEntriesPaged(currentPage,pageLimit);

      var ast = XmlReader.parseSync(data);
      var pagesAvailable = xmlQuery(ast).find('paging').find('last').text();

      this.setState({allContent : data, pagesAvailable, currentPage, pageLimit})
     }

     processEntriesFromXML (xmlcontent) {
       var ast = XmlReader.parseSync(xmlcontent);
       var xq = xmlQuery(ast);
       var length = xmlQuery(ast).find('entry').length
       var toReturn = []
       for ( var i = 0; i < length; i++){
        //  for ( var j = 0; j < length; j++){
        //    var itemsLength = xmlQuery(ast).find('entry').eq(i).find('item').length
        //    console.log(xmlQuery(ast).find('entry').eq(i).find('item').eq(j).text())
        //
        //  }

        // Awesome XML searching and use of JSX to build the nodes ;)
         toReturn.push(<Entry key={i} entryData={xmlQuery(ast).find('entry').eq(i).find('item').text()}></Entry>)
       }
      return toReturn;
     }


    render() {

      if (!this.state.allContent){
        return <div>Loading content</div>
      }

      return (
        <div style={{ padding:8, height:"100%"}}>

                {this.processEntriesFromXML(this.state.allContent).map( (e) => e)}

                <div>{ Array.from({length: parseInt(this.state.pagesAvailable)}, (v, i) => <a key={i} style={{marginRight:3}} href={"/browser/"+(i+1)+"/"+this.state.pageLimit} >{i+1}</a>)}</div>
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
)(EntryBrowser);
