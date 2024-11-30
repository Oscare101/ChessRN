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
