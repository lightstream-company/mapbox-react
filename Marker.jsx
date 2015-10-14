'use strict';
import L from 'mapbox.js';
import React from 'react';
import Popup from './Popup.jsx';


const popupOptionsList = [
  'maxWidth',
  'minWidth',
  'maxHeight',
  'autoPan',
  'keepInView',
  'closeButton',
  'offset',
  'autoPanPaddingTopLeft',
  'autoPanPaddingBottomRight',
  'autoPanPadding',
  'zoomAnimation',
  'closeOnClick',
  'className'
];

function pick(_this, arr) {
  let obj = {};
  arr.forEach(function(key) {
    if (_this[key] !== undefined) {
      obj[key] = _this[key];
    }
  });
  return obj;
}

class Marker extends React.Component {

  static propTypes = {
    children: React.PropTypes.node,
    geojson: React.PropTypes.any,
    map: React.PropTypes.any
  };

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
  componentWillUnmount() {
    this.props.map.off('zoomstart', this._onZoomStart);
    this.props.map.off('zoomend', this._onZoomEnd);
    this.props.map.off('zoomanim', this._onZoomAnim);
  }
  setPosition(zoom, center) {
    let coor = this.props.geojson.coordinates;
    let lng = coor[0];
    let lat = coor[1];
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

  openPopup() {
    let popup, popupElement;
    React.Children.forEach(this.props.children, (child) => {
      if (child.type === Popup) {
        let popupOptions = pick(child.props, popupOptionsList);
        popup = L.popup(popupOptions);
        popupElement = child;
      }
    });
    if (popup) {
      let coor = this.props.geojson.coordinates;
      let html = React.renderToStaticMarkup(popupElement);
      popup.setLatLng([coor[1], coor[0]]);
      popup.setContent(html);
      popup.openOn(this.props.map);
    }
  }

  render() {
    let style = {
      WebkitTransform: `translateX(${this.state.x}px) translateY(${this.state.y}px)`,
      transform: `translateX(${this.state.x}px) translateY(${this.state.y}px)`,
      position: 'absolute'
    };
    if (this.state.transition) {
      style.transition = `0.25s transform`;
    }
    let children = React.Children.map(this.props.children, (child) => {
      if (child.type !== Popup) {
        return child;
      }
    });
    return <div style={style} onClick={this.openPopup.bind(this)}>
      {children}
    </div>;
  }
}

export
default Marker;
