import "./App.css";
import MCC from "./Component/MCC";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Error from "./Component/Error";
// import TemporaryDrawer from './Component/TemporaryDrawer'
function App() {
  return (
    <div className='App'>
      <Routes>
        <Route exact path='/' element={<Navigate to='/mcc' replace />} />
        <Route path='/mcc/*' element={<MCC />} />
        <Route path='/404' element={<Error />} />
        <Route path='*' element={<Navigate replace to='/404' />} />
      </Routes>
    </div>
  );
}

export default App;
