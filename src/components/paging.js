import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import { Link } from 'react-router'
import fetchData from '../network/fetch-data'
import urlUtils from './urlUtils'

export default class Paging extends Component {

  constructor(props) {
    super()
    this.state = {
      pages: props.pages,
      entriesPerPage: props.entriesPerPage,
      currentPage: props.currentPage,
      linkRoot: props.linkRoot,
      sorting: props.sorting,
      advSearchParameters: props.advSearchParameters
    }

  }

  componentWillReceiveProps(next) {

    this.setState({
      pages:next.pages,
      entriesPerPage:next.entriesPerPage,
      currentPage:next.currentPage,
      linkRoot: next.linkRoot,
      sorting: next.sorting,
      advSearchParameters: next.advSearchParameters
    });

  }

  render() {

    var numberOfPagesEitherSide = 5;
  //  debugger
    return <span style={{marginBottom:10,padding:5,textAlign:"center"}}>

                <div>
                  { Array.from(
                            {length: this.state.pages},
                            (v, i) => {
                                        i = i+1
                                        if ( this.state.pages > 10 ){
                                            var shouldprint = false; // no need to show all page numebers if there are too many

                                            if ( (i == 1 || i == this.state.pages)
                                              || ( i >= (this.state.currentPage-numberOfPagesEitherSide) && (i <= this.state.currentPage) )
                                              || ( i <= this.state.currentPage+numberOfPagesEitherSide && (i >= this.state.currentPage))
                                            ){
                                              shouldprint = true;
                                            }
                                            var leftDelimiter = "", rightDelimiter = ""

                                            if ( i != 1 && i == this.state.currentPage-numberOfPagesEitherSide ) {
                                              leftDelimiter = "..."
                                            }

                                            if  ( i == this.state.currentPage+numberOfPagesEitherSide ){
                                              rightDelimiter = "..."
                                            }

                                            if ( shouldprint){
                                              return <span key={i}>
                                                        {leftDelimiter}
                                                        <Link to={urlUtils.formatUrl(this.state.linkRoot,i,this.state.entriesPerPage, this.state.sorting,this.state.advSearchParameters)} style={{marginRight:3, fontWeight: i == this.state.currentPage ? "bolder" : "auto"}}>{i}</Link>
                                                        {rightDelimiter}
                                                    </span>
                                            }

                                        } else  {
                                          return <span key={i}>

                                                    <Link to={urlUtils.formatUrl(this.state.linkRoot,i,this.state.entriesPerPage,this.state.sorting,this.state.advSearchParameters)} style={{marginRight:3, fontWeight: i == this.state.currentPage ? "bolder" : "auto"}}>{i}</Link>

                                                </span>
                                        }
                                      }
                            )
                  }
                </div>
           </span>
  }
}
