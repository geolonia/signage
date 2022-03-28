import React from 'react';
import MapboxDraw from "@mapbox/mapbox-gl-draw"
import { Buffer } from 'buffer'
import ws from './lib/ws'

import './Admin.scss';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

declare global {
  interface Window {
    geolonia: any;
  }
}

global.Buffer = Buffer;

const defaultCenter = [139.6917337, 35.6895014] as any

const Admin = () => {
  const mapContainer = React.useRef(null)

  React.useEffect(() => {
    const map = new window.geolonia.Map({
      container: mapContainer.current,
      center: defaultCenter,
      zoom: 10,
      // hash: true,
      style: "geolonia/basic",
    })

    const draw = new MapboxDraw({
      controls: {
        point: true,
        line_string: true,
        polygon: true,
        trash: true,
        combine_features: false,
        uncombine_features: false,
      }
    });

    map.addControl(draw, 'top-right');

    map.on('moveend', () => {
      ws.send(JSON.stringify({
        action: "broadcast",
        channel: "signage",
        message: {
          zoom: map.getZoom(),
          center: map.getCenter(),
          bearing: map.getBearing(),
          pitch: map.getPitch(),
        }
      }));
    })

    const events = ['create', 'delete', 'update', 'selectionchange', 'modechange']
    events.forEach(event => {
      map.on(`draw.${event}`, () => {
        ws.send(JSON.stringify({
          action: "broadcast",
          channel: "signage",
          message: {
            style: map.getStyle() // TODO: GeoJSON だけを送信するようにしたほうがよさそう。
          }
        }));
      })
    })
  }, [mapContainer])

  return (
    <div className="Admin">
      <div ref={mapContainer} className="map" data-marker="off"
        data-navigation-control="on" data-geolocate-control="on" data-gesture-handling="off"></div>
    </div>
  );
}

export default Admin;
