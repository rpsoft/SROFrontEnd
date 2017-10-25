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

import urlUtils from './urlUtils'

import allNames from '../allPeopleNames.json'

import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const styles = {
  propContainer: {
    width: "190px",
    overflow: 'hidden',
    margin: '20px auto 0',
  },
  propToggleHeader: {
    margin: '20px auto 10px',
  },
};

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

      let allLetters = []

      for ( var i = 97; i <= 122; i++){
        allLetters.push (String.fromCharCode(i))
      }

      let results = !letter

          ? <div style={{textAlign:"center",
                         marginTop:100, height: 630,
                         fontSize:25,color:"rgba(128, 128, 128, 0.60)"}}>
                         No letter selected. Click on the letters above.
            </div>
          : <div style={{height:730, overflowY:"scroll",
                         padding: 20, marginTop:2,
                         borderBottom: "3px solid rgba(128, 128, 128, 0.24)"}}>
            { all.filter( (person) => (person.s[0] ? (person.s[0] == letter) : person.f[0] == letter ))
              .map((v,i) => <div key={i} style={{marginBottom:10}}>
                                <Link to={"/search/1/20?person="+this.removeVan(v.s || v.f)}>
                                  <span>{v.s ? this.cf(v.s)+ (v.f ? "," :"") : ""}</span>
                                  <span style={{marginLeft:2}}>{this.cf(v.f)}</span>
                                </Link>
                              </div>)}
          </div>

      return (
        <div style={{ marginTop:10, height:"98%"}}>

          <Card style={{width:"100%"}}>

                <Card><span style={{fontSize:20,display:"flex",paddingLeft:20,paddingBottom:5}}>{allLetters.map( (v,i) => <span key={i} style={{flexGrow:1}}><Link to={"/browser/names/"+v}>{v.toUpperCase()}</Link>  </span>)}</span></Card>


                { results }



                {/* <Table
                    height={"700px"}
                    wrapperStyle={{maxHeight:1000,overflowX:"hidden"}}
                    fixedHeader={this.state.fixedHeader}
                    fixedFooter={this.state.fixedFooter}
                    style={{margin:8}}
                    onRowSelection={(a,b) => this.props.goToUrl("/search/1/20?person="+(filteredAll[a].s || filteredAll[a].f) )}
                  >
                    <TableHeader

                        adjustForCheckbox={true}
                         enableSelectAll={false}
                         displaySelectAll={false}
                    >
                      <TableRow>
                        <TableHeaderColumn tooltip="The Surname">Surname</TableHeaderColumn>
                        <TableHeaderColumn tooltip="The Forename">Forename</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody
                      displayRowCheckbox={false}
                      deselectOnClickaway={this.state.deselectOnClickaway}
                      showRowHover={true}
                      stripedRows={this.state.stripedRows}
                    >
                      {filteredAll.map( (row, index) => (
                        <TableRow key={index} striped={true} >
                          <TableRowColumn><Link to={"/search/1/20?person="+(row.s || row.f)}>{row.s}</Link></TableRowColumn>
                          <TableRowColumn><Link to={"/search/1/20?person="+(row.s || row.f)}>{row.f}</Link></TableRowColumn>
                        </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter
                      adjustForCheckbox={this.state.showCheckboxes}
                    >
                        <TableRow>
                        </TableRow>
                    </TableFooter>
                  </Table> */}

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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowseNames);
