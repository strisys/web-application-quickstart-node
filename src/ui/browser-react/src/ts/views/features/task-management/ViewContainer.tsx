import React from 'react';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Grow from '@mui/material/Grow';
import { ViewModel, Task, TransitionName, getLogger } from './ViewModel';
import { CardListView } from './CardListView'

export function TasksViewContainer() {  
  const logger = getLogger('task-view-container');
  logger(`executing component function ...`);

  const create = (): ViewModel => {
    const vm = ViewModel.createNew((vm: ViewModel) => {
      logger(`setting view model component state (event:=${vm.transitionName}, vm:=${vm}) ...`);
      setVM(vm);
      setOpen(vm.isTransitionOneOf(['genisis', 'loading']));
    });

    vm.load();
    
    return vm;
  }

  const [vm, setVM] = React.useState(create);
  const [open, setOpen] = React.useState(true);

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
          <CardListView entities={vm.entities} onEvent={onEvent} />
        </div>
      </Grow>
    </React.Fragment>
  )
}

export default TasksViewContainer;
