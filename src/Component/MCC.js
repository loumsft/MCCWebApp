import React, { useState, useEffect, useRef } from "react";
import NavBar from "./NavBarComponent/NavBar";
import Profile from "./ProfileComponent/Profile";
import ControlSummary from "./ConfigComponent/ControlSummary";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import InputTable from "./InputComponent/InputTable";
import Output from './OutputComponent/Output';
import DrawerProgressComponent from './NavBarComponent/DrawerProgressComponent';

export default function MCC(props) {

  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [ticket, setTicket] = useState();
  const [currentFileName, setCurrentFileName] = useState(""); // Also used as flag when user clicks back to edit filename
  const [editingFileName, setEditingFileName] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false)

  //DEMO PURPOSES
  const initialInputValues = {
    totalNumSessions: ["11000000","13000000","10000000","17000000","19000000",],
    totalTraffic: ["74", "140", "200", "400", "800"],
    numSites: ["2", "2", "2", "2", "2"],
    numCplane: ["2", "2", "2", "2", "2"],
    numUplane: ["2", "2", "2", "2", "2"],
  }

  //Input Table & Output Table related data
  // const initialInputValues = {
  //   totalNumSessions: ["","","","",""],
  //   totalTraffic: ["","","","",""],
  //   numSites: ["","","","",""],
  //   numCplane: ["","","","",""],
  //   numUplane: ["","","","",""],
  // }
  const [inputTable, setInputTable] = useState(initialInputValues)
  const [isNewProfile, setIsNewProfile] = React.useState(true)
  const [outputData, setoutputData] = useState({});
  const [isOutputLoading, setisOutputLoading] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);

  const didMount = useRef(false);




  const handleSubmit = (e) => {
    e.preventDefault();
    handleNext()
    setoutputData({});
    setisOutputLoading(true); //triggers the useeffect below regarding the isOutputLoading variable
  };

  const isEmpty = (obj) => {
    //check if object is empty
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  useEffect(() => {//handles when output is loading.
    //runs only if the output is loading.
    // Return early, if this is the first render:
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    if (isOutputLoading) {
      //ensures that we only fetch when condition of outputloading
      axios.post("/api/mcc/" + currentFileName, {
        totalNumSessions: inputTable.totalNumSessions,
        totalTraffic: inputTable.totalTraffic,
        numSites: inputTable.numSites,
        numCplane: inputTable.numCplane,
        numUplane: inputTable.numUplane,
      },{
        headers: {
          Authorization: 'Bearer ' + props.token
        }
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

  const handleInputUpdates = (e, row) => {
    const {name, value} = e.target
    const newArr = inputTable[name]
    newArr[e.target.dataset.key] = value
    setInputTable((prevState) => ({
      ...prevState,
      [name]: newArr,
    }))
  }

  const handleNext = () => {
    const newActiveStep = activeStep + 1;
    setActiveStep(newActiveStep);
  };

  // const getMenuProps = () => { //TODO: set props here.
  //   return {
  //     username,
  //     setUsername,
  //     description,
  //     ticket
  //   }
  // }

  const renderComponent = (activeStep) => { //TODO: Change name
    switch (activeStep) {
      case 0:
        return (
          <Profile 
            username={username}
            setUsername={setUsername}
            description={description}
            setDescription={setDescription}
            ticket={ticket}
            setTicket={setTicket}
            currentFileName={currentFileName}
            setCurrentFileName={setCurrentFileName}
            setEditingFileName={setEditingFileName}
            profileLoading={profileLoading}
            setProfileLoading={setProfileLoading}
            setIsImporting={setIsImporting}
            setInputTable={setInputTable}
            setoutputData={setoutputData}
            setIsNewProfile={setIsNewProfile}
            handleNext={handleNext}
            token={props.token}
          />
        )
      case 1:
        return (
          isImporting ?(
            <>
              <br/>
              <CircularProgress />
            </>
          ) : (
            <InputTable 
              handleSubmit={handleSubmit}
              currentFileName={currentFileName}
              inputTable={inputTable}
              handleInputUpdates={handleInputUpdates}
            />
          )
        )
      case 2:
        return (
          <ControlSummary 
            currentFileName={currentFileName}
            handleSubmit={handleSubmit}
            handleNext={handleNext}
            token={props.token}
          />
          
        )
      case 3:
        return (
          isEmpty(outputData) ? ( //checks for empty outputData
            isOutputLoading && (
              <>
                <br />
                <CircularProgress />
                <br />
              </>
            )
          ) : (
            <Output
              currentFileName={currentFileName}
              setCurrentFileName={setCurrentFileName}
              setEditingFileName={setEditingFileName}
              outputData={outputData}
              setoutputData={setoutputData}
              username={username}
              setUsername={setUsername}
              description={description}
              setDescription={setDescription}
              ticket={ticket}
              setTicket={setTicket}
              setActiveStep={setActiveStep}
              token={props.token}
            />
          )
          
        )
      default:
        return "Error Case Not Found";
    }
  }

  return (
    <>
      <NavBar
        currentFileName={currentFileName}
        setCurrentFileName={setCurrentFileName}
        editingFileName={editingFileName}
        setEditingFileName={setEditingFileName}
        isImporting={isImporting}
        isNewProfile={isNewProfile}
        setActiveStep={setActiveStep}
        token={props.token}
      />

      <DrawerProgressComponent 
        setActiveStep={setActiveStep}
        activeStep={activeStep} 
      />

      {renderComponent(activeStep)}
      
    </>
  );
}
