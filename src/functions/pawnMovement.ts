import {PiecePlacementLogType, PieceType} from '../constants/interfaces';

export function EnPassant(
  activePieceColor: 'white' | 'black',
  piecesPlacement: PiecePlacementLogType,
  lastMove: {from: number | null; to: number | null},
  rowIndex: number,
  columnIndex: number,
) {
  if (!lastMove.from || !lastMove.to) return false;
  const directions = {
    forward: activePieceColor === 'white' ? 1 : -1,
    enPassantRow: activePieceColor === 'white' ? 4 : 3,
  };

  const lastFromRow = Math.floor(lastMove.from / 8);
  const lastToRow = Math.floor(lastMove.to / 8);
  const lastColumn = lastMove.to % 8;
  const attackOffsets = [-1, 1];

  if (
    Math.abs(lastToRow - lastFromRow) === 2 && // Opponent pawn moved two squares forward
    piecesPlacement[lastMove.to]?.piece?.name === 'Pawn' &&
    piecesPlacement[lastMove.to]?.piece?.color !== activePieceColor &&
    rowIndex === directions.enPassantRow // Pawn is on en passant row
  ) {
    for (const colOffset of attackOffsets) {
      const enPassantColumn = columnIndex + colOffset;
      if (enPassantColumn === lastColumn) {
        const enPassantIndex = lastMove.to + directions.forward * 8;
        return enPassantIndex;
      }
    }
  }
  return false;
}

export function PawnMovement(
  position: number,
  activePiece: PieceType['value'],
  piecesPlacement: PiecePlacementLogType,
  isAttackCheck?: boolean,
  lastMove?: {from: number | null; to: number | null},
) {
  const activePieceColor = activePiece?.color;
  const rowIndex: number = Math.floor(position / 8);
  const columnIndex: number = position % 8;

  const directions = {
    forward: activePieceColor === 'white' ? 1 : -1,
    startRow: activePieceColor === 'white' ? 1 : 6,
  };

  const routes: number[] = [];

  // forward
  const forwardIndex = position + directions.forward * 8;
  if (
    rowIndex + directions.forward >= 0 &&
    rowIndex + directions.forward <= 7 &&
    piecesPlacement[forwardIndex]?.status === 'free' &&
    !isAttackCheck
  ) {
    routes.push(forwardIndex);

    // double forward
    const doubleForwardIndex = position + directions.forward * 8 * 2;
    if (
      rowIndex === directions.startRow &&
      piecesPlacement[doubleForwardIndex]?.status === 'free'
    ) {
      routes.push(doubleForwardIndex);
    }
  }

  // diagonal attack
  const attackOffsets = [-1, 1];
  for (const colOffset of attackOffsets) {
    const attackRow = rowIndex + directions.forward;
    const attackColumn = columnIndex + colOffset;
    const attackIndex = attackRow * 8 + attackColumn;

    if (
      attackRow >= 0 &&
      attackRow <= 7 &&
      attackColumn >= 0 &&
      attackColumn <= 7 &&
      attackIndex >= 0 &&
      attackIndex <= 63 &&
      ((piecesPlacement[attackIndex]?.status === 'occupied' &&
        piecesPlacement[attackIndex]?.piece?.color !== activePieceColor) ||
        isAttackCheck)
    ) {
      routes.push(attackIndex);
    }
  }

  // en passant
  if (lastMove && lastMove.from && lastMove.to) {
    const enpasant = EnPassant(
      activePieceColor,
      piecesPlacement,
      lastMove,
      rowIndex,
      columnIndex,
    );
    if (typeof enpasant === 'number') routes.push(enpasant);
  }

  return routes;
}
