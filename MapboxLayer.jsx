'use strict';
import L from 'mapbox.js';
import React from 'react';

class MapboxLayer extends React.Component {

  static propTypes = {
    map: React.PropTypes.any,
    url: React.PropTypes.string
  };

  componentDidMount(){
    let mapLayer = L.mapbox.tileLayer(this.props.url);
    mapLayer.addTo(this.props.map);
  }

  render() {
    return null;
  }

}

export
default MapboxLayer;
