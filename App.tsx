import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ChessScreen from './src/screens/ChessScreen';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';

export default function App() {
  return (
    <Provider store={store}>
      <ChessScreen />
    </Provider>
  );
}

const styles = StyleSheet.create({});
