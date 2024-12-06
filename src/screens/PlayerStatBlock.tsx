import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '../constants/colors';
import {PieceType} from '../constants/interfaces';
import Icon from '../components/icons/Icon';

const width = Dimensions.get('screen').width;

interface PlayerStatBlockProps {
  step: 'white' | 'black';
  takenPieces: PieceType['value'][];
  playerColor: 'white' | 'black';
  check: boolean;
  checkmate: boolean;
  isGameActive: boolean;
}

export default function PlayerStatBlock(props: PlayerStatBlockProps) {
  return (
    <View
      style={{
        flex: 1,
        width: width * 0.12 * 8,
        borderColor: props.isGameActive
          ? props.step === props.playerColor
            ? props.step === 'white'
              ? colors.cellWhite
              : colors.cellBlack
            : colors.bg
          : colors.bg,
        borderWidth: width * 0.01,
        // borderRadius: width * 0.02,
        backgroundColor: colors.bg,
        transform: [
          {rotate: props.playerColor === 'white' ? '0deg' : '180deg'},
        ],
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column',
        paddingBottom: width * 0.05,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          width: '100%',
          // flex: 1,
        }}>
        {props.takenPieces
          .filter((i: PieceType['value']) => i.color !== props.playerColor)
          .map((piece: PieceType['value'], index: number) => (
            <View key={index} style={{marginRight: -width * 0.03}}>
              <Icon
                name={piece.name}
                size={width * 0.08}
                color={
                  piece.color === 'white'
                    ? colors.pieceWhite
                    : colors.pieceBlack
                }
              />
            </View>
          ))}
      </View>

      {props.check ? (
        <View style={styles.checkBlock}>
          <Text style={styles.checkTitle}>Check</Text>
        </View>
      ) : (
        <></>
      )}
      {props.checkmate ? (
        <View style={styles.checkmateBlock}>
          <Text style={styles.checkmateTitle}>Checkmate</Text>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  checkBlock: {
    padding: width * 0.02,
    paddingHorizontal: width * 0.05,
    backgroundColor: colors.piecePointBlack,
    borderRadius: width * 0.022,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  checkmateBlock: {
    padding: width * 0.02,
    paddingHorizontal: width * 0.05,
    backgroundColor: colors.error,
    borderRadius: width * 0.022,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  checkTitle: {fontSize: width * 0.05, color: colors.bg},
  checkmateTitle: {fontSize: width * 0.05, color: colors.bg},
});
