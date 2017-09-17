import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'

import { templateListSet } from '../actions/actions';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import {URL_BASE} from '../links'

import RaisedButton from 'material-ui/RaisedButton';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import Divider from 'material-ui/Divider';
import DownArrow from 'material-ui/svg-icons/navigation/arrow-drop-down';
import { push } from 'react-router-redux'

import SearchControls from './searchControls';

class CommonView extends Component {

  constructor() {
    super()
    this.state = {
      isAMobile: (navigator.userAgent.indexOf('Mobile') > -1)? true : false,
      open: false,
      open2: false,
      navigationOption : "Browse",
      navigationOption2 : "About",
    };
  }

  handleTouchTap = (event,target) => {
    // This prevents ghost click.
    event.preventDefault();
    var newstate = {
        anchorEl: event.currentTarget,
      }

    newstate[target] = true

    this.setState(newstate);
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
      open2: false,
    });
  };

 toggleAdvancedSearch = () => {
   this.setState({advancedSearchEnabled : this.state.advancedSearchEnabled ? false : true })
 };

 changeQuery = (query) => {
   this.setState({query : query})
 }

  render() {
    let logoStyle = {height: 50,marginLeft:5}
    let buttonStyle = {marginRight:10}
    let bodyStyle = {padding:10, maxWidth:960,minWidth:540,marginLeft:"auto",marginRight:"auto"}
    let bgStyle = {height: 50,marginLeft:5, backgroundColor: "#002147"}

    return <div><Card style={{ ...bodyStyle, minHeight:"92vh"}}>
        <Card style={{marginTop:5,marginBottom:10,padding:15,fontSize:20}}><span>Stationers' Register Online</span></Card>
        <Card style={{paddingBottom:5,paddingLeft:5}}>
          <Link to={'/'} style={buttonStyle}>
            <RaisedButton label="Home" />
          </Link>


          <RaisedButton
          onClick={(event) => {this.handleTouchTap(event,"open") }}
          label={<span>{this.state.navigationOption} <DownArrow style={{display:"inline-flex",top:6, position:"relative",marginRight:-10, marginLeft: 6, paddingLeft: 4, borderLeft: "#d2d2d2 1px solid"}}/></span>}
          style={{marginRight:10}}
          />
          <Popover
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose}
          >
            <Menu>
              <MenuItem value={1} primaryText="Browse" onClick={ (e) => {this.props.goToUrl("/browser/1"); this.handleRequestClose()}}/>
              <MenuItem value={2} primaryText="Copies" onClick={ (e) => {this.props.goToUrl("/browser/1"); this.handleRequestClose()}}/>
              <MenuItem value={3} primaryText="Names" onClick={ (e) => {this.props.goToUrl("/browser/1"); this.handleRequestClose()}}/>
              <MenuItem value={4} primaryText="By Date" onClick={ (e) => {this.props.goToUrl("/browser/1"); this.handleRequestClose()}}/>
              <MenuItem value={5} primaryText="By Volume" onClick={ (e) => {this.props.goToUrl("/browser/1"); this.handleRequestClose()}}/>
            </Menu>
          </Popover>

          <RaisedButton
          onClick={(event) => {this.handleTouchTap(event,"open2")}}
          label={<span>{this.state.navigationOption2} <DownArrow style={{display:"inline-flex",top:6, position:"relative",marginRight:-10, marginLeft: 6, paddingLeft: 4, borderLeft: "#d2d2d2 1px solid"}}/></span>}
          style={{marginRight:10}}
          />

          <Popover
            open={this.state.open2}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose}
          >
            <Menu>
              <MenuItem value={1} primaryText="About" onClick={ (e) => {this.props.goToUrl("/about"); this.handleRequestClose()}}/>
              <MenuItem value={2} primaryText="- The Stationers' Register" onClick={ (e) => {this.props.goToUrl("/about"); this.handleRequestClose()}}/>
              <MenuItem value={3} primaryText="- The Stationers' Company" onClick={ (e) => {this.props.goToUrl("/about"); this.handleRequestClose()}}/>
              <MenuItem value={4} primaryText="- History of Copyright" onClick={ (e) => {this.props.goToUrl("/about"); this.handleRequestClose()}}/>
              <a href={"#bibliography"}><MenuItem value={5} primaryText="- Bibliography" /></a>
              <Divider /><Divider /><Divider />
              <MenuItem value={6} primaryText="Project" onClick={ (e) => {this.props.goToUrl("/project"); this.handleRequestClose()}}/>
              <MenuItem value={7} primaryText="- History" onClick={ (e) => {this.props.goToUrl("/project"); this.handleRequestClose()}}/>
              <MenuItem value={8} primaryText="- Editorial" onClick={ (e) => {this.props.goToUrl("/project"); this.handleRequestClose()}}/>
              <MenuItem value={9} primaryText="- Technical" onClick={ (e) => {this.props.goToUrl("/project"); this.handleRequestClose()}}/>
              <MenuItem value={10} primaryText="- Credits" onClick={ (e) => {this.props.goToUrl("/project"); this.handleRequestClose()}}/>
              <MenuItem value={11} primaryText="- Permissions" onClick={ (e) => {this.props.goToUrl("/project"); this.handleRequestClose()}}/>
            </Menu>
          </Popover>


          <SearchControls
            // allContent={this.state.allContent}
            // pagesAvailable={this.state.pagesAvailable}
            // pageLimit={this.state.pageLimit}
            // currentPage={this.state.currentPage}
            // linkRoot={"browser"}
            changeQuery = { this.changeQuery }
            toggleAdvancedSearch = { this.toggleAdvancedSearch }
            routeParams={{query:"hello"}}
            location={this.props.location}
          />

          {/*
                    <DropDownMenu
                      style={{marginBottom:0, display: "inline-flex"}}
                      // anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                      value={1}
                      autoWidth={true}
                    >
                      {/* <Link to={'/browser/1'} style={buttonStyle}> */}
                        {/* <MenuItem value={1} primaryText="Browse" />
                      {/* </Link>
                    </DropDownMenu>  */}

          {/* <Link to={'/search'} style={buttonStyle}>
            <RaisedButton label="Search" />
          </Link> */}
          {/* <Link to={'/project'} style={buttonStyle}>
            <RaisedButton label="Project" />
          </Link>
          <Link to={'/about'} style={buttonStyle}>
            <RaisedButton label="About" />
          </Link> */}
        </Card>

        {React.cloneElement(this.props.children, { advancedSearchEnabled : this.state.advancedSearchEnabled, query : this.state.query })}

     </Card>

       <Card style={{ ...bodyStyle, marginTop:10, marginBottom:10, textAlign:"center"}}>
       <a href="http://www.bathspa.ac.uk" target="_blank">
         <img src="https://thehub.bathspa.ac.uk/MediaFolder/Marketing/branding/logos/bsu-logo.png" style={logoStyle} />
       </a>
       <a href="http://www.create.ac.uk" target="_blank">
         <img src="http://www.create.ac.uk/wp-content/uploads/logos/create_primary_logo_160.jpg" style={logoStyle} />
       </a>location
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
  },
  goToUrl: (url) => dispatch(push(url))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommonView);
