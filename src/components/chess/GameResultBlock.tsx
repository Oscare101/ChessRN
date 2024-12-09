import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {GameStatInterface} from '../../constants/interfaces';
import colors from '../../constants/colors';

const width = Dimensions.get('screen').width;

export default function GameResultBlock(props: {
  gameStat: GameStatInterface;
  playerColor: 'white' | 'black';
}) {
  return (
    <>
      {props.gameStat.checkmate === props.playerColor ? (
        <View style={[styles.block, {backgroundColor: colors.error}]}>
          <Text style={styles.title}>CHECKMATE</Text>
        </View>
      ) : (
        <></>
      )}
      {props.gameStat.gameResult === 'draw' ? (
        <View style={[styles.block, {backgroundColor: colors.warning}]}>
          <Text style={styles.title}>DRAW</Text>
          <Text
            style={[styles.title, {fontSize: width * 0.04, fontWeight: 300}]}>
            {props.gameStat.comment}
          </Text>
        </View>
      ) : (
        <></>
      )}
      {props.gameStat.gameResult === props.playerColor ? (
        <View style={[styles.block, {backgroundColor: colors.success}]}>
          <Text style={styles.title}>WIN</Text>
        </View>
      ) : (
        <></>
      )}
      {props.gameStat.comment &&
      props.gameStat.gameResult ===
        (props.playerColor === 'white' ? 'black' : 'white') ? (
        <View style={[styles.block, {backgroundColor: colors.error}]}>
          <Text style={styles.title}>{props.gameStat.comment}</Text>
        </View>
      ) : (
        <></>
      )}
    </>
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
});
