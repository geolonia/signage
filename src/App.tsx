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
