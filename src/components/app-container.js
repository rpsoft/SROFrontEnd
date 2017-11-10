import React, { Component } from 'react';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import muiLMSTheme from '../muiLMSTheme';

// This replaces the textColor value on the palette
// and then update the keys for each component that depends on it.
// More on Colors: http://www.material-ui.com/#/customization/colors
const muiTheme = getMuiTheme(muiLMSTheme);

injectTapEventPlugin();
/**
 * Component that handles default App layout.
 *
 * React container pattern. The container component explained:
 * https://medium.com/@learnreact/container-components-c0e67432e005#.iu4v0nc2d
 *
 * Example usage (please look at ./src/routes.js):
 * ```
 * var routes = (history) => (
 *   <Router history={history}>
 *     <Route path="/" component={AppContainer}>
 *       <IndexRoute component={Dashboard} />
 * ```
 */

import CommonView from './common-view';

export default class AppContainer extends Component {
  render() {
    return (
     <div id="maincontainer" style={{height:"calc(100%)", backgroundImage: "url(/assets/bgLetters-gray2.png)", backgroundSize: "52%",backgroundAttachment:"fixed"}}>
       <MuiThemeProvider muiTheme={ muiTheme }>
         <CommonView {...this.props} />
       </MuiThemeProvider>
     </div>
    );
  }
}
