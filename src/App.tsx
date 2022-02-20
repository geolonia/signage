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

const App = () => {
  const mapContainer = React.useRef(null)
  const [location, setLocation] = React.useState({})
  const [lnglat, setLnglat] = React.useState([0, 0])

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

    map.on('move', () => {
      const center = map.getCenter()
      const lnglat = Object.values(center) as number[]

      setLnglat(lnglat)

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
