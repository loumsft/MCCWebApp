import React from "react";
import { Box } from "@mui/system";
import InputTable from "./InputTable";
import CircularProgress from "@mui/material/CircularProgress";
import Output from "./Output";

function InputOutput(props) {
  const isEmpty = (obj) => {
    //check if object is empty
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  return (
    <Box
      component='form'
      noValidate
      autoComplete='off'
      onSubmit={props.handleSubmit}
      sx={{ paddingTop: "4em" }}
    >
      <InputTable
        handleChange={props.handleChange}
        currentFileName={props.currentFileName}
        {...props}
      />
      {isEmpty(props.outputData) ? ( //checks for empty outputData
        props.isOutputLoading && (
          <>
            <br />
            <CircularProgress />
            <br />
          </>
        )
      ) : (
        <Output {...props} />
      )}
      <br />
    </Box>
  );
}

export default InputOutput;
