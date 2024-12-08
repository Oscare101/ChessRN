import React from 'react';
import {
  View,
  Text,
  useColorScheme,
  Modal,
  TouchableOpacity,
  Dimensions,
  Linking,
  StatusBar,
  StyleSheet,
} from 'react-native';
import colors from '../constants/colors';
import Icon from '../components/icons/Icon';

const width = Dimensions.get('window').width;

export default function PromotionModal(props: {
  visible: boolean;
  step: 'white' | 'black';
  onSelect: any;
}) {
  const piecesToPtomote = ['Queen', 'Bishop', 'Rook', 'Knight'];
  return (
    <Modal visible={props.visible} transparent={true} style={styles.modal}>
      <StatusBar barStyle={'light-content'} backgroundColor={'#000'} />
      <View
        style={[
          styles.centeredView,
          {
            backgroundColor: '#00000000',
          },
        ]}>
        <View
          style={[
            styles.modalView,
            {
              backgroundColor: colors.bg,
              transform: [{rotate: props.step === 'white' ? '0deg' : '180deg'}],
            },
          ]}>
          {piecesToPtomote.map((i: any, index: number) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => props.onSelect(i)}
              key={index}>
              <Icon
                name={i}
                size={width * 0.15}
                color={
                  props.step === 'white' ? colors.pieceWhite : colors.pieceBlack
                }
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    // for dim effect on the background
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    // card with error(message) content
    width: '90%',
    padding: width * 0.1,
    borderRadius: width * 0.05,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
