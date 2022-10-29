import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Fade from '@mui/material/Fade';
import { styled } from '@mui/material/styles';
import { MasterViewModel, ContextChangedEventData, KV, SalesEntryQueryResult, getLogger } from './ViewModel';
import { DataGrid, Sorting, LoadPanel, Paging, Pager, HeaderFilter, FilterPanel, Grouping, GroupPanel, StateStoring, Summary, TotalItem, Export, ColumnFixing  } from '../shared/grid-util';
import { CenteredVerticalFlexGrid } from '../../shared/layout/flex';
import { BackdropTypography } from '../../shared/typography';

export function SalesEntryDetailGrid(props: { vm: MasterViewModel }) {  
  const logger = getLogger('sales-entry-detail-grid-view');
  const { vm } = props;
  const [state, setState] = React.useState<ContextChangedEventData>(null);

  vm.registerContextChanged((state: ContextChangedEventData) => {
    setState(state);
  });

  const getRowData = (): any[] => {
    if (!state) {
      return [];
    }

    // TODO: Transform data
    return state.result.data;
  }
  
  if (!state) {
    return null;
  }

  if (state.isLoading)  {
    const RootGridLoading = styled('div')(({theme}) => ({
      backgroundColor: theme.palette.primary.dark,
      height: '100%',
    }));

    return (
      <RootGridLoading>
        <CenteredVerticalFlexGrid>
          <BackdropTypography>
            {'fetching data ...'}
          </BackdropTypography>
        </CenteredVerticalFlexGrid>
      </RootGridLoading>
    );
  }
  
  const RootGrid = styled('div')(() => ({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateAreas: `'b' 
                        'd'`,
    height: '100%',
    gridTemplateRows: `35px auto`,
  }));

  const BreadCrumbSection = styled(CenteredVerticalFlexGrid)(({theme}) => ({
    height: '100%',
    width: '100%',
    gridArea: 'b',
    padding: '5px 25px',
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
  }));

  const DetailGridSection = styled('div')(() => ({
    height: '100%',
    gridArea: 'd',
    overflow: 'auto',
  }));

  const suffix = ((vm.isDesktopMode) ? 'desktop' : 'mobile');
  const count = state.result.data.length;
  const filtering = (count > 10);
  const grouping = (count > 1);
  const totals = (count > 1);

  logger(`component function invoked (data:=${count})`);

  const dataGrid = (
    <DataGrid
      keyExpr='id'
      dataSource={getRowData()}
      // customizeColumns={customizeColumns}
      elementAttr ={{ id: `detail-datagrid-${suffix}` }}
      allowColumnResizing={true}
      allowColumnReordering={true}
      showColumnLines={vm.isDesktopMode}
      showRowLines={vm.isDesktopMode}
      showBorders={vm.isDesktopMode}
      rowAlternationEnabled={!vm.isDesktopMode}
      hoverStateEnabled={vm.isDesktopMode}
      selection={{ mode: 'single' }}
      // onRowClick={onRowClick}
      // onSelectionChanged={onRowSelectionChanged}
      // onInitialized={onGridInitialized}
      // onCellPrepared={onCellPrepared}
      cellHintEnabled={vm.isDesktopMode}
      columnAutoWidth={true}>
    <Sorting mode='multiple' />
    {/* <Scrolling mode='infinite' /> */}
    <ColumnFixing enabled={vm.isDesktopMode} />
    <HeaderFilter visible={filtering} />
    <FilterPanel visible={vm.isDesktopMode && filtering} />
    <GroupPanel visible={grouping} />
    <Grouping autoExpandAll={false} />
    <Paging enabled={true} defaultPageSize={25} defaultPageIndex={0} />
    <Pager showPageSizeSelector={true} allowedPageSizes={[25, 50]} showInfo={false} showNavigationButtons={true} />
    <LoadPanel enabled={false} height={'100%'} showIndicator={false} shading={false} shadingColor={'blue'} showPane={false} />
    <StateStoring enabled={vm.isDesktopMode} type='localStorage' storageKey={`detail-datagrid-state-storage-${suffix}-2`} />
    <Export enabled={vm.isDesktopMode} allowExportSelectedData={false} />
    {/* {totals && 
      <Summary>
        <TotalItem column='xxxx' summaryType='count' />
      </Summary>} */}
  </DataGrid>
  )

  const breadcrumbs = (
    <Fade in={true} timeout={700}>
      <Breadcrumbs>
        {Object.keys(state.context).map((k, index) => {
          return <Typography key={`context-${index}`} color='text.primary'>{state.context[k]}</Typography>
        })}
      </Breadcrumbs>
    </Fade>
  )

  return (
    <RootGrid id={'detail-root-section'}>
      <BreadCrumbSection id={'detail-breadcrumb-section'}>
        {breadcrumbs}
      </BreadCrumbSection>
      <DetailGridSection id={`detail-grid-section`}>
        {dataGrid}
      </DetailGridSection>
    </RootGrid>
  );
}