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
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

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
  const drawerWidth = 180;

  const onClickProfileHandler = () => {
    props.setActiveStep(0)
  };

  const handleFileNameSubmit = (e) => {
    e.preventDefault()
    //need to rename the actual file
    axios.post('/api/renamebook', {
      currentFileName: props.currentFileName,
      newFileName: props.editingFileName
    }, {
      headers: {
        Authorization: 'Bearer ' + props.token
      }
    }).then((response) => {
      props.setCurrentFileName(props.editingFileName)
      //no need to set editing filename cuse the file name hsa been edited onchange of textfield.
    })
  }
  
  return (
    <HideOnScroll {...props}>
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar sx={{ justifyContent: "center" }}>
          {props.currentFileName ? (
            <Typography sx={{width: '18em'}} variant='h7' component='div'>
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
                      
                    },
                    inputProps:{
                      style: {
                      textAlign: 'center'
                      }
                    }
                  }}
                  
                  onBlur={(e) => props.setEditingFileName(props.currentFileName)} //on click away the file name goes back to the initial value.
                  onChange={(e) => props.setEditingFileName(e.target.value + '.xlsx')}
                  value={props.editingFileName.substring(0, props.editingFileName.lastIndexOf('.xlsx'))}
                />
              </form>
            </Typography>
          ) : (
            props.isNewProfile ? (
              <Typography><i>Please add the new profile down below</i></Typography>
            ): (
              <CircularProgress style={{'color': 'white'}}/>
            )
          )}
          {props.isImporting?
              <CircularProgress style={{'color': 'white'}}/>
            :
            <div>
            </div>
          }
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}

export default NavBar;
