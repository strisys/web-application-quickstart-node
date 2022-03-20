import React from 'react';
import Grow from '@mui/material/Grow';
import { Typography } from '@mui/material';

export function FourOFourViewContainer() {  
  return (
    <React.Fragment>
      <Grow in={true} timeout={1000}>
        <div style={{ margin: 50 }}>
          <Typography>Air ball</Typography>
        </div>
      </Grow>
    </React.Fragment>
  );
}

export default FourOFourViewContainer;
