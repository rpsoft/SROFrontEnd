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

import searchTools from './searchTools';

class CommonView extends Component {

  constructor(props) {
    super()

    var advSearch = searchTools.getSOptsFromProps(props)
      advSearch.enabled = false
       //
       // debugger

    this.state = {
      isAMobile: (navigator.userAgent.indexOf('Mobile') > -1)? true : false,
      open: false,
      open2: false,
      loading : Object.keys(props.location.query).length > 0 ? true : false,

      // Search & Browsing parameters here.
      sorting:{
          sortField: props.params.sortField,
          direction: props.params.direction || "ascending"
        },

      allContent : null,//data,
      pagesAvailable : 0, //parseInt(pagesAvailable),
      currentPage : parseInt(props.params.page) || 1, //parseInt(currentPage),
      pageLimit: parseInt(props.params.pageLimit) || 10,// parseInt(pageLimit),

      // Search Parameters here.

      advancedSearch: advSearch,
      enabled: false,
      banner: "/assets/BannerGoudy.png",
    };


    if ( Object.keys(props.location.query).length > 0 ) {

      this.runSearch()
    }
  }

  async componentWillReceiveProps(next) {
    var props = next
    var updatedAdvSearchOptions = searchTools.getSOptsFromProps(props)
    var newState = {
      // Search & Browsing parameters here.
      sorting:{
          sortField: props.params.sortField,
          direction: props.params.direction || "ascending"
        },

      allContent : null,//data,
      pagesAvailable : 0, //parseInt(pagesAvailable),
      currentPage : parseInt(props.params.page) || 1, //parseInt(currentPage),
      pageLimit: parseInt(props.params.pageLimit) || 10,// parseInt(pageLimit),

      // Search Parameters here.

      advancedSearch: updatedAdvSearchOptions,
      enabled: this.state.enabled,
    }
  //  debugger
    this.setState(newState, async ()=> {await this.runSearch()} );
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

   //debugger

   var isInSearch = this.props.location.pathname.indexOf("search") > -1




   var advSearch = this.state.advancedSearch

   var didClose = advSearch.enabled

       advSearch.enabled = advSearch.enabled ? false : true
       advSearch.enabled = !isInSearch ? true : advSearch.enabled

       didClose = didClose && !advSearch.enabled

  if( didClose ){ // then clear Advanced Search
    //  debugger
      advSearch = {"query":"",
                    "filters":[],
                    "person":"",
                    "minDate":"",
                    "maxDate":"",
                    "minFees":"",
                    "maxFees":"",
                    "entry":"",
                    "enabled":advSearch.enabled}
  }

  if ( !isInSearch ){
    advSearch.enabled = true; //this.props.goToUrl("/search")
    this.setState({advancedSearch : advSearch, enabled: advSearch.enabled } , () => { this.props.goToUrl("/search") } )

  } else  {
    // debugger
    // advSearch.enabled = false;

    this.setState({advancedSearch : advSearch, enabled: advSearch.enabled })
  }

  //  console.log("HERE:"+ JSON.stringify(advSearch)+" this.state.: "+this.state.enabled)
 };

 runSearch = async () => {
    this.setState({loading : true})
    var newData = await searchTools.executeSearch(this.state.advancedSearch,
                              this.state.currentPage,
                              this.state.pageLimit,
                              this.state.sorting.sortField,
                              this.state.sorting.direction,
                              this.state.advancedSearch.filters)

    // debugger
    if ( !this.state.advancedSearch || (Object.keys(this.state.advancedSearch).length == 1 && Object.keys(this.state.advancedSearch)[0] == "query" && !this.state.advancedSearch.query)){
      this.setState({allContent : null,
                  pagesAvailable : parseInt(newData.pagesAvailable),
                  loading : false})
    } else {
      this.setState({allContent : newData.allContent,
                  pagesAvailable : parseInt(newData.pagesAvailable),
                  loading : false})
    }
 }

 searchURL = () => {
      //  debugger
         var url = searchTools.formatUrlAndGoto(this.state.advancedSearch, this.props , "search", true);
         //console.log("HERE "+url)
         this.props.goToUrl(url);

 }


 changeQuery = (query) => {
  // debugger
   var adSearch = this.state.advancedSearch
       adSearch.query = query
   //console.log("Change QUERY: "+query)
   this.setState({advancedSearch : adSearch, query: query })
 }


 updateAdvancedSearch = (adSearch) => {
   this.setState({advancedSearch : adSearch, query: adSearch.query })
 }



 changeBanner = () => {
    // var selectedBanner = this.state.banner.indexOf("bannerSRO3.png") > -1 ? "/assets/bannerSRO4.png" : "/assets/bannerSRO3.png"
    // this.setState({banner : selectedBanner})
 }

 render() {

    let logoStyle = {height: 50,marginLeft:5}
    let buttonStyle = {marginRight:10}
    let bodyStyle = {padding:10, maxWidth:960,minWidth:960,marginLeft:"auto",marginRight:"auto"}
    let bgStyle = {height: 50,marginLeft:5, backgroundColor: "#002147"}

    let dividerFormat = {width:"90%",marginLeft:"5%"}

    let buttonColor = "#e6e6e6"
    let buttonHoverColor = "#b5b5b5"


    let child = React.cloneElement(this.props.children, { advancedSearch : this.state.advancedSearch,
                                    enabled: this.state.enabled,
                                    query: this.state.query,
                                    data: this.state.allContent,
                                    loading : this.state.loading,
                                    pagesAvailable : this.state.pagesAvailable,
                                    runSearch : this.runSearch,
                                    updateAdvancedSearch : this.updateAdvancedSearch})


                                    //debugger
    if ( this.props.location.pathname.indexOf("browse") > -1 ){
      child = React.cloneElement(this.props.children, { advancedSearch : this.state.advancedSearch,
                                      enabled: this.state.enabled,
                                      data: this.state.allContent,
                                      loading : this.state.loading,
                                      pagesAvailable : this.state.pagesAvailable,
                                      runSearch : this.runSearch })

    }

    return <div>

    <a href="/">

      <Card style={{ ...bodyStyle,height:114, backgroundImage: 'url("'+this.state.banner+'")',marginTop:5,backgroundSize:"100%",marginBottom:7}} onClick={ ()=> this.changeBanner()}>
                  <span style={{fontSize:30, color:"#fff"}}>

                  </span>
                </Card>
    </a>

        <Card style={{ ...bodyStyle, minHeight:"52vh",backgroundImage: 'url("/assets/page.png")', backgroundSize: "100%"}}>

        {/* <span>Stationers' Register Online</span> */}
        <Card style={{paddingBottom:5,paddingLeft:13}}>
          <Link to={'/'} style={buttonStyle}>
            <RaisedButton hoverColor={buttonHoverColor}  backgroundColor={buttonColor}  className="mui-btn mui-btn--small mui-btn--primary" label="Home" />
          </Link>


          <RaisedButton hoverColor={buttonHoverColor}  backgroundColor={buttonColor}  className="mui-btn mui-btn--small mui-btn--primary"
          onClick={(event) => {this.handleTouchTap(event,"open") }}
          label={<span style={{display:"inline-flex",top:0, position:"relative",paddingLeft: 0}}>Browse <DownArrow style={{display:"inline-flex",top:3, position:"relative",marginRight:-10, marginLeft: 6, paddingLeft: 4, borderLeft: "#d2d2d2 1px solid"}}/></span>}
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

          <RaisedButton hoverColor={buttonHoverColor}  backgroundColor={buttonColor}  className="mui-btn mui-btn--small mui-btn--primary"
          onClick={(event) => {this.handleTouchTap(event,"open2")}}
          label={<span style={{display:"inline-flex",top:0, position:"relative",paddingLeft: 0}}>About <DownArrow style={{display:"inline-flex",top:3, position:"relative",marginRight:-10, marginLeft: 6, paddingLeft: 4, borderLeft: "#d2d2d2 1px solid"}}/></span>}
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
              <MenuItem value={2} primaryText="- The Stationers' Company" onClick={ (e) => {this.props.goToUrl("/about?g=stationersCompany"); this.handleRequestClose()}}/>
              <MenuItem value={3} primaryText="- The Stationers' Register" onClick={ (e) => {this.props.goToUrl("/about?g=stationersRegister"); this.handleRequestClose()}}/>
              <MenuItem value={4} primaryText="- Bibliography" onClick={ (e) => {this.props.goToUrl("/about?g=bibliography"); this.handleRequestClose(); }} />
              <Divider style={dividerFormat}/>
              {/* <Divider style={dividerFormat} /><Divider style={dividerFormat} /> */}
              <MenuItem value={5} primaryText="Project" onClick={ (e) => {this.props.goToUrl("/project"); this.handleRequestClose()}}/>
              <MenuItem value={6} primaryText="- Project History" onClick={ (e) => {this.props.goToUrl("/project?g=history"); this.handleRequestClose()}}/>
              <MenuItem value={7} primaryText="- Editorial" onClick={ (e) => {this.props.goToUrl("/project?g=editorial"); this.handleRequestClose()}}/>
              <MenuItem value={8} primaryText="- Technical" onClick={ (e) => {this.props.goToUrl("/project?g=technical"); this.handleRequestClose()}}/>
              <MenuItem value={9} primaryText="- Licence" onClick={ (e) => {this.props.goToUrl("/project?g=license"); this.handleRequestClose()}}/>
              <MenuItem value={10} primaryText="- Credits" onClick={ (e) => {this.props.goToUrl("/project?g=credits"); this.handleRequestClose()}}/>
            </Menu>
          </Popover>

          <Link to={'/help'} style={buttonStyle}>
            <RaisedButton hoverColor={buttonHoverColor}  backgroundColor={buttonColor}  className="mui-btn mui-btn--small mui-btn--primary" label="Help" />
          </Link>

          <SearchControls
            changeQuery = { this.changeQuery }
            toggleAdvancedSearch = {this.toggleAdvancedSearch }
            location={this.props.location}
            runSearch= {this.searchURL}
          />

        </Card>

        {
          child
        }
        {/* {this.props.children} */}

     </Card>

      <Card style={{ ...bodyStyle, marginTop:10, marginBottom:5, textAlign:"center",backgroundImage: 'url("/assets/page.png")', backgroundSize: "100%"}}>
        <Card style={{paddingTop:8,paddingBottom:8}}>
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
           <img src="/assets/GLogo.jpg" style={logoStyle} />
         </a>
         <a href="http://www.ox.ac.uk" target="_blank">
           <img src="https://upload.wikimedia.org/wikipedia/en/thumb/2/2f/University_of_Oxford.svg/1280px-University_of_Oxford.svg.png" style={logoStyle} />
         </a>
         <a href="https://bibsocamer.org/" target="_blank">
            <img src="/assets/bsamlogo.png" style={logoStyle} />
         </a>
        </Card>
      </Card>
      <Card style={{ ...bodyStyle, marginTop:10, marginBottom:5, textAlign:"center",backgroundImage: 'url("/assets/page.png")', backgroundSize: "100%"}}>
        <Card style={{paddingTop:8,paddingBottom:1}}>
          <p>Contact us: editors@stationersregister.online</p>
        </Card>
      </Card>

      <div style={{height:"25vh"}}></div>
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
