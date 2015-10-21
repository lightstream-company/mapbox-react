'use strict';
import React from 'react';
import L from 'mapbox.js';
import {
  Map, Layer, MapboxLayer, Marker, Popup
}
from '../';

L.mapbox.accessToken = 'pk.eyJ1IjoiZnJhbmNrZXJuZXdlaW4iLCJhIjoiYXJLM0dISSJ9.mod0ppb2kjzuMy8j1pl0Bw';

let collection = [];
for (let i = 0; i < 50; i++) {
  let coor = [Math.random() * 360 - 180, Math.random() * 140 - 70];
  collection.push({
    data: {
      title: 'marker ' + i
    },
    id: i,
    geojson: {
      type: 'Point',
      coordinates: coor
    }
  });
}

let matrix = {};
let step = 30;
collection.forEach(function(item) {
  let lat = item.geojson.coordinates[1];
  let lng = item.geojson.coordinates[0];
  let key = (Math.round(lng / step) * step) + ',' + (Math.round(lat / step) * step);
  if (!matrix[key]) {
    matrix[key] = [];
  }
  matrix[key].push(item);
});

var cluster = [];
Object.keys(matrix).forEach(function(key) {
  let items = matrix[key];
  let lng_sum = 0;
  let lat_sum = 0;
  let titles = [];
  items.forEach(function(item) {
    lng_sum += item.geojson.coordinates[0];
    lat_sum += item.geojson.coordinates[1];
    titles.push(item.title);
  });

  cluster.push({
    data: {
      title: titles.join(),
      count: items.length
    },
    geojson: {
      type: 'Point',
      coordinates: [
        lng_sum / items.length,
        lat_sum / items.length
      ]
    }
  });


});

const CENTER = {
  type: 'Point',
  coordinates: [0, 0]
};

class Example extends React.Component {

  state = {
    collection: [],
    now: new Date().toISOString()
  };

  componentWillMount() {
    let i = 0;
    this.map = L.mapbox.map(document.getElementById('map'));
    this.map.setView([0, 0], 1);
    let timer = setInterval(() => {
      if (collection[i]) {
        this.setState({
          collection: this.state.collection.concat(collection[i])
        });
      } else {
        clearInterval(timer);
      }
      i++;
    }, 20);
    setInterval(() => {
      this.setState({
        now: new Date().toISOString()
      });
    }, 1000);
  }

  remove() {
    this.setState({
      collection: this.state.collection.slice(1, this.state.collection.length)
    });
  }

  render() {
    return <div>
      <button onClick={this.remove.bind(this)}>Remove</button>
      <Map map={this.map}>
        <MapboxLayer url="mapbox.streets" />
        <Layer>
          <Marker geojson={CENTER}>
            <span>Center !</span>
          </Marker>
        </Layer>
        <Layer interactive>
          {this.state.collection.map((item) => {
            return <Marker key={item.id} geojson={item.geojson}>
              <div className="circle">
                <div className="center"></div>
              </div>
              <Popup className="popup-class" offset={[0, -10]}>
                <h1>{item.data.title}</h1>
                <p>{this.state.now}</p>
                <a href="#">Remove Me</a>
              </Popup>
            </Marker>;
          })}
        </Layer>
      </Map>
    </div>;
  }
}



React.render(<Example />, document.getElementById('content'));
