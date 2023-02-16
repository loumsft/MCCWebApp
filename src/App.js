import "./App.css";
import MCC from "./Component/MCC";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Error from "./Component/Error";
import useToken from './Component/LoginComponent/useToken';
import Header from './Component/LoginComponent/Header';
import Login from './Component/LoginComponent/Login';

function App() {
  const { token, removeToken, setToken } = useToken();
  const drawerWidth = 180;

  return (
    <div className='App'>
      {!token && token!=="" &&token!== undefined?  
        <Login setToken={setToken} />
        :(
          <div style={{
            width: `calc(100% - ${drawerWidth}px)`, 
            marginLeft: `${drawerWidth}px`
          }}>
            <Routes>
              <Route exact path='/' element={<MCC token={token}/>} />
              <Route path='/404' element={<Error />} />
              <Route path='*' element={<Navigate replace to='/404' />} />
            </Routes>
            <Header token={removeToken}/>
          </div>
        )
      }
      
    </div>
  );
}

export default App;
