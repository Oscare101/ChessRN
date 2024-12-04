import {PiecePlacementLogType, PieceType} from '../constants/interfaces';
import {EnPassant} from './pawnMovement';

// return new piecePlacement after move is done

export function MakeMove(
  piecePlacement: PiecePlacementLogType,
  from: number,
  to: number,
  lastMove: {from: number | null; to: number | null},
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
    } else if (
      lastMove.from &&
      lastMove.to &&
      Math.abs(Math.floor(lastMove.to / 8) - Math.floor(lastMove.from / 8)) ===
        2 && // Opponent pawn moved two squares forward
      piecePlacement[lastMove.to]?.piece?.name === 'Pawn' &&
      piecePlacement[lastMove.to]?.piece?.color !==
        piecePlacement[from]?.piece?.color &&
      EnPassant(
        piecePlacement[from]?.piece?.color,
        piecePlacement,
        lastMove,
        Math.floor(from / 8),
        from % 8,
      )
    ) {
      newPiecePlacement[lastMove.to] = {status: 'free'};
      newPiecePlacement[from] = {status: 'free'};
      newPiecePlacement[to] = {status: 'occupied', piece: piece};
    } else {
      newPiecePlacement[from] = {status: 'free'};
      newPiecePlacement[to] = {status: 'occupied', piece: piece};
    }

    return newPiecePlacement as PiecePlacementLogType;
  }
  return piecePlacement; // if smth wrong just return
}
