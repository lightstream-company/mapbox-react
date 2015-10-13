'use strict';
import React from 'react';
import Layer from './Layer.jsx';

class Map extends React.Component {

  static propTypes = {
    map: React.PropTypes.any,
    children: React.PropTypes.node
  };

  componentDidMount() {
    React.Children.map(this.props.children, (child) => {
      if (child.type === Layer) {
        let clone = React.cloneElement(child, {
          map: this.props.map
        });
        React.render(clone, this.props.map.getPanes().overlayPane);
      }
    });
  }

  render() {
    return <div>{React.Children.map(this.props.children, (child) => {
      if(child.type !== Layer){
        let clone = React.cloneElement(child, {
            map: this.props.map
        });
        return clone;
      }
    })}</div>;
  }
}


export
default Map;
