import React, { useState, useEffect, useRef } from "react";
import NavBar from "./NavBar";
import Profile from "./Profile";
import { Routes, Route } from "react-router-dom";
import InputOutput from "./IOComponent/InputOutput";
import ControlSummary from "./ConfigComponent/ControlSummary";


export default function NewMCC(props) {
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [ticket, setTicket] = useState();
  const [showProfile, setShowProfile] = useState(true);//TODO: set true
  const [currentFileName, setCurrentFileName] = useState(""); // Also used as flag when user clicks back to edit filename
  const [profileLoading, setProfileLoading] = useState(false);

  //Input Table & Output Table related data
  const [totalNumSessions, settotalNumSessions] = useState(["","","","","",]);
  const [totalTraffic, settotalTraffic] = useState(["", "", "", "", ""]);
  const [numSites, setnumSites] = useState(["", "", "", "", ""]);
  const [numCplane, setnumCplane] = useState(["", "", "", "", ""]);
  const [numUplane, setnumUplane] = useState(["", "", "", "", ""]);
  const [outputData, setoutputData] = useState({});//TODO: set empty obj
  const [isOutputLoading, setisOutputLoading] = useState(false);//TODO: set false
  const didMount = useRef(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setoutputData({});
    setisOutputLoading(true);//triggers the useeffect below regarding the isOutputLoading variable
  };
  
  useEffect(() => { //runs only if the output is loading.
    // Return early, if this is the first render:
    if ( !didMount.current ) {
      didMount.current = true;
      return;
    }
    fetch("/mcc/" + currentFileName, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        totalNumSessions,
        totalTraffic,
        numSites,
        numCplane,
        numUplane,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setoutputData(data);
        setisOutputLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOutputLoading]);

  const handleChange = (e, row) => {
    const id = parseInt(e.target.id.split("_")[1]);
    let updateArray;
    switch (row) {
      case "Total number of sessions":
        updateArray = Array.from(totalNumSessions);
        updateArray[id] = e.target.value;
        settotalNumSessions(updateArray);
        break;
      case "Total traffic (Gbps)":
        updateArray = Array.from(totalTraffic);
        updateArray[id] = e.target.value;
        settotalTraffic(updateArray);

        break;
      case "Number of sites (For Integrated MCC)":
        updateArray = Array.from(numSites);
        updateArray[id] = e.target.value;
        setnumSites(updateArray);
        break;
      case "Number of C-plane sites":
        updateArray = Array.from(numCplane);
        updateArray[id] = e.target.value;
        setnumCplane(updateArray);
        break;

      case "Number of U-plane sites":
        updateArray = Array.from(numUplane);
        updateArray[id] = e.target.value;
        setnumUplane(updateArray);
        break;

      default:
        //error handling here
        console.error("unseen case: ", row);
    }
  };

  return (
    <>
      {showProfile? (
          <Profile
            setUsername={setUsername}
            setDescription={setDescription}
            setTicket={setTicket}
            setShowProfile={setShowProfile}
            currentFileName={currentFileName}
            setCurrentFileName={setCurrentFileName}
            profileLoading={profileLoading}
            setProfileLoading={setProfileLoading}
          />
      ) : (
        <>
          <NavBar currentFileName={currentFileName} handleSubmit={handleSubmit} setShowProfile={setShowProfile}/>
          <Routes>
            <Route path="/io" element={
              <InputOutput 
                handleSubmit={handleSubmit} handleChange={handleChange} currentFileName={currentFileName} setCurrentFileName={setCurrentFileName}
                outputData={outputData} setoutputData={setoutputData} isOutputLoading={isOutputLoading}
                username={username} setUsername={setUsername} description={description} setDescription={setDescription}
                ticket={ticket} setTicket={setTicket} 
              />}/>
            <Route path="/control" element={<ControlSummary currentFileName={currentFileName} handleSubmit={handleSubmit}/>}/>
          </Routes>
        </>
      )}
    </>
  );
}