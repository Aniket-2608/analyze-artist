
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Store } from '../../types/models';

interface StoreState {
  stores: Store[];
  loading: boolean;
  error: string | null;
}

const initialState: StoreState = {
  stores: [],
  loading: false,
  error: null,
};

// Sample data for initialization
const sampleStores: Store[] = [
  { id: 'ST035', seqNo: 1, label: 'San Francisco Bay Trends', city: 'San Francisco', state: 'CA' },
  { id: 'ST046', seqNo: 2, label: 'Phoenix Sunwear', city: 'Phoenix', state: 'AZ' },
  { id: 'ST064', seqNo: 3, label: 'Dallas Ranch Supply', city: 'Dallas', state: 'TX' },
  { id: 'ST066', seqNo: 4, label: 'Atlanta Outfitters', city: 'Atlanta', state: 'GA' },
  { id: 'ST073', seqNo: 5, label: 'Nashville Melody Music Store', city: 'Nashville', state: 'TN' },
];

const storeSlice = createSlice({
  name: 'stores',
  initialState: {
    ...initialState,
    stores: sampleStores, // Initialize with sample data
  },
  reducers: {
    setStores: (state, action: PayloadAction<Store[]>) => {
      state.stores = action.payload;
    },
    addStore: (state, action: PayloadAction<Omit<Store, 'seqNo'>>) => {
      const newSeqNo = state.stores.length > 0 
        ? Math.max(...state.stores.map(s => s.seqNo)) + 1 
        : 1;
      state.stores.push({ ...action.payload, seqNo: newSeqNo });
    },
    updateStore: (state, action: PayloadAction<Store>) => {
      const index = state.stores.findIndex(store => store.id === action.payload.id);
      if (index !== -1) {
        state.stores[index] = action.payload;
      }
    },
    removeStore: (state, action: PayloadAction<string>) => {
      state.stores = state.stores.filter(store => store.id !== action.payload);
    },
    reorderStore: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      const result = [...state.stores];
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      
      // Update sequence numbers
      state.stores = result.map((store, idx) => ({
        ...store,
        seqNo: idx + 1
      }));
    },
  },
});

export const {
  setStores,
  addStore,
  updateStore,
  removeStore,
  reorderStore,
} = storeSlice.actions;

export default storeSlice.reducer;
