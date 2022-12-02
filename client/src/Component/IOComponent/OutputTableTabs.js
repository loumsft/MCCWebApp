import React, {useRef} from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function OutputTableTabs(props) {
  const { integratedRowsTotal, integratedRowsPerSite, cupsRowsCPPerSite, cupsRowsCPTotal, cupsRowsUPPerSite, cupsRowsUPTotal } = props;
  const focusRef = useRef();

  function TabPanel(props) {
    const { children, tableTab, index,  ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={tableTab !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {tableTab === index && (
          <Box sx={{ p: 3 }}>
            <Typography component="span">{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  const handleChange = (event, newValue) => {
    props.setTableTab(newValue);
  };

  return (
    <Box sx={{ width: "95%", margin: "auto" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={props.tableTab}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
          ref={focusRef}
        >
          <Tab label="Integrated Case"/>
          <Tab label="CUPS Case"/>
        </Tabs>
      </Box>
      <TabPanel tableTab={props.tableTab} index={0}>
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 650, maxWidth: 1127, margin: "auto" }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell><strong>Total</strong></TableCell>
                <TableCell>Year 1</TableCell>
                <TableCell>Year 2</TableCell>
                <TableCell>Year 3</TableCell>
                <TableCell>Year 4</TableCell>
                <TableCell>Year 5</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {integratedRowsTotal.map((row) => (
                <StyledTableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.data[0]}</TableCell>
                  <TableCell>{row.data[1]}</TableCell>
                  <TableCell>{row.data[2]}</TableCell>
                  <TableCell>{row.data[3]}</TableCell>
                  <TableCell>{row.data[4]}</TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <br/>
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 650, maxWidth: 1127, margin: "auto" }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell><strong>Per Site</strong></TableCell>
                <TableCell>Year 1</TableCell>
                <TableCell>Year 2</TableCell>
                <TableCell>Year 3</TableCell>
                <TableCell>Year 4</TableCell>
                <TableCell>Year 5</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {integratedRowsPerSite.map((row) => (
                <StyledTableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.data[0]}</TableCell>
                  <TableCell>{row.data[1]}</TableCell>
                  <TableCell>{row.data[2]}</TableCell>
                  <TableCell>{row.data[3]}</TableCell>
                  <TableCell>{row.data[4]}</TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </TabPanel>
      <TabPanel tableTab={props.tableTab} index={1}>
      <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 650, maxWidth: 1127, margin: "auto" }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell><strong>CP Total</strong> </TableCell>
                <TableCell>Year 1</TableCell>
                <TableCell>Year 2</TableCell>
                <TableCell>Year 3</TableCell>
                <TableCell>Year 4</TableCell>
                <TableCell>Year 5</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cupsRowsCPTotal.map((row) => (
                <StyledTableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.data[0]}</TableCell>
                  <TableCell>{row.data[1]}</TableCell>
                  <TableCell>{row.data[2]}</TableCell>
                  <TableCell>{row.data[3]}</TableCell>
                  <TableCell>{row.data[4]}</TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <br/>
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 650, maxWidth: 1127, margin: "auto" }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell> <strong>CP Per Site</strong> </TableCell>
                <TableCell>Year 1</TableCell>
                <TableCell>Year 2</TableCell>
                <TableCell>Year 3</TableCell>
                <TableCell>Year 4</TableCell>
                <TableCell>Year 5</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cupsRowsCPPerSite.map((row) => (
                <StyledTableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.data[0]}</TableCell>
                  <TableCell>{row.data[1]}</TableCell>
                  <TableCell>{row.data[2]}</TableCell>
                  <TableCell>{row.data[3]}</TableCell>
                  <TableCell>{row.data[4]}</TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <br/>
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 650, maxWidth: 1127, margin: "auto" }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell><strong>UP Total</strong></TableCell>
                <TableCell>Year 1</TableCell>
                <TableCell>Year 2</TableCell>
                <TableCell>Year 3</TableCell>
                <TableCell>Year 4</TableCell>
                <TableCell>Year 5</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cupsRowsUPTotal.map((row) => (
                <StyledTableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.data[0]}</TableCell>
                  <TableCell>{row.data[1]}</TableCell>
                  <TableCell>{row.data[2]}</TableCell>
                  <TableCell>{row.data[3]}</TableCell>
                  <TableCell>{row.data[4]}</TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <br/>
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 650, maxWidth: 1127, margin: "auto" }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell><strong>UP Per Site</strong> </TableCell>
                <TableCell>Year 1</TableCell>
                <TableCell>Year 2</TableCell>
                <TableCell>Year 3</TableCell>
                <TableCell>Year 4</TableCell>
                <TableCell>Year 5</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cupsRowsUPPerSite.map((row) => (
                <StyledTableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.data[0]}</TableCell>
                  <TableCell>{row.data[1]}</TableCell>
                  <TableCell>{row.data[2]}</TableCell>
                  <TableCell>{row.data[3]}</TableCell>
                  <TableCell>{row.data[4]}</TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </Box>
  );
}
