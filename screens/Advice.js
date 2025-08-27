import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from '../components/Header';
import { width, height, fontSize } from '../constants/theme';
import logo from '../assets/textlogo.png';
import { useRoute } from '@react-navigation/native';
import { format } from 'date-fns';

// Control-method pool 
const CONTROL_METHODS = [
  'Cover beans during rain, dry again if needed',
  'Avoid soaking too long, dry quickly in sun',
  'Avoid overexposure to sun and rough movement',
  'Dry immediately after pulping, monitor fermentation',
  'Store in well-ventilated dry areas',
];

// Deterministic pick so it doesn’t shuffle on every re-render
const pickStable = (key, arr) => {
  if (!arr?.length) return '';
  let h = 0;
  const s = String(key || '');
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return arr[h % arr.length];
};

const Advice = () => {
  const { params } = useRoute();
  const report = params?.report ?? {};

  const source = report?.source; // 'predictions' | 'predictions_with_image'
  const categoryRaw = report?.category || report?.label || report?.predicted_class || '';
  const category = String(categoryRaw).toLowerCase();

  const isPredictions = source === 'predictions';
  const isDisease = isPredictions && category === 'disease';
  const isPredictionsWithImage = source === 'predictions_with_image';

  // normalize createdAt/timestamp
  const createdAt = useMemo(() => {
    if (report?.createdAt instanceof Date) return report.createdAt;
    if (report?.createdAt?.toDate) return report.createdAt.toDate();
    if (report?.timestamp?.toDate) return report.timestamp.toDate();
    return null;
  }, [report]);
  const when = createdAt ? format(createdAt, 'yyyy-MM-dd HH:mm') : '';

  // helpers
  const get = (v, fb = 'Unknown') => {
    if (v === null || v === undefined) return fb;
    const s = String(v).trim();
    return s.length ? s : fb;
  };

  // predictions (disease doc shape)
  const beanQuality = report?.bean_Quality || {};
  const causeCondition = report?.cause_condition || {};
  const defectName = report?.defect_Name || {};

  const beanQualityPrediction = get(beanQuality.prediction);
  const beanQualityProbability = get(beanQuality.probability);
  const causePrediction = get(causeCondition.prediction);
  const causeProbability = get(causeCondition.probability);
  const defectPrediction = get(defectName.prediction);
  const defectProbability = get(defectName.probability);

  // predictions_with_image (image doc shape)
  const predictedClass = get(
    report?.predicted_class || report?.prediction || categoryRaw || '',
    'Unknown'
  );
  const isCoffeeBean =
    report?.is_coffee_bean === true ||
    report?.is_coffee_beans === true ||
    false;
  const coffeeBeanConf = get(
    report?.is_coffee_bean_confidence || report?.is_coffee_beans_confidence
  );
  const beanTypeConf = get(report?.bean_type_confidence);
  // Prefer remote url if you later save one
  const imageSrc = report?.imageUrl || report?.imageUri || '';

  // Random advice from sheet (stable by report)
  const adviceText = CONTROL_METHODS[Math.floor(Math.random() * CONTROL_METHODS.length)];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#fff" />
      <Header title="AI Result Advice" showBack />

      {/* Logo / Meta */}
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.subtitle}>AI-POWERED</Text>
        {!!when && <Text style={styles.timestamp}>{when} • Prediction</Text>}
      </View>

      {/* Disease (predictions) */}
      {isDisease && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Intelligent Insights</Text>

          <View style={styles.kv}>
            <Text style={styles.kvLabel}>Category</Text>
            <Text style={styles.kvValue}>Disease</Text>
          </View>

          <Text style={styles.sectionTitle}>Bean Quality</Text>
          <Text style={styles.infoText}>
            Prediction: <Text style={styles.bold}>{beanQualityPrediction}</Text>
          </Text>
          <Text style={styles.infoText}>
            Probability: <Text style={styles.bold}>{beanQualityProbability}</Text>
          </Text>

          <Text style={[styles.sectionTitle, { marginTop: height(1.5) }]}>Cause &amp; Condition</Text>
          <Text style={styles.infoText}>
            Prediction: <Text style={styles.bold}>{causePrediction}</Text>
          </Text>
          <Text style={styles.infoText}>
            Probability: <Text style={styles.bold}>{causeProbability}</Text>
          </Text>

          <Text style={[styles.sectionTitle, { marginTop: height(1.5) }]}>Defect Name</Text>
          <Text style={styles.infoText}>
            Prediction: <Text style={styles.bold}>{defectPrediction}</Text>
          </Text>
          <Text style={styles.infoText}>
            Probability: <Text style={styles.bold}>{defectProbability}</Text>
          </Text>

          <View style={[styles.resultBox, { marginTop: height(2) }]}>
            <Text style={styles.resultText}>Disease detected</Text>
          </View>

          <View style={styles.adviceBox}>
            <Text style={styles.adviceText}>Advice: {adviceText}</Text>
          </View>
        </View>
      )}

      {/* Image classification (predictions_with_image) */}
      {isPredictionsWithImage && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Image-Based Insights</Text>

          {!!imageSrc && (
            <Image
              source={{ uri: imageSrc }}
              style={styles.preview}
              resizeMode="cover"
              onError={(e) => console.log('Image load error', e.nativeEvent?.error)}
            />
          )}

          <View style={[styles.kv, { marginTop: height(1.2) }]}>
            <Text style={styles.kvLabel}>Predicted Class</Text>
            <Text style={styles.kvValue}>{predictedClass}</Text>
          </View>

          <View style={styles.kv}>
            <Text style={styles.kvLabel}>Is Coffee Bean?</Text>
            <Text style={styles.kvValue}>{isCoffeeBean ? 'Yes' : 'No'}</Text>
          </View>

          {!!coffeeBeanConf && (
            <View style={styles.kv}>
              <Text style={styles.kvLabel}>Coffee Bean Confidence</Text>
              <Text style={styles.kvValue}>{coffeeBeanConf}</Text>
            </View>
          )}

          {!!beanTypeConf && (
            <View style={styles.kv}>
              <Text style={styles.kvLabel}>Bean Type Confidence</Text>
              <Text style={styles.kvValue}>{beanTypeConf}</Text>
            </View>
          )}

          <View style={[styles.resultBox, { marginTop: height(1.5) }]}>
            <Text style={styles.resultText}>
              {isCoffeeBean ? 'Looks like coffee beans' : 'Does not look like coffee beans'}
            </Text>
          </View>

          <View style={styles.adviceBox}>
            <Text style={styles.adviceText}>Advice: {adviceText}</Text>
          </View>
        </View>
      )}

      {/* ===== C) Fallback ===== */}
      {!isDisease && !isPredictionsWithImage && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Intelligent Insights</Text>
          <Text style={styles.infoText}>
            Category: <Text style={styles.bold}>{get(report?.category, 'Unknown')}</Text>
          </Text>
          <Text style={styles.infoText}>
            Label: <Text style={styles.bold}>{get(report?.label || report?.predicted_class, 'Unknown')}</Text>
          </Text>
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>
              {category ? category.replace(/^./, c => c.toUpperCase()) : 'Result Unavailable'}
            </Text>
          </View>
          <View style={styles.adviceBox}>
            <Text style={styles.adviceText}>Advice: {adviceText}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default Advice;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  logoContainer: { alignItems: 'center', marginTop: height(3) },
  logo: { width: width(30), height: width(30) },
  subtitle: { color: '#FF6600', fontWeight: 'bold', marginTop: height(1), fontSize: fontSize.medium },
  timestamp: { color: '#888', marginTop: height(0.5), fontSize: fontSize.small },

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
  cardTitle: { fontWeight: '700', fontSize: fontSize.medium, color: '#333', marginBottom: height(1.5) },
  sectionTitle: { marginTop: height(1), marginBottom: height(0.4), fontWeight: '700', color: '#333' },
  infoText: { fontSize: fontSize.small, color: '#222', marginBottom: height(0.5) },
  bold: { fontWeight: '600' },
  kv: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: height(0.6) },
  kvLabel: { color: '#555', fontSize: fontSize.small },
  kvValue: { color: '#111', fontWeight: '700', fontSize: fontSize.small },

  resultBox: {
    backgroundColor: '#E9FCEF',
    paddingVertical: height(1.2),
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: height(1.0),
  },
  resultText: { color: '#075E29', fontWeight: '600', fontSize: fontSize.small },

  adviceBox: {
    backgroundColor: '#BA3D00',
    paddingVertical: height(1.2),
    borderRadius: 50,
    alignItems: 'center',
  },
  adviceText: { color: '#fff', fontWeight: '600', fontSize: fontSize.small },

  preview: {
    width: '100%',
    height: height(25),
    borderRadius: 10,
    backgroundColor: '#eee',
  },
});
