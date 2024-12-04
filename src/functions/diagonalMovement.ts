import {PiecePlacementLogType, PieceType} from '../constants/interfaces';
import {LineDiagonalMovement} from './lineDiagonalMovement';

export function DiagonalMovement(
  position: number,
  activePiece: PieceType['value'],
  piecesPlacement: PiecePlacementLogType,
  limit: boolean, // for king
) {
  const directions = [
    {rowStep: 1, colStep: 1}, // up right
    {rowStep: -1, colStep: 1}, // dowwn right
    {rowStep: 1, colStep: -1}, // up left
    {rowStep: -1, colStep: -1}, // down left
  ];
  return LineDiagonalMovement(
    position,
    activePiece,
    piecesPlacement,
    directions,
    limit,
  );
}
