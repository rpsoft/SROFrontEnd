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
import Checkbox from 'material-ui/Checkbox';
import urlUtils from './urlUtils'

class BrowseNames extends Component {

    constructor() {
      super()
      this.state = {
        fixedHeader: true,
           fixedFooter: true,
           stripedRows: false,
           showRowHover: false,
           selectable: true,
           multiSelectable: false,
           enableSelectAll: false,
           deselectOnClickaway: true,
           showCheckboxes: true,
           height: '100%',
      };
    }

    async componentWillReceiveProps(next) {

    }

    async componentWillMount() {

     }

    removeVan(name){
      if (name.toLowerCase().indexOf("van") == 0){
        return name.replace("van","")
      }
      return name
    }

    cf(string) {
      if (string.toLowerCase().indexOf("van") == 0){
        string = string.replace("van","")
        return "van "+ string.charAt(0).toUpperCase() + string.slice(1)

      }

      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    render() {
      let letter = this.props.params.letter

      let all = allNames.names()

      let filteredAll = all.filter( (person) => (person.s[0] ? (person.s[0] == letter) : person.f[0] == letter )).sort( ( a,b ) => {
        let nameA = a.s ? a.s : a.f
        let nameB = b.s ? b.s : b.f

        return nameA.localeCompare(nameB)
      } )

      //debugger
      let results

      let filterYears = ["1557-1560"]//["1557-1560","1561-1565","1566-1570","1571-1580","1581-1590","1591-1595","1596-1600","1601-1605","1606-1610","1611-1615","1616-1620"]

      for ( var i = 1565; i <= 1640; i = i+5){
         filterYears.push((i-4) + "-" + i);
      }

      //
      switch (this.props.location.pathname) {
        case "/browser/date":
          results = <span> <h3 style={{marginTop: 5,marginBottom:20}}> Browse By Date</h3> {filterYears.map((item,i) =>
                      <div style={{fontSize:20, marginTop:10,marginLeft:20}} key={i} >
                        <Link to={"/browser/1/10/date/ascending?filters=date_"+item}>{item}</Link>
                      </div>) }
                    </span>
          break;
        case "/browser/volume":
        results = <span> <h3 style={{marginTop: 5,marginBottom:20}}> Browse By Volume</h3> {["A","B","C","D"].map((item,i) =>
                    <div style={{fontSize:20, marginTop:10,marginLeft:20}} key={i} >
                      <Link to={"/browser/1/10/date/ascending?filters=volume_"+item}>{"Volume "+item}</Link>
                    </div>) }
                  </span>
          break;
        default:

      }


      return (
        <div style={{ marginTop:10, height:"98%"}}>

          <Card style={{width:"100%", padding:20, paddingTop:10, minHeight:600}}>

                { results }

          </Card>

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
import allNames from '../allPeopleNames.json'


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowseNames);
