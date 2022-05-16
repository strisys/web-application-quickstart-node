
import React from 'react';
import { PivotGrid, Field, CellClickEvent, CellPreparedEvent, createDataSource, deriveDataContext, setSelectedCellStyle } from '../shared/pivotgrid-util';
import { MasterViewModel, regionSortMap, getLogger } from './ViewModel';

const getStatusSortFn = (isRow: boolean) => (a: any, b: any): number => {
  const c1 = regionSortMap[a.value];
  const c2 = regionSortMap[b.value];

  if (isRow) {
    return ((c1 === c2) ? 0 : ((c1 > c2) ? 1 : -1)); 
  }

  return ((c1 === c2) ? 0 : ((c1 > c2) ? -1 : 1));
}

// https://js.devexpress.com/Documentation/ApiReference/Data_Layer/PivotGridDataSource/
const gridConfig: Array<Field> = [{
  caption: 'Region',
  width: 120,
  dataField: 'region',
  sortingMethod: getStatusSortFn(true),
  area: 'row',
  sortBySummaryField: 'Total',
}, {
  caption: 'City',
  dataField: 'city',
  width: 150,
  area: 'row',
}, {
  dataField: 'date',
  dataType: 'date',
  area: 'column',
}, {
  groupName: 'date',
  groupInterval: 'month',
  visible: false,
}, {
  caption: 'Total',
  dataField: 'amount',
  dataType: 'number',
  summaryType: 'sum',
  format: 'currency',
  area: 'data',
}];

export type EventType = ('loaded' | 'context-changed')

export function SalesEntryMasterGrid(props: { vm: MasterViewModel }) {  
  const logger = getLogger('sales-entry-master-pivotgrid-view');
  const { vm } = props;

  const onCellClick = (e: CellClickEvent) => {
    vm.context = deriveDataContext(setSelectedCellStyle(e));
  }

  const onCellPrepared = (e: CellPreparedEvent) => {
    // logger(e);
  }

  if ((!vm) || (!vm.result)) {
    return null;
  }

  logger(`component function invoked (data:=${vm.result.data.length})`);
  console.log(vm.result.data);

  const grid = (
	  <PivotGrid id={`sales-master-pivotgrid`} style={{ width: '100%' }}
	             dataSource={createDataSource(gridConfig, vm.result.data)}
	             onCellClick={onCellClick}
	             onCellPrepared={onCellPrepared}
	             allowSortingBySummary={true}
	             allowSorting={false}
	             allowFiltering={false}
	             allowExpandAll={false}
	             showBorders={true}
	             showColumnTotals={false}
	             showRowGrandTotals={false}
	             showColumnGrandTotals={false}
	             rowHeaderLayout={'tree'}>
	  </PivotGrid>
  )

  return (
    <React.Fragment>
      {grid}
    </React.Fragment>    
  );
}