import React from 'react';

const Component = (props: any) => {
  const [weather, setWeather] = React.useState({} as any)

  React.useEffect(() => {
    const apikey = '11fff809b9d9816ab782cf1216951600'
    const lng = props.lnglat[0]
    const lat = props.lnglat[1]
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apikey}`
    fetch(api)
      .then(response => response.json())
      .then(data => {
        setWeather(data.weather[0].main)
      }).catch(error => {
        // nothing to do
      })
  }, [props.lnglat])

  const style = {

  }

  return (
    <>
      <div style={style}>{props.location.prefecture}{props.location.city} {weather}</div>
    </>
  );
}

export default Component;