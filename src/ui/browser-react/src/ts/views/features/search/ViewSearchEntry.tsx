import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { TransitionName, getLogger } from './ViewModel';

export function SearchEntryView({ onEvent }: { onEvent: (eventName: TransitionName, data: any) => void }) { 
  const logger = getLogger('search-entry-view');
  const content = <div/>
  
  logger(`executing component function ...`);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={5}>
        {content}
      </Grid>
    </Box>
  );
}