import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TouchableWithoutFeedback,
} from 'react-native';
import { width, height, fontSize } from '../constants/theme';

const SelectModal = ({
    title,
    visible,
    onClose,
    options = [],
    selectedValues,
    setSelectedValues,
    multi = false,
}) => {
    const handleSelect = (value) => {
        if (multi) {
            if (selectedValues.includes(value)) {
                setSelectedValues(selectedValues.filter((v) => v !== value));
            } else {
                setSelectedValues([...selectedValues, value]);
            }
        } else {
            setSelectedValues(value);
            onClose();
        }
    };

    const isSelected = (value) =>
        multi ? selectedValues.includes(value) : selectedValues === value;

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>
                            <Text style={styles.title}>{title}</Text>
                            <ScrollView contentContainerStyle={{ paddingBottom: height(4) }}>
                                {options.map((item) => (
                                    <TouchableOpacity
                                        key={item.value}
                                        onPress={() => handleSelect(item.value)}
                                        style={styles.option}
                                    >
                                        <Text style={styles.optionText}>
                                            {isSelected(item.value) ? '☑️' : '⬜️'} {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {multi && (
                                <TouchableOpacity onPress={onClose} style={styles.doneButton}>
                                    <Text style={styles.doneText}>Done</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default SelectModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width(85),
        backgroundColor: '#fff',
        borderRadius: width(3),
        padding: width(5),
        maxHeight: height(70),
    },
    title: {
        fontSize: fontSize(5),
        fontWeight: 'bold',
        marginBottom: height(2),
        textAlign: 'center',
    },
    option: {
        paddingVertical: height(1),
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    optionText: {
        fontSize: fontSize(4),
        color: '#333',
    },
    doneButton: {
        marginTop: height(2),
        backgroundColor: '#FF7A00',
        paddingVertical: height(1.5),
        borderRadius: width(2),
        alignItems: 'center',
    },
    doneText: {
        color: '#fff',
        fontSize: fontSize(4),
        fontWeight: '600',
    },
});
