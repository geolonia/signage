import React from 'react';

const Component = (props: any) => {
  const [weather, setWeather] = React.useState("")

  const fetchWeather = (api: string) => {
    fetch(api)
      .then(response => response.json())
      .then(data => {
        setWeather(`http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`)
      }).catch(error => {
        // nothing to do
      })
  }

  React.useEffect(() => {
    const apikey = '11fff809b9d9816ab782cf1216951600'
    const lng = props.lnglat[0]
    const lat = props.lnglat[1]
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apikey}`

    fetchWeather(api)

    const timerID = setInterval(() => {
      fetchWeather(api)
    }, 3600000)

    return function cleanup() {
      clearInterval(timerID);
    };
  }, [props.lnglat])

  return (
    <>
      <div>
        <div className="weather"><img src={weather} /></div>
      </div>
    </>
  );
}

export default Component;