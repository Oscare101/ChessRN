import {PiecePlacementLogType, PieceType} from '../constants/interfaces';

export function KnightMovement(
  position: number,
  activePiece: any,
  piecesPlacement: any,
) {
  const activePieceColor = activePiece?.color;

  const rowIndex: number = Math.floor(position / 8);
  const columnIndex: number = position % 8;

  const m1 =
    rowIndex <= 5 && columnIndex <= 6 && (rowIndex + 2) * 8 + (columnIndex + 1);
  const m2 =
    rowIndex <= 6 && columnIndex <= 5 && (rowIndex + 1) * 8 + (columnIndex + 2);
  const m3 =
    rowIndex >= 1 && columnIndex <= 5 && (rowIndex - 1) * 8 + (columnIndex + 2);
  const m4 =
    rowIndex >= 2 && columnIndex <= 6 && (rowIndex - 2) * 8 + (columnIndex + 1);
  const m5 =
    rowIndex >= 2 && columnIndex >= 1 && (rowIndex - 2) * 8 + (columnIndex - 1);
  const m6 =
    rowIndex >= 2 && columnIndex >= 2 && (rowIndex - 1) * 8 + (columnIndex - 2);
  const m7 =
    rowIndex <= 6 && columnIndex >= 2 && (rowIndex + 1) * 8 + (columnIndex - 2);
  const m8 =
    rowIndex <= 5 && columnIndex >= 1 && (rowIndex + 2) * 8 + (columnIndex - 1);
  let movementsArr: number[] = [m1, m2, m3, m4, m5, m6, m7, m8].filter(
    (i: any) => typeof i === 'number',
  );
  movementsArr = movementsArr.filter(
    (i: number) =>
      (piecesPlacement[i].status === 'occupied' &&
        piecesPlacement[i].piece.color !== activePieceColor) ||
      piecesPlacement[i].status === 'free',
  );
  return movementsArr;
}

export function MakeMove(
  piecePlacement: PiecePlacementLogType,
  from: number,
  to: number,
) {
  if (
    piecePlacement[from].piece !== undefined &&
    piecePlacement[to].status === 'free'
  ) {
    const piece: PieceType['value'] = piecePlacement[from]?.piece;

    let newPiecePlacement = {...piecePlacement};
    newPiecePlacement[from] = {status: 'free'};
    newPiecePlacement[to] = {status: 'occupied', piece: piece};
    return newPiecePlacement;
  }
}
