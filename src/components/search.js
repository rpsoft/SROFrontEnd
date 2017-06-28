//System imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import { templateListSet } from '../actions/actions';
import fetchData from '../network/fetch-data';

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


class Search extends Component {

    constructor(props) {
      super()
      this.state = {
        query:props.params.query,
        searchType:'fulltext'
        // isAMobile: (navigator.userAgent.indexOf('Mobile') > -1)? true : false,
      };

    }


    async componentWillReceiveProps(next) {
        this.loadPageFromProps(next)
    }

    async componentWillMount() {
        this.loadPageFromProps(this.props)
     }

    async loadPageFromProps(props){
       let fetch = new fetchData();

       var currentPage = props.params.page ? props.params.page : 1
       var pageLimit = props.params.pageLimit ? props.params.pageLimit : 20

       var data;

       var xmlField = ''
       switch (props.params.sortField){
         case 'id':
          xmlField = '@xml:id'
          break;
         case 'date':
          xmlField = 'date//text()[last()]'
          break;
         default:
          xmlField = '@xml:id'
       }

       var direction = props.params.direction ? props.params.direction : 'ascending'

       if ( props.params.sortField && props.params.direction){
         data = await fetch.getEntriesForQueryWithSorting(props.params.query,currentPage,pageLimit,xmlField, direction); //getAllEntriesPaged(currentPage,pageLimit);
       } else {
         data = await fetch.getEntriesForQuery(props.params.query,currentPage,pageLimit); //getAllEntriesPaged(currentPage,pageLimit);
       }

       var ast = XmlReader.parseSync(data);
       var pagesAvailable = xmlQuery(ast).find('paging').find('last').text();

       this.setState({sorting:{sortField: props.params.sortField, direction: direction}, allContent : data, pagesAvailable : parseInt(pagesAvailable), currentPage : parseInt(currentPage), pageLimit: parseInt(pageLimit), query: props.params.query})
      // console.log(this.state)
     }

     handleChangeSearchType = (value, i, type ) => {
        //console.log(type) // Search type
        this.setState({searchType:type})

     }


    render() {
      var loadingIndicator = (<Halogen.MoonLoader color={'blue'}/>)

      if (!this.state.allContent){
        return <div style={{width:100,height:100, marginLeft: 'auto', marginRight: 'auto' ,paddingTop: 30}}>{loadingIndicator}</div>
      }

      var pageResults = <div></div>
      if( this.state.pagesAvailable ){
          pageResults = <BrowseList allContent={this.state.allContent}
                                    pagesAvailable={this.state.pagesAvailable}
                                    pageLimit={this.state.pageLimit}
                                    currentPage={this.state.currentPage}
                                    linkRoot={'search/'+this.state.query}
                                    sorting={this.state.sorting}/>
      }

      let sortLinkStyle = {marginRight:10}
      let sortbuttonStyle = {height:25,marginBottom:5}

      return (
        <div style={{ padding:8, height:'100%'}}>
          {/* <span>YOU ARE IN: SEARCH</span> */}

          <Card style={{marginTop:10,marginBottom:10,paddingLeft:10}}>
            {/* <span style={{float:'left',top:10}}>Search Type:</span> */}
              <SelectField
                        value={this.state.searchType}
                        onChange={(value,i,j) => this.handleChangeSearchType(value,i,j)}
                        style={{float:'right',width:200}}
                        >

               <MenuItem value={'fulltext'} primaryText='Full Text Search' />
               <MenuItem value={'people'} primaryText='People Search' />
               <MenuItem value={'title'} primaryText='Title Search' />

             </SelectField>

            <span style={{marginRight:5,marginLeft:10}}>Search text:</span> <TextField
                hintText='Type here your search terms'
                style={{width: 250}}
                value = {this.state.query}
                onChange={(event,value) => {this.setState({query: value})}}
                onKeyPress={(event,value,e) => { if (event.key === 'Enter'){browserHistory.push('/search/'+this.state.query)}}}
              />
          </Card>

          <Card style={{paddingTop:5,paddingLeft:5,paddingRight:5,textAlign:'center'}}>
            <Link to={'/search/'+this.state.query+'/'+this.state.currentPage+'/'+this.state.pageLimit+'/date/ascending'} style={sortLinkStyle}>
              <RaisedButton label='Date (earliest)' style={sortbuttonStyle}/>
            </Link>
            <Link to={'/search/'+this.state.query+'/'+this.state.currentPage+'/'+this.state.pageLimit+'/date/descending'} style={sortLinkStyle}>
              <RaisedButton label='Date (latest)' style={sortbuttonStyle}/>
            </Link>
            <Link to={'/search/'+this.state.query+'/'+this.state.currentPage+'/'+this.state.pageLimit+'/date/descending'} style={sortLinkStyle}>
              <RaisedButton label='Volume/page'  style={sortbuttonStyle}/>
            </Link>
            <Link to={'/search/'+this.state.query+'/'+this.state.currentPage+'/'+this.state.pageLimit+'/date/descending'} style={sortLinkStyle}>
              <RaisedButton label='Copies (A-Z)'  style={sortbuttonStyle}/>
            </Link>
            <Link to={'/search/'+this.state.query+'/'+this.state.currentPage+'/'+this.state.pageLimit+'/date/descending'} style={sortLinkStyle}>
              <RaisedButton label='Enterers (A-Z)'  style={sortbuttonStyle}/>
            </Link>
            <Link to={'/search/'+this.state.query+'/'+this.state.currentPage+'/'+this.state.pageLimit+'/date/descending'} style={sortLinkStyle}>
              <RaisedButton label='All names (A-Z)'  style={sortbuttonStyle}/>
            </Link>
          </Card>

          {pageResults}

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
)(Search);
