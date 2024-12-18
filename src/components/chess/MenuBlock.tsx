import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Icon from '../icons/Icon';
import colors from '../../constants/colors';
import {GameStatInterface} from '../../constants/interfaces';

const width = Dimensions.get('screen').width;

export default function MenuBlock(props: {
  playerColor: 'white' | 'black';
  gameStat: GameStatInterface;
  onPrev: any;
  onNext: any;
  showMoveIndex: number | null;
}) {
  return (
    <View style={styles.block}>
      <TouchableOpacity
        disabled={
          props.gameStat.isGameActive ||
          !props.gameStat.gameResult ||
          !props.showMoveIndex
        }
        activeOpacity={0.8}
        style={[
          styles.button,
          {
            opacity:
              props.gameStat.isGameActive ||
              !props.gameStat.gameResult ||
              !props.showMoveIndex
                ? 0.3
                : 1,
          },
        ]}
        onPress={props.onPrev}>
        <Icon name="Left" size={width * 0.09} color={colors.pieceWhite} />
      </TouchableOpacity>
      <View style={styles.line} />
      <TouchableOpacity activeOpacity={0.8} style={styles.button}>
        <Icon name="Menu" size={width * 0.09} color={colors.pieceWhite} />
      </TouchableOpacity>
      <View style={styles.line} />
      <TouchableOpacity
        disabled={
          props.gameStat.isGameActive ||
          !props.gameStat.gameResult ||
          props.showMoveIndex === props.gameStat.piecesPlacementLog.length - 1
        }
        activeOpacity={0.8}
        style={[
          styles.button,
          {
            opacity:
              props.gameStat.isGameActive ||
              !props.gameStat.gameResult ||
              props.showMoveIndex ===
                props.gameStat.piecesPlacementLog.length - 1
                ? 0.3
                : 1,
          },
        ]}
        onPress={props.onNext}>
        <Icon name="Right" size={width * 0.09} color={colors.pieceWhite} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    width: width * 0.37,
    height: width * 0.12,
    borderRadius: width * 0.015,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: colors.shadow,
    borderWidth: 1,
    borderColor: colors.pieceBlack,
  },
  button: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    height: '80%',
    width: 1,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.pieceBlack,
  },
});
