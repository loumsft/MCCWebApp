import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import {inputRows} from './inputRows';

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



function InputTable(props) {
  
  const setInputValue = (rowDataArr, index) => {
    if (rowDataArr && rowDataArr[index]){
      return rowDataArr[index]
    }
    return ""
  }
  
  return (
    <div>
      <TableContainer
        component={Paper}
        sx={{ margin: "auto", width: "90%", marginTop: "1em" }}
      >
        <Table sx={{ minWidth: 650, maxWidth: 1127, margin: "auto" }}>
          <TableHead>
            <TableRow>
              <TableCell align='center'>Input</TableCell>
              <TableCell align='center'>Year 1</TableCell>
              <TableCell align='center'>Year 2</TableCell>
              <TableCell align='center'>Year 3</TableCell>
              <TableCell align='center'>Year 4</TableCell>
              <TableCell align='center'>Year 5</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inputRows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component='th' scope='row'>
                  {row.title}
                </TableCell>
                <TableCell align='right'>
                  <ValidationTextField
                    required
                    id={row.id + "_0"} //year1
                    label='Required'
                    onChange={(e) => props.handleChange(e, row.title)}
                    variant='outlined'
                    autoFocus={row.title === "Total number of sessions"}
                    value={setInputValue(props[row.id], 0)} //TODO: FOR DEMO PURPOSE, REMOVE ONCE DONE
                  />
                </TableCell>
                <TableCell align='right'>
                  <ValidationTextField
                    id={row.id + "_1"} //year2
                    onChange={(e) => props.handleChange(e, row.title)}
                    variant='outlined'
                    value={setInputValue(props[row.id], 1)} //TODO: FOR DEMO PURPOSE, REMOVE ONCE DONE
                  />
                </TableCell>
                <TableCell align='right'>
                  <ValidationTextField
                    id={row.id + "_2"} //year3
                    onChange={(e) => props.handleChange(e, row.title)}
                    variant='outlined'
                    value={setInputValue(props[row.id], 2)} //TODO: FOR DEMO PURPOSE, REMOVE ONCE DONE
                  />
                </TableCell>
                <TableCell align='right'>
                  <ValidationTextField
                    id={row.id + "_3"} //year4
                    onChange={(e) => props.handleChange(e, row.title)}
                    variant='outlined'
                    value={setInputValue(props[row.id], 3)} //TODO: FOR DEMO PURPOSE, REMOVE ONCE DONE
                  />
                </TableCell>
                <TableCell align='right'>
                  <ValidationTextField
                    id={row.id + "_4"} //year5
                    onChange={(e) => props.handleChange(e, row.title)}
                    variant='outlined'
                    value={setInputValue(props[row.id], 4)} //TODO: FOR DEMO PURPOSE, REMOVE ONCE DONE
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* should use border or padding */}
      <br />
      <Button
        type='submit'
        color='primary'
        variant='contained'
        disabled={!props.currentFileName || props.currentFileName.length === 0}
      >
        Submit
      </Button>
    </div>
  );
}

export default InputTable;
