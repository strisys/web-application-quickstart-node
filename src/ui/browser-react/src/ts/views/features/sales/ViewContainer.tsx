import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Grow from '@mui/material/Grow';
import { ViewModel, SalesEntryQueryResult, getLogger } from './ViewModel';
import { SalesEntryGrid } from './ViewGridMaster';

export function SalesEntryContainer() {  
  const logger = getLogger('sales-entry-view-container');

  const create = (): ViewModel => {
    const vm = ViewModel.createNew((vm: ViewModel) => {
      logger(`setting view model component state (transition:=${vm.transitionName}, vm:=${vm}) ...`);
      setVM(vm);
      setOpen(vm.isTransitionOneOf(['start', 'loading']));
    });

    vm.load();
    
    return vm;
  }

  const [vm, setVM] = React.useState(create);
  const [open, setOpen] = React.useState(true);

  logger(`component function invoked (vm:=${vm})`);

  if (open) {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color='inherit' />
      </Backdrop>
    )
  }

  return (
    <React.Fragment>
      <Grow in={true} timeout={1000}>
        <div style={{ margin: 50 }}>
          <SalesEntryGrid result={vm.result} />
        </div>
      </Grow>
    </React.Fragment>
  );
}

export default SalesEntryContainer;
