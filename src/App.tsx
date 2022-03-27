import React from 'react';
import { openReverseGeocoder } from '@geolonia/open-reverse-geocoder'
import { Buffer } from 'buffer'
import ReconnectingWebSocket from 'reconnecting-websocket'

import './App.scss';

import Clock from './Clock';
import Weather from './Weather';

declare global {
  interface Window {
    geolonia: any;
  }
}

global.Buffer = Buffer;

const defaultCenter = [134.055369, 34.421371] as any

const piesocket = new ReconnectingWebSocket(`wss://demo.piesocket.com/v3/channel_1?api_key=oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm&notify_self`);

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
      style: "geolonia/basic",
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
          zoom: payload.zoom,
          bearing: payload.bearing,
          pitch: payload.pitch
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

    map.on('load', () => {
      const now = (new Date()).getTime();
      const r   = 0;// relative time: -36~+11
      const t1  = (new Date(now - now%(5*60*1000) + (r<0?r:(r?-1:0))*5*60*1000)).toISOString().slice(0,19).replace(/[^0-9]/g,"");
      const t2  = (r<0)?t1:(new Date(now - now%(5*60*1000) + r*5*60*1000)).toISOString().slice(0,19).replace(/[^0-9]/g,"");
      console.log(t1)
      console.log(t2)
      map.addSource('weather', {
        type: 'raster',
        tiles: [`https://www.jma.go.jp/bosai/jmatile/data/nowc/${t1}/none/${t2}/surf/hrpns/{z}/{x}/{y}.png`],
      })
      map.addLayer({
        id: 'weather',
        type: 'raster',
        source: 'weather',
        maxzoom: 8,
      }, 'oc-label-pref-ja')
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
