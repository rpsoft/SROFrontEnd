import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

export default class App extends Component {
  render() {
    const style = {
      margin: 12,
    };

    return (
      <div>
        <h1>
          Hello, world!!!
        </h1>
        <RaisedButton label="Primary" primary={true} style={style} />
        <RaisedButton label="Secondary" secondary={true} style={style} />
        <span>
          Adding packages...
        </span>
      </div>
    );
  }
}
