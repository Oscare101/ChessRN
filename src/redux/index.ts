import {configureStore} from '@reduxjs/toolkit';
import piecesPlacementLogReducer from './piecesPlacementLog';
import routeCellsReducer from './routeCells';

export const store = configureStore({
  reducer: {
    piecesPlacementLog: piecesPlacementLogReducer,
    routeCells: routeCellsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
