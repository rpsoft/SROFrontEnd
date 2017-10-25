import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'

import { templateListSet } from '../actions/actions';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import {URL_BASE} from '../links'

import Bootstrap from '../../assets/bootstrap.css';

import RaisedButton from 'material-ui/FlatButton';

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
      banner: "/assets/bannerSRO3.png",
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

 changeBanner = () => {
    var selectedBanner = this.state.banner.indexOf("bannerSRO3.png") > -1 ? "/assets/bannerSRO4.png" : "/assets/bannerSRO3.png"
    this.setState({banner : selectedBanner})
 }
  render() {

    let logoStyle = {height: 50,marginLeft:5}
    let buttonStyle = {marginRight:10}
    let bodyStyle = {padding:10, maxWidth:960,minWidth:960,marginLeft:"auto",marginRight:"auto"}
    let bgStyle = {height: 50,marginLeft:5, backgroundColor: "#002147"}

    let dividerFormat = {width:"90%",marginLeft:"5%"}

    let buttonColor = "#e6e6e6"
    let buttonHoverColor = "#b5b5b5"

    return <div>

      <Card style={{ ...bodyStyle,height:114, backgroundImage: 'url("'+this.state.banner+'")',backgroundSize:"100%",marginBottom:7}} onClick={ ()=> this.changeBanner()}>
                  <span style={{fontSize:30, color:"#fff"}}>

                  </span>
                </Card>

        <Card style={{ ...bodyStyle, minHeight:"80vh",backgroundImage: 'url("/assets/page.png")', backgroundSize: "100%"}}>

        {/* <span>Stationers' Register Online</span> */}
        <Card style={{paddingBottom:5,paddingLeft:13}}>
          <Link to={'/'} style={buttonStyle}>
            <RaisedButton hoverColor={buttonHoverColor}  backgroundColor={buttonColor}  className="" label="Home" />
          </Link>


          <RaisedButton hoverColor={buttonHoverColor}  backgroundColor={buttonColor}  className=""
          onClick={(event) => {this.handleTouchTap(event,"open") }}
          label={<span>Browse <DownArrow style={{display:"inline-flex",top:6, position:"relative",marginRight:-10, marginLeft: 6, paddingLeft: 4, borderLeft: "#d2d2d2 1px solid"}}/></span>}
          style={{marginRight:10}}
          />
          <Popover className="popover-content"
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose}
          >
            <Menu>
              <MenuItem value={1} primaryText="All" onClick={ (e) => {this.props.goToUrl("/browser/1"); this.handleRequestClose()}}/>
              {/* <MenuItem value={2} primaryText="Copies" onClick={ (e) => {this.props.goToUrl("/browser/1"); this.handleRequestClose()}}/> */}
              <MenuItem value={3} primaryText="Names" onClick={ (e) => {this.props.goToUrl("/browser/names"); this.handleRequestClose()}}/>
              <MenuItem value={4} primaryText="By Date" onClick={ (e) => {this.props.goToUrl("/browser/date"); this.handleRequestClose()}}/>
              <MenuItem value={5} primaryText="By Volume" onClick={ (e) => {this.props.goToUrl("/browser/volume"); this.handleRequestClose()}}/>
            </Menu>
          </Popover>

          <RaisedButton hoverColor={buttonHoverColor}  backgroundColor={buttonColor}  className=""
          onClick={(event) => {this.handleTouchTap(event,"open2")}}
          label={<span>About <DownArrow style={{display:"inline-flex",top:6, position:"relative",marginRight:-10, marginLeft: 6, paddingLeft: 4, borderLeft: "#d2d2d2 1px solid"}}/></span>}
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
              <MenuItem value={2} primaryText="- The Stationers' Register" onClick={ (e) => {this.props.goToUrl("/about?g=stationersRegister"); this.handleRequestClose()}}/>
              <MenuItem value={3} primaryText="- The Stationers' Company" onClick={ (e) => {this.props.goToUrl("/about"); this.handleRequestClose()}}/>
              <MenuItem value={4} primaryText="- History of Copyright" onClick={ (e) => {this.props.goToUrl("/about"); this.handleRequestClose()}}/>
              <MenuItem value={5} primaryText="- Bibliography" onClick={ (e) => {this.props.goToUrl("/about?g=bibliography"); this.handleRequestClose(); }} />
              <Divider style={dividerFormat}/>
              {/* <Divider style={dividerFormat} /><Divider style={dividerFormat} /> */}
              <MenuItem value={6} primaryText="Project" onClick={ (e) => {this.props.goToUrl("/project"); this.handleRequestClose()}}/>
              <MenuItem value={7} primaryText="- History" onClick={ (e) => {this.props.goToUrl("/project"); this.handleRequestClose()}}/>
              <MenuItem value={8} primaryText="- Editorial" onClick={ (e) => {this.props.goToUrl("/project"); this.handleRequestClose()}}/>
              <MenuItem value={9} primaryText="- Technical" onClick={ (e) => {this.props.goToUrl("/project"); this.handleRequestClose()}}/>
              <MenuItem value={10} primaryText="- Credits" onClick={ (e) => {this.props.goToUrl("/project"); this.handleRequestClose()}}/>
              <MenuItem value={11} primaryText="- Permissions" onClick={ (e) => {this.props.goToUrl("/project"); this.handleRequestClose()}}/>
            </Menu>
          </Popover>

          <Link to={'/help'} style={buttonStyle}>
            <RaisedButton hoverColor={buttonHoverColor}  backgroundColor={buttonColor}  className="" label="Help" />
          </Link>

          <SearchControls
            changeQuery = { this.changeQuery }
            toggleAdvancedSearch = { this.toggleAdvancedSearch }
            routeParams={{query:""}}
            location={this.props.location}
          />

        </Card>

        {React.cloneElement(this.props.children, { advancedSearchEnabled : this.state.advancedSearchEnabled, query : this.state.query })}

        <div style={{width:"100%",textAlign:"center",marginTop:10,marginBottom:10,opacity:0.8}}><img src={"/assets/letterTrans.png"} style={{width:80}}></img></div>
     </Card>

       <Card style={{ ...bodyStyle, marginTop:10, marginBottom:0, textAlign:"center",backgroundImage: 'url("/assets/page.png")', backgroundSize: "100%"}}>
       <a href="http://www.bathspa.ac.uk" target="_blank">
         <img src="https://thehub.bathspa.ac.uk/MediaFolder/Marketing/branding/logos/bsu-logo.png" style={logoStyle} />
       </a>
       <a href="http://www.create.ac.uk" target="_blank">
         <img src="http://www.create.ac.uk/wp-content/uploads/logos/create_primary_logo_160.jpg" style={logoStyle} />
       </a>location
       <a href="http://www.bibsoc.org.uk/" target="_blank">
         <img src="/assets/BibSocsupportlogo.jpg" style={bgStyle} />
       </a>
       <a href="https://stationers.org/" target="_blank">
         <img src="https://stationers.org/images/module-images/small-crest.png" style={logoStyle} /></a>
       <a href="http://gla.ac.uk" target="_blank">
         <img src="http://www.gla.ac.uk/media/media_434161_en.jpg" style={logoStyle} />
       </a>
       <a href="http://www.ox.ac.uk" target="_blank">
         <img src="https://upload.wikimedia.org/wikipedia/en/thumb/2/2f/University_of_Oxford.svg/1280px-University_of_Oxford.svg.png" style={logoStyle} />
       </a>
       <div style={{backgroundColor:"#00B5DA", height:50, width: 180, display:"inline-block",paddingTop:3,paddingBottom:5,marginLeft:5}}><a href="http://www.ox.ac.uk" target="_blank" >
         <img src="https://creativecommons.org/images/deed/cc_icon_white_x2.png" style={{...logoStyle,height:45}} />
         <img src="https://creativecommons.org/images/deed/attribution_icon_white_x2.png" style={{...logoStyle,height:40}} />
         <img src="https://creativecommons.org/images/deed/sa_white_x2.png" style={{...logoStyle,height:45}} />
       </a>
        </div>

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
