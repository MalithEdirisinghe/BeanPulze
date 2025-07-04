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
        { label: 'Sour or fermented odor', value: 'sour_or_fermented_odor' },
        { label: 'Soft outer layer', value: 'soft_outer_layer' },
        { label: 'Discoloration near center cut', value: 'discoloration_near_center_cut' },
        { label: 'Chalky black tone', value: 'chalky_black_tone' },
        { label: 'Dense bean body', value: 'dense_bean_body' },
        { label: 'Ash-like odor', value: 'ash_like_odor' },
        { label: 'White or gray fuzzy growth', value: 'white_or_gray_fuzzy_growth' },
        { label: 'Musty smell', value: 'musty_smell' },
        { label: 'Slimy texture', value: 'slimy_texture' },
        { label: 'Oily outer coat', value: 'oily_outer_coat' },
        { label: 'Carbonized tips', value: 'carbonized_tips' },
        { label: 'Dull finish', value: 'dull_finish' },
        { label: 'Blue mold spots', value: 'blue_mold_spots' },
        { label: 'Sticky to touch', value: 'sticky_to_touch' },
        { label: 'Stale or moldy smell', value: 'stale_or_moldy_smell' },
        { label: 'Wrinkled shell', value: 'wrinkled_shell' },
        { label: 'Heavy moisture feel', value: 'heavy_moisture_feel' },
        { label: 'Damp odor', value: 'damp_odor' },
        { label: 'Loss of firmness', value: 'loss_of_firmness' },
        { label: 'Internal discoloration', value: 'internal_discoloration' },
        { label: 'Uniform black surface', value: 'uniform_black_surface' },
        { label: 'Tough to break', value: 'tough_to_break' },
        { label: 'Scorched taste', value: 'scorched_taste' },
        { label: 'Spore clusters', value: 'spore_clusters' },
        { label: 'Sticky appearance', value: 'sticky_appearance' },
        { label: 'Unpleasant smell', value: 'unpleasant_smell' },
        { label: 'Hairline fractures', value: 'hairline_fractures' },
        { label: 'Indentations', value: 'indentations' },
        { label: 'Flaky edges', value: 'flaky_edges' },
        { label: 'Vinegar-like smell', value: 'vinegar_like_smell' },
        { label: 'Sticky mucilage remnants', value: 'sticky_mucilage_remnants' },
        { label: 'Brownish surface tint', value: 'brownish_surface_tint' },
        { label: 'Darkened patches', value: 'darkened_patches' },
        { label: 'Swollen appearance', value: 'swollen_appearance' },
        { label: 'Resoaked appearance', value: 'resoaked_appearance' },
        { label: 'Peeling parchment', value: 'peeling_parchment' },
        { label: 'Visible moisture bubbles', value: 'visible_moisture_bubbles' },
    ];

    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const categoryOptions = [
        { label: 'Fungal', value: 'fungal' },
        { label: 'Environment', value: 'environment' },
        { label: 'Physical', value: 'physical' },
        { label: 'Fermentation', value: 'fermentation' },
    ];

    const [regionModalVisible, setRegionModalVisible] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const regionOptions = [
        { label: 'Badulla', value: 'badulla' },
        { label: 'Uva', value: 'uva' },
        { label: 'Matale', value: 'matale' },
        { label: 'Nuwara Eliya', value: 'nuwara_eliya' },
        { label: 'Hill Country', value: 'hill_country' },
        { label: 'Kandy', value: 'kandy' },
    ];

    const [dehydrateModalVisible, setDehydrateModalVisible] = useState(false);
    const [selectedDehydrate, setSelectedDehydrate] = useState(null);
    const dehydrateOptions = [
        { label: '0-4 days', value: '1' },
        { label: '4-7 days', value: '2' },
        { label: '7-10 days', value: '3-5' },
        { label: 'More than 10 days', value: '5+' },
    ];

    const [rainModalVisible, setRainModalVisible] = useState(false);
    const [selectedRain, setSelectedRain] = useState(null);
    const rainOptions = [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
    ];

    const handleSubmit = () => {
        console.log({
            symptom: selectedSymptoms,
            category: selectedCategory,
            region: selectedRegions,
            dehydrate: selectedDehydrate,
            rain: selectedRain,
        });
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
                <TouchableOpacity style={styles.customDropdown} onPress={() => setRainModalVisible(true)}>
                    <Text style={styles.dropdownText}>
                        {selectedRain
                            ? rainOptions.find(o => o.value === selectedRain)?.label
                            : 'Select option'}
                    </Text>
                </TouchableOpacity>

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
            <SelectModal
                title="Caught Rain or Mist?"
                visible={rainModalVisible}
                onClose={() => setRainModalVisible(false)}
                options={rainOptions}
                selectedValues={selectedRain}
                setSelectedValues={setSelectedRain}
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
});
