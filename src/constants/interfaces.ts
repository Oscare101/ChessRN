export interface PieceType {
  value: {
    name: 'Knight' | 'King' | 'Queen' | 'Pawn' | 'Bishop' | 'Rook';
    color: 'white' | 'black';
    id: string;
  };
}

export interface PiecePlacementType {
  status: 'free' | 'occupied';
  piece?: PieceType['value'];
}

export interface PiecePlacementLogType {
  [key: number]: PiecePlacementType;
}

export type PiecePlacementLogArrayType = Array<PiecePlacementLogType>;

export interface IconName {
  value: 'Knight' | 'King' | 'Queen' | 'Pawn' | 'Bishop' | 'Rook';
}

export interface CastlingType {
  whiteKingMoved: boolean;
  '0RookMoved': boolean;
  '7RookMoved': boolean;
  blackKingMoved: boolean;
  '56RookMoved': boolean;
  '63RookMoved': boolean;
}

export interface GameStatInterface {
  gameResult: 'draw' | 'white' | 'black' | null;
  check: 'white' | 'black' | null;
  checkmate: 'white' | 'black' | null;
  takenPieces: PieceType['value'][];
  step: 'white' | 'black';
  movesHistory: {
    from: number;
    to: number;
  }[];
  activeCell: number | null;
  routeCells: number[];
  castlingInfo: CastlingType[];
  piecesPlacementLog: PiecePlacementLogArrayType;
  isGameActive: boolean;
  comment: string;
}
