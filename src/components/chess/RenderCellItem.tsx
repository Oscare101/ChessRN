import {
  Text,
  TouchableOpacity,
  Dimensions,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import rules from '../../constants/rules';
import Icon from '../icons/Icon';
import colors from '../../constants/colors';

const width = Dimensions.get('screen').width;

function RenderCellItem(props: any) {
  const cellIndex: number =
    props.column.index + props.row.index * rules.rows.length;
  const isEven: boolean =
    (props.column.index % 2 === 0 && props.row.index % 2 === 0) ||
    (props.column.index % 2 === 1 && props.row.index % 2 === 1);

  const cell =
    props.piecesPlacementLog[props.piecesPlacementLog.length - 1][cellIndex];
  const piece = cell?.piece;
  const kingCheck: boolean =
    props.check === piece?.color && piece?.name === 'King';

  const cellStyle: ViewStyle = React.useMemo(
    () => ({
      alignItems: 'center',
      justifyContent: 'center',
      width: width * 0.12,
      aspectRatio: 1,
      backgroundColor:
        props.lastMove?.from === cellIndex
          ? isEven
            ? colors.piecePointBlack
            : colors.piecePointWhite
          : props.lastMove?.to === cellIndex
          ? isEven
            ? colors.piecePointBlack
            : colors.piecePointWhite
          : props.activeCell === cellIndex
          ? isEven
            ? colors.piecePointBlack
            : colors.piecePointWhite
          : isEven
          ? colors.cellBlack
          : colors.cellWhite,
      transform: props.step === 'black' ? [{rotate: '180deg'}] : [],
    }),
    [cellIndex, props.lastMove, props.activeCell, props.step, isEven],
  );

  return (
    <TouchableOpacity
      onPress={() => props.onPress(cellIndex, piece)}
      style={cellStyle}>
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

export default React.memo(RenderCellItem);
