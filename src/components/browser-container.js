import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

export default class BrowserContainer extends Component {
  render() {
    return (
      <div>
        {/* <h1>
          Registers container!!!
          {this.props.params.recordId}
          {this.props.params.recordName}
        </h1> */}
        {React.cloneElement(this.props.children, this.props)}
      </div>
    );
  }
}
