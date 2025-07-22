import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { fontSize } from '../constants/theme';
import { db, auth } from '../src/firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import Toast from 'react-native-toast-message';

const ResultModal = ({ visible, onClose, result, category = 'default' }) => {
    const [loading, setLoading] = React.useState(false);

    const handleSave = async () => {
        if (!result) return;

        const userId = auth.currentUser?.uid;
        if (!userId) {
            Toast.show({
                type: 'error',
                text1: 'User not logged in',
                text2: 'Please login to save predictions.',
            });
            return;
        }

        setLoading(true);

        try {
            const payload = {
                defect_Name: result?.defect_Name || null,
                cause_condition: result?.cause_condition || null,
                bean_Quality: result?.bean_Quality || null,
                category: category || null,
                createdAt: Timestamp.now(),
            };

            await addDoc(collection(db, 'users', userId, 'predictions'), payload);

            Toast.show({
                type: 'success',
                text1: 'Saved Successfully',
                text2: 'Your prediction was saved securely.',
            });

            onClose();
        } catch (error) {
            console.error('Firestore Save Error:', error);
            Toast.show({
                type: 'error',
                text1: 'Save Failed',
                text2: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Prediction Result</Text>

                    {result?.defect_Name && (
                        <View style={styles.section}>
                            <Text style={styles.label}>Defect:</Text>
                            <Text style={styles.value}>{result.defect_Name.prediction}</Text>
                            <Text style={styles.probability}>Confidence: {result.defect_Name.probability}</Text>
                        </View>
                    )}

                    {result?.cause_condition && (
                        <View style={styles.section}>
                            <Text style={styles.label}>Cause:</Text>
                            <Text style={styles.value}>{result.cause_condition.prediction}</Text>
                            <Text style={styles.probability}>Confidence: {result.cause_condition.probability}</Text>
                        </View>
                    )}

                    {result?.bean_Quality && (
                        <View style={styles.section}>
                            <Text style={styles.label}>Bean Quality:</Text>
                            <Text style={styles.value}>{result.bean_Quality.prediction}</Text>
                            <Text style={styles.probability}>Confidence: {result.bean_Quality.probability}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Save</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ResultModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '85%',
    },
    title: {
        fontSize: fontSize(5.5),
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    section: {
        marginBottom: 15,
    },
    label: {
        fontSize: fontSize(4),
        fontWeight: '600',
        color: '#555',
    },
    value: {
        fontSize: fontSize(4),
        color: '#222',
        marginTop: 4,
    },
    probability: {
        fontSize: fontSize(3.5),
        color: '#888',
        marginTop: 2,
    },
    button: {
        marginTop: 10,
        backgroundColor: '#FF7A00',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButton: {
        marginTop: 10,
        backgroundColor: '#28A745',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: fontSize(4),
        fontWeight: '600',
    },
});
