import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../redux';
import rules from '../constants/rules';
import RenderRowItem from '../components/chess/RenderRowItem';
import {KnightMovement} from '../functions/chessFunctions';
import {updateRouteCells} from '../redux/routeCells';
import {updatepiecesPlacementLog} from '../redux/piecesPlacementLog';

const width = Dimensions.get('screen').width;

export default function ChessScreen() {
  const piecesPlacementLog = useSelector(
    (state: RootState) => state.piecesPlacementLog,
  );
  const [activeCell, setActiveCell] = useState<number | null>();
  const [routeCells, setRoutersCells] = useState<number[]>();
  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
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
              onPress={(cell: number, activePiece: any) => {
                const newActiveCell = activeCell === cell ? null : cell;
                setActiveCell(newActiveCell);
                if (activePiece.name && newActiveCell !== null) {
                  setRoutersCells(
                    activePiece.name === 'Knight'
                      ? KnightMovement(
                          newActiveCell,
                          activePiece,
                          piecesPlacementLog[piecesPlacementLog.length - 1],
                        )
                      : [],
                  );
                } else {
                  setRoutersCells([]);
                }
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
