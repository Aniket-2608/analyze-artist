
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Store, SKU, Week, PlanningCell } from '../types/models';

// Define calendar weeks
const WEEKS = Array.from({ length: 52 }, (_, i) => ({
  id: `W${(i + 1).toString().padStart(2, '0')}`,
  month: getMonthFromWeek(i + 1),
}));

function getMonthFromWeek(weekNum: number): string {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                 'July', 'August', 'September', 'October', 'November', 'December'];
  // Simple mapping (approximate)
  const monthIndex = Math.floor((weekNum - 1) / 4.33);
  return months[monthIndex % 12];
}

interface DataContextType {
  stores: Store[];
  setStores: React.Dispatch<React.SetStateAction<Store[]>>;
  skus: SKU[];
  setSkus: React.Dispatch<React.SetStateAction<SKU[]>>;
  weeks: Week[];
  planningData: PlanningCell[];
  setPlanningData: React.Dispatch<React.SetStateAction<PlanningCell[]>>;
  addStore: (store: Omit<Store, 'seqNo'>) => void;
  updateStore: (store: Store) => void;
  removeStore: (id: string) => void;
  reorderStore: (fromIndex: number, toIndex: number) => void;
  addSku: (sku: Omit<SKU, 'seqNo'>) => void;
  updateSku: (sku: SKU) => void;
  removeSku: (id: string) => void;
  setPlanningCellValue: (storeId: string, skuId: string, weekId: string, salesUnits: number) => void;
  calculateDerivedValues: (storeId: string, skuId: string, weekId: string) => {
    salesDollars: number;
    gmDollars: number;
    gmPercentage: number;
  } | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [skus, setSkus] = useState<SKU[]>([]);
  const [weeks] = useState<Week[]>(WEEKS);
  const [planningData, setPlanningData] = useState<PlanningCell[]>([]);

  const addStore = (store: Omit<Store, 'seqNo'>) => {
    setStores(prevStores => {
      const newSeqNo = prevStores.length > 0 
        ? Math.max(...prevStores.map(s => s.seqNo)) + 1 
        : 1;
      return [...prevStores, { ...store, seqNo: newSeqNo }];
    });
  };

  const updateStore = (store: Store) => {
    setStores(prevStores => 
      prevStores.map(s => s.id === store.id ? store : s)
    );
  };

  const removeStore = (id: string) => {
    setStores(prevStores => prevStores.filter(s => s.id !== id));
    // Also remove planning data
    setPlanningData(prevData => prevData.filter(cell => cell.storeId !== id));
  };

  const reorderStore = (fromIndex: number, toIndex: number) => {
    setStores(prevStores => {
      const result = [...prevStores];
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      
      // Update sequence numbers
      return result.map((store, idx) => ({
        ...store,
        seqNo: idx + 1
      }));
    });
  };

  const addSku = (sku: Omit<SKU, 'seqNo'>) => {
    setSkus(prevSkus => {
      const newSeqNo = prevSkus.length > 0 
        ? Math.max(...prevSkus.map(s => s.seqNo)) + 1 
        : 1;
      return [...prevSkus, { ...sku, seqNo: newSeqNo }];
    });
  };

  const updateSku = (sku: SKU) => {
    setSkus(prevSkus => 
      prevSkus.map(s => s.id === sku.id ? sku : s)
    );
  };

  const removeSku = (id: string) => {
    setSkus(prevSkus => prevSkus.filter(s => s.id !== id));
    // Also remove planning data
    setPlanningData(prevData => prevData.filter(cell => cell.skuId !== id));
  };

  const setPlanningCellValue = (storeId: string, skuId: string, weekId: string, salesUnits: number) => {
    setPlanningData(prevData => {
      const existingIndex = prevData.findIndex(
        cell => cell.storeId === storeId && cell.skuId === skuId && cell.weekId === weekId
      );
      
      if (existingIndex >= 0) {
        // Update existing cell
        const newData = [...prevData];
        newData[existingIndex] = {
          ...newData[existingIndex],
          salesUnits
        };
        return newData;
      } else {
        // Add new cell
        return [...prevData, { storeId, skuId, weekId, salesUnits }];
      }
    });
  };

  const calculateDerivedValues = (storeId: string, skuId: string, weekId: string) => {
    const planningCell = planningData.find(
      cell => cell.storeId === storeId && cell.skuId === skuId && cell.weekId === weekId
    );
    
    if (!planningCell) return undefined;
    
    const sku = skus.find(s => s.id === skuId);
    if (!sku) return undefined;
    
    const salesDollars = planningCell.salesUnits * sku.price;
    const gmDollars = salesDollars - (planningCell.salesUnits * sku.cost);
    const gmPercentage = salesDollars > 0 ? (gmDollars / salesDollars) * 100 : 0;
    
    return { salesDollars, gmDollars, gmPercentage };
  };

  // Load sample data (temporarily hardcoded here)
  useEffect(() => {
    // Add sample stores
    const sampleStores: Store[] = [
      { id: 'ST035', seqNo: 1, label: 'San Francisco Bay Trends', city: 'San Francisco', state: 'CA' },
      { id: 'ST046', seqNo: 2, label: 'Phoenix Sunwear', city: 'Phoenix', state: 'AZ' },
      { id: 'ST064', seqNo: 3, label: 'Dallas Ranch Supply', city: 'Dallas', state: 'TX' },
      { id: 'ST066', seqNo: 4, label: 'Atlanta Outfitters', city: 'Atlanta', state: 'GA' },
      { id: 'ST073', seqNo: 5, label: 'Nashville Melody Music Store', city: 'Nashville', state: 'TN' },
    ];
    
    // Add sample SKUs
    const sampleSKUs: SKU[] = [
      { id: 'SKU001', seqNo: 1, label: 'Premium T-Shirt', price: 29.99, cost: 12.50 },
      { id: 'SKU002', seqNo: 2, label: 'Denim Jeans', price: 59.99, cost: 24.75 },
      { id: 'SKU003', seqNo: 3, label: 'Sneakers', price: 89.99, cost: 45.00 },
    ];
    
    setStores(sampleStores);
    setSkus(sampleSKUs);
  }, []);

  return (
    <DataContext.Provider
      value={{
        stores,
        setStores,
        skus,
        setSkus,
        weeks,
        planningData,
        setPlanningData,
        addStore,
        updateStore,
        removeStore,
        reorderStore,
        addSku,
        updateSku,
        removeSku,
        setPlanningCellValue,
        calculateDerivedValues,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
