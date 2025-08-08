import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { width, height, fontSize } from '../constants/theme';
import { StatusBar } from 'expo-status-bar';
import Header from '../components/Header';
import { predictImage } from '../src/api/api';
import Loader from '../components/Loader';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../src/firebaseConfig';

const Capture = () => {
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [aiResult, setAiResult] = useState(null);

    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission denied', 'Camera access is required.');
            return;
        }

        Alert.alert('Choose Option', 'Select an option to proceed', [
            {
                text: 'Camera',
                onPress: async () => {
                    const result = await ImagePicker.launchCameraAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        quality: 1,
                    });

                    if (!result.canceled) {
                        setImage(result.assets[0].uri);
                    }
                },
            },
            {
                text: 'Gallery',
                onPress: async () => {
                    const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        quality: 1,
                    });

                    if (!result.canceled) {
                        setImage(result.assets[0].uri);
                    }
                },
            },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    const handleSendToAI = async () => {
        if (!image) return;
        setLoading(true);
        setAiResult(null);

        try {
            const result = await predictImage(image);
            console.log('AI Response:', result);
            setAiResult(result);

            Toast.show({
                type: 'success',
                text1: 'Analysis Complete',
                text2: `Class: ${result.predicted_class ?? 'N/A'}`,
            });

        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Image Prediction Failed',
                text2: error.message || 'Something went wrong.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleViewAdvice = async () => {
        if (!aiResult || !auth.currentUser) return;

        try {
            const userId = auth.currentUser.uid;

            await addDoc(collection(db, 'users', userId, 'predictions_with_image'), {
                timestamp: Timestamp.now(),
                imageUri: image,
                is_coffee_bean: aiResult.is_coffee_bean,
                bean_type_confidence: aiResult.bean_type_confidence,
                is_coffee_bean_confidence: aiResult.is_coffee_bean_confidence,
                predicted_class: aiResult.predicted_class,
            });

            navigation.navigate('Advice');
        } catch (error) {
            Alert.alert('Error', 'Failed to save analysis. Please try again.');
            console.error('Firestore Save Error:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <StatusBar style="light" backgroundColor="#F4F4F4" />

            <Header title="Capture" />

            {/* Image Capture Card */}
            <View style={styles.card}>
                <Image
                    source={image ? { uri: image } : require('../assets/capture.png')}
                    style={styles.coffeeImage}
                    resizeMode="cover"
                />
                {!image ? (
                    <Text style={styles.captureText}>Take a photo to check quality</Text>
                ) : (
                    <TouchableOpacity onPress={handlePickImage}>
                        <Text style={[styles.captureText, styles.retakeText]}>
                            Retake or Re-select Image
                        </Text>
                    </TouchableOpacity>
                )}

                {!image ? (
                    <TouchableOpacity style={styles.aiButton} onPress={handlePickImage}>
                        <Ionicons name="camera" size={20} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.buttonText}>Capture or Select Image</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.aiButton, loading && styles.disabledButton]}
                        onPress={handleSendToAI}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Processing...' : 'Send to AI'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Summary Card */}
            {loading ? (
                <View style={styles.loaderWrapper}>
                    <Loader />
                </View>
            ) : aiResult ? (
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Summary</Text>

                    <Text style={styles.summaryText}>Coffee Bean: {aiResult.is_coffee_bean ? 'Yes' : 'No'}</Text>
                    <Text style={styles.summaryText}>Bean Type Confidence: {aiResult.bean_type_confidence}</Text>
                    <Text style={styles.summaryText}>Prediction Confidence: {aiResult.is_coffee_bean_confidence}</Text>
                    <Text style={styles.summaryText}>Predicted Class: {aiResult.predicted_class}</Text>

                    <TouchableOpacity style={styles.viewAdviceButton} onPress={handleViewAdvice}>
                        <Text style={styles.buttonText}>Save & View Advice</Text>
                    </TouchableOpacity>
                </View>
            ) : null}
        </ScrollView>
    );
};

export default Capture;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    card: {
        backgroundColor: '#fff',
        margin: width(4),
        padding: width(4),
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    coffeeImage: {
        width: '100%',
        height: height(20),
        borderRadius: 10,
    },
    captureText: {
        fontSize: width(4),
        textAlign: 'center',
        marginVertical: height(2),
    },
    aiButton: {
        backgroundColor: '#FF7A00',
        paddingVertical: height(1.8),
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: height(1),
    },
    summaryCard: {
        backgroundColor: '#fff',
        marginHorizontal: width(4),
        marginBottom: height(2),
        padding: width(4),
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    summaryTitle: {
        fontSize: fontSize(4.5),
        fontWeight: '600',
        marginBottom: height(1),
        backgroundColor: '#FFF3EC',
        padding: width(2),
        borderRadius: 5,
    },
    summaryText: {
        fontSize: fontSize(4),
        marginVertical: height(0.5),
        color: '#000',
    },
    diseaseBox: {
        backgroundColor: '#E6FAEC',
        paddingVertical: height(1),
        marginVertical: height(2),
        borderRadius: 20,
        alignItems: 'center',
    },
    diseaseText: {
        color: '#1C5E2F',
        fontWeight: 'bold',
        fontSize: width(4),
    },
    viewAdviceButton: {
        backgroundColor: '#FF7A00',
        paddingVertical: height(1.8),
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: fontSize(4),
    },
    retakeText: {
        color: '#FF7A00',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    loaderWrapper: {
        marginHorizontal: width(4),
        marginBottom: height(2),
        paddingVertical: height(4),
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        backgroundColor: '#CCCCCC',
        opacity: 0.6,
    },
});
