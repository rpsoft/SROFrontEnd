import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'

import { templateListSet } from '../actions/actions';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import {URL_BASE} from '../links'

import RaisedButton from 'material-ui/RaisedButton';


class CommonView extends Component {

  constructor() {
    super()
    this.state = {
      isAMobile: (navigator.userAgent.indexOf('Mobile') > -1)? true : false,
    };
  }

  render() {
    let logoStyle = {height: 50,marginLeft:5}
    let buttonStyle = {marginRight:10}
    let bodyStyle = {padding:10, maxWidth:960,minWidth:540,marginLeft:"auto",marginRight:"auto"}
    let bgStyle = {height: 50,marginLeft:5, backgroundColor: "#002147"}

    return <div><Card style={{ ...bodyStyle, minHeight:"90vh"}}>
        <Card style={{marginTop:5,marginBottom:10,padding:15,fontSize:20}}><span>Stationers Register Online</span></Card>
        <Card style={{padding:5}}>
          <Link to={'/'} style={buttonStyle}>
            <RaisedButton label="Home" />
          </Link>
          <Link to={'/browser/1'} style={buttonStyle}>
            <RaisedButton label="Browse" />
          </Link>
          <Link to={'/search'} style={buttonStyle}>
            <RaisedButton label="Search" />
          </Link>
          <Link to={'/project'} style={buttonStyle}>
            <RaisedButton label="Project" />
          </Link>
          <Link to={'/about'} style={buttonStyle}>
            <RaisedButton label="About" />
          </Link>
        </Card>
          {this.props.children}

     </Card>

       <Card style={{ ...bodyStyle, marginTop:10, marginBottom:10, textAlign:"center"}}>
       <a href="http://www.bathspa.ac.uk" target="_blank">
         <img src="https://thehub.bathspa.ac.uk/MediaFolder/Marketing/branding/logos/bsu-logo.png" style={logoStyle} />
       </a>
       <a href="http://www.create.ac.uk" target="_blank">
         <img src="http://www.create.ac.uk/wp-content/uploads/logos/create_primary_logo_160.jpg" style={logoStyle} />
       </a>
       <a href="http://www.bibsoc.org.uk/" target="_blank">
         <img src="http://www.bibsoc.org.uk/sites/bibsoc.adaptivetechnologies.com/themes/bibsoc/logo.png" style={bgStyle} />
       </a>
       <a href="https://stationers.org/" target="_blank">
         <img src="https://stationers.org/images/module-images/small-crest.png" style={logoStyle} /></a>
       <a href="http://gla.ac.uk" target="_blank">
         <img src="http://www.gla.ac.uk/media/media_434161_en.jpg" style={logoStyle} />
       </a>
       <a href="http://www.ox.ac.uk" target="_blank">
         <img src="https://upload.wikimedia.org/wikipedia/en/thumb/2/2f/University_of_Oxford.svg/1280px-University_of_Oxford.svg.png" style={logoStyle} />
       </a>

      </Card>
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
