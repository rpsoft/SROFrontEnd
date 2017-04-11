import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

export default class RecordContainer extends Component {
  render() {
    return (
      <div>
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
