import React from 'react';

const Component = (props: any) => {
//   const [clock, setClock] = React.useState(new Date())

//   React.useEffect(() => {
//     const timerID = setInterval( () => tick(), 1000 );

//     return function cleanup() {
//       clearInterval(timerID);
//     };
//   });
  
//   const tick = () => {
//     setClock(new Date());
//   }

  React.useEffect(() => {
    const apikey = '11fff809b9d9816ab782cf1216951600'
    const lng = props.lnglat[0]
    const lat = props.lnglat[1]
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apikey}`
    fetch(api)
      .then(response => response.json())
      .then(data => {
        console.log(data)
      });
    console.log(api)
  }, [props.lnglat])

  const style = {

  }

  return (
    <>
      <div style={style}>{props.location.prefecture}{props.location.city}</div>
    </>
  );
}

export default Component;