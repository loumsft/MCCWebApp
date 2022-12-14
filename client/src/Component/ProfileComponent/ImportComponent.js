import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Paper from "@mui/material/Paper";
import axios from 'axios';


function SimpleDialog(props) {
  const { onClose, open } = props;
  const fileInput = React.createRef();

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (e) => {//import excel sheet
    e.preventDefault();
    props.setShowProfile(false)
    props.setCurrentFileName(fileInput.current.files[0].name)
    props.setIsImporting(true)
    axios.get("/import",  {
      params: {fileName: fileInput.current.files[0].name}
    }).then((response, error) => {
      //set the input table from import response
      if (error) {
        console.error(error)
      }
      props.settotalNumSessions(response.data.inputTable.totalNumSessions)
      props.settotalTraffic(response.data.inputTable.totalTraffic)
      props.setnumSites(response.data.inputTable.numSites)
      props.setnumCplane(response.data.inputTable.numCplane)
      props.setnumUplane(response.data.inputTable.numUplane)
      return (response)
    }).then((response, error) => {
      if (error) {
        console.error(error)
      }
      props.setIsImporting(false)
    })
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Import Sizing Model</DialogTitle>
          
      <Paper sx={{margin: "auto"}}>
        <Button
          variant="contained"
          component="label"
        >
          Import
          <input
            type="file"
            hidden
            accept=".xlsx"
            ref={fileInput}
            onChange={(e) => {handleSubmit(e)}}
          />
        </Button>
      </Paper>
      <Button onClick={handleClose}>
        Close
      </Button>
    </Dialog>
  );
}

export default function ImportComponent(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen}>
        Import
      </Button>
      <SimpleDialog
        open={open}
        onClose={handleClose}
        {...props}
      />

    </>
  );
}
