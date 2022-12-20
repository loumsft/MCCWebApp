import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { inputRows } from "./inputRows";

export default function Session(props) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const newUsername = document.getElementById("username").value;
    const newDescription = document.getElementById("description").value;
    const newTicket = document.getElementById("ticket").value;
    props.setUsername(newUsername);
    props.setDescription(newDescription);
    props.setTicket(newTicket);
    // inputRows.forEach((row) => {//TODO: make clear all entries function
    //   console.log(document.getElementById(row.id+"_0"))
    //   document.getElementById(row.id + "_0").reset();
    //   document.getElementById(row.id + "_1").reset();
    //   document.getElementById(row.id + "_2").reset();
    //   document.getElementById(row.id + "_3").reset();
    //   document.getElementById(row.id + "_4").reset();
    // });
    axios({
      //asynchronously happens
      method: "get",
      url: "/createbook"
    }).then((response) => {
      props.setCurrentFileName(response.data);
      props.setoutputData({});
      setOpen(false);
    });
  };

  return (
    <div>
      <Button color='primary' variant='contained' onClick={handleClickOpen}>
        New Session
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll='body'
        sx={{ overflow: "auto" }}
      >
        <div>
          <DialogTitle>Create A New Session</DialogTitle>
          <DialogContent>
            <TextField
              margin='dense'
              id='username'
              // key={}
              label='Username'
              fullWidth
              variant='standard'
              defaultValue={props.username}
            />
            <TextField
              margin='dense'
              id='description'
              // key={}
              label='Description'
              fullWidth
              variant='standard'
              defaultValue={props.description}
            />
            <TextField
              margin='dense'
              id='ticket'
              // key={}
              label='Ticket'
              fullWidth
              variant='standard'
              defaultValue={props.ticket}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={(e) => handleChange(e)}>Save</Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
}
