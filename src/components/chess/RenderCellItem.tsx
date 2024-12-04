import {Text, TouchableOpacity, Dimensions, View} from 'react-native';
import React from 'react';
import rules from '../../constants/rules';
import Icon from '../icons/Icon';
import {IsCellUnderAttack} from '../../functions/chessFunctions';
import colors from '../../constants/colors';

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
            ? isEven
              ? colors.piecePointBlack
              : colors.piecePointWhite
            : isEven
            ? colors.cellBlack
            : colors.cellWhite,
        transform: props.step === 'black' ? [{rotate: '180deg'}] : [],
      }}>
      {props.routeCells?.includes(cellIndex) ? (
        props.piecesPlacementLog[props.piecesPlacementLog.length - 1][cellIndex]
          .status === 'free' ? (
          <View
            style={{
              width: '40%',
              aspectRatio: 1,
              borderRadius: 100,
              backgroundColor: colors.cellPoint,
              position: 'absolute',
            }}
          />
        ) : (
          <View
            style={{
              width: '100%',
              aspectRatio: 1,
              borderRadius: 100,
              borderColor: colors.cellPoint,
              position: 'absolute',
              borderWidth: 5,
            }}
          />
        )
      ) : (
        <></>
      )}
      {/* <Text
        style={{
          color: IsCellUnderAttack(
            cellIndex,
            props.step,
            props.piecesPlacementLog[props.piecesPlacementLog.length - 1],
          )
            ? 'red'
            : piece?.color,
        }}>
        {cellIndex}
      </Text> */}
      {piece && piece.name ? (
        <Icon
          name={piece.name}
          size={width * 0.12 * 0.9}
          color={
            piece.color === 'black' ? colors.pieceBlack : colors.pieceWhite
          }
        />
      ) : (
        <></>
      )}
    </TouchableOpacity>
  );
}
