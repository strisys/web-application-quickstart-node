import React from 'react';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Grow from '@mui/material/Grow';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';
import { AddTaskFormDialog, DialogResultValue } from './AddTaskDialog';
import AddIcon from '@mui/icons-material/Add';
import { ViewModel, Task, TransitionName, getLogger } from './ViewModel';
import { CardListView } from './CardListView'

const logger = getLogger(`view-container`);

const fabStyle = {
  position: 'absolute',
  bottom: 20,
  right: 20,
};

const triggerButtonStyle = {
  position: 'absolute',
  bottom: 20,
  left: 20,
  fontSize: '7px',
};

export function TasksViewContainer() {  
  logger(`executing component function ...`);

  const create = (): ViewModel => {
    const setState = (vm: ViewModel) => {
      logger(`setting view model component state (event:=${vm.transitionName}, vm:=${vm}) ...`);
      setVM(vm);
      setOpen(vm.isTransitionOneOf('genesis', 'loading'));
    };

    const vm = ViewModel.createNew(setState);
    vm.load();
    
    return vm;
  }

  const [vm, setVM] = React.useState(create);
  const [open, setOpen] = React.useState(true);
  const [entity, setEntity] = React.useState<Task>();

  const onEvent = async (eventName: TransitionName, data: any = null): Promise<void> => {
    if (eventName === 'mark-complete') {
      await vm.markComplete(data as Task);
    }

    if (eventName === 'add-task') {
      setEntity(new Task());
    }
  }

  const onEditDialogClose = async (result: DialogResultValue, state?: Task): Promise<void> => {
    if (result === 'submit') {
      await vm.post(state);
    }
    
    setEntity(null);
  }

  if (open) {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color='inherit' />
      </Backdrop>
    )
  }

  return (
    <>
      <Grow in={true} timeout={1000}>
        <div style={{ margin: 50 }}>
          <CardListView entities={vm.entities} onEvent={onEvent} />
        </div>
      </Grow>
      <Fab sx={fabStyle} onClick={() => onEvent('add-task')} aria-label={'add'} color={'primary'}>
        <AddIcon  />
      </Fab>
      <Button sx={triggerButtonStyle} onClick={vm.tickle} aria-label={'debug render'}>{'debug render'}</Button>
      <AddTaskFormDialog open={(entity != null)} entity={entity} onClose={onEditDialogClose} />
    </>
  )
}
