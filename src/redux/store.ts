import {configureStore} from '@reduxjs/toolkit';
import piecesPlacementLogReducer from './piecesPlacementLog';

export const store = configureStore({
  reducer: {
    piecesPlacementLog: piecesPlacementLogReducer,
  },
});
