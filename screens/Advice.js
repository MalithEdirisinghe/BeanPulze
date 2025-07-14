import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from '../components/Header';
import { width, height, fontSize, colors } from '../constants/theme';
import logo from '../assets/textlogo.png';

const Advice = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#fff" />
      <Header title="AI Result Advice" showBack />

      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.subtitle}>AI-POWERED</Text>
      </View>

      {/* Insight Box */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Intelligent Insights</Text>

        <View style={styles.infoBlock}>
          <Text style={styles.infoText}>Coffee Type : <Text style={styles.bold}>Arabica</Text></Text>
          <Text style={styles.infoText}>Quality Score : <Text style={styles.bold}>75%</Text></Text>
          <Text style={styles.infoText}>Quality Mode : <Text style={styles.bold}>Green (Good)</Text></Text>
        </View>

        <View style={styles.resultBox}>
          <Text style={styles.resultText}>No disease detected</Text>
        </View>

        <View style={styles.adviceBox}>
          <Text style={styles.adviceText}>Advice: Ideal for roasting. No rust found</Text>
        </View>
      </View>
    </View>
  );
};

export default Advice;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height(3),
  },
  logo: {
    width: width(30),
    height: width(30),
  },
  subtitle: {
    color: '#FF6600',
    fontWeight: 'bold',
    marginTop: height(1),
    fontSize: fontSize.medium,
  },
  card: {
    marginTop: height(3),
    marginHorizontal: width(4),
    backgroundColor: '#FFF9F5',
    borderRadius: 12,
    padding: width(4),
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderColor: '#F0E0D0',
    borderWidth: 1,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: fontSize.medium,
    color: '#333',
    marginBottom: height(1.5),
  },
  infoBlock: {
    marginBottom: height(1.5),
  },
  infoText: {
    fontSize: fontSize.small,
    color: '#222',
    marginBottom: height(0.5),
  },
  bold: {
    fontWeight: '600',
  },
  resultBox: {
    backgroundColor: '#E9FCEF',
    paddingVertical: height(1.2),
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: height(1.5),
  },
  resultText: {
    color: '#075E29',
    fontWeight: '600',
    fontSize: fontSize.small,
  },
  adviceBox: {
    backgroundColor: '#BA3D00',
    paddingVertical: height(1.2),
    borderRadius: 50,
    alignItems: 'center',
  },
  adviceText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: fontSize.small,
  },
});
