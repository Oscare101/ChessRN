import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import rules from '../constants/rules';
import colors from '../constants/colors';

const width = Dimensions.get('screen').width;

export default function SquaresNaming() {
  return (
    <>
      <View
        style={{
          width: width * 0.02,
          flexDirection: 'column-reverse',
          alignItems: 'center',
          justifyContent: 'flex-start',
          // backgroundColor: 'red',
          height: width * 0.12 * 8,
          position: 'absolute',
          left: -width * 0.02,
          top: 0,
          zIndex: 2,
        }}>
        {rules.rows.map((row: any, index: number) => (
          <Text
            style={{
              fontSize: width * 0.03,
              fontWeight: 300,
              color: colors.pieceWhite,
              height: width * 0.12,
              textAlignVertical: 'bottom',
            }}
            key={index}>
            {row}
          </Text>
        ))}
      </View>
      <View
        style={{
          width: width * 0.02,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          height: width * 0.12 * 8,
          position: 'absolute',
          right: -width * 0.02,
          top: 0,
          zIndex: 2,
          transform: [{rotate: '180deg'}],
        }}>
        {rules.rows.map((row: any, index: number) => (
          <Text
            style={{
              fontSize: width * 0.03,
              fontWeight: 300,
              color: colors.pieceWhite,
              height: width * 0.12,
              textAlignVertical: 'bottom',
            }}
            key={index}>
            {row}
          </Text>
        ))}
      </View>
      <View
        style={{
          height: width * 0.03,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: width * 0.12 * 8,
          position: 'absolute',
          right: 0,
          top: -width * 0.04,
          zIndex: 2,
        }}>
        {rules.columns.map((row: any, index: number) => (
          <Text
            style={{
              fontSize: width * 0.03,
              fontWeight: 300,
              color: colors.pieceWhite,
              width: width * 0.12,
              textAlignVertical: 'bottom',
              transform: [{rotate: '180deg'}],
            }}
            key={index}>
            {row}
          </Text>
        ))}
      </View>
      <View
        style={{
          height: width * 0.03,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: width * 0.12 * 8,
          position: 'absolute',
          right: 0,
          bottom: -width * 0.04,
          zIndex: 2,
        }}>
        {rules.columns.map((row: any, index: number) => (
          <Text
            style={{
              fontSize: width * 0.03,
              fontWeight: 300,
              color: colors.pieceWhite,
              width: width * 0.12,
              textAlignVertical: 'bottom',
              // transform: [{rotate: '180deg'}],
            }}
            key={index}>
            {row}
          </Text>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
