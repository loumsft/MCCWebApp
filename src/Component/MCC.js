import React, { useState, useEffect, useRef } from "react";
import NavBar from "./NavBar";
import Profile from "./ProfileComponent/Profile";
import ControlSummary from "./ConfigComponent/ControlSummary";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import InputTable from "./InputComponent/InputTable";
import Output from './OutputComponent/Output';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';

export default function MCC(props) {
  const [username, setUsername] = useState(""); //TODO: Set to ""
  const [description, setDescription] = useState("");
  const [ticket, setTicket] = useState();
  const [currentFileName, setCurrentFileName] = useState(""); // Also used as flag when user clicks back to edit filename
  const [editingFileName, setEditingFileName] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const steps = ['User Profile', 'Input Table', 'Control & Summary', 'Output Table']
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
  const [isNewProfile, setIsNewProfile] = React.useState(true)
  const [outputData, setoutputData] = useState({}); //TODO: set empty obj
  const [isOutputLoading, setisOutputLoading] = useState(false); //TODO: set false
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  const didMount = useRef(false);

  const { window } = props;

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const drawerWidth = 240;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

  const container = window !== undefined ? () => window().document.body : undefined;

  useEffect(() => {//handles when output is loading.
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

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleCompleted = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const renderComponent = (activeStep) => {
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
        handleDrawerToggle={handleDrawerToggle}
        token={props.token}
      />

      {/* TODO: Make a component for this Drawer section. */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
        keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
        display: 'block',
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        <Toolbar/>
        <Divider/>
        <Stepper activeStep={activeStep} orientation="vertical" sx={{pl: "1em"}}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton color="inherit" onClick={handleStep(index)} sx={{
                "& .MuiStepLabel-labelContainer span": {
                  fontSize: "small"
              }
              }}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <Divider/>
        <Toolbar/>

      </Drawer>
      
      
      {allStepsCompleted() ? ( //TODO: show OutputTable
        <>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </>
      ) : (
        <>
          {renderComponent(activeStep)}
          {/* {activeStep === 1 && //if active step is not in profile page, use the back, next, reset buttons for moving between stepper.
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleNext} sx={{ mr: 1 }}>
              Next
            </Button>
            {activeStep !== steps.length &&
              (completed[activeStep] ? (
                <Typography variant="caption" sx={{ display: 'inline-block' }}>
                  Step {activeStep + 1} already completed
                </Typography>
              ) : (
                <Button onClick={handleCompleted}>
                  {completedSteps() === totalSteps() - 1
                    ? 'Finish'
                    : 'Complete Step'}
                </Button>
              ))}
          </Box>
          } */}
          
        </>
      )}
      
    </>
  );
}
