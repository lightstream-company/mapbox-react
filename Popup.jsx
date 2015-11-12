'use strict';

import React from 'react';

class Popup extends React.Component {

  static propTypes = {
    map: React.PropTypes.any,
    marker: React.PropTypes.any,
    children: React.PropTypes.node
  };

  render() {
    return <div>
      {this.props.children}
    </div>;
  }
}

export
default Popup;
