import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import React from 'react';
import rules from '../../constants/rules';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux';

const width = Dimensions.get('screen').width;

export default function RenderCellItem(props: any) {
  // const piecesPlacementLog = useSelector(
  //   (state: RootState) => state.piecesPlacementLog,
  // );

  const cellIndex: number =
    props.column.index + props.row.index * rules.rows.length;
  const isEven: boolean =
    (props.column.index % 2 === 0 && props.row.index % 2 === 0) ||
    (props.column.index % 2 === 1 && props.row.index % 2 === 1);

  const cell =
    props.piecesPlacementLog[props.piecesPlacementLog.length - 1][cellIndex];
  // console.log(cell);
  const piece = cell?.piece;
  return (
    <TouchableOpacity
      onPress={() => props.onPress(cellIndex, piece)}
      // disabled={cell.status === 'free'}
      style={{
        width: width * 0.12,
        aspectRatio: 1,
        backgroundColor:
          props.activeCell === cellIndex
            ? 'yellow'
            : props.routeCells?.includes(cellIndex)
            ? 'red'
            : isEven
            ? 'grey'
            : 'lightgrey',
      }}>
      <Text style={{color: piece?.color}}>
        {piece && piece.color}
        {piece && piece.name}
        {cellIndex}
      </Text>
    </TouchableOpacity>
  );
}
