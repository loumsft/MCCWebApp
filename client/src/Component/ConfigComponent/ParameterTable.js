import React from 'react';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

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

function ParameterTable(props) {
  return (
    <TableContainer component={Paper} sx={{margin: "auto", width: "90%", marginTop: "1em"}}>
        <Table sx={{ minWidth: 650, maxWidth: 1127, margin: "auto" }}>
          <TableHead>
            <TableRow>
                <TableCell align="center" key="paramTitle">{props.paramsData[0].name}</TableCell>
                {props.paramsData[0].data.map((parameterName, index) => {
                    return <TableCell align="center" key={index}>{parameterName}</TableCell>
                })}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.paramsData.map((row, index) => {
                
                return (
                    index !== 0 &&
                        <>
                            <TableRow
                            key={row.id}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">
                                    {/* <ValidationTextField
                                    required
                                    id={row.id + "_0"}//year1 
                                    label="Required"
                                    onChange={(e) => props.handleChange(e, row.title)}
                                    variant="outlined"
                                    autoFocus={row.title === "Total number of sessions"}
                                    /> */}
                                    {row.data[0]}
                                </TableCell>
                                <TableCell align="right">
                                    {/* <ValidationTextField
                                    id={row.id + "_1"}//year2
                                    onChange={(e) => props.handleChange(e, row.title)}
                                    variant="outlined"
                                    /> */}
                                    {row.data[1]}
                                </TableCell>
                                <TableCell align="right">
                                    {/* <ValidationTextField
                                    id={row.id + "_2"}//year3
                                    onChange={(e) => props.handleChange(e, row.title)}
                                    variant="outlined"
                                    /> */}
                                    {row.data[2]}
                                </TableCell>
                                <TableCell align="right">
                                    {/* <ValidationTextField
                                    id={row.id + "_3"}//year4
                                    onChange={(e) => props.handleChange(e, row.title)}
                                    variant="outlined"
                                    /> */}
                                    {row.data[3]}
                                </TableCell>
                                <TableCell align="right">
                                    {/* <ValidationTextField
                                    id={row.id + "_4"}//year5
                                    onChange={(e) => props.handleChange(e, row.title)}
                                    variant="outlined"
                                    /> */}
                                    {row.data[4]}
                                </TableCell>
                                <TableCell align="right">
                                    {/* <ValidationTextField
                                    id={row.id + "_4"}//year5
                                    onChange={(e) => props.handleChange(e, row.title)}
                                    variant="outlined"
                                    /> */}
                                    {row.data[5]}
                                </TableCell>
                            </TableRow>
                        </>
                )
            }
                
            )}
          </TableBody>
        </Table>
      </TableContainer>
  )
}

export default ParameterTable