import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Task, TransitionName, getLogger } from './ViewModel';

function GridView({ entity, onEvent }: { entity: Task, onEvent: (eventName: TransitionName, data: any) => void }) {
  const logger = getLogger('task-view-list');
  logger(`component function invoked (vm:=${JSON.stringify(entity)})`);

  return (
    <div />
  );
}

export function GridListView({ entities, onEvent }: { entities: Task[], onEvent: (eventName: TransitionName, data: any) => void }) { 
  // if (entities.length > 0) {
  //   content = entities.map((entity) => {
  //     return <CardView key={entity.id} entity={entity} onEvent={onEvent} />
  //   });
  // }
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={5}>
        {`grid goes here`}
      </Grid>
    </Box>
  );
}