import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { width, height } from '../constants/theme';

const CaptureOptionModal = ({ visible, onClose, onSelectOption }) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Choose an Option</Text>

                    <TouchableOpacity style={styles.optionButton} onPress={() => onSelectOption('quality')}>
                        <Text style={styles.optionText}>Take Photo to Check Quality</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton} onPress={() => onSelectOption('diseases')}>
                        <Text style={styles.optionText}>Check Diseases</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default CaptureOptionModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width(85),
        backgroundColor: '#FFFFFF',
        borderRadius: width(4),
        padding: width(5),
        alignItems: 'center',
        elevation: 10,
    },
    title: {
        fontSize: width(5),
        fontWeight: 'bold',
        marginBottom: height(2),
        color: '#000',
    },
    optionButton: {
        backgroundColor: '#FF7A00',
        paddingVertical: height(1.5),
        paddingHorizontal: width(5),
        borderRadius: width(2),
        marginVertical: height(1),
        width: '100%',
        alignItems: 'center',
    },
    optionText: {
        fontSize: width(4),
        color: '#FFFFFF',
        fontWeight: '600',
    },
    cancelButton: {
        marginTop: height(2),
        backgroundColor: '#FF4D4D',
        paddingVertical: height(1.5),
        paddingHorizontal: width(5),
        borderRadius: width(2),
        width: '100%',
        alignItems: 'center',
    },
    cancelText: {
        color: '#FFFFFF',
        fontSize: width(4),
        fontWeight: '600',
    },
});
