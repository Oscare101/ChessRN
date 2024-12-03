import {Text, TouchableOpacity, Dimensions} from 'react-native';
import React from 'react';
import rules from '../../constants/rules';
import Icon from '../icons/Icon';
import {IsCellUnderAttack} from '../../functions/chessFunctions';

const width = Dimensions.get('screen').width;

export default function RenderCellItem(props: any) {
  const cellIndex: number =
    props.column.index + props.row.index * rules.rows.length;
  const isEven: boolean =
    (props.column.index % 2 === 0 && props.row.index % 2 === 0) ||
    (props.column.index % 2 === 1 && props.row.index % 2 === 1);

  const cell =
    props.piecesPlacementLog[props.piecesPlacementLog.length - 1][cellIndex];
  const piece = cell?.piece;

  return (
    <TouchableOpacity
      onPress={() => props.onPress(cellIndex, piece)}
      // disabled={cell.status === 'free'}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
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
        transform: props.step === 'black' ? [{rotate: '180deg'}] : [],
      }}>
      <Text
        style={{
          color: IsCellUnderAttack(
            cellIndex,
            props.step,
            props.piecesPlacementLog[props.piecesPlacementLog.length - 1],
          )
            ? 'red'
            : piece?.color,
        }}>
        {/* {piece && piece.color} */}
        {/* {piece && piece.name} */}
        {cellIndex}
        {/* {cell.status} */}
      </Text>
      {piece && piece.name ? (
        <Icon
          name={piece.name}
          size={width * 0.12 * 0.9}
          color={piece.color === 'black' ? rules.blackColor : piece.color}
        />
      ) : (
        <></>
      )}
    </TouchableOpacity>
  );
}
