import React from 'react';
import {
  Grid,
  GridColumn,
  GridProps,
  GridPageChangeEvent,
  GridFilterChangeEvent,
  GridSortChangeEvent,
} from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';

interface KendoGridProps<T> extends Omit<GridProps, 'data'> {
  data: T[];
  pageable?: boolean;
  pageSize?: number;
  filterable?: boolean;
  sortable?: boolean;
  gridHeight?: string | number;
  onRowClick?: (dataItem: T) => void;
  className?: string;
}

function KendoGrid<T>({
  data,
  pageable = true,
  pageSize = 10,
  filterable = true,
  sortable = true,
  gridHeight,
  onRowClick,
  children,
  className = '',
  ...props
}: KendoGridProps<T>) {
  const [dataState, setDataState] = React.useState({
    skip: 0,
    take: pageSize,
    sort: [],
    filter: {
      logic: 'and',
      filters: [],
    },
  });

  const processedData = process(data, dataState);

  const onPageChange = (e: GridPageChangeEvent) => {
    setDataState({
      ...dataState,
      skip: e.page.skip,
      take: e.page.take,
    });
  };

  const onFilterChange = (e: GridFilterChangeEvent) => {
    setDataState({
      ...dataState,
      filter: e.filter,
      skip: 0,
    });
  };

  const onSortChange = (e: GridSortChangeEvent) => {
    setDataState({
      ...dataState,
      sort: e.sort,
      skip: 0,
    });
  };

  const gridStyles = {
    height: gridHeight || 'auto',
  };

  return (
    <Grid
      style={gridStyles}
      data={processedData}
      pageable={pageable}
      filterable={filterable}
      sortable={sortable}
      onPageChange={onPageChange}
      onFilterChange={onFilterChange}
      onSortChange={onSortChange}
      total={data.length}
      skip={dataState.skip}
      take={dataState.take}
      onRowClick={onRowClick ? (e) => onRowClick(e.dataItem) : undefined}
      className={`border border-neutral-200 rounded-md ${className}`}
      {...props}
    >
      {children}
    </Grid>
  );
}

export default KendoGrid;