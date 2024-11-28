import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import rules from '../../constants/rules';
import RenderCellItem from './RenderCellItem';

export default function RenderRowItem(props: any) {
  return (
    <FlatList
      horizontal
      data={rules.columns}
      renderItem={(item: any) => (
        <RenderCellItem column={item} row={props.row} onPress={props.onPress} />
      )}
    />
  );
}

const styles = StyleSheet.create({});
