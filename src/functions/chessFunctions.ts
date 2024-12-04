import {
  PiecePlacementLogType,
  PiecePlacementType,
  PieceType,
} from '../constants/interfaces';

export function KnightMovement(
  position: number,
  activePiece: any,
  piecesPlacement: any,
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
          piecesPlacement[i].piece.color !== activePieceColor),
    );

  return routes;
}

export function PawnMovement(
  position: number,
  activePiece: any,
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

function LineDiagonalMovement(
  position: number,
  activePiece: any,
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

export function LineMovement(
  position: number,
  activePiece: any,
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

export function DiagonalMovement(
  position: number,
  activePiece: any,
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

export function KingMovement(
  position: number,
  activePiece: any,
  piecesPlacement: PiecePlacementLogType,
  castlingInfo: {[key: string]: boolean},
) {
  let routes: number[] = [
    ...DiagonalMovement(position, activePiece, piecesPlacement, true),
    ...LineMovement(position, activePiece, piecesPlacement, true),
  ];

  // cannot go under attack
  routes = routes.filter(
    route => !IsCellUnderAttack(route, activePiece.color, piecesPlacement),
  );

  const activePieceColor = activePiece.color;

  // castling
  function canCastle(isKingside: boolean): boolean {
    const rookPosition = isKingside
      ? activePieceColor === 'white'
        ? 7
        : 63
      : activePieceColor === 'white'
      ? 0
      : 56;

    const direction = isKingside ? 1 : -1;

    // space between king and rook
    const emptyPositions = [
      position + direction,
      position + 2 * direction,
      ...(isKingside ? [] : [position + 3 * direction]), // Для ферзевого боку
    ];

    // check if not used
    if (
      castlingInfo[`${activePieceColor}KingMoved`] ||
      castlingInfo[`${rookPosition}RookMoved`]
    ) {
      return false;
    }

    // check if cells are free
    if (emptyPositions.some(pos => piecesPlacement[pos].status !== 'free')) {
      return false;
    }

    // check if ceels is NOT under attack
    const threatenedPositions = [position, ...emptyPositions];
    if (
      threatenedPositions.some(pos =>
        IsCellUnderAttack(pos, activePieceColor, piecesPlacement),
      )
    ) {
      return false;
    }

    return true;
  }

  // castling if possible
  if (activePieceColor === 'white' && position === 4) {
    if (canCastle(true)) routes.push(6); // king side
    if (canCastle(false)) routes.push(2); // queen side
  } else if (activePieceColor === 'black' && position === 60) {
    if (canCastle(true)) routes.push(62); // king side
    if (canCastle(false)) routes.push(58); // queen side
  }

  return routes;
}

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
  // Копіюємо поточний стан дошки
  const newPlacement = {...piecePlacement};

  // Очищуємо початкову позицію
  newPlacement[from] = {status: 'free'};

  // Переміщуємо фігуру на нову позицію
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
): boolean {
  // Знаходимо всі фігури поточного кольору
  const myPieces = Object.entries(piecePlacement).filter(
    ([, i]: [string, any]) =>
      i.status === 'occupied' && i.piece.color === color,
  );
  console.log(myPieces.length);

  // Для кожної фігури перевіряємо можливі ходи
  for (const [index, piece] of myPieces) {
    console.log(index, piece);
    const position = parseInt(index);
    const moves = GetPossibleMoves(position, piece.piece, piecePlacement);

    for (const move of moves) {
      // Емуляція ходу
      const newPlacement = SimulateMove(
        piecePlacement,
        position,
        move,
        piece.piece,
      );

      // Якщо король після цього ходу не під шахом, це не мат
      if (!IsKingChecked(newPlacement, color)) {
        return false; // Знайдений легальний хід
      }
    }
  }

  // Якщо всі ходи випробувані і жоден не знімає шах, це мат
  return true;
}

export function MakeMove(
  piecePlacement: PiecePlacementLogType,
  from: number,
  to: number,
) {
  if (
    piecePlacement[from].piece !== undefined &&
    (piecePlacement[to].status === 'free' ||
      (piecePlacement[to].status === 'occupied' &&
        piecePlacement[to].piece?.color !== piecePlacement[from].piece?.color))
  ) {
    let newPiecePlacement = {...piecePlacement};
    let piece: PieceType['value'] = {...piecePlacement[from]?.piece};
    // castling
    function MoveRookCastle(cellFrom: number, cellTo: number) {
      newPiecePlacement[cellTo] = {
        status: 'occupied',
        piece: piecePlacement[cellFrom].piece,
      };
      newPiecePlacement[cellFrom] = {status: 'free'};
    }
    if (piecePlacement[from].piece.name === 'King') {
      if (from === 4 && to === 6) {
        MoveRookCastle(7, 5);
      } else if (from === 4 && to === 2) {
        MoveRookCastle(0, 3);
      } else if (from === 60 && to === 62) {
        MoveRookCastle(63, 61);
      } else if (from === 60 && to === 58) {
        MoveRookCastle(56, 59);
      }
    }

    if (
      piecePlacement[from].piece.name === 'Pawn' &&
      ((piecePlacement[from].piece.color === 'white' &&
        Math.floor(to / 8) === 7) ||
        (piecePlacement[from].piece.color === 'black' &&
          Math.floor(to / 8) === 0))
    ) {
      newPiecePlacement[from] = {status: 'free'};
      newPiecePlacement[to] = {
        status: 'occupied',
        piece: {...piece, name: 'Queen'},
      };
    } else {
      newPiecePlacement[from] = {status: 'free'};
      newPiecePlacement[to] = {status: 'occupied', piece: piece};
    }

    return newPiecePlacement as PiecePlacementLogType;
  }
  return piecePlacement; // if smth wrong just return
}
