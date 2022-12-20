import React, { useState, useEffect, useRef } from "react";
import NavBar from "./NavBar";
import Profile from "./ProfileComponent/Profile";
import { Routes, Route } from "react-router-dom";
import InputOutput from "./IOComponent/InputOutput";
import ControlSummary from "./ConfigComponent/ControlSummary";
import axios from "axios";

export default function NewMCC(props) {
  const [username, setUsername] = useState(""); //TODO: Set to ""
  const [description, setDescription] = useState("");
  const [ticket, setTicket] = useState();
  const [showProfile, setShowProfile] = useState(true); //TODO: set true
  const [currentFileName, setCurrentFileName] = useState(""); // Also used as flag when user clicks back to edit filename
  const [editingFileName, setEditingFileName] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const [isImporting, setIsImporting] = useState(false)

  //DEMO PURPOSES
  // const initialInputValues = {
  //   totalNumSessions: ["11000000","13000000","10000000","17000000","19000000",],
  //   totalTraffic: ["74", "84", "94", "84", "100"],
  //   numSites: ["2", "2", "2", "2", "2"],
  //   numCplane: ["2", "2", "2", "2", "2"],
  //   numUplane: ["2", "2", "2", "2", "2"],
  // }

  //Input Table & Output Table related data
  const initialInputValues = {
    totalNumSessions: ["","","","",""],
    totalTraffic: ["","","","",""],
    numSites: ["","","","",""],
    numCplane: ["","","","",""],
    numUplane: ["","","","",""],
  }
  const [inputTable, setInputTable] = useState(initialInputValues)

  const [outputData, setoutputData] = useState({}); //TODO: set empty obj
  const [isOutputLoading, setisOutputLoading] = useState(false); //TODO: set false
  
  const didMount = useRef(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setoutputData({});
    setisOutputLoading(true); //triggers the useeffect below regarding the isOutputLoading variable
  };

  useEffect(() => {
    //runs only if the output is loading.
    // Return early, if this is the first render:
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    if (isOutputLoading) {
      //ensures that we only fetch when condition of outputloading
      axios.post("/mcc/" + currentFileName, {
        totalNumSessions: inputTable.totalNumSessions,
        totalTraffic: inputTable.totalTraffic,
        numSites: inputTable.numSites,
        numCplane: inputTable.numCplane,
        numUplane: inputTable.numUplane,
      }).then((response) => {
        setoutputData(response.data);
        setisOutputLoading(false);
      });
    }
  }, [isOutputLoading]);

  useEffect(() => {//testing inputtable
    // console.log(inputTable)

  }, [inputTable])
  
  useEffect(() => {//testing filename
    // console.log(currentFileName, editingFileName)

  }, [currentFileName])

  const handleChangeNew = (e, row) => {
    const {name, value} = e.target
    const newArr = inputTable[name]
    newArr[e.target.dataset.key] = value
    setInputTable((prevState) => ({
      ...prevState,
      [name]: newArr,
    }))
  }

  return (
    <>
      {showProfile ? (
        <Profile
          username={username}
          setUsername={setUsername}
          description={description}
          setDescription={setDescription}
          ticket={ticket}
          setTicket={setTicket}
          setShowProfile={setShowProfile}
          currentFileName={currentFileName}
          setCurrentFileName={setCurrentFileName}
          setEditingFileName={setEditingFileName}
          profileLoading={profileLoading}
          setProfileLoading={setProfileLoading}
          setIsImporting={setIsImporting}
          setInputTable={setInputTable}
          setoutputData={setoutputData}
        />
      ) : (
        <>
          <NavBar
            currentFileName={currentFileName}
            setCurrentFileName={setCurrentFileName}
            editingFileName={editingFileName}
            setEditingFileName={setEditingFileName}
            handleSubmit={handleSubmit}
            setShowProfile={setShowProfile}
            isImporting={isImporting}

          />
          <Routes>
            <Route
              path='/io'
              element={
                <InputOutput
                  handleSubmit={handleSubmit}
                  currentFileName={currentFileName}
                  setCurrentFileName={setCurrentFileName}
                  setEditingFileName={setEditingFileName}
                  outputData={outputData}
                  setoutputData={setoutputData}
                  isOutputLoading={isOutputLoading}
                  username={username}
                  setUsername={setUsername}
                  description={description}
                  setDescription={setDescription}
                  ticket={ticket}
                  setTicket={setTicket}
                  isImporting={isImporting}
                  inputTable={inputTable}
                  handleChangeNew={handleChangeNew}
                />
              }
            />
            <Route
              path='/control'
              element={
                <ControlSummary
                  currentFileName={currentFileName}
                  handleSubmit={handleSubmit}
                />
              }
            />
          </Routes>
        </>
      )}
    </>
  );
}
