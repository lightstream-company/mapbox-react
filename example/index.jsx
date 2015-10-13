'use strict';
import React from 'react';
import L from 'mapbox.js';
import {Map, Layer, MapboxLayer, Marker, Popup} from '../';

L.mapbox.accessToken = 'pk.eyJ1IjoiZnJhbmNrZXJuZXdlaW4iLCJhIjoiYXJLM0dISSJ9.mod0ppb2kjzuMy8j1pl0Bw';

class Example extends React.Component {

  render() {

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

    let map = L.mapbox.map(document.getElementById('map'));
    map.setView([0, 0], 1);
    return <Map map={map}>
      <MapboxLayer url="mapbox.streets" />
      <Layer interactive>
        {collection.map((item) => {
          return <Marker key={item.id} geojson={item.geojson}>
            <div className="circle">
              <div className="center"></div>
            </div>
            <Popup className="popup-class" offset={[0, -10]}>
              <h1>{item.data.title}</h1>
              <p>yolo</p>
            </Popup>
          </Marker>;
        })}
      </Layer>
    </Map>;
  }
}

React.render(<Example />, document.getElementById('content'));
