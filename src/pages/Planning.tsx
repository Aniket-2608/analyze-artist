
import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { 
  ColDef, 
  ValueFormatterParams, 
  ICellRendererParams, 
  CellClassParams 
} from 'ag-grid-community';

const Planning: React.FC = () => {
  const { stores, skus, weeks, planningData, setPlanningCellValue, calculateDerivedValues } = useData();
  const gridRef = useRef<AgGridReact>(null);

  // Create a lookup for SKU prices and costs
  const skuLookup = useMemo(() => {
    const lookup: Record<string, { price: number; cost: number }> = {};
    skus.forEach(sku => {
      lookup[sku.id] = { price: sku.price, cost: sku.cost };
    });
    return lookup;
  }, [skus]);

  // Group weeks by month
  const monthGroups = useMemo(() => {
    const groups: Record<string, string[]> = {};
    weeks.forEach(week => {
      if (!groups[week.month]) {
        groups[week.month] = [];
      }
      groups[week.month].push(week.id);
    });
    return groups;
  }, [weeks]);

  // Currency formatter
  const currencyFormatter = (params: ValueFormatterParams) => {
    const value = params.value || 0;
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Percentage formatter
  const percentFormatter = (params: ValueFormatterParams) => {
    const value = params.value || 0;
    return `${value.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
  };

  // GM Percentage Cell Styling
  const getGmPercentageCellClass = (params: CellClassParams) => {
    const value = params.value;
    if (value === undefined || value === null) return '';
    
    if (value >= 40) return 'grid-cell-success';
    if (value >= 10) return 'grid-cell-warning';
    if (value > 5) return 'grid-cell-caution';
    return 'grid-cell-danger';
  };

  // Get cell value from planningData
  const getCellValue = useCallback((storeId: string, skuId: string, weekId: string, field: string) => {
    const planningCell = planningData.find(
      cell => cell.storeId === storeId && cell.skuId === skuId && cell.weekId === weekId
    );
    
    if (!planningCell) return field === 'salesUnits' ? 0 : undefined;
    
    if (field === 'salesUnits') return planningCell.salesUnits;
    
    const calculated = calculateDerivedValues(storeId, skuId, weekId);
    if (!calculated) return undefined;
    
    switch (field) {
      case 'salesDollars': return calculated.salesDollars;
      case 'gmDollars': return calculated.gmDollars;
      case 'gmPercentage': return calculated.gmPercentage;
      default: return undefined;
    }
  }, [planningData, calculateDerivedValues]);

  // Column definitions
  const columnDefs = useMemo(() => {
    const baseCols: ColDef[] = [
      { 
        headerName: 'Store', 
        field: 'store',
        width: 200,
        pinned: 'left',
        cellRenderer: (params: ICellRendererParams) => params.data.storeName
      },
      { 
        headerName: 'SKU', 
        field: 'sku',
        width: 200,
        pinned: 'left',
        cellRenderer: (params: ICellRendererParams) => params.data.skuName
      }
    ];
    
    const weekCols: ColDef[] = [];
    
    // Group columns by month
    Object.entries(monthGroups).forEach(([month, monthWeeks]) => {
      const children: ColDef[] = [];
      
      monthWeeks.forEach(weekId => {
        children.push(
          {
            headerName: 'Sales Units',
            field: `${weekId}_salesUnits`,
            width: 120,
            editable: true,
            type: 'numericColumn'
          },
          {
            headerName: 'Sales Dollars',
            field: `${weekId}_salesDollars`,
            width: 120,
            valueFormatter: currencyFormatter,
            type: 'numericColumn'
          },
          {
            headerName: 'GM Dollars',
            field: `${weekId}_gmDollars`,
            width: 120,
            valueFormatter: currencyFormatter,
            type: 'numericColumn'
          },
          {
            headerName: 'GM %',
            field: `${weekId}_gmPercentage`,
            width: 100,
            valueFormatter: percentFormatter,
            type: 'numericColumn',
            cellClassRules: {
              'grid-cell-success': (params) => params.value >= 40,
              'grid-cell-warning': (params) => params.value >= 10 && params.value < 40,
              'grid-cell-caution': (params) => params.value > 5 && params.value < 10,
              'grid-cell-danger': (params) => params.value <= 5
            }
          }
        );
      });
      
      weekCols.push({
        headerName: month,
        children
      });
    });
    
    return [...baseCols, ...weekCols];
  }, [monthGroups]);

  // Row data
  const rowData = useMemo(() => {
    const rows: any[] = [];
    
    stores.forEach(store => {
      skus.forEach(sku => {
        const row: any = {
          storeId: store.id,
          storeName: store.label,
          skuId: sku.id,
          skuName: sku.label,
          skuPrice: sku.price,
          skuCost: sku.cost
        };
        
        weeks.forEach(week => {
          row[`${week.id}_salesUnits`] = getCellValue(store.id, sku.id, week.id, 'salesUnits');
          row[`${week.id}_salesDollars`] = getCellValue(store.id, sku.id, week.id, 'salesDollars');
          row[`${week.id}_gmDollars`] = getCellValue(store.id, sku.id, week.id, 'gmDollars');
          row[`${week.id}_gmPercentage`] = getCellValue(store.id, sku.id, week.id, 'gmPercentage');
        });
        
        rows.push(row);
      });
    });
    
    return rows;
  }, [stores, skus, weeks, getCellValue]);

  // Cell value changed event
  const onCellValueChanged = useCallback((params: any) => {
    const { data, colDef } = params;
    const { storeId, skuId } = data;
    
    // Extract weekId from field name (format: "W01_salesUnits")
    const field = colDef.field || '';
    const matches = field.match(/^(W\d+)_salesUnits$/);
    if (!matches) return;
    
    const weekId = matches[1];
    const salesUnits = params.newValue || 0;
    
    setPlanningCellValue(storeId, skuId, weekId, salesUnits);
    
    // Refresh derived cells
    setTimeout(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.refreshCells({
          columns: [
            `${weekId}_salesDollars`,
            `${weekId}_gmDollars`,
            `${weekId}_gmPercentage`
          ],
          rowNodes: [params.node]
        });
      }
    }, 0);
  }, [setPlanningCellValue]);

  // Default column definition
  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    filter: true,
  }), []);

  return (
    <div className="container mx-auto">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Planning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="ag-theme-alpine w-full h-[75vh]">
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              animateRows={true}
              onCellValueChanged={onCellValueChanged}
              suppressMenuHide={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Planning;
