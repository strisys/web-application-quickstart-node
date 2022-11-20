import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Grow from '@mui/material/Grow';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { CenteredVerticalFlexGrid } from '../../shared/layout/flex';
import { ViewModel, TransitionName, getLogger, isBrowser } from './ViewModel';
import { DataViewDetailGrid } from './DataViewerDetailGrid'

const logger = getLogger(`view-container`);

const RootGridBase = styled('div')(() => ({
  display: 'grid',
  margin: '5px 5px 5px 5px' ,
  gridTemplateColumns: '1fr',
  gridTemplateAreas: `'a' 
                      'd'
                      'g'`,
  height: 'calc(100vh - 82px)',
  overflow: 'hidden',
}));

const topPanelHeight = ((isBrowser) ? '85' : '85');

const RootGrid = styled(RootGridBase)(() => ({
  gridTemplateRows: `0px ${topPanelHeight}px auto`,
}));

const TopSection = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row-reverse',
  height: '100%',
  width: '100%',
  gridArea: 'd',
  background: 'transparent',
  padding: '10px 30px 0px 0px'
}));

const DataSection = styled('div')(() => ({
  height: '100%',
  width: '100%',
  gridArea: 'g',
  overflow: 'auto',
  background: 'transparent'
}));

const DataDisplaySection = styled('div')(() => ({
  height: '100%',
  width: '100%',
  padding: '100px',
}));

const JsonSection = styled(DataDisplaySection)(() => ({
  padding: '100px',
}));

const DataGridSection = styled(DataDisplaySection)(() => ({
  padding: '50px',
}));

type DataViewerSelectProps = { vm: ViewModel };

export function DataViewerSelect( {vm}: DataViewerSelectProps) {  
    const handleChange = (e: SelectChangeEvent<string>) => {
      vm.setCurrent(e.target.value);
    };

    const menuItems = vm.details.map((state) => {
      return (
        <MenuItem key={state.id} value={state.id}>
          {state.id}
        </MenuItem>
      );
    })

    return (
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id='dataset-select-label'>Datasets</InputLabel>
        <Select labelId='dataset-select-label' id='dataset-select' value={vm.current.id} label='datasets' onChange={handleChange}>
          {menuItems}
        </Select>
      </FormControl>
  )
}

export function DataViewerViewContainer() {  
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

  if (open) {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color='inherit' />
      </Backdrop>
    )
  }

  const dataViewer = ((Array.isArray(vm.current.data)) ? <DataGridSection><DataViewDetailGrid vm={vm} /></DataGridSection> : <JsonSection><Typography variant="body1" id='data-text'>{JSON.stringify(vm.current.data)}</Typography></JsonSection>);

  return (
    <>
      <Grow in={true} timeout={1000}>
        <RootGrid>
          <TopSection>
            <DataViewerSelect vm={vm} />
          </TopSection>
          <DataSection>
            <CenteredVerticalFlexGrid>
              {dataViewer}
            </CenteredVerticalFlexGrid>
          </DataSection>
        </RootGrid>
      </Grow>
    </>
  )
}
