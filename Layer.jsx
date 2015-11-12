'use strict';

import React from 'react';

class Layer extends React.Component {

  static propTypes = {
    map: React.PropTypes.any,
    children: React.PropTypes.node,
    interactive: React.PropTypes.bool,
    className: React.PropTypes.string
  };

  constructor(props) {
    super(props);
    this.options = {
      interactive: props.interactive ? true : false,
      nonBubblingEvents: ['click', 'dblclick', 'mouseover', 'mouseout', 'contextmenu']
    };
    this.props.map.addLayer(this);
  }

  onAdd() {
    //must be implemented...
  }

  render() {
    return <div ref="content" className={this.props.className}>{React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        map: this.props.map,
        layer: this
      });
    })}</div>;
  }
}

export default Layer;
