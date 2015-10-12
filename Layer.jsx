'use strict';
//import L from 'mapbox.js';
import React from 'react';

class Layer extends React.Component {

  constructor(props) {
    super(props);
    this.options = {
      interactive: props.interactive ? true : false,
      nonBubblingEvents: ['click', 'dblclick', 'mouseover', 'mouseout', 'contextmenu']
    };
  }

  componentDidMount() {
    this.props.map.addLayer(this);
  }

  onAdd() {
    let el = this.refs.content.getDOMNode();
    this.props.map.getPanes().overlayPane.appendChild(el);
  }
  onRemove() {

  }

  render() {
    return <div ref="content">{React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        map: this.props.map,
        layer: this
      });
    })}</div>;
  }
}

export
default Layer;