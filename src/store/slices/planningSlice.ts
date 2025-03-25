
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlanningCell, Week } from '../../types/models';

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

interface PlanningState {
  planningData: PlanningCell[];
  weeks: Week[];
  loading: boolean;
  error: string | null;
}

const initialState: PlanningState = {
  planningData: [],
  weeks: WEEKS,
  loading: false,
  error: null,
};

const planningSlice = createSlice({
  name: 'planning',
  initialState,
  reducers: {
    setPlanningData: (state, action: PayloadAction<PlanningCell[]>) => {
      state.planningData = action.payload;
    },
    setPlanningCellValue: (state, action: PayloadAction<{ storeId: string, skuId: string, weekId: string, salesUnits: number }>) => {
      const { storeId, skuId, weekId, salesUnits } = action.payload;
      const existingIndex = state.planningData.findIndex(
        cell => cell.storeId === storeId && cell.skuId === skuId && cell.weekId === weekId
      );
      
      if (existingIndex >= 0) {
        // Update existing cell
        state.planningData[existingIndex] = {
          ...state.planningData[existingIndex],
          salesUnits
        };
      } else {
        // Add new cell
        state.planningData.push({ storeId, skuId, weekId, salesUnits });
      }
    },
  },
});

export const { setPlanningData, setPlanningCellValue } = planningSlice.actions;

export default planningSlice.reducer;
