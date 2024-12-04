import {PiecePlacementLogType, PieceType} from '../constants/interfaces';

export function PawnMovement(
  position: number,
  activePiece: PieceType['value'],
  piecesPlacement: PiecePlacementLogType,
  isAttackCheck?: boolean,
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
  return routes;
}
