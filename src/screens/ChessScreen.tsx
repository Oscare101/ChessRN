import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const width = Dimensions.get('screen').width;

const columns: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const rows: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

function RenderCellItem({column, row}: any) {
  const cellIndex: number = column.index + row.index * rows.length;
  const isEven: boolean =
    (column.index % 2 === 0 && row.index % 2 === 0) ||
    (column.index % 2 === 1 && row.index % 2 === 1);
  return (
    <View
      style={{
        width: width * 0.12,
        aspectRatio: 1,
        backgroundColor: isEven ? 'grey' : 'lightgrey',
      }}>
      <Text>
        {/* {column.index} {row.index} */}
        {column.index + row.index * rows.length}
        {/* {column.item} {row.item} */}
      </Text>
    </View>
  );
}

function RenderRowItem({row}: any) {
  return (
    <FlatList
      horizontal
      data={columns}
      renderItem={(item: any) => <RenderCellItem column={item} row={row} />}
    />
  );
}

export default function ChessScreen() {
  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <View
        style={{
          width: width * 0.12 * 8,
          aspectRatio: 1,
        }}>
        <FlatList
          // style={{flexDirection: 'column-reverse'}}
          inverted
          data={rows}
          renderItem={(item: any) => <RenderRowItem row={item} />}
          // style={}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
