import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Task, TransitionName, getLogger } from './ViewModel';

function TaskView({ entity, onEvent }: { entity: Task, onEvent: (eventName: TransitionName, data: any) => void }) {
  const logger = getLogger('task-view-list');
  logger(`component function invoked (vm:=${JSON.stringify(entity)})`);

  return (
    <Card sx={{ minWidth: 275, margin: '5px' }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
          {`task: ${entity.id}`}
        </Typography>
        <Typography variant='h5' component='div'>
          {entity.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size='small' onClick={() => onEvent('mark-complete', entity)} >complete</Button>
      </CardActions>
    </Card>
  );
}

export function TaskListView({ entities, onEvent }: { entities: Task[], onEvent: (eventName: TransitionName, data: any) => void }) { 
  let content = [<Typography variant='h5' component='div'>Tasks completed!</Typography>];

  if (entities.length > 0) {
    content = entities.map((entity) => {
      return <TaskView key={entity.id} entity={entity} onEvent={onEvent} />
    });
  }
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={5}>
        {content}
      </Grid>
    </Box>
  );
}