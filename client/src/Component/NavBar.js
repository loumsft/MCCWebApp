import React from "react";
import {
  AppBar,
  Typography,
  Toolbar,
  useScrollTrigger,
  Slide,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TextField from "@mui/material/TextField";
import axios from 'axios'

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction='down' in={!trigger}>
      {children}
    </Slide>
  );
}


function NavBar(props) {
  const onClickProfileHandler = () => {
    props.setShowProfile(true);
  };

  React.useEffect(() => {
    // console.log(props.isImporting)

  }, [props.isImporting])

  const handleFileNameSubmit = (e) => {
    e.preventDefault()
    //need to rename the actual file
    axios.post('/renamebook', {
      currentFileName: props.currentFileName,
      newFileName: props.editingFileName
    }).then((response) => {
      props.setCurrentFileName(props.editingFileName)
      //no need to set editing filename cuse the file name hsa been edited onchange of textfield.
    })
  }
  
  return (
    <HideOnScroll {...props}>
      <AppBar>
        <Toolbar sx={{ justifyContent: "space-between", paddingRight: '0 !important' }}>
          <Typography align='center' variant='h6' component='div'>
            MCC WebApp
          </Typography>
          {props.currentFileName ? (
            <Typography sx={{width: '18em'}} variant='h6' component='div'>
              <form
                onSubmit={handleFileNameSubmit}
              >
                <TextField
                  fullWidth
                  
                  variant="standard"
                  required
                  InputProps={{//different from inputProps
                    disableUnderline: true,
                    sx:{
                      color: 'white',
                      fontSize: '1.25em',
                      
                    }
                  }}
                  inputProps={{
                    style: {
                    textAlign: 'center'
                  }}}
                  onBlur={(e) => props.setEditingFileName(props.currentFileName)} //on click away the file name goes back to the initial value.
                  onChange={(e) => props.setEditingFileName(e.target.value + '.xlsx')}
                  value={props.editingFileName.substring(0, props.editingFileName.lastIndexOf('.xlsx'))}
                />
              </form>
            </Typography>
          ) : (
            <CircularProgress style={{'color': 'white'}}/>
          )}
          {props.isImporting?
              <CircularProgress style={{'color': 'white'}}/>
            :
            <div>
              <Link to='/mcc/io'>
                <Button variant='outlined' sx={{ color: "white" }}>
                  I/O
                </Button>
              </Link>
              <Button
                variant='outlined'
                onClick={onClickProfileHandler}
                sx={{ color: "white" }}
              >
                <AccountCircleIcon />
              </Button>
              
                <Link to='/mcc/control' >
                  <Button variant='outlined' sx={{ color: "white" }} >
                      <SettingsIcon />
                  </Button>
                </Link>
              
              
            </div>
          }
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}

export default NavBar;
