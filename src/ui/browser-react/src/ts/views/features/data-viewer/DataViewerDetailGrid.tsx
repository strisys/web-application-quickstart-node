import { styled } from '@mui/material/styles';
import { getLogger, ViewModel } from './ViewModel';
import { DataGrid, Sorting, LoadPanel, Paging, Pager, HeaderFilter, FilterPanel, Grouping, GroupPanel, StateStoring, Export, ColumnFixing  } from '../shared/grid-util';

const logger = getLogger('data-viewer-grid-view');

export function DataViewDetailGrid(props: { vm: ViewModel }) {  
  logger(`component function invoked ...`);
  const { vm } = props;

  if (!vm.current) {
    return null;
  }

  const getRowData = (): any[] => {
    return ((vm.current) ? vm.current.data : [])
  }
  
  const RootGrid = styled('div')(() => ({
    display: 'grid',
    gridTemplateAreas: `'d'`,
    height: '100%',
    width: '100%',
    backgroundColor: 'transparent'
  }));

  const DetailGridSection = styled('div')(() => ({
    height: '100%',
    width: '100%',
    gridArea: 'd',
    overflow: 'auto',
  }));

  const suffix = ((vm.isDesktopMode) ? 'desktop' : 'mobile');
  const count = vm.current.data.length;
  const filtering = (count > 10);
  const grouping = (count > 1);

  const dataGrid = (
    <DataGrid
      keyExpr='id'
      dataSource={getRowData()}
      elementAttr ={{ id: `detail-datagrid-${suffix}` }}
      allowColumnResizing={true}
      allowColumnReordering={true}
      showColumnLines={vm.isDesktopMode}
      showRowLines={vm.isDesktopMode}
      showBorders={vm.isDesktopMode}
      rowAlternationEnabled={!vm.isDesktopMode}
      hoverStateEnabled={vm.isDesktopMode}
      selection={{ mode: 'single' }}
      cellHintEnabled={vm.isDesktopMode}
      columnAutoWidth={true}>
    <Sorting mode='multiple' />
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
  </DataGrid>
  )

  return (
    <RootGrid id={'detail-root-section'}>
      <DetailGridSection id={`detail-grid-section`}>
        {dataGrid}
      </DetailGridSection>
    </RootGrid>
  );
}