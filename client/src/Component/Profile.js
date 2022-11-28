import React, {useState} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import {useNavigate} from "react-router-dom";
import axios from 'axios'



function Profile(props) {
  const navigate = useNavigate();

  const ValidationTextField = styled(TextField)({
    "& input:valid + fieldset": {
      borderColor: "black",
      borderWidth: 2,
    },
    "& input:invalid + fieldset": {
      borderColor: "blue",
      borderWidth: 2,
    },
    "& input:valid:focus + fieldset": {
      borderLeftWidth: 2,
      padding: "4px !important", // override inline-style
    },
  });

  const StyledTableCell = styled(TableCell)({
    color: "#007AF5",
    fontWeight: "bold"
  });

  const handleCancel = (e) => {
    e.preventDefault()
    props.setShowProfile(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate("/mcc/io")
    const username = document.getElementById("name").value
    const description = document.getElementById("description").value
    const ticket = document.getElementById("ticket").value

    props.setUsername(username)
    props.setDescription(description)
    props.setTicket(ticket)
    props.setShowProfile(false)
    props.setProfileLoading(true)

    if (!props.currentFileName && props.currentFileName.length === 0){//make new file if no current file name
      axios.post("/createbook", {
        username,
        description,
        ticket,
      }).then((response) => {
        props.setCurrentFileName(response.data)
        props.setProfileLoading(false)
      })
    }
    else{//edit the current file name if already existed
      let filenamearr = props.currentFileName.split("_")
      let newFileName = filenamearr.at(-6) + "_" + filenamearr.at(-5) + "_" + filenamearr.at(-4) + "_"  + filenamearr.at(-3) + "_"  + filenamearr.at(-2) + "_" + filenamearr.at(-1)  
      if (ticket !== ""){
        newFileName = ticket + "_" + newFileName
      }
      if (description !== ""){
        newFileName = description + "_" + newFileName
      }
      if (username !== ""){
        newFileName = username + "_" + newFileName
      }
      axios.post("/renamebook", {
        "currentFileName": props.currentFileName,
        newFileName
      }).then((response) => {
        props.setCurrentFileName(response.data)
        props.setProfileLoading(false)

      })
    }
  }

  return (
    <Paper elevation={24} sx={{paddingTop: "1px", paddingBottom: "1em", width: "75%", margin: "1em auto 0 auto", background: "linear-gradient(to right bottom, #007FFF, #0059B2 120%)", color: "white"}}>
        <h2>MCC Sizing Model Version 1.4</h2>
        <p style={{marginLeft: '8vw', marginRight: '8vw'}}>This is the MCC Sizing Model which covers both Integrated and CUPS Architecture. 
          Please make sure to fill in all the required fields in order to use it. 
          Have at least 1 year worth of information in order to use the model. 
          Please email: whoever for any question.
        </p>
        <div>*This is an internal tool*</div>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <TableContainer component={Paper} sx={{margin: "auto", width: "80%", color: "#33EEff", marginTop: "1em", marginBottom: "1em"}}>
          <Table>
            <TableBody>
              <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                <StyledTableCell align="center">
                  Customer Name
                </StyledTableCell>
                <TableCell align="center">
                  <ValidationTextField
                    required
                    label="Required"
                    id="name"
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
              <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                <StyledTableCell align="center">
                  Description
                </StyledTableCell>
                <TableCell align="center">
                  <ValidationTextField
                    id="description"
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
              <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                <StyledTableCell align="center">
                  Related Ticket/REQS
                </StyledTableCell>
                <TableCell align="center">
                  <ValidationTextField
                    id="ticket"
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        {props.currentFileName && props.currentFileName.length !== 0 &&
          <Button  onClick={(e) => handleCancel(e)} color="primary" variant="contained">
            Cancel
          </Button>
        }
        <Button disabled={props.profileLoading} id="profileSubmitButton" type="submit" color="primary" variant="contained">
          Next
        </Button>
      </Box>
    </Paper>
  );
}

export default Profile;
