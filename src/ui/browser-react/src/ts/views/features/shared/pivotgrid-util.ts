import React from 'react';
import { PivotGrid } from 'devextreme-react';
import { CellClickEvent, CellPreparedEvent } from 'devextreme/ui/pivot_grid';
import PivotGridDataSource, { Field } from 'devextreme/ui/pivot_grid/data_source';
import { theme as apptheme } from '../../shared/theme-factory';
import { KV, getLogger } from 'model-client';
export { PivotGrid };
export type { CellClickEvent, CellPreparedEvent, Field, PivotGridDataSource };

const logger = getLogger('pivotgrid-util');

export const defaultSelectCellStyle = { 
  backgroundColor: apptheme.palette.primary.main, 
  color: apptheme.palette.primary.contrastText, 
  opacity: '.8'
};

export const createDataSource = (config: Array<Field>, data: Array<any>): PivotGridDataSource => {             
  return new PivotGridDataSource({
    fields: config,
    store: data,
  });
}

export const deriveDataContext = (e: CellClickEvent): KV => {
  const context: KV = {};

  const getColumnDataFieldName = (index: number) => {
    let dataField = e.columnFields[index].dataField;

    if (e.columnFields[index].groupInterval) {
      dataField = `${dataField}-${e.columnFields[index].groupInterval}`;
    }

    return dataField;
  }

  if (e.area === 'data') {
    for (let c = 0; (c < e.cell.columnPath.length); c++) {
      context[getColumnDataFieldName(c)] = e.cell.columnPath[c];
    }

    for (let r = 0; (r < e.cell.rowPath.length); r++) {
      context[e.rowFields[r].dataField] = e.cell.rowPath[r];
    }
  }

  if (e.area === 'row') {
    for(let r = 0; (r < e.cell.path.length); r++) {
      context[e.rowFields[r].dataField] = e.cell.path[r];
    }
  }

  if (e.area === 'column') {
    for(let c = 0; (c < e.cell.path.length); c++) {
      context[getColumnDataFieldName(c)] = e.cell.path[c];
    }
  }

  logger(`selected cell context: ${JSON.stringify(context)}`);
  return context;
}

let previousElement: HTMLElement = null;

export const setSelectedCellStyle = (e: CellClickEvent, style: KV = defaultSelectCellStyle): CellClickEvent => {
  if (previousElement) {
    Object.keys(style).forEach((k) => {
      previousElement.style[k] = e.cellElement.style[k];
    })
  }

  previousElement = e.cellElement;

  Object.keys(style).forEach((k) => {
    e.cellElement.style[k] = style[k];
  });

  return e;
}