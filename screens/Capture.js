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

const Capture = () => {
    const navigation = useNavigation();
    const [image, setImage] = useState(null);

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

    const handleSendToAI = () => {
        // Replace with your actual AI send logic
        Alert.alert('Image sent to AI for analysis!');
    };

    const handleViewAdvice = () => {
        navigation.navigate('Advice');
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
                {/* <Text style={styles.captureText}>Take a photo to check quality</Text> */}
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
                    <TouchableOpacity style={styles.aiButton} onPress={handleSendToAI}>
                        <Text style={styles.buttonText}>Save Image & Send to AI</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Summary Card */}
            <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Summary</Text>
                <Text style={styles.summaryText}>Coffee Type : Arabica</Text>
                <Text style={styles.summaryText}>Quality Score : 75%</Text>
                <Text style={styles.summaryText}>Quality Mode : Green (Good)</Text>

                <View style={styles.diseaseBox}>
                    <Text style={styles.diseaseText}>No disease detected</Text>
                </View>

                <TouchableOpacity style={styles.viewAdviceButton} onPress={handleViewAdvice}>
                    <Text style={styles.buttonText}>Save & View Advice</Text>
                </TouchableOpacity>
            </View>
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
    }
});
