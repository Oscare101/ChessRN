import {PiecePlacementLogType, PieceType} from '../constants/interfaces';
import {LineDiagonalMovement} from './lineDiagonalMovement';

export function LineMovement(
  position: number,
  activePiece: PieceType['value'],
  piecesPlacement: PiecePlacementLogType,
  limit: boolean, // for king
) {
  const directions = [
    {rowStep: 1, colStep: 0}, // up
    {rowStep: -1, colStep: 0}, // down
    {rowStep: 0, colStep: 1}, // right
    {rowStep: 0, colStep: -1}, // left
  ];
  return LineDiagonalMovement(
    position,
    activePiece,
    piecesPlacement,
    directions,
    limit,
  );
}
