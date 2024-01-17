import React from 'react';
import ws from './lib/ws'

import './App.scss';

declare global {
  interface Window {
    geolonia: any;
  }
}

const defaultCenter = [139.6917337, 35.6895014] as any

const App = () => {
  const mapContainer = React.useRef(null)

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
  }, [mapContainer])

  return (
    <div className="App">
      <div ref={mapContainer} className="map" data-geolocate-control="on" data-gesture-handling="off"></div>
    </div>
  );
}

export default App;
