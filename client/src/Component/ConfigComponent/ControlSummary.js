import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import ParameterTable from "./ParameterTable";

export default function ControlSummary(props) {
  const [serverData, setserverData] = useState({});
  const [isLoadingControl, setisLoadingControl] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  const [currServerData, setCurrServerData] = useState({}); //new server data based on changes made to the user REGARDLESS of whether they saved or cancel their edits.
  const navigate = useNavigate();
  const steps = [
    "Master Control (Settings for All Years)",
    "User Plane Cluster Related Parameters",
    "Defined & Customized Parameters",
  ];

  const [param, setParam] = useState("Custom2");
  const [isParamLoading, setIsParamLoading] = useState(true);
  const didMount = useRef(false);

  const totalSteps = () => {
    return steps.length;
  };

  const handleNext = () => {
    setActiveStep((activeStep + 1) % totalSteps());
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  useEffect(() => {
    //Load the control and summary page
    if (props.currentFileName && isLoadingControl) {
      axios("/control/" + props.currentFileName, {
        method: "get",
      }).then((response) => {
        setserverData(response.data);
        setCurrServerData(response.data);
        setisLoadingControl(false);
        setIsParamLoading(false);
      });
    }
  }, [isLoadingControl, props.currentFileName]);

  useEffect(() => {
    if (!didMount.current) {
      //NOTE: make sure this is the last useEffect that changes didMount.current
      didMount.current = true;
      return;
    }
    axios.post("/control/" + props.currentFileName, currServerData).then(() => {
      setisLoadingControl(true); //triggers the useeffect above to reload the control n summary page
    });
  }, [param]);

  useEffect(() => {
    console.log(currServerData)
  }, [currServerData])
  

  const handleSave = (e) => {
    axios({
      method: "post",
      url: "/control/" + props.currentFileName,
      data: currServerData,
    }).then((response) => {
      props.handleSubmit(e);
      navigate("/mcc/io");
    });
  };

  const onChange = (e, activeStep, index) => {
    switch (activeStep) {
      case 0: {
        const newArray = currServerData["masterControl"];
        newArray[index].data = e.target.value;
        setCurrServerData((prevServerData) => ({
          ...prevServerData,
          masterControl: newArray,
        }));
        break;
      }
      case 1: {
        const newArray = currServerData["UPClusterRelatedParams"];
        newArray[index].data = e.target.value;
        setCurrServerData((prevServerData) => ({
          ...prevServerData,
          UPClusterRelatedParams: newArray,
        }));
        break;
      }
      //TODO: MAKE EDIT CASE FOR CUSTOM PARAMETER TABLE
      default:
        console.error("invalid active step", activeStep);
    }
  };

  const handleParamChange = (e, activeStep, index) => {
    setIsParamLoading(true);
    setParam(e.target.value);
    onChange(e, activeStep, index);
  };

  const renderComponent = (activeStep) => {
    switch (activeStep) {
      case 0:
        return (
          <Paper
            sx={{
              margin: "2em auto auto auto",
              width: "75%",
              padding: "1em 1em 1em 1em",
            }}
          >
            <Typography component='span' sx={{ mt: 2, mb: 1, py: 1 }}>
              {steps[activeStep]}
            </Typography>
            {serverData["masterControl"].map((setting, index) => {
              return (
                <TextField
                  margin='dense'
                  id={setting.id}
                  key={index}
                  label={setting.name}
                  fullWidth
                  variant='standard'
                  defaultValue={setting.data}
                  onChange={(e) => onChange(e, activeStep, index)}
                />
              );
            })}
          </Paper>
        );
      case 1:
        return (
          <Paper
            sx={{
              margin: "2em auto auto auto",
              width: "75%",
              padding: "1em 1em 1em 1em",
            }}
          >
            <Typography component='span' sx={{ mt: 2, mb: 1, py: 1 }}>
              {steps[activeStep]}
            </Typography>
            {serverData["UPClusterRelatedParams"].map((setting, index) => {
              return setting.id === "UPParams" ? (
                <FormControl fullWidth variant='standard' key={index}>
                  <InputLabel id='parameter-label'>Parameter</InputLabel>
                  <Select
                    id='demo-simple-select-standard'
                    value={setting.data}
                    onChange={(e) => handleParamChange(e, activeStep, index)}
                  >
                    {setting.parameters.map((parameter, i) => {
                      return (
                        <MenuItem value={parameter} key={i}>
                          {parameter}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  margin='dense'
                  id={setting.id}
                  key={index}
                  label={setting.name}
                  disabled={setting.id !== "UPParams"}
                  fullWidth
                  variant='standard'
                  defaultValue={setting.data}
                />
              );
            })}
          </Paper>
        );
      case 2:
        return (
          <>
            <ParameterTable
              paramsData={currServerData['defaultCustomizedParams']}
              setCurrServerData={setCurrServerData}
            />
          </>
        );
      default:
        return "Error Case Not Found";
    }
  };

  return (
    <Box sx={{ width: "80%", margin: "5em auto 0 auto" }}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton color='inherit' onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      {isLoadingControl || isParamLoading ? (
        <CircularProgress />
      ) : (
        <>
          {/* {activeStep === 0 && renderComponent(activeStep)} Warning, renderCompoennt(activeStep) DOES NOT WORK as it will cause default values from one textfield to transfer over the other, a bug that should be reported to Material UI? */}
          {/* {activeStep === 1 && renderComponent(activeStep)} */}
          {/* {activeStep === 2 && renderComponent(activeStep)} */}

          {renderComponent(activeStep)}

          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              variant='contained'
              color='inherit'
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />

            <Button variant='contained' onClick={handleNext} sx={{ mr: 1 }}>
              Next
            </Button>
            <Button variant='contained' onClick={handleSave} sx={{ mr: 1 }}>
              Save
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
