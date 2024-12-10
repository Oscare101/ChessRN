import {FlatList} from 'react-native';
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
          gameStat={props.gameStat}
          showMoveIndex={props.showMoveIndex}
        />
      )}
    />
  );
}

export default React.memo(RenderRowItem);
