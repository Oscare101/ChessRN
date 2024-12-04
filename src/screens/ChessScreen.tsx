import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux';
import rules from '../constants/rules';
import RenderRowItem from '../components/chess/RenderRowItem';
import {updatepiecesPlacementLog} from '../redux/piecesPlacementLog';
import {PiecePlacementLogType, PieceType} from '../constants/interfaces';
import colors from '../constants/colors';
import {KnightMovement} from '../functions/knightMovement';
import {PawnMovement} from '../functions/pawnMovement';
import {LineMovement} from '../functions/lineMovement';
import {DiagonalMovement} from '../functions/diagonalMovement';
import {KingMovement} from '../functions/kingMovement';
import {MakeMove} from '../functions/makeMove';
import {IsCheckmate, IsKingChecked} from '../functions/chessFunctions';

const width = Dimensions.get('screen').width;

export default function ChessScreen() {
  const piecesPlacementLog = useSelector(
    (state: RootState) => state.piecesPlacementLog,
  );
  const [step, setStep] = useState<'white' | 'black'>('white');
  const [movesHistory, setMovesHistory] = useState<
    {
      from: number;
      to: number;
    }[]
  >([]);
  const [activeCell, setActiveCell] = useState<number | null>();
  const [routeCells, setRouteCells] = useState<number[]>();
  const [castlingInfo, setCastlingInfo] = useState<any>({
    whiteKingMoved: false,
    '0RookMoved': false,
    '7RookMoved': false,
    blackKingMoved: false,
    '56RookMoved': false,
    '63RookMoved': false,
  });
  const dispatch = useDispatch();

  function OnNewPiecePoint(cell: number, activePiece: PieceType['value']) {
    const newActiveCell = activeCell === cell ? null : cell;
    if (step === activePiece.color) setActiveCell(newActiveCell);
    if (
      activePiece.name &&
      newActiveCell !== null &&
      step === activePiece.color
    ) {
      setRouteCells(
        activePiece.name === 'Knight'
          ? KnightMovement(
              newActiveCell,
              activePiece,
              piecesPlacementLog[piecesPlacementLog.length - 1],
            )
          : activePiece.name === 'Pawn'
          ? PawnMovement(
              newActiveCell,
              activePiece,
              piecesPlacementLog[piecesPlacementLog.length - 1],
              false,
              movesHistory[movesHistory.length - 1],
            )
          : activePiece.name === 'Rook'
          ? LineMovement(
              newActiveCell,
              activePiece,
              piecesPlacementLog[piecesPlacementLog.length - 1],
              false,
            )
          : activePiece.name === 'Bishop'
          ? DiagonalMovement(
              newActiveCell,
              activePiece,
              piecesPlacementLog[piecesPlacementLog.length - 1],
              false,
            )
          : activePiece.name === 'Queen'
          ? [
              ...DiagonalMovement(
                newActiveCell,
                activePiece,
                piecesPlacementLog[piecesPlacementLog.length - 1],
                false,
              ),
              ...LineMovement(
                newActiveCell,
                activePiece,
                piecesPlacementLog[piecesPlacementLog.length - 1],
                false,
              ),
            ]
          : activePiece.name === 'King'
          ? KingMovement(
              newActiveCell,
              activePiece,
              piecesPlacementLog[piecesPlacementLog.length - 1],
              castlingInfo,
            )
          : [],
      );
    } else {
      setActiveCell(null);
      setRouteCells([]);
    }
  }

  function CellAction(cell: number, activePiece: PieceType['value']) {
    if (
      routeCells?.length &&
      routeCells.includes(cell) &&
      typeof activeCell === 'number'
    ) {
      // calculate new move
      const newMove: PiecePlacementLogType = MakeMove(
        piecesPlacementLog[piecesPlacementLog.length - 1],
        activeCell,
        cell,
        movesHistory[movesHistory.length - 1],
      );

      // Illegal check if my king become under attack
      if (IsKingChecked(newMove, step)) {
        // TODO illegal move
        console.log('illegal move');
        return false;
      }
      if (IsKingChecked(newMove, step === 'white' ? 'black' : 'white')) {
        console.log('check');
        if (
          IsCheckmate(
            newMove,
            step === 'white' ? 'black' : 'white',
            movesHistory[movesHistory.length - 1],
          )
        ) {
        }
      }

      if (newMove) {
        setMovesHistory([...movesHistory, {from: activeCell, to: cell}]);
        dispatch(updatepiecesPlacementLog([...piecesPlacementLog, newMove]));
      }

      const pieceId =
        piecesPlacementLog[piecesPlacementLog.length - 1][activeCell].piece?.id;
      // is castle pieces moved
      setCastlingInfo({
        whiteKingMoved:
          pieceId === 'WK' ? true : castlingInfo['whiteKingMoved'],
        '0RookMoved': pieceId === 'WR1' ? true : castlingInfo['0RookMoved'],
        '7RookMoved': pieceId === 'WR2' ? true : castlingInfo['7RookMoved'],
        blackKingMoved:
          pieceId === 'BK' ? true : castlingInfo['blackKingMoved'],
        '56RookMoved': pieceId === 'BR1' ? true : castlingInfo['56RookMoved'],
        '63RookMoved': pieceId === 'BR2' ? true : castlingInfo['63RookMoved'],
      });
      // change color
      setStep(prev => (prev === 'white' ? 'black' : 'white'));
      setActiveCell(null);
      setRouteCells([]);
      return;
    } else if (
      piecesPlacementLog[piecesPlacementLog.length - 1][cell].status === 'free'
    ) {
      setActiveCell(null);
      setRouteCells([]);
      return;
    }
    OnNewPiecePoint(cell, activePiece);
  }

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: colors.bg,
      }}>
      <Text>
        {piecesPlacementLog.length} {step}{' '}
        {movesHistory[movesHistory.length - 1]?.from}-
        {movesHistory[movesHistory.length - 1]?.to}
      </Text>
      <View
        style={{
          width: width * 0.12 * 8,
          aspectRatio: 1,
        }}>
        <FlatList
          inverted
          data={rules.rows}
          renderItem={(item: any) => (
            <RenderRowItem
              row={item}
              onPress={(cell: number, activePiece: PieceType['value']) => {
                CellAction(cell, activePiece);
              }}
              activeCell={activeCell}
              routeCells={routeCells}
              piecesPlacementLog={piecesPlacementLog}
              step={step}
              lastMove={movesHistory}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
