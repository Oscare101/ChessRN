import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux';
import rules from '../constants/rules';
import RenderRowItem from '../components/chess/RenderRowItem';
import {
  DiagonalMovement,
  IsCellUnderAttack,
  KingMovement,
  KnightMovement,
  LineMovement,
  MakeMove,
  PawnMovement,
} from '../functions/chessFunctions';
import {updatepiecesPlacementLog} from '../redux/piecesPlacementLog';
import {PieceType} from '../constants/interfaces';

const width = Dimensions.get('screen').width;

export default function ChessScreen() {
  const piecesPlacementLog = useSelector(
    (state: RootState) => state.piecesPlacementLog,
  );
  const [step, setStep] = useState<'white' | 'black'>('white');
  const [activeCell, setActiveCell] = useState<number | null>();
  const [routeCells, setRouteCells] = useState<number[]>();
  const [castlingInfo, setCastlingInfo] = useState<any>({
    whiteKingMoved: true, // Якщо білий король рухався
    '0RookMoved': true, // Якщо біла тура на клітинці 0 рухалася
    '7RookMoved': false, // Якщо біла тура на клітинці 7 не рухалася
    blackKingMoved: false,
    '56RookMoved': false,
    '63RookMoved': false,
  });
  const dispatch = useDispatch();

  function OnNewPiecePoint(cell: number, activePiece: PieceType['value']) {
    const newActiveCell = activeCell === cell ? null : cell;
    if (step === activePiece.color) setActiveCell(newActiveCell);
    // console.log('a');

    // console.log(
    //   IsCellUnderAttack(
    //     cell,
    //     step,
    //     piecesPlacementLog[piecesPlacementLog.length - 1],
    //   ),
    // );

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
    // if (
    //   piecesPlacementLog[piecesPlacementLog.length - 1][cell].piece &&
    //   step !== piecesPlacementLog[piecesPlacementLog.length - 1][cell].piece.color
    // ) {
    //   setActiveCell(null);
    //   setRouteCells([]);
    //   return;
    // }
    if (
      routeCells?.length &&
      routeCells.includes(cell) &&
      typeof activeCell === 'number'
    ) {
      const newMove = MakeMove(
        piecesPlacementLog[piecesPlacementLog.length - 1],
        activeCell,
        cell,
      );
      if (newMove) {
        dispatch(updatepiecesPlacementLog([...piecesPlacementLog, newMove]));
      }
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
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <Text>
        {piecesPlacementLog.length} {step}
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
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
