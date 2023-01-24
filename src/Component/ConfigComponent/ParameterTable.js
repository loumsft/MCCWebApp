import React, {useState} from "react";
import { useRef } from "react";
import { useDraggable } from "react-use-draggable-scroll";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import PacketSwitchMenuComponent from './PacketSwitchMenuComponent';

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
  const [disableAdd, setDisableAdd] = useState(false)
  const ref = useRef(); // We will use React useRef hook to reference the wrapping div:
  const { events } = useDraggable(ref); // Now we pass the reference to the useDraggable hook;

  const addCustomParameter = () => {
    props.paramsData.forEach((row, index) => {
      props.paramsData[index].data.push("")
    })
    props.setCurrServerData((prevServerData) => ({
      ...prevServerData,
      defaultCustomizedParams: props.paramsData
    }));
    setDisableAdd(true)
  }

  const onChange = (e, rowIndex, columnIndex) => {
    const newArray = props.paramsData
    newArray[rowIndex]['data'][columnIndex] = e.target.value
    props.setCurrServerData((prevServerData) => ({
      ...prevServerData,
      defaultCustomizedParams: newArray
    }))
  }

  return (
    <div style={{ display: "flex" }}>
      <TableContainer
        component={Paper}
        {...events}
        ref={ref}
        sx={{ margin: "auto", marginTop: "1em", overflow:"auto" }}
      >
        <Table sx={{ margin: "auto", width: "max-content"}}>
          <TableHead>
            <TableRow>
              <TableCell align='center' key='paramTitle' sx={{width: "10%"}}>
                {props.paramsData[0].name}
              </TableCell>
              {props.paramsData[0].data.map((parameterName, index) => {
                return (
                  <TableCell align='center' key={index} sx={{width: "10%"}}>
                    {index >= 4 ?(
                      <ValidationTextField
                        required
                        label='Required'
                        value={parameterName || ""}
                        onChange={(e) => onChange(e, 0, index)}
                        
                      />
                    ):
                      parameterName
                    }
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody sx={{overflow:"auto"}}>
            {props.paramsData.map((row, rowIndex) => {
              return (
                rowIndex !== 0 && (
                  <>
                    <TableRow
                      key={row.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component='th' scope='row' key={0} sx={{width: "10%"}}>
                        {row.name}
                      </TableCell>
                      {
                        row.data.map((element, colIndex) => {
                          return (
                            colIndex >= 4 ?( //num of defined parameters + title
                              <TableCell align='center' key={colIndex} sx={{width: "10%"}}>
                                {/* //TODO: fix the packet switching tech (PST) doesn't work atm because not sure how to add more dropdown usestate variables. */}
                                {rowIndex === 1? (
                                  <PacketSwitchMenuComponent
                                    onChange={onChange}
                                    colIndex={colIndex}
                                    element={element}
                                    rowIndex={rowIndex}
                                  />
                                ):(
                                  <ValidationTextField
                                    onChange={(e) => onChange(e, rowIndex, colIndex)}
                                    // variant="outlined"
                                    autoFocus={row.title === "Total number of sessions"}
                                    value={element || ""}
                                    // fullWidth
                                    
                                  />
                                )}
                              </TableCell>
                            ):(
                              <TableCell align='center' >
                                {element}
                              </TableCell>
                            )
                          )
                        })
                      }
                    </TableRow>
                  </>
                )
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant='contained'
        style={{
          flexDirection: "column",
          justifyContent: "flex-start",
          margin: "1.1em auto auto auto",
        }}
        onClick={addCustomParameter}
        disabled={disableAdd}
      >
        <AddCircleIcon />
      </Button>
    </div>
  );
}

export default ParameterTable;
