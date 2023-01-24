import React from 'react'
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';

function DrawerProgressComponent(props) {
  const steps = ['User Profile', 'Input Table', 'Control & Summary', 'Output Table']
  const drawerWidth = 240;
  const { window } = props;
  const container = window !== undefined ? () => window().document.body : undefined;

  const handleStep = (step) => () => {
    props.setActiveStep(step);
  };

  return (
    <Drawer
      container={container}
      variant="temporary"
      open={props.mobileOpen}
      onClose={props.handleDrawerToggle}
      ModalProps={{
      keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
      display: 'block',
      '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
    >
      <Toolbar/>
      <Divider/>
      <Stepper activeStep={props.activeStep} orientation="vertical" sx={{pl: "1em"}}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton color="inherit" onClick={handleStep(index)} sx={{
              "& .MuiStepLabel-labelContainer span": {
                fontSize: "small"
            }
            }}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <Divider/>
      <Toolbar/>
    </Drawer>
  )
}

export default DrawerProgressComponent