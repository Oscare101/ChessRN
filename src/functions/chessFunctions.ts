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

  // Всі можливі зміщення для коня
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

  // Побудова можливих рухів
  const routes: number[] = knightMoves
    .map(({row, col}) => ({
      row: rowIndex + row,
      col: columnIndex + col,
    }))
    .filter(
      ({row, col}) => row >= 0 && row < 8 && col >= 0 && col < 8, // Залишити тільки дійсні клітинки
    )
    .map(({row, col}) => row * 8 + col) // Перетворити на індекси
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

  // Хід вперед
  const forwardIndex = position + directions.forward * 8;
  if (
    rowIndex + directions.forward >= 0 &&
    rowIndex + directions.forward <= 7 &&
    piecesPlacement[forwardIndex]?.status === 'free' &&
    !isAttackCheck
  ) {
    routes.push(forwardIndex);

    // Подвійний хід вперед
    const doubleForwardIndex = position + directions.forward * 8 * 2;
    if (
      rowIndex === directions.startRow &&
      piecesPlacement[doubleForwardIndex]?.status === 'free'
    ) {
      routes.push(doubleForwardIndex);
    }
  }

  // Атака по діагоналі
  const attackOffsets = [-1, 1]; // Зміщення по колонках для атаки ліворуч і праворуч
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
      piecesPlacement[attackIndex]?.status === 'occupied' &&
      piecesPlacement[attackIndex]?.piece?.color !== activePieceColor
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
          routes.push(newIndex); // Додаємо, якщо це фігура супротивника
        }
        break; // Зупиняємось, якщо клітинка зайнята
      }

      routes.push(newIndex); // Додаємо, якщо клітинка пуста

      if (limit) break; // Зупиняємось після першого ходу для King
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
    {rowStep: 1, colStep: 0}, // Вгору
    {rowStep: -1, colStep: 0}, // Вниз
    {rowStep: 0, colStep: 1}, // Праворуч
    {rowStep: 0, colStep: -1}, // Ліворуч
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
    {rowStep: 1, colStep: 1}, // Вгору праворуч
    {rowStep: -1, colStep: 1}, // Вниз праворуч
    {rowStep: 1, colStep: -1}, // Вгору ліворуч
    {rowStep: -1, colStep: -1}, // Вниз ліворуч
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
  castlingInfo: {[key: string]: boolean}, // Інформація про рух короля та тур
) {
  let routes: number[] = [
    ...DiagonalMovement(position, activePiece, piecesPlacement, true),
    ...LineMovement(position, activePiece, piecesPlacement, true),
  ];

  // Додаємо перевірку, щоб король не йшов на клітинку, яка під атакою
  // routes = routes.filter(
  //   route => !isCellUnderAttack(route, activePiece.color, piecesPlacement),
  // );

  const activePieceColor = activePiece.color;

  // Розрахунок рокіровки
  // function canCastle(isKingside: boolean): boolean {
  //   const rookPosition = isKingside
  //     ? activePieceColor === 'white'
  //       ? 7
  //       : 63
  //     : activePieceColor === 'white'
  //     ? 0
  //     : 56;

  //   const direction = isKingside ? 1 : -1;

  //   // Клітинки між королем і турою
  //   const emptyPositions = [
  //     position + direction,
  //     position + 2 * direction,
  //     ...(isKingside ? [] : [position + 3 * direction]), // Для ферзевого боку
  //   ];

  //   // Перевірка, чи тур і король не рухались
  //   if (
  //     castlingInfo[`${activePieceColor}KingMoved`] ||
  //     castlingInfo[`${rookPosition}RookMoved`]
  //   ) {
  //     return false;
  //   }

  //   // Перевірка, чи клітинки між королем і турою вільні
  //   if (emptyPositions.some(pos => piecesPlacement[pos].status !== 'free')) {
  //     return false;
  //   }

  //   // Перевірка, чи клітинки між королем і турою або позиція короля не під шахом
  //   const threatenedPositions = [position, ...emptyPositions];
  //   if (
  //     threatenedPositions.some(pos =>
  //       IsCellUnderAttack(pos, activePieceColor, piecesPlacement),
  //     )
  //   ) {
  //     return false;
  //   }

  //   return true;
  // }

  // Додамо рокіровку, якщо можливо
  // if (activePieceColor === 'white' && position === 4) {
  //   if (canCastle(true)) routes.push(6); // Королівський фланг
  //   if (canCastle(false)) routes.push(2); // Ферзевий фланг
  // } else if (activePieceColor === 'black' && position === 60) {
  //   if (canCastle(true)) routes.push(62); // Королівський фланг
  //   if (canCastle(false)) routes.push(58); // Ферзевий фланг
  // }

  return routes;
}

// Допоміжна функція для перевірки, чи клітинка під атакою
export function IsCellUnderAttack(
  cellIndex: number,
  color: 'white' | 'black',
  piecesPlacement: PiecePlacementLogType,
): boolean {
  const opponentColor = color === 'white' ? 'black' : 'white';

  // Перевіряємо всі фігури суперника
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
    return newPiecePlacement;
  }
}
