import {PiecePlacementLogType, PieceType} from '../constants/interfaces';
import {DiagonalMovement} from './diagonalMovement';
import {KingMovement} from './kingMovement';
import {KnightMovement} from './knightMovement';
import {LineMovement} from './lineMovement';
import {PawnMovement} from './pawnMovement';

export function IsCellUnderAttack(
  cellIndex: number,
  color: 'white' | 'black',
  piecesPlacement: PiecePlacementLogType,
): boolean {
  const opponentColor = color === 'white' ? 'black' : 'white';

  // all opponents pieces
  for (const [index, placement] of Object.entries(piecesPlacement)) {
    if (
      placement.status === 'occupied' &&
      placement.piece.color === opponentColor
    ) {
      const possibleMoves =
        placement.piece.name === 'Pawn'
          ? PawnMovement(+index, placement.piece, piecesPlacement, true)
          : placement.piece.name === 'Knight'
          ? KnightMovement(+index, placement.piece, piecesPlacement)
          : placement.piece.name === 'Bishop'
          ? DiagonalMovement(+index, placement.piece, piecesPlacement, false)
          : placement.piece.name === 'Rook'
          ? LineMovement(+index, placement.piece, piecesPlacement, false)
          : placement.piece.name === 'Queen'
          ? [
              ...DiagonalMovement(
                +index,
                placement.piece,
                piecesPlacement,
                false,
              ),
              ...LineMovement(+index, placement.piece, piecesPlacement, false),
            ]
          : LineMovement(+index, placement.piece, piecesPlacement, true); // King

      if (possibleMoves.includes(cellIndex)) return true;
    }
  }
  return false;
}

export function IsKingChecked(
  piecePlacement: PiecePlacementLogType,
  color: 'white' | 'black',
) {
  const kingIndex = Object.values(piecePlacement).findIndex(
    (i: any) =>
      i.status === 'occupied' &&
      i.piece.name === 'King' &&
      i.piece.color === color,
  );
  return IsCellUnderAttack(kingIndex, color, piecePlacement);
}

function SimulateMove(
  piecePlacement: PiecePlacementLogType,
  from: number,
  to: number,
  piece: PieceType['value'],
): PiecePlacementLogType {
  const newPlacement = {...piecePlacement};

  newPlacement[from] = {status: 'free'};
  newPlacement[to] = {status: 'occupied', piece};

  return newPlacement;
}

function GetPossibleMoves(
  position: number,
  piece: PieceType['value'],
  piecePlacement: PiecePlacementLogType,
): number[] {
  switch (piece.name) {
    case 'Pawn':
      return PawnMovement(position, piece, piecePlacement);
    case 'Rook':
      return LineMovement(position, piece, piecePlacement, false);
    case 'Bishop':
      return DiagonalMovement(position, piece, piecePlacement, false);
    case 'Queen':
      return [
        ...LineMovement(position, piece, piecePlacement, false),
        ...DiagonalMovement(position, piece, piecePlacement, false),
      ];
    case 'King':
      return KingMovement(position, piece, piecePlacement, {});
    case 'Knight':
      return KnightMovement(position, piece, piecePlacement);
    default:
      return [];
  }
}

export function IsCheckmate(
  piecePlacement: PiecePlacementLogType,
  color: 'white' | 'black',
  lastMove: {from: number | null; to: number | null},
): boolean {
  // all my pieces
  const myPieces = Object.entries(piecePlacement).filter(
    ([, i]: [string, any]) =>
      i.status === 'occupied' && i.piece.color === color,
  );

  // all possible movements
  for (const [index, piece] of myPieces) {
    const position = parseInt(index);
    const moves = GetPossibleMoves(position, piece.piece, piecePlacement);

    for (const move of moves) {
      // move
      const newPlacement = SimulateMove(
        piecePlacement,
        position,
        move,
        piece.piece,
      );

      // if king is not under attack so its ok
      if (!IsKingChecked(newPlacement, color)) {
        return false; // legal move
      }
    }
  }

  // checkmate
  return true;
}
