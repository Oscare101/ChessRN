import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux';
import rules from '../constants/rules';
import RenderRowItem from '../components/chess/RenderRowItem';
import {KnightMovement, MakeMove} from '../functions/chessFunctions';
import {updatepiecesPlacementLog} from '../redux/piecesPlacementLog';
import {PieceType} from '../constants/interfaces';

const width = Dimensions.get('screen').width;

export default function ChessScreen() {
  const piecesPlacementLog = useSelector(
    (state: RootState) => state.piecesPlacementLog,
  );
  const [activeCell, setActiveCell] = useState<number | null>();
  const [routeCells, setRouteCells] = useState<number[]>();
  const dispatch = useDispatch();

  function OnNewPiecePoint(cell: number, activePiece: PieceType['value']) {
    const newActiveCell = activeCell === cell ? null : cell;
    setActiveCell(newActiveCell);
    if (activePiece.name && newActiveCell !== null) {
      setRouteCells(
        activePiece.name === 'Knight'
          ? KnightMovement(
              newActiveCell,
              activePiece,
              piecesPlacementLog[piecesPlacementLog.length - 1],
            )
          : [],
      );
    } else {
      setRouteCells([]);
    }
  }

  function CellAction(cell: number, activePiece: PieceType['value']) {
    if (routeCells?.length && routeCells.includes(cell) && activeCell) {
      const newMove = MakeMove(
        piecesPlacementLog[piecesPlacementLog.length - 1],
        activeCell,
        cell,
      );
      if (newMove) {
        dispatch(updatepiecesPlacementLog([...piecesPlacementLog, newMove]));
      }
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
      <Text>{piecesPlacementLog.length}</Text>
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
