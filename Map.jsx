'use strict';
import L from 'mapbox.js';
import React from 'react';

L.mapbox.accessToken = 'pk.eyJ1IjoiZnJhbmNrZXJuZXdlaW4iLCJhIjoiYXJLM0dISSJ9.mod0ppb2kjzuMy8j1pl0Bw';

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapCreated: false,
      width: this.props.width,
      height: this.props.height
    };
  }
  componentDidMount() {
    this.map = L.mapbox.map(this.refs.map.getDOMNode());
    let lat = this.props.lat || 0;
    let lng = this.props.lng || 0;
    let zoom = this.props.zoom || 1;
    this.map.setView([lat, lng], zoom);
    this.setState({
      mapCreated: true
    });
  }
  render() {
    let style = {
      width: this.state.width + 'px',
      height: this.state.width + 'px',
      border: '1px solid #ccc'
    };
    let clones;
    if (this.state.mapCreated) {
      clones = React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, {
          map: this.map
        });
      });
    }
    return <div className="ls-map-wrapper">
      <div ref="map" style={style}></div>
      {clones}
    </div>;
  }
}

export
default Map;
