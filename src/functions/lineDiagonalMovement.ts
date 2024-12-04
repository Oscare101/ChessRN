import {PiecePlacementLogType, PieceType} from '../constants/interfaces';

export function LineDiagonalMovement(
  position: number,
  activePiece: PieceType['value'],
  piecesPlacement: PiecePlacementLogType,
  directions: {rowStep: number; colStep: number}[],
  limit: boolean,
): number[] {
  const activePieceColor = activePiece?.color;
  const rowIndex: number = Math.floor(position / 8);
  const columnIndex: number = position % 8;

  const routes: number[] = [];

  for (const {rowStep, colStep} of directions) {
    let row = rowIndex;
    let column = columnIndex;

    while (true) {
      row += rowStep;
      column += colStep;

      if (row < 0 || row >= 8 || column < 0 || column >= 8) break;

      const newIndex = row * 8 + column;

      if (piecesPlacement[newIndex].status === 'occupied') {
        if (piecesPlacement[newIndex].piece?.color !== activePieceColor) {
          routes.push(newIndex); // attack
        }
        break; // color === activePiece
      }

      routes.push(newIndex); // free

      if (limit) break; // for King
    }
  }

  return routes;
}
