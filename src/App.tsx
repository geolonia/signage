import React from 'react';
import { openReverseGeocoder } from '@geolonia/open-reverse-geocoder'
import { Buffer } from 'buffer'
import ws from './lib/ws'

import './App.scss';

import Clock from './Clock';
import Weather from './Weather';

declare global {
  interface Window {
    geolonia: any;
  }
}

global.Buffer = Buffer;

const defaultCenter = [139.6917337, 35.6895014] as any

const App = () => {
  const mapContainer = React.useRef(null)
  const [location, setLocation] = React.useState({})
  const [lnglat, setLnglat] = React.useState(defaultCenter)

  React.useEffect(() => {
    ws.send(JSON.stringify({
      action: "subscribe",
      channel: "signage"
    }));

    const map = new window.geolonia.Map({
      container: mapContainer.current,
      center: defaultCenter,
      zoom: 10,
      // hash: true,
      style: "geolonia/basic",
    })

    openReverseGeocoder(defaultCenter).then(res => {
      setLocation(res)
    }).catch(error => {
      // nothing to do
    })

    ws.onmessage = function(message) {
      const rawPayload = JSON.parse(message.data);
      const payload = rawPayload.msg;
      if (payload) {
        if (payload.center && payload.zoom) {
          map.flyTo({
            center: payload.center,
            zoom: payload.zoom,
            bearing: payload.bearing,
            pitch: payload.pitch
          });
        }

        if (payload.style) {
          map.setStyle(payload.style, {
            diff: true,
          })
        }
      }
    }

    map.on('moveend', () => {
      const center = map.getCenter()
      const lnglat = Object.values(center) as number[]

      if (lnglat) {
        setLnglat(lnglat)
      }
    })

    map.on('move', () => {
      const center = map.getCenter()
      const lnglat = Object.values(center) as number[]

      // @ts-ignore
      openReverseGeocoder(lnglat).then(res => {
        setLocation(res)
      }).catch(error => {
        // nothing to do
      })
    })
  }, [mapContainer])

  return (
    <div className="App">
      <div ref={mapContainer} className="map" data-navigation-control="off"></div>
      <div>
        <div className="weather-container"><Weather location={location} lnglat={lnglat} /></div>
        <div className="clock-container"><Clock /></div>
      </div>
    </div>
  );
}

export default App;
