import {
  CastlingType,
  PiecePlacementLogType,
  PieceType,
} from '../constants/interfaces';
import {IsCellUnderAttack} from './chessFunctions';
import {DiagonalMovement} from './diagonalMovement';
import {LineMovement} from './lineMovement';

export function KingMovement(
  position: number,
  activePiece: PieceType['value'],
  piecesPlacement: PiecePlacementLogType,
  castlingInfo: CastlingType | null,
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
      ...(isKingside ? [] : [position + 3 * direction]), // for queen side
    ];

    // check if not used
    if (
      castlingInfo &&
      (castlingInfo[`${activePieceColor}KingMoved`] ||
        castlingInfo[`${rookPosition}RookMoved`])
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
