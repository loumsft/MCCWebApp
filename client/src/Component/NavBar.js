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
    console.log(props.isImporting)

  }, [props.isImporting])
  
  return (
    <HideOnScroll {...props}>
      <AppBar>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography edge='start' variant='h6' component='div'>
            MCC WebApp
          </Typography>
          {props.currentFileName ? (
            <Typography edge='start' variant='h6' component='div'>
              {props.currentFileName.substring(0, props.currentFileName.lastIndexOf('.xlsx'))}
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
