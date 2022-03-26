import React from 'react';
import { openReverseGeocoder } from '@geolonia/open-reverse-geocoder'
import { Buffer } from 'buffer'

import './App.scss';

import Clock from './Clock';
import Weather from './Weather';

import mapStyle from './style.json'

declare global {
  interface Window {
    geolonia: any;
  }
}

global.Buffer = Buffer;

const defaultCenter = [134.055369, 34.421371] as any

const piesocket = new WebSocket(`wss://demo.piesocket.com/v3/channel_1?api_key=oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm&notify_self`);

const App = () => {
  const mapContainer = React.useRef(null)
  const [location, setLocation] = React.useState({})
  const [lnglat, setLnglat] = React.useState(defaultCenter)

  React.useEffect(() => {
    const map = new window.geolonia.Map({
      container: mapContainer.current,
      center: defaultCenter,
      zoom: 16,
      hash: true,
      style: mapStyle,
    })

    openReverseGeocoder(defaultCenter).then(res => {
      setLocation(res)
    }).catch(error => {
      // nothing to do
    })

    piesocket.onmessage = function(message) {
      const payload = JSON.parse(message.data);
      if (payload.center && payload.zoom) {
        map.flyTo({
          center: payload.center,
          zoom: payload.zoom
        });
      }
    }

    map.on('move', () => {
      const center = map.getCenter()
      const lnglat = Object.values(center) as number[]

      if (lnglat) {
        setLnglat(lnglat)
      }

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
