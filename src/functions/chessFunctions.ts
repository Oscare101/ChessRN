import {
  CastlingType,
  PiecePlacementLogArrayType,
  PiecePlacementLogType,
  PiecePlacementType,
  PieceType,
} from '../constants/interfaces';
import startPiecePlacement from '../constants/StartPiecePlacement';
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
          : [
              ...DiagonalMovement(
                +index,
                placement.piece,
                piecesPlacement,
                true,
              ),
              ...LineMovement(+index, placement.piece, piecesPlacement, true),
            ]; // King

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

// simulate move (used for checking illegal moves checking)
export function SimulateMove(
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
      return KingMovement(position, piece, piecePlacement, null);
    case 'Knight':
      return KnightMovement(position, piece, piecePlacement);
    default:
      return [];
  }
}

// is check
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

// is stalemate
export function IsStalemate(
  piecesPlacement: PiecePlacementLogType,
  color: 'white' | 'black',
): boolean {
  // King is under attack ?
  if (IsKingChecked(piecesPlacement, color)) {
    return false; // if king is under attack
  }

  // all possible moves
  const allMoves: number[] = [];
  Object.entries(piecesPlacement).forEach(([index, cell]) => {
    if (cell.status === 'occupied' && cell.piece.color === color) {
      const pieceMoves = GetPossibleMoves(
        parseInt(index),
        cell.piece,
        piecesPlacement,
      );
      allMoves.push(...pieceMoves);
    }
  });

  // if at least sigle move is legal -> not a stalemate
  return allMoves.length === 0;
}

// if only two kings left on board -> draw
export function OnlyKingsLeft(piecePlacement: PiecePlacementLogType) {
  const piecesLeft = Object.values(piecePlacement).filter(
    (i: PiecePlacementType) => i.status === 'occupied',
  ).length;
  return piecesLeft === 2;
}

export function IsPawnPromotion(
  piecePlacement: PiecePlacementLogType,
  from: number,
  to: number,
) {
  if (
    piecePlacement[from].piece &&
    piecePlacement[from].piece.name === 'Pawn' &&
    Math.floor(to / 8) ===
      (piecePlacement[from].piece.color === 'white' ? 7 : 0)
  ) {
    return true;
  }
  return false;
}

export function CheckThreefoldRepetition(
  placementLog: PiecePlacementLogArrayType,
  castlingLog: CastlingType[],
): boolean {
  const lastPlacement = placementLog[placementLog.length - 1];
  const lastCastling = castlingLog[castlingLog.length - 1];

  const amount = placementLog.filter(
    (_: any, index: number) =>
      JSON.stringify(
        Object.entries(placementLog[index])
          .sort(([a], [b]) => Number(a) - Number(b))
          .map((i: any) => {
            if (i[1].status === 'occupied') {
              return [i[0], i[1].piece?.name];
            } else {
              return [i[0], 'free'];
            }
          }),
      ) ===
        JSON.stringify(
          Object.entries(lastPlacement)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map((i: any) => {
              if (i[1].status === 'occupied') {
                return [i[0], i[1].piece?.name];
              } else {
                return [i[0], 'free'];
              }
            }),
        ) &&
      JSON.stringify(
        Object.entries(castlingLog[index]).sort(
          ([a], [b]) => Number(a) - Number(b),
        ),
      ) ===
        JSON.stringify(
          Object.entries(lastCastling).sort(
            ([a], [b]) => Number(a) - Number(b),
          ),
        ),
  ).length;

  return amount === 3;
}
