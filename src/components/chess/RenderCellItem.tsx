import {TouchableOpacity, Dimensions, View, ViewStyle} from 'react-native';
import React from 'react';
import rules from '../../constants/rules';
import Icon from '../icons/Icon';
import colors from '../../constants/colors';
import {
  GameStatInterface,
  PiecePlacementLogType,
} from '../../constants/interfaces';

const width = Dimensions.get('screen').width;

function RenderCellItem(props: {
  column: any;
  row: any;
  onPress: any;
  gameStat: GameStatInterface;
}) {
  const cellIndex: number =
    props.column.index + props.row.index * rules.rows.length;
  const isEven: boolean =
    (props.column.index % 2 === 0 && props.row.index % 2 === 0) ||
    (props.column.index % 2 === 1 && props.row.index % 2 === 1);

  const lastPiecePlacement: PiecePlacementLogType =
    props.gameStat.piecesPlacementLog[
      props.gameStat.piecesPlacementLog.length - 1
    ];
  const cell = lastPiecePlacement[cellIndex];
  const piece = cell?.piece;
  const lastMove =
    props.gameStat.movesHistory[props.gameStat.movesHistory.length - 1];
  const activeCell = props.gameStat.activeCell;

  const cellStyle: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.12,
    aspectRatio: 1,
    backgroundColor:
      lastMove?.from === cellIndex
        ? isEven
          ? colors.piecePointBlack
          : colors.piecePointWhite
        : lastMove?.to === cellIndex
        ? isEven
          ? colors.piecePointBlack
          : colors.piecePointWhite
        : activeCell === cellIndex
        ? isEven
          ? colors.piecePointBlack
          : colors.piecePointWhite
        : isEven
        ? colors.cellBlack
        : colors.cellWhite,
    transform: props.gameStat.step === 'black' ? [{rotate: '180deg'}] : [],
  };

  const enPassantCell: boolean = !!(
    activeCell &&
    activeCell % 8 !== cellIndex % 8 &&
    lastPiecePlacement[activeCell].piece?.name === 'Pawn' &&
    lastPiecePlacement[cellIndex].status === 'free'
  );

  return (
    <TouchableOpacity
      onPress={() => props.onPress(cellIndex, piece)}
      disabled={!!props.gameStat.gameResult || !props.gameStat.isGameActive}
      style={cellStyle}>
      {props.gameStat.routeCells?.includes(cellIndex) ? (
        lastPiecePlacement[cellIndex].status === 'occupied' || enPassantCell ? (
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
        ) : (
          <View
            style={{
              width: '40%',
              aspectRatio: 1,
              borderRadius: 100,
              backgroundColor: colors.cellPoint,
              position: 'absolute',
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
