import "./App.css";
import MCC from "./Component/MCC";
import React, {useEffect} from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Error from "./Component/Error";
import useToken from './Component/LoginComponent/useToken';
import Header from './Component/LoginComponent/Header';
import Login from './Component/LoginComponent/Login';

function App() {
  const { token, removeToken, setToken } = useToken();

  return (
    <div className='App'>
      {!token && token!=="" &&token!== undefined?  
        <Login setToken={setToken} />
        :(
          <>
            <Routes>
              <Route exact path='/' element={<Navigate to='/mcc' replace />} />
              <Route path='/mcc/*' element={<MCC token={token}/>} />
              <Route path='/404' element={<Error />} />
              <Route path='*' element={<Navigate replace to='/404' />} />
            </Routes>
          </>
        )}
      <Header token={removeToken}/>
    </div>
  );
}

export default App;
