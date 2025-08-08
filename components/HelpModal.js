import React, { useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Animated,
  PanResponder,
} from 'react-native';
import { height, width, fontSize } from '../constants/theme';
import * as Haptics from 'expo-haptics';

const HelpModal = ({ visible, onClose }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[styles.modalContent, { transform: [{ translateY }] }]}
      >
        <View
          {...panResponder.panHandlers}
          onStartShouldSetResponder={() => true}
          onResponderGrant={() => {
            Haptics.selectionAsync();
          }}
        >
          <View style={styles.bar} />
        </View>

        <ScrollView contentContainerStyle={styles.innerContent}>
          <Text style={styles.title}>Help and Support</Text>
          <Text style={styles.subTitle}>How to Use BeanPulze mobile app</Text>

          <Text style={styles.step}>Step 1:</Text>
          <Text style={styles.desc}>Choose an option first</Text>
          <Text style={styles.desc}>
            (Take photo to check quality, Check disease, cancel)
          </Text>
          <Text style={styles.desc}>Option 1: Take photo to check quality,</Text>
          <Text style={styles.bullet}>
            • <Text style={styles.bold}>Quality:</Text> Basic quality standard
          </Text>
          <Text style={styles.bullet}>
            • <Text style={styles.bold}>Size:</Text> 224 x 224 input size
          </Text>

          <Text style={styles.desc}>Option 2: Check disease</Text>
          <Text style={styles.desc}>
            Fill symptoms (One or more can be select), select category, select region, Dehydration duration and Caught rain/mist (yes or no)
          </Text>

          <Text style={styles.step}>Step 2:</Text>
          <Text style={styles.desc}>View your past reports analysis</Text>

          <Text style={styles.step}>Step 3:</Text>
          <Text style={styles.desc}>More options for edit profile</Text>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    height: height(80),
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: width(6),
    borderTopRightRadius: width(6),
  },
  bar: {
    width: width(20),
    height: height(0.6),
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginVertical: height(1),
    borderRadius: width(10),
  },
  innerContent: {
    padding: width(5),
  },
  title: {
    fontSize: fontSize(5.5),
    fontWeight: 'bold',
    marginBottom: height(1.5),
  },
  subTitle: {
    fontSize: fontSize(4.5),
    fontWeight: 'bold',
    marginBottom: height(2),
  },
  step: {
    fontSize: fontSize(4.5),
    fontWeight: 'bold',
    marginTop: height(1.5),
  },
  desc: {
    fontSize: fontSize(4),
    marginBottom: height(1),
  },
  bullet: {
    fontSize: fontSize(4),
    marginLeft: width(2),
    marginBottom: height(0.5),
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default HelpModal;
