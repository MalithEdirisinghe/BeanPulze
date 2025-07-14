import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { height, width, fontSize } from '../constants/theme';
import Header from '../components/Header';
import { StatusBar } from 'expo-status-bar';
import SelectModal from '../components/SelectModal';

const Disease = () => {
    const [symptomModalVisible, setSymptomModalVisible] = useState(false);
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);

    const symptomOptions = [
        { label: 'Resoaked appearance, Peeling parchment, Visible moisture bubbles', value: '0' },
        { label: 'Musty smell, Wrinkled shell, Heavy moisture feel', value: '1' },
        { label: 'Damp odor, Loss of firmness, Internal discoloration', value: '2' },
        { label: 'Rubbery texture, Color unevenness, Soft and damp interior', value: '3' },
        { label: 'Sticky to touch, Darkened patches, Swollen appearance', value: '4' },
        { label: 'Rotten fruit odor, Soft mass texture, Color fading at tips', value: '5' },
        { label: 'Acidic aroma, Wrinkled outer surface, Uneven color', value: '6' },
        { label: 'Vinegar-like smell, Sticky mucilage remnants, Brownish surface tint', value: '7' },
        { label: 'Sour or fermented odor, Soft outer layer, Discoloration near center cut', value: '8' },
        { label: 'Fruity sourness, Slimy feel, Translucent center', value: '9' },
        { label: 'Jagged breaks, Open seams, Lightweight texture', value: '10' },
        { label: 'Hairline fractures, Indentations, Flaky edges', value: '11' },
        { label: 'Splitting down middle, Irregular bean halves, Rough texture', value: '12' },
        { label: 'Long surface cracks, Exposed inner cotyledon, Dry feel', value: '13' },
        { label: 'Angular cracks, Visible stress lines, Brittle edges', value: '14' },
        { label: 'Deep black shade, Shriveled appearance, Dry cracking sound', value: '15' },
        { label: 'Chalky black tone, Dense bean body, Ash-like odor', value: '16' },
        { label: 'Uniform black surface, Tough to break, Scorched taste', value: '17' },
        { label: 'Oily outer coat, Carbonized tips, Dull finish', value: '18' },
        { label: 'Greenish specks, Powdery surface, Earthy odor', value: '19' },
        { label: 'Black mold patches, Softening surface, Mildewy aroma', value: '20' },
        { label: 'Blue mold spots, Sticky to touch, Stale or moldy smell', value: '21' },
        { label: 'Spore clusters, Sticky appearance, Unpleasant smell', value: '22' },
        { label: 'White or gray fuzzy growth, Musty smell, Slimy texture', value: '23' },
    ];

    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const categoryOptions = [
        { label: 'Environmental', value: '0' },
        { label: 'Fermentation', value: '1' },
        { label: 'Fungal', value: '2' },
        { label: 'Physical', value: '3' },
    ];

    const [regionModalVisible, setRegionModalVisible] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const regionOptions = [
        { label: 'Badulla', value: '0' },
        { label: 'Hill Country', value: '1' },
        { label: 'Kandy', value: '2' },
        { label: 'Matale', value: '3' },
        { label: 'Nuwara Eliya', value: '4' },
        { label: 'Uva', value: '5' },
    ];

    const [dehydrateModalVisible, setDehydrateModalVisible] = useState(false);
    const [selectedDehydrate, setSelectedDehydrate] = useState(null);
    const dehydrateOptions = [
        { label: '0-4 days', value: '0' },
        { label: '4-7 days', value: '2' },
        { label: '7-10 days', value: '3' },
        { label: 'More than 10 days', value: '1' },
    ];

    const [selectedRain, setSelectedRain] = useState(null);
    const rainOptions = [
        { label: 'Yes', value: '1', emoji: '🌧️' },
        { label: 'No', value: '0', emoji: '☀️' },
    ];

    // const handleSubmit = () => {
    //     console.log({
    //         symptom: selectedSymptoms,
    //         category: selectedCategory,
    //         region: selectedRegion,
    //         dehydrate: selectedDehydrate,
    //         rain: selectedRain,
    //     });
    // };
    const handleSubmit = async () => {
        // Use first selected symptom for mock (can modify to send all if API supports)
        const body = {
            Symptoms: parseInt(selectedSymptoms[0] || 0), // default to 0 if empty
            Category: parseInt(selectedCategory ?? 0),
            Region: parseInt(selectedRegion ?? 0),
            Dehydration_Duration: parseInt(selectedDehydrate ?? 0),
            Caught_Rain_or_Mist: parseInt(selectedRain ?? 0),
        };

        console.log('Submitting:', body);

        try {
            const response = await fetch('https://mocki.io/v1/149c0d1f-93e3-44be-92a2-e2261d10eb7e', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const result = await response.json();
            console.log('API Response:', result);
            // Navigate or show result here
        } catch (error) {
            console.error('API Error:', error);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null}>
            <StatusBar style="light" backgroundColor="#F4F4F4" />
            <Header title="Disease Prediction" />

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.heading}>Disease Prediction Form</Text>

                {/* SYMPTOM */}
                <Text style={styles.label}>Symptom</Text>
                <TouchableOpacity style={styles.customDropdown} onPress={() => setSymptomModalVisible(true)}>
                    <Text style={styles.dropdownText}>
                        {selectedSymptoms.length > 0
                            ? selectedSymptoms.map(val => symptomOptions.find(o => o.value === val)?.label).join(', ')
                            : 'Select symptom(s)'}
                    </Text>
                </TouchableOpacity>

                {/* CATEGORY */}
                <Text style={styles.label}>Category</Text>
                <TouchableOpacity style={styles.customDropdown} onPress={() => setCategoryModalVisible(true)}>
                    <Text style={styles.dropdownText}>
                        {selectedCategory
                            ? categoryOptions.find(o => o.value === selectedCategory)?.label
                            : 'Select category'}
                    </Text>
                </TouchableOpacity>

                {/* REGION */}
                <Text style={styles.label}>Region</Text>
                <TouchableOpacity style={styles.customDropdown} onPress={() => setRegionModalVisible(true)}>
                    <Text style={styles.dropdownText}>
                        {selectedRegion ? regionOptions.find(o => o.value === selectedRegion)?.label : 'Select region'}
                    </Text>
                </TouchableOpacity>

                {/* DEHYDRATION */}
                <Text style={styles.label}>Dehydration Duration</Text>
                <TouchableOpacity style={styles.customDropdown} onPress={() => setDehydrateModalVisible(true)}>
                    <Text style={styles.dropdownText}>
                        {selectedDehydrate
                            ? dehydrateOptions.find(o => o.value === selectedDehydrate)?.label
                            : 'Select duration'}
                    </Text>
                </TouchableOpacity>

                {/* RAIN */}
                <Text style={styles.label}>Caught Rain/Mist</Text>
                <View style={styles.radioGroup}>
                    {rainOptions.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.radioButton,
                                selectedRain === option.value && styles.radioButtonSelected,
                            ]}
                            onPress={() => {
                                setSelectedRain(option.value);
                                console.log(`Selected Rain: ${option.label} (value: ${option.value})`);
                            }}
                        >
                            <Text style={styles.radioEmoji}>{option.emoji}</Text>
                            <Text style={styles.radioText}>{option.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* SUBMIT */}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitText}>Predict Disease</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* MODALS */}
            <SelectModal
                title="Select Symptoms"
                visible={symptomModalVisible}
                onClose={() => setSymptomModalVisible(false)}
                options={symptomOptions}
                selectedValues={selectedSymptoms}
                setSelectedValues={setSelectedSymptoms}
                multi
            />
            <SelectModal
                title="Select Category"
                visible={categoryModalVisible}
                onClose={() => setCategoryModalVisible(false)}
                options={categoryOptions}
                selectedValues={selectedCategory}
                setSelectedValues={setSelectedCategory}
            />
            <SelectModal
                title="Select Region"
                visible={regionModalVisible}
                onClose={() => setRegionModalVisible(false)}
                options={regionOptions}
                selectedValues={selectedRegion}
                setSelectedValues={setSelectedRegion}
            />
            <SelectModal
                title="Select Dehydration Duration"
                visible={dehydrateModalVisible}
                onClose={() => setDehydrateModalVisible(false)}
                options={dehydrateOptions}
                selectedValues={selectedDehydrate}
                setSelectedValues={setSelectedDehydrate}
            />
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
    customDropdown: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        padding: 12,
        marginBottom: 10,
    },
    dropdownText: {
        fontSize: fontSize(4),
        color: '#333',
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
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: height(1),
        marginBottom: height(3),
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: height(1.2),
        paddingHorizontal: width(4),
        borderRadius: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    radioButtonSelected: {
        borderColor: '#FF7A00',
        backgroundColor: '#FFE8D9',
    },
    radioEmoji: {
        fontSize: fontSize(5),
        marginRight: width(1),
    },
    radioText: {
        fontSize: fontSize(4),
        color: '#333',
    },
});