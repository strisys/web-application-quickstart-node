import React from 'react';
import { ViewModel, SalesEntryQueryResult, getLogger } from './ViewModel';


export function SalesEntryGrid(props: { result: SalesEntryQueryResult }) {  
  const logger = getLogger('sales-entry-view-grid');

  logger(`component function invoked (data:=${props.result.data.length})`);
  console.log(props.result.data);
  
  return (
    <React.Fragment>
      {`Sales data (${props.result.data.length} rows)`}
    </React.Fragment>
  );
}