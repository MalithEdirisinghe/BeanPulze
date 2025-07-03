import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { height, width, fontSize } from '../constants/theme';
import Header from '../components/Header';
import { StatusBar } from 'expo-status-bar';

const Disease = () => {
    const [openSymptom, setOpenSymptom] = useState(false);
    const [symptom, setSymptom] = useState(null);
    const [symptomItems, setSymptomItems] = useState([
        { label: 'Leaf Spot', value: 'leaf_spot' },
        { label: 'Yellowing', value: 'yellowing' },
        { label: 'Rust', value: 'rust' },
        { label: 'Mold', value: 'mold' },
    ]);

    const [openCategory, setOpenCategory] = useState(false);
    const [category, setCategory] = useState(null);
    const [categoryItems, setCategoryItems] = useState([
        { label: 'Fungal', value: 'fungal' },
        { label: 'Environment', value: 'environment' },
        { label: 'Physical', value: 'physical' },
        { label: 'Fermentation', value: 'fermentation' },
    ]);

    const [openRegion, setOpenRegion] = useState(false);
    const [region, setRegion] = useState(null);
    const [regionItems, setRegionItems] = useState([
        { label: 'Hill Country', value: 'hill' },
        { label: 'Wet Zone', value: 'wet' },
        { label: 'Dry Zone', value: 'dry' },
        { label: 'Uva Region', value: 'uva' },
    ]);

    const [openDehydrate, setOpenDehydrate] = useState(false);
    const [dehydrate, setDehydrate] = useState(null);
    const [dehydrateItems, setDehydrateItems] = useState([
        { label: '1 day', value: '1' },
        { label: '2 days', value: '2' },
        { label: '3-5 days', value: '3-5' },
        { label: 'More than 5 days', value: '5+' },
    ]);

    const [openRain, setOpenRain] = useState(false);
    const [rain, setRain] = useState(null);
    const [rainItems, setRainItems] = useState([
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
        { label: 'Not Sure', value: 'not_sure' },
    ]);

    const handleSubmit = () => {
        // TODO: send values to model
        console.log({ symptom, category, region, dehydrate, rain });
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null}>
            <StatusBar style="light" backgroundColor="#F4F4F4" />
            <Header title="Disease Prediction" />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.heading}>Disease Prediction Form</Text>

                <Text style={styles.label}>Symptom</Text>
                <DropDownPicker
                    open={openSymptom}
                    value={symptom}
                    items={symptomItems}
                    setOpen={setOpenSymptom}
                    setValue={setSymptom}
                    setItems={setSymptomItems}
                    placeholder="Select symptom"
                    zIndex={5000}
                />

                <Text style={styles.label}>Category</Text>
                <DropDownPicker
                    open={openCategory}
                    value={category}
                    items={categoryItems}
                    setOpen={setOpenCategory}
                    setValue={setCategory}
                    setItems={setCategoryItems}
                    placeholder="Select category"
                    zIndex={4000}
                />

                <Text style={styles.label}>Region</Text>
                <DropDownPicker
                    open={openRegion}
                    value={region}
                    items={regionItems}
                    setOpen={setOpenRegion}
                    setValue={setRegion}
                    setItems={setRegionItems}
                    placeholder="Select region"
                    zIndex={3000}
                />

                <Text style={styles.label}>Dehydration Duration</Text>
                <DropDownPicker
                    open={openDehydrate}
                    value={dehydrate}
                    items={dehydrateItems}
                    setOpen={setOpenDehydrate}
                    setValue={setDehydrate}
                    setItems={setDehydrateItems}
                    placeholder="Select duration"
                    zIndex={2000}
                />

                <Text style={styles.label}>Caught Rain/Mist</Text>
                <DropDownPicker
                    open={openRain}
                    value={rain}
                    items={rainItems}
                    setOpen={setOpenRain}
                    setValue={setRain}
                    setItems={setRainItems}
                    placeholder="Select option"
                    zIndex={1000}
                />

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitText}>Predict Disease</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Disease;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    content: {
        padding: width(5),
        paddingBottom: height(10),
    },
    heading: {
        fontSize: fontSize(6),
        fontWeight: 'bold',
        marginBottom: height(3),
        textAlign: 'center',
    },
    label: {
        fontSize: fontSize(4),
        marginBottom: height(1),
        marginTop: height(2),
    },
    submitButton: {
        backgroundColor: '#FF7A00',
        paddingVertical: height(2),
        borderRadius: width(2),
        marginTop: height(4),
        alignItems: 'center',
    },
    submitText: {
        color: '#fff',
        fontSize: fontSize(4),
        fontWeight: '600',
    },
});
