import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';
import Icon from '../icons/Icon';

const width = Dimensions.get('screen').width;

export default function TimerBlock(props: {
  time: number;
  increment: number;
  playerColor: 'white' | 'black';
}) {
  function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / (60 * 60));
    const mins = (Math.floor(seconds / 60) % 60).toString();
    const secs = (seconds % 60).toString();
    return `${hours ? hours + ':' : ''}${mins.padStart(2, '0')}:${secs.padStart(
      2,
      '0',
    )}`;
  }
  return (
    <View
      style={[
        styles.block,
        {
          backgroundColor:
            props.playerColor === 'white' ? colors.cellWhite : colors.cellBlack,
        },
      ]}>
      <Text style={styles.title}>{formatTime(props.time)}</Text>
      <View
        style={{
          height: '70%',
          width: width * 0.007,
          backgroundColor: colors.bg,
          borderRadius: width * 0.007,
        }}
      />
      <Text style={styles.title}>{props.increment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    width: width * 0.37,
    height: width * 0.12,
    paddingHorizontal: width * 0.02,
    borderRadius: width * 0.015,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  title: {
    fontSize: width * 0.05,
    color: colors.bg,
    fontWeight: 600,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
