import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Grow from '@mui/material/Grow';
import { ViewModel, Task, TransitionName, getLogger } from './ViewModel';

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

function TaskListView({ entities, onEvent }: { entities: Task[], onEvent: (eventName: TransitionName, data: any) => void }) { 
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

export function TasksViewContainer() {  
  const logger = getLogger('task-view-container');

  const create = (): ViewModel => {
    const vm = new ViewModel((vm: ViewModel) => {
      logger(`setting view model component state (event:=${vm.transitionName}, vm:=${vm}) ...`);
      setVM(vm);
      setOpen(vm.isTransitionOneOf(['start', 'loading']));
    });

    vm.load();
    
    return vm;
  }

  const [vm, setVM] = React.useState(create);
  const [open, setOpen] = React.useState(true);

  logger(`component function invoked (vm:=${vm})`);

  const onEvent = (eventName: TransitionName, data: any) => {
    if (eventName === 'mark-complete') {
      vm.markComplete(data as Task);
    }
  }

  if (open) {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color='inherit' />
      </Backdrop>
    )
  }

  return (
    <React.Fragment>
      <Button onClick={vm.tickle}>Tickle</Button>

      <Grow in={true} timeout={1000}>
        <div style={{ margin: 50 }}>
          <TaskListView entities={vm.entities} onEvent={onEvent} />
        </div>
      </Grow>
    </React.Fragment>
  );
}

export default TasksViewContainer;
