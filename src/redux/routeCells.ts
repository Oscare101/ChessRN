import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: any[] = [];

const routeCellsSlice = createSlice({
  name: 'routeCells',
  initialState,
  reducers: {
    updateRouteCells: (state, action: PayloadAction<any[]>) => {
      state.splice(0, state.length, ...action.payload);
    },
  },
});

export const {updateRouteCells} = routeCellsSlice.actions;
export default routeCellsSlice.reducer;
