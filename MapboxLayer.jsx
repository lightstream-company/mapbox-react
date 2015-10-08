'use strict';
import L from 'mapbox.js';
import React from 'react';

class MapboxLayer extends React.Component {

  componentDidMount() {
    var mapLayer = L.mapbox.tileLayer(this.props.url);
    mapLayer.addTo(this.props.map);
  }

  render() {
    return null;
  }

}

export
default MapboxLayer;
