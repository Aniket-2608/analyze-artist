import React, { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setPlanningCellValue } from '../store/slices/planningSlice';
import { SKU, Store, Week } from '../types/models';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const Planning: React.FC = () => {
  const stores = useSelector((state: RootState) => state.stores.stores);
  const skus = useSelector((state: RootState) => state.skus.skus);
  const weeks = useSelector((state: RootState) => state.planning.weeks);
  const planningData = useSelector((state: RootState) => state.planning.planningData);
  const dispatch = useDispatch();

  const [columnDefs, setColumnDefs] = useState<any[]>([
    { field: 'storeLabel', headerName: 'Store', width: 200, sortable: true, filter: true, resizable: true, pinned: 'left' },
  ]);

  // Generate dynamic columns for weeks
  useMemo(() => {
    const weekColumns = weeks.map((week: Week) => ({
      field: week.id,
      headerName: week.id,
      width: 100,
      editable: true,
      type: 'numericColumn',
      valueParser: numberValueParser,
      cellClass: 'editable-cell',
      resizable: true,
    }));

    setColumnDefs([{ field: 'storeLabel', headerName: 'Store', width: 200, sortable: true, filter: true, resizable: true, pinned: 'left' }, ...weekColumns]);
  }, [weeks]);

  const numberValueParser = useCallback((params: any) => {
    return Number(params.newValue);
  }, []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
  }), []);

  const rowData = useMemo(() => {
    return stores.map((store: Store) => {
      const row: any = { storeLabel: store.label, storeId: store.id };
      weeks.forEach((week: Week) => {
        const cell = planningData.find(
          (cell) => cell.storeId === store.id && cell.weekId === week.id
        );
        row[week.id] = cell ? cell.salesUnits : 0;
      });
      return row;
    });
  }, [stores, weeks, planningData]);

  const onCellValueChanged = useCallback((event: any) => {
    const storeId = event.data.storeId;
    const weekId = event.colDef.field;
    const newValue = Number(event.value);

    if (storeId && weekId) {
      dispatch(setPlanningCellValue({ storeId, skuId: skus[0].id, weekId, salesUnits: newValue }));
    }
  }, [dispatch, skus]);

  return (
    <div className="container mx-auto max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>Planning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              defaultColDef={defaultColDef}
              onCellValueChanged={onCellValueChanged}
              rowSelection="single"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Planning;
