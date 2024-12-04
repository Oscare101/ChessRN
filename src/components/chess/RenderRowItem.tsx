import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import rules from '../../constants/rules';
import RenderCellItem from './RenderCellItem';

function RenderRowItem(props: any) {
  return (
    <FlatList
      horizontal
      data={rules.columns}
      renderItem={(item: any) => (
        <RenderCellItem
          column={item}
          row={props.row}
          onPress={props.onPress}
          activeCell={props.activeCell}
          routeCells={props.routeCells}
          piecesPlacementLog={props.piecesPlacementLog}
          step={props.step}
          lastMove={props.lastMove}
          check={props.check}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({});
export default React.memo(RenderRowItem);
