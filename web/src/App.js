import React, { useEffect, useState } from 'react';
import MenuNavbar from './MenuNavbar';
import io from 'socket.io-client';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:3000`);
    setSocket(newSocket);

    newSocket.emit('teste', {teste: 'oi, tudo bom?'});

    return () => newSocket.close();
  }, [setSocket]);


  return (
    <div className="App">
      <MenuNavbar socket={socket}/>
    </div>
  );
}

export default App;
