import React from 'react';
import { openReverseGeocoder } from '@geolonia/open-reverse-geocoder'
import ws from './lib/ws'

import './App.scss';

import QRCode from './qr-code';

declare global {
  interface Window {
    geolonia: any;
  }
}

const defaultCenter = [139.6917337, 35.6895014] as any

const App = () => {
  const mapContainer = React.useRef(null)
  const [city, setCity] = React.useState('')

  React.useEffect(() => {
    ws.addEventListener('open', () => {
      console.log('WebSocket opened')
      ws.send(JSON.stringify({
        action: "subscribe",
        channel: "signage"
      }));
    })

    ws.addEventListener('error', () => {
      console.log('WebSocket error')
    })

    ws.addEventListener('close', () => {
      console.log('WebSocket closed')
    })

    const map = new window.geolonia.Map({
      container: mapContainer.current,
      center: defaultCenter,
      zoom: 10,
      // hash: true,
      style: "geolonia/gsi",
    })

    openReverseGeocoder(defaultCenter).then(res => {
      setCity(`${res.prefecture}${res.city}`)
    }).catch(error => {
      // nothing to do
    })

    map.on('load', () => {
      const ss = new window.geolonia.simpleStyle({
        "type": "FeatureCollection",
        "features": []
      }, { id: 'geojson' }).addTo(map)

      ws.addEventListener('message', (message) => {
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

          if (payload.geojson) {
            ss.updateData(payload.geojson)
          }
        }
      })
    })

    map.on('move', () => {
      const center = map.getCenter()
      const lnglat = Object.values(center) as number[]

      // @ts-ignore
      openReverseGeocoder(lnglat).then(res => {
        setCity(`${res.prefecture}${res.city}`)
      }).catch(error => {
        // nothing to do
      })
    })
  }, [mapContainer])

  return (
    <div className="App">
      <div ref={mapContainer} className="map" data-navigation-control="off" data-gesture-handling="off"></div>
      <div>
        <div className="location-container">{city}</div>
        <div className="qrcode-container"><QRCode /></div>
      </div>
    </div>
  );
}

export default App;
