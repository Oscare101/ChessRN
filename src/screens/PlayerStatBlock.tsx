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
}

export default function PlayerStatBlock(props: PlayerStatBlockProps) {
  return (
    <View
      style={{
        flex: 1,
        width: width * 0.12 * 8,
        borderColor:
          props.step === props.playerColor
            ? props.step === 'white'
              ? colors.cellWhite
              : colors.cellBlack
            : colors.shadow,
        borderWidth: width * 0.01,
        // borderRadius: width * 0.02,
        backgroundColor: colors.shadow,
        transform: [
          {rotate: props.playerColor === 'white' ? '0deg' : '180deg'},
        ],
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        {props.takenPieces
          .filter((i: PieceType['value']) => i.color !== props.playerColor)
          .map((piece: PieceType['value'], index: number) => (
            <Icon
              key={index}
              name={piece.name}
              size={width * 0.05}
              color={
                piece.color === 'white' ? colors.pieceWhite : colors.pieceBlack
              }
            />
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
