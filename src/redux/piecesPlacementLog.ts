import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  PiecePlacementLogArrayType,
  PiecePlacementType,
} from '../constants/interfaces';
import startPiecePlacement from '../constants/StartPiecePlacement';

const piecesPlacementLogSlice = createSlice({
  name: 'piecesPlacementLog',
  initialState: startPiecePlacement,
  reducers: {
    updatepiecesPlacementLog: (
      state,
      action: PayloadAction<PiecePlacementLogArrayType>,
    ) => {
      state.splice(0, state.length, ...action.payload);
    },
  },
});

export const {updatepiecesPlacementLog} = piecesPlacementLogSlice.actions;
export default piecesPlacementLogSlice.reducer;
