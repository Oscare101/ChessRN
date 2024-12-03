import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import React from 'react';
import rules from '../../constants/rules';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux';
import {SvgXml} from 'react-native-svg';
import PawnIcon from '../icons/PawnIcon';
import Icon from '../icons/Icon';
// import Icon from '../icons/Icon';

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
      }}>
      <Text style={{color: piece?.color}}>
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
