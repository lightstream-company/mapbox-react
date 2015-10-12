'use strict';
import L from 'mapbox.js';
import React from 'react';
import Popup from './Popup.jsx';

class Marker extends React.Component {

  constructor(props) {
    super(props);

    this._onZoomAnim = function(e) {
      this.setPosition(e.zoom, e.center);
    }.bind(this);

    this._onZoomStart = function() {
      this.setState({
        transition: true
      });
    }.bind(this);

    this._onZoomEnd = function() {
      this.setState({
        transition: false
      });
    }.bind(this);

    this.state = {
      transition: false,
      x: 0,
      y: 0
    };
  }
  componentDidMount() {
    this.setPosition();
    this.props.map.on('zoomstart', this._onZoomStart);
    this.props.map.on('zoomend', this._onZoomEnd);
    this.props.map.on('zoomanim', this._onZoomAnim);
  }
  componentDidUnmount() {
    this.props.map.off('zoomstart', this._onZoomStart);
    this.props.map.off('zoomend', this._onZoomEnd);
    this.props.map.off('zoomanim', this._onZoomAnim);
  }
  setPosition(zoom, center) {
    let lng, lat;
    if (this.props.geojson) {
      let coor = this.props.geojson.coordinates;
      lng = coor[0];
      lat = coor[1];
    } else if (this.props.lat && this.props.lng) {
      lng = this.props.lat;
      lat = this.props.lng;
    }
    let latlng = L.latLng(lat, lng);
    let position;
    if (zoom && center) {
      position = this.props.map._latLngToNewLayerPoint(latlng, zoom, center);
    } else {
      position = this.props.map.latLngToLayerPoint(latlng);
    }
    this.setState({
      visible: true,
      x: position.x,
      y: position.y
    });
  }

  render() {
    let style = {
      WebkitTransform: `translateX(${this.state.x}px) translateY(${this.state.y}px)`,
    };
    if (this.state.transition) {
      style.transition = `0.25s transform`;
    }
    let hasPopup = false;
    let children = React.Children.map(this.props.children, (child) => {
      if (child.type === Popup) {
        hasPopup = true;
        this.popupClassName = child.props.className || '';
        this.popup = React.cloneElement(child, {
          map: this.props.map,
          layer: this.props.layer,
          marker: this
        });
      } else {
        return child;
      }
    });
    return <div style={style} className="ls-marker" 
      onClick={this.openPopup.bind(this)}>{children}</div>;
  }
  openPopup() {
    if (this.popup) {
      let coor = this.props.geojson.coordinates;
      let popup = L.popup({
        className: this.popupClassName
      });
      let html = React.renderToStaticMarkup(this.popup);
      popup.setLatLng([coor[1], coor[0]]);
      popup.setContent(html);
      popup.openOn(this.props.map);
    }
  }
}

export
default Marker;
