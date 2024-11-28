import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: any[] = [
  {
    0: {color: 'white', id: 'R1', name: 'Rook', status: 'occupied'},
    1: {color: 'white', id: 'B1', name: 'Bishop', status: 'occupied'},
    2: {color: 'white', id: 'Kn1', name: 'Knight', status: 'occupied'},
    3: {color: 'white', id: 'Q', name: 'Queen', status: 'occupied'},
    4: {color: 'white', id: 'K', name: 'King', status: 'occupied'},
    5: {color: 'white', id: 'Kn2', name: 'Knight', status: 'occupied'},
    6: {color: 'white', id: 'B2', name: 'Bishop', status: 'occupied'},
    7: {color: 'white', id: 'R2', name: 'Rook', status: 'occupied'},
    8: {color: 'white', id: 'P1', name: 'Pawn', status: 'occupied'},
    9: {color: 'white', id: 'P2', name: 'Pawn', status: 'occupied'},
    10: {color: 'white', id: 'P3', name: 'Pawn', status: 'occupied'},
    11: {color: 'white', id: 'P4', name: 'Pawn', status: 'occupied'},
    12: {color: 'white', id: 'P5', name: 'Pawn', status: 'occupied'},
    13: {color: 'white', id: 'P6', name: 'Pawn', status: 'occupied'},
    14: {color: 'white', id: 'P7', name: 'Pawn', status: 'occupied'},
    15: {color: 'white', id: 'P8', name: 'Pawn', status: 'occupied'},

    48: {color: 'black', id: 'P1', name: 'Pawn', status: 'occupied'},
    49: {color: 'black', id: 'P2', name: 'Pawn', status: 'occupied'},
    50: {color: 'black', id: 'P3', name: 'Pawn', status: 'occupied'},
    51: {color: 'black', id: 'P4', name: 'Pawn', status: 'occupied'},
    52: {color: 'black', id: 'P5', name: 'Pawn', status: 'occupied'},
    53: {color: 'black', id: 'P6', name: 'Pawn', status: 'occupied'},
    54: {color: 'black', id: 'P7', name: 'Pawn', status: 'occupied'},
    55: {color: 'black', id: 'P8', name: 'Pawn', status: 'occupied'},
    56: {color: 'black', id: 'R1', name: 'Rook', status: 'occupied'},
    57: {color: 'black', id: 'B1', name: 'Bishop', status: 'occupied'},
    58: {color: 'black', id: 'Kn1', name: 'Knight', status: 'occupied'},
    59: {color: 'black', id: 'Q', name: 'Queen', status: 'occupied'},
    60: {color: 'black', id: 'K', name: 'King', status: 'occupied'},
    61: {color: 'black', id: 'Kn2', name: 'Knight', status: 'occupied'},
    62: {color: 'black', id: 'B2', name: 'Bishop', status: 'occupied'},
    63: {color: 'black', id: 'R2', name: 'Rook', status: 'occupied'},
  },
];

const piecesPlacementLogSlice = createSlice({
  name: 'piecesPlacementLog',
  initialState,
  reducers: {
    updatepiecesPlacementLog: (state, action: PayloadAction<any[]>) => {
      state.splice(0, state.length, ...action.payload);
    },
  },
});

export const {updatepiecesPlacementLog} = piecesPlacementLogSlice.actions;
export default piecesPlacementLogSlice.reducer;
