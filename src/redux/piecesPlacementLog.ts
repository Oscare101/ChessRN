import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  PiecePlacementLogArrayType,
  PiecePlacementType,
} from '../constants/interfaces';

const initialState: PiecePlacementLogArrayType = [
  {
    0: {piece: {color: 'white', id: 'WR1', name: 'Rook'}, status: 'occupied'},
    1: {
      piece: {color: 'white', id: 'WKN1', name: 'Knight'},
      status: 'occupied',
    },
    2: {
      piece: {color: 'white', id: 'WB1', name: 'Bishop'},
      status: 'occupied',
    },
    3: {piece: {color: 'white', id: 'WQ', name: 'Queen'}, status: 'occupied'},
    4: {piece: {color: 'white', id: 'WK', name: 'King'}, status: 'occupied'},
    5: {
      piece: {color: 'white', id: 'WB2', name: 'Bishop'},
      status: 'occupied',
    },
    6: {
      piece: {color: 'white', id: 'WKN2', name: 'Knight'},
      status: 'occupied',
    },
    7: {piece: {color: 'white', id: 'WR2', name: 'Rook'}, status: 'occupied'},
    8: {piece: {color: 'white', id: 'WP1', name: 'Pawn'}, status: 'occupied'},
    9: {piece: {color: 'white', id: 'WP2', name: 'Pawn'}, status: 'occupied'},
    10: {piece: {color: 'white', id: 'WP3', name: 'Pawn'}, status: 'occupied'},
    11: {piece: {color: 'white', id: 'WP4', name: 'Pawn'}, status: 'occupied'},
    12: {piece: {color: 'white', id: 'WP5', name: 'Pawn'}, status: 'occupied'},
    13: {piece: {color: 'white', id: 'WP6', name: 'Pawn'}, status: 'occupied'},
    14: {piece: {color: 'white', id: 'WP7', name: 'Pawn'}, status: 'occupied'},
    15: {piece: {color: 'white', id: 'WP8', name: 'Pawn'}, status: 'occupied'},
    16: {status: 'free'},
    17: {status: 'free'},
    18: {status: 'free'},
    19: {status: 'free'},
    20: {status: 'free'},
    21: {status: 'free'},
    22: {status: 'free'},
    23: {status: 'free'},
    24: {status: 'free'},
    25: {status: 'free'},
    26: {status: 'free'},
    27: {status: 'free'},
    28: {status: 'free'},
    29: {status: 'free'},
    30: {status: 'free'},
    31: {status: 'free'},
    32: {status: 'free'},
    33: {status: 'free'},
    34: {status: 'free'},
    35: {status: 'free'},
    36: {status: 'free'},
    37: {status: 'free'},
    38: {status: 'free'},
    39: {status: 'free'},
    40: {status: 'free'},
    41: {status: 'free'},
    42: {status: 'free'},
    43: {status: 'free'},
    44: {status: 'free'},
    45: {status: 'free'},
    46: {status: 'free'},
    47: {status: 'free'},
    48: {piece: {color: 'black', id: 'BP1', name: 'Pawn'}, status: 'occupied'},
    49: {piece: {color: 'black', id: 'BP2', name: 'Pawn'}, status: 'occupied'},
    50: {piece: {color: 'black', id: 'BP3', name: 'Pawn'}, status: 'occupied'},
    51: {piece: {color: 'black', id: 'BP4', name: 'Pawn'}, status: 'occupied'},
    52: {piece: {color: 'black', id: 'BP5', name: 'Pawn'}, status: 'occupied'},
    53: {piece: {color: 'black', id: 'BP6', name: 'Pawn'}, status: 'occupied'},
    54: {piece: {color: 'black', id: 'BP7', name: 'Pawn'}, status: 'occupied'},
    55: {piece: {color: 'black', id: 'BP8', name: 'Pawn'}, status: 'occupied'},
    56: {piece: {color: 'black', id: 'BR1', name: 'Rook'}, status: 'occupied'},
    57: {
      piece: {color: 'black', id: 'BKN1', name: 'Knight'},
      status: 'occupied',
    },
    58: {
      piece: {color: 'black', id: 'BB1', name: 'Bishop'},
      status: 'occupied',
    },
    59: {piece: {color: 'black', id: 'BQ', name: 'Queen'}, status: 'occupied'},
    60: {piece: {color: 'black', id: 'BK', name: 'King'}, status: 'occupied'},
    61: {
      piece: {color: 'black', id: 'BB2', name: 'Bishop'},
      status: 'occupied',
    },
    62: {
      piece: {color: 'black', id: 'BKN2', name: 'Knight'},
      status: 'occupied',
    },
    63: {piece: {color: 'black', id: 'BR2', name: 'Rook'}, status: 'occupied'},
  },
];

const piecesPlacementLogSlice = createSlice({
  name: 'piecesPlacementLog',
  initialState,
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
