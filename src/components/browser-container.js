import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

export default class BrowserContainer extends Component {
  render() {
    return (
      <div>
          <div>THIS IS THE HEADER!</div>
        {/* <h1>
          Registers container!!!
          {this.props.params.recordId}
          {this.props.params.recordName}
        </h1> */}
        {this.props.children}
      </div>
    );
  }
}
