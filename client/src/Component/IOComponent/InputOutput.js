import React from 'react'
import { Box } from "@mui/system";
import InputTable from "./InputTable";
import CircularProgress from "@mui/material/CircularProgress";
import Output from "./Output";

function InputOutput(props) {
  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={props.handleSubmit}
      sx={{ paddingTop: "4em" }}
    >
      <InputTable handleChange={props.handleChange} currentFileName={props.currentFileName}/>
      {Object.keys(props.outputData).length === 0 && props.outputData.constructor === Object ? ( //checks for empty outputData
        props.isOutputLoading && (
          <>
            <br />
            <CircularProgress />
            <br/>
          </>
        )
      ) : (
        <Output {...props}/>
      )}
      <br />
    </Box>
  )
}

export default InputOutput