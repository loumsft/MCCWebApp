import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Typography from '@mui/material/Typography';
import Paper from "@mui/material/Paper";
import {useNavigate} from "react-router-dom";

export default function ControlSummary(props) {
  const [serverData, setserverData] = useState({});
  const [isLoadingControl, setisLoadingControl] = useState(true);
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  const [currServerData, setCurrServerData] = useState({}); //new server data based on changes made to the user REGARDLESS of whether they saved or cancel their edits.
  const navigate = useNavigate();
  const steps = ['Master Control (Settings for All Years)', 'User Plane Cluster Related Parameters'];

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    // const newActiveStep =
    //   isLastStep() && !allStepsCompleted()
    //     ? It's the last step, but not all steps have been completed,
    //       find the first step that has been completed
    //       steps.findIndex((step, i) => !(i in completed))
    //     : activeStep + 1;
    setActiveStep((activeStep + 1) % totalSteps());
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  // const handleComplete = () => {
  //   const newCompleted = completed;
  //   newCompleted[activeStep] = true;
  //   setCompleted(newCompleted);
  //   handleNext();
  // };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  useEffect(() => {
    //Load the control and summary page
    setisLoadingControl(true);
    if (props.currentFileName) {
      axios("/control/" + props.currentFileName, {
        method: "get",
      }).then((response) => {
        setserverData(response.data);
        setCurrServerData(response.data);
        setisLoadingControl(false);
      });
    }
  }, [props.currentFileName]);

  useEffect(() => {
    console.log(serverData)
  }, [serverData])
  

  const handleSave = (e) => {
    axios({
      method: "post",
      url: "/control/" + props.currentFileName,
      data: currServerData,
    }).then((response) => {
      props.handleSubmit(e);
      navigate('/mcc/io')
    });
  };
  
  const onChange = (e, activeStep, index) => {
    switch (activeStep){
      case 0: {
        const newArray = currServerData["masterControl"]
        newArray[index].data = e.target.value
        setCurrServerData((prevServerData) => ({
          ...prevServerData,
          "masterControl": newArray
        }));
        break;
      }
      case 1:{
        const newArray = currServerData["UPClusterRelatedParams"]
        newArray[index].data = e.target.value
        setCurrServerData((prevServerData) => ({
          ...prevServerData,
          "UPClusterRelatedParams": newArray
        }));
        break;
      }
      default:
        console.error("invalid step in updateServerData");
    }
    
  }

  // const handleSubmit = () => {
  //   return;
  // }
  
  const renderComponent = (activeStep) => {
    switch (activeStep){
      case 0:
        return (
          <>
            <Typography component="span" sx={{ mt: 2, mb: 1, py: 1 }}>
              {steps[activeStep]}
            </Typography>
            {currServerData["masterControl"].map((setting, index) => {
              return (
                <TextField
                  margin="dense"
                  id={setting.id}
                  key={index}
                  label={setting.name}
                  fullWidth
                  variant="standard"
                  defaultValue={setting.data}
                  onChange={(e) => onChange(e, activeStep, index)}
                />
              );
            })}
          </>
        );
      case 1:
        return (
          <>
            <Typography component="span" sx={{ mt: 2, mb: 1, py: 1 }}>
              {steps[activeStep]}
            </Typography>
            {currServerData["UPClusterRelatedParams"].map((setting, index) => {
              return (
                <TextField
                  margin="dense"
                  id={setting.id}
                  key={index}
                  label={setting.name}
                  disabled={setting.id!=="UPParams"}
                  fullWidth
                  variant="standard"
                  defaultValue={setting.data}
                  onChange={(e) => onChange(e, activeStep, index)}
                />
              );
            })}
          </>
        );
      case 2:
        // return (
        //   <>
        //     <Typography component="span" sx={{ mt: 2, mb: 1, py: 1 }}>
        //       {steps[activeStep]}
        //     </Typography>
        //     {currServerData["defaultCustomizedParams"].map((setting, index) => {
        //       return (
        //         <TextField
        //           margin="dense"
        //           id={setting.id}
        //           key={index}
        //           label={setting.name}
        //           fullWidth
        //           variant="standard"
        //           defaultValue={setting.data}
        //         />
        //       );
        //     })}
        //   </>
        // );
        break;
      default:
        return "Error Case Not Found";
    }
  }

  return (
    <Box sx={{ width: '80%', margin: "5em auto 0 auto" }}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      {isLoadingControl ? (
        <CircularProgress />
      ) : (
        allStepsCompleted() ? (
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
            <Paper
              sx={{ margin: "2em auto auto auto", width: "75%", padding: "1em 1em 1em 1em"}}
            >
              {activeStep === 0 && renderComponent(activeStep)} {/* Warning, renderCompoennt(activeStep) DOES NOT WORK as it will cause default values from one textfield to transfer over the other, a bug that should be reported to Material UI? */}
              {activeStep === 1 && renderComponent(activeStep)}
              {/* {renderComponent(activeStep)} */}
            </Paper>
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
              {/* {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography variant="caption" sx={{ display: 'inline-block' }}>
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (
                  <Button onClick={handleComplete}>
                    {completedSteps() === totalSteps() - 1
                      ? 'Finish'
                      : 'Complete Step'}
                  </Button>
                ))} */}
              <Button onClick={handleSave} sx={{ mr: 1 }}>
                Save
              </Button>
            </Box>
          </>
        ))
      }
    </Box>
  );
}