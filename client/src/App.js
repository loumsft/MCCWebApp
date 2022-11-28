import "./App.css";
import NewMCC from "./Component/NewMCC";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Error from "./Component/Error"

function App() {

  return (
    <div className="App">
      <Routes>
        <Route
          exact
          path="/"
          element={<Navigate to="/mcc" replace/>}
        />
        <Route path="/mcc/*" element={<NewMCC/>}/>
        <Route path="/404" element={<Error/>} />
        <Route path="*" element={<Navigate replace to="/404" />} />
      </Routes>
    </div>
  );
}

export default App;
