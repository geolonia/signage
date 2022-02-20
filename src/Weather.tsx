import React from 'react';

const Component = (props: any) => {
  const [weather, setWeather] = React.useState("")

  React.useEffect(() => {
    const apikey = '11fff809b9d9816ab782cf1216951600'
    const lng = props.lnglat[0]
    const lat = props.lnglat[1]
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apikey}`
    fetch(api)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setWeather(data.weather[0].icon)
      }).catch(error => {
        // nothing to do
      })
  }, [props.lnglat])

  const icon = `http://openweathermap.org/img/wn/${weather}@4x.png`

  return (
    <>
      <div>
        <div className="weather"><img src={icon} /></div>
      </div>
    </>
  );
}

export default Component;