import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { height, width, fontSize } from '../constants/theme';

const HelpModal = ({ visible, onClose }) => {
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
      <View style={styles.modalContent}>
        <View style={styles.bar} />
        <ScrollView contentContainerStyle={styles.innerContent}>
          <Text style={styles.title}>Help and Support</Text>
          <Text style={styles.subTitle}>How to Use BeanPulze mobile app</Text>

          <Text style={styles.step}>Step 1:</Text>
          <Text style={styles.desc}>Capture your bean image or upload from your gallery</Text>
          <Text style={styles.bullet}>• <Text style={styles.bold}>Acceptance of the image:</Text></Text>
          <Text style={styles.bullet}>• <Text style={styles.bold}>Quality:</Text></Text>
          <Text style={styles.bullet}>• <Text style={styles.bold}>Size:</Text></Text>

          <Text style={styles.step}>Step 2:</Text>
          <Text style={styles.desc}>View Intelligent Insights Report</Text>

          <Text style={styles.step}>Step 3:</Text>
          <Text style={styles.desc}>Save & Access Anytime</Text>
        </ScrollView>
      </View>
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
