import {PiecePlacementLogType} from '../constants/interfaces';

export function KnightMovement(
  position: number,
  activePiece: any,
  piecesPlacement: PiecePlacementLogType,
) {
  const activePieceColor = activePiece?.color;

  // all directions
  const knightMoves = [
    {row: 2, col: 1},
    {row: 1, col: 2},
    {row: -1, col: 2},
    {row: -2, col: 1},
    {row: -2, col: -1},
    {row: -1, col: -2},
    {row: 1, col: -2},
    {row: 2, col: -1},
  ];

  const rowIndex: number = Math.floor(position / 8);
  const columnIndex: number = position % 8;

  const routes: number[] = knightMoves
    .map(({row, col}) => ({
      row: rowIndex + row,
      col: columnIndex + col,
    }))
    .filter(({row, col}) => row >= 0 && row < 8 && col >= 0 && col < 8)
    .map(({row, col}) => row * 8 + col)
    .filter(
      (i: number) =>
        piecesPlacement[i].status === 'free' ||
        (piecesPlacement[i].status === 'occupied' &&
          piecesPlacement[i].piece &&
          piecesPlacement[i].piece.color !== activePieceColor),
    );

  return routes;
}
