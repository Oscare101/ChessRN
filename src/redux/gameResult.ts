import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type GameResultState = 'white' | 'black' | 'draw' | null;

const initialState: GameResultState = null;

const checkSlice = createSlice({
  name: 'gameResult',
  initialState,
  reducers: {
    setGameResult: (state, action: PayloadAction<any>) => {
      return action.payload;
    },
    resetGameResult: () => {
      return null;
    },
  },
});

export const {setGameResult, resetGameResult} = checkSlice.actions;

export default checkSlice.reducer;
