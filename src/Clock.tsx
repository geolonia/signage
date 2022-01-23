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
    <>{clock.toLocaleTimeString()}</>
  );
}

export default Component;