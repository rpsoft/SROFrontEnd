import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import ContentLinkIcon from 'material-ui/svg-icons/content/link';

import fetchData from '../../network/fetch-data';

import Carousel from 'nuka-carousel';

import { EditorState, convertFromRaw, convertToRaw, convertFromHTML, ContentState} from 'draft-js';
import Editor from 'draft-js-plugins-editor';

import Measure from 'react-measure';

import Lightbox from 'react-image-lightbox';

import Preload from 'react-preload';

import Halogen from 'halogen';

import {
  URL_BASE_MULTIMEDIA_IMAGES,
  URL_MULTIMEDIA,
} from '../../links'

export default class RecordView extends Component {
  state = {
      dimensions: {
        width: -1,
        height: -1
      }
    }

  async componentDidMount() {
    let fetch = new fetchData();
    // Load the templateListdialog
    let recordData

    try {

      recordData = await fetch.getRecordData(this.props.params.recordId)

      this.setState({recordData: recordData.recordById[0]})
    } catch(error) {
      console.error('fetching record data > ' + error)
    }
  }


  sectionTitle = (title) => {
    return (
      <span style={{fontWeight:"bolder",fontSize:20}}>
        {title}
      </span>
    )
  }

  richTextToComponent = (textStateFromDB) => {
    var componentToReturn
    try {
      var prevContentState = JSON.parse(textStateFromDB)
      if ( prevContentState.blocks && prevContentState.blocks[0] && prevContentState.blocks[0].text.length == 0  ) { //this means the text is empty
        return <div></div>
      }
      componentToReturn = EditorState.createWithContent(convertFromRaw(prevContentState))
      componentToReturn = <Editor readOnly={true} editorState={componentToReturn} onChange={(value) => {return null}} />
    } catch (e){
      componentToReturn = <div style={{marginLeft:10}} dangerouslySetInnerHTML={{__html: textStateFromDB}} />
    }
    return componentToReturn
  }

  prepareLine = (name,title,data) => {


    switch (name.toLowerCase()){
      case 'featuredimage':
        return <div></div>;
      case 'name':
        return <div><h3 style={{fontSize:18,fontWeight:500}}>{data}</h3></div>
      default:
        return <div>{title}<span style={{marginLeft:0}}>{data}</span></div>
    }
  }

  hasAnyMedia = ( media ) => {

    if ( media.picture.length > 0 ||
      media.audio.length > 0 ||
      media.video.length > 0 ||
      media.text.length > 0
    ) {
      return true;
    }

    return false;

  }

  render() {
    const style = {
      margin: 12,
    };

    var loadingIndicator = (<Halogen.MoonLoader color={"blue"}/>)

    if ( !this.state || !this.state.recordData ){
      return <Card style={{minHeight:600,textAlign:"centered"}}>
                <div style={{width:100,height:100, marginLeft: "auto", marginRight: "auto" ,paddingTop: 30}}>{loadingIndicator}</div>
              </Card>
    }

    const baseImage = URL_BASE_MULTIMEDIA_IMAGES + '/institution-default.jpg' // This is the image used by default when we have no image to show.

    return (
      <Card style={{padding:30, minHeight:600}}>
              Record view
      </Card>
    );
  }
}
