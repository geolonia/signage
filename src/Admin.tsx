import React from 'react';
import { openReverseGeocoder } from '@geolonia/open-reverse-geocoder'
import { Buffer } from 'buffer'
import ws from './lib/ws'

import './Admin.scss';

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
      hash: true,
      style: "geolonia/basic",
    })

    map.on('moveend', () => {
      ws.send(JSON.stringify({
        zoom: map.getZoom(),
        center: map.getCenter(),
        bearing: map.getBearing(),
        pitch: map.getPitch(),
      }));
    })
  }, [mapContainer])

  return (
    <div className="Admin">
      <div ref={mapContainer} className="map" data-navigation-control="on" data-geolocate-control="on"></div>
    </div>
  );
}

export default Admin;
