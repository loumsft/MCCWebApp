import * as React from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { read } from 'xlsx';
import ImportInputHelper from './ImportInputHelper';
import ImportConfigHelper from './ImportConfigHelper';

function SimpleDialog(props) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  const handleImport = (e) => {
    //import excel sheet
    e.preventDefault();
    const files = e.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;
        if (sheets.length) {
          const inputTable = ImportInputHelper(wb, sheets)
          const configTable = ImportConfigHelper(wb, sheets)
          props.setIsNewProfile(false);
          props.setCurrentFileName(file.name);
          props.setEditingFileName(file.name)
          props.setIsImporting(true)
          props.setoutputData({})
          props.handleNext()
          axios.post("/import", { 
            fileName: file.name,
            inputTable: inputTable,
            configTable: configTable
          },{
            headers: {
              Authorization: 'Bearer ' + props.token
            }
          })
          .then((response) => {
            //set the input table from import response
            props.setInputTable(response.data.inputTable);
          })
          .then((response) => {
            props.setIsImporting(false);
            handleClose()
          });
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Import Sizing Model</DialogTitle>

      <Paper sx={{ margin: "auto" }}>
        <Button variant='contained' component='label'>
          Import
          <input
            type='file'
            hidden
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={(e) => {
              handleImport(e);
            }}
          />
        </Button>
      </Paper>
      <Button onClick={handleClose}>Close</Button>
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
      <Button variant='contained' onClick={handleClickOpen}>
        Import
      </Button>
      <SimpleDialog open={open} onClose={handleClose} {...props} />
    </>
  );
}
