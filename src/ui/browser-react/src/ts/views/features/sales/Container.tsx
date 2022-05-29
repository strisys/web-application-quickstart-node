import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Grow from '@mui/material/Grow';
import { styled } from '@mui/material/styles';
import { CenteredHorizontalFlexGrid } from '../../shared/layout/flex';
import { Theme } from '@mui/material/styles';
import { MasterViewModel, isBrowser, getLogger } from './ViewModel';
import { SalesEntryMasterGrid } from './GridMaster';
import { SalesEntryDetailGrid } from './GridDetail';
import { Link } from '@mui/material';

const RootGridBase = styled('div')(() => ({
  display: 'grid',
  margin: '15px 25px 0px 25px' ,
  gridTemplateColumns: '1fr',
  gridTemplateAreas: `'a' 
                      'd' 
                      'g'
                      'j'
                      'l'`,
  height: 'calc(100vh - 82px)',
  overflow: 'hidden'
}));

const topPanelHeight = ((isBrowser) ? '410' : '300');

const RootGrid = styled(RootGridBase)(() => ({
  gridTemplateRows: `0px ${topPanelHeight}px 1px auto 30px`,
}));

const MasterGrid = styled('div')(() => ({
  height: '100%',
  width: '100%',
  gridArea: 'd',
  overflow: 'auto',
}));

const CenterLineSection = styled('div')(({ theme }: { theme: Theme }) => ({
  display: 'grid',
  backgroundColor: theme.palette.secondary.dark,
  height: '100%',
  width: '100%',
  gridArea: 'g',
  opacity: .8,
}));

const DetailGrid = styled('div')(() => ({
  height: '100%',
  gridArea: 'j',
  overflowX: 'auto',
  padding: '2px 2px 2px 0px'
}));

const LicenseGrid = styled(CenteredHorizontalFlexGrid)(({theme}) => ({
  height: '100%',
  backgroundColor: theme.palette.secondary.dark,
  color: theme.palette.secondary.contrastText,
  display: 'flex',
  gridArea: 'l',
  padding: '2px 2px 2px 0px'
}));

export function SalesEntryContainer() {  
  const logger = getLogger('sales-entry-view-container');

  const create = (): MasterViewModel => {
    const vm = MasterViewModel.createNew((vm: MasterViewModel) => {
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
    <Grow in={true} timeout={1000}>
      <RootGrid id={'sales-root-section'}>
        <MasterGrid id={'sales-master-grid-section'}>
          <SalesEntryMasterGrid vm={vm} />
        </MasterGrid>
        <CenterLineSection id={'sales-center-line-section'} />
        <DetailGrid id={'sales-detail-grid-section'}>
          <SalesEntryDetailGrid vm={vm} />
        </DetailGrid>
        <LicenseGrid>
          <Link href='https://js.devexpress.com/Licensing/' target='_blank' color='inherit'>{'DevExpress DevExtreme License'}</Link>
        </LicenseGrid>
      </RootGrid>
    </Grow>
  );
}

export default SalesEntryContainer;
