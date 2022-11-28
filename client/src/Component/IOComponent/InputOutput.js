import React from 'react'
import { Box } from "@mui/system";
import InputTable from "./InputTable";
import CircularProgress from "@mui/material/CircularProgress";
import Output from "./Output";

function InputOutput({handleSubmit, handleChange, currentFileName, setCurrentFileName, outputData, setoutputData, isOutputLoading, username, setUsername, ticket, setTicket, description, setDescription}) {
  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
      sx={{ paddingTop: "4em" }}
    >
      <InputTable handleChange={handleChange} currentFileName={currentFileName}/>
      {Object.keys(outputData).length === 0 && outputData.constructor === Object ? ( //checks for empty outputData
        isOutputLoading && (
          <>
            <br />
            <CircularProgress />
            <br/>
          </>
        )
      ) : (
        <Output outputData={outputData} setoutputData={setoutputData} currentFileName={currentFileName} 
          username={username} description={description} ticket={ticket}
          setUsername={setUsername} setDescription={setDescription} setTicket={setTicket}
          setCurrentFileName={setCurrentFileName}/>
      )}
      <br />
    </Box>
  )
}

export default InputOutput