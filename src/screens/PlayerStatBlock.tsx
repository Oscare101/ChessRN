import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import colors from '../constants/colors';
import {GameStatInterface, PieceType} from '../constants/interfaces';
import Icon from '../components/icons/Icon';
import TimerBlock from '../components/chess/TimerBlock';
import GameResultBlock from '../components/chess/GameResultBlock';
import MenuBlock from '../components/chess/MenuBlock';

const width = Dimensions.get('screen').width;

interface PlayerStatBlockProps {}

export default function PlayerStatBlock(props: {
  gameStat: GameStatInterface;
  playerColor: 'white' | 'black';
  time: number;
  startTime: number;
  increment: number;
  onStart: any;
  onPrev: any;
  onNext: any;
  showMoveIndex: number | null;
}) {
  return (
    <View
      style={{
        flex: 1,
        width: width * 0.12 * 8,
        borderColor: props.gameStat.isGameActive
          ? props.gameStat.step === props.playerColor
            ? props.gameStat.step === 'white'
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
        padding: width * 0.02,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          width: '100%',
        }}>
        {props.gameStat.takenPieces
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

      {!props.gameStat.isGameActive && props.playerColor === 'black' ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            props.onStart(!props.gameStat.gameResult);
          }}
          style={styles.block}>
          <Text style={[styles.title, {color: colors.cellWhite}]}>
            {props.gameStat.gameResult ? 'RESET' : 'START'}
          </Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}
      {!props.gameStat.isGameActive ? (
        <GameResultBlock
          gameStat={props.gameStat}
          playerColor={props.playerColor}
        />
      ) : (
        <></>
      )}

      {props.gameStat.isGameActive &&
      props.gameStat.check === props.playerColor ? (
        <View style={[styles.block, {backgroundColor: colors.piecePointBlack}]}>
          <Text style={styles.title}>Check</Text>
        </View>
      ) : (
        <></>
      )}
      <View style={styles.bottomBlock}>
        <TimerBlock
          time={props.time}
          increment={props.increment}
          playerColor={props.playerColor}
        />
        <View
          style={{
            height: width * 0.1,
            aspectRatio: 1,
            borderRadius: width * 0.05,
            overflow: 'hidden',
          }}>
          <Icon name="Logo" size={width * 0.1} color="" />
        </View>

        <MenuBlock
          gameStat={props.gameStat}
          playerColor={props.playerColor}
          onPrev={props.onPrev}
          onNext={props.onNext}
          showMoveIndex={props.showMoveIndex}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    padding: width * 0.02,
    paddingHorizontal: width * 0.05,
    borderRadius: width * 0.015,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  title: {fontSize: width * 0.05, color: colors.bg},
  bottomBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
});
