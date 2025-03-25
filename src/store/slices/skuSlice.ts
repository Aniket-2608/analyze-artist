
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SKU } from '../../types/models';

interface SKUState {
  skus: SKU[];
  loading: boolean;
  error: string | null;
}

const initialState: SKUState = {
  skus: [],
  loading: false,
  error: null,
};

// Sample data for initialization
const sampleSKUs: SKU[] = [
  { id: 'SKU001', seqNo: 1, label: 'Premium T-Shirt', price: 29.99, cost: 12.50 },
  { id: 'SKU002', seqNo: 2, label: 'Denim Jeans', price: 59.99, cost: 24.75 },
  { id: 'SKU003', seqNo: 3, label: 'Sneakers', price: 89.99, cost: 45.00 },
];

const skuSlice = createSlice({
  name: 'skus',
  initialState: {
    ...initialState,
    skus: sampleSKUs, // Initialize with sample data
  },
  reducers: {
    setSkus: (state, action: PayloadAction<SKU[]>) => {
      state.skus = action.payload;
    },
    addSku: (state, action: PayloadAction<Omit<SKU, 'seqNo'>>) => {
      const newSeqNo = state.skus.length > 0 
        ? Math.max(...state.skus.map(s => s.seqNo)) + 1 
        : 1;
      state.skus.push({ ...action.payload, seqNo: newSeqNo });
    },
    updateSku: (state, action: PayloadAction<SKU>) => {
      const index = state.skus.findIndex(sku => sku.id === action.payload.id);
      if (index !== -1) {
        state.skus[index] = action.payload;
      }
    },
    removeSku: (state, action: PayloadAction<string>) => {
      state.skus = state.skus.filter(sku => sku.id !== action.payload);
    },
  },
});

export const {
  setSkus,
  addSku,
  updateSku,
  removeSku,
} = skuSlice.actions;

export default skuSlice.reducer;
