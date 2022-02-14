import React from 'react';

const Component = () => {
  const [clock, setClock] = React.useState(new Date())

  React.useEffect(() => {
    const timerID = setInterval( () => tick(), 1000 );

    return function cleanup() {
      clearInterval(timerID);
    };
  });
  
  const tick = () => {
    setClock(new Date());
  }

  return (
    <>
      <div className="time">{clock.toLocaleTimeString().replace(/\:[0-9]{2}$/, '')}</div>
      <div className="date"></div>
    </>
  );
}

export default Component;