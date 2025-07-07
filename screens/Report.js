import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { width, height, fontSize, colors } from '../constants/theme';
import Header from '../components/Header';
import { StatusBar } from 'expo-status-bar';
import { format, addDays } from 'date-fns';

const reports = [
    { id: '1', label: 'High Quality', date: '20/04/2025', color: '#D1ECFF', iconColor: '#2196F3' },
    { id: '2', label: 'Medium Quality', date: '20/04/2025', color: '#D7FFE0', iconColor: '#00C853' },
    { id: '3', label: 'Defective', date: '13/04/2025', color: '#FFF3CD', iconColor: '#FF9800' },
    { id: '4', label: 'Diseased', date: '15/04/2025', color: '#FFE2E0', iconColor: '#F44336' },
];

const Report = () => {
    const [activeTab, setActiveTab] = useState('Today');
    const today = new Date();
    const [baseDate, setBaseDate] = useState(new Date());
    // const dateRange = Array.from({ length: 7 }, (_, i) => addDays(today, i - 3)); // 3 days back to 3 days ahead
    const dateRange = Array.from({ length: 30 }, (_, i) => addDays(baseDate, i - 15)); // 15 days back to 15 days ahead
    const [selectedDate, setSelectedDate] = useState(format(today, 'yyyy-MM-dd'));

    return (
        <View style={styles.container}>
            <StatusBar style="light" backgroundColor="#F9F8FD" />
            <Header title="View Past Reports" showBack />

            {/* Date Selector */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() => setBaseDate(prev => addDays(prev, -30))}
                >
                    <Text style={styles.tabText}>Last Month</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, styles.tabActive]}
                    onPress={() => {
                        setBaseDate(new Date());
                        setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
                    }}
                >
                    <Text style={styles.tabActiveText}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton]}
                    onPress={() => setBaseDate(prev => addDays(prev, 30))}
                >
                    <Text style={styles.tabText}>Next Month</Text>
                </TouchableOpacity>
            </View>

            {/* Dates Row */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.datesRow}
                contentContainerStyle={{ paddingHorizontal: width(2) }}
            >
                {dateRange.map((date, i) => {
                    const isSelected = format(date, 'yyyy-MM-dd') === selectedDate;
                    return (
                        <TouchableOpacity
                            key={i}
                            onPress={() => setSelectedDate(format(date, 'yyyy-MM-dd'))}
                            style={[styles.dateBox, isSelected && styles.selectedDate]}
                        >
                            <Text style={styles.dateText}>{format(date, 'MMM').toUpperCase()}</Text>
                            <Text style={styles.dateNum}>{format(date, 'dd')}</Text>
                            <Text style={styles.dateTextSmall}>{format(date, 'EEE').toUpperCase()}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Sorting Dropdown (static for now) */}
            <View style={styles.sortContainer}>
                <Text style={styles.sortLabel}>Sorting Options :</Text>
                <TouchableOpacity style={styles.sortButton}>
                    <Text style={styles.sortButtonText}>High Quality/Deseased ▾</Text>
                </TouchableOpacity>
            </View>

            {/* Report List */}
            <FlatList
                data={reports}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.reportItem}>
                        <View style={[styles.iconBox, { backgroundColor: item.color }]}>
                            <Ionicons name="people" size={24} color={item.iconColor} />
                        </View>
                        <View>
                            <Text style={styles.reportTitle}>{item.label}</Text>
                            <Text style={styles.reportDate}>({item.date})</Text>
                        </View>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 40 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F8FD' },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: height(1),
        backgroundColor: '#fff',
    },
    tabButton: {
        paddingVertical: height(0.7),
        paddingHorizontal: width(5),
        borderRadius: 25,
    },
    tabActive: {
        backgroundColor: '#2F1606',
    },
    tabText: { color: '#2F1606', fontWeight: '600' },
    tabActiveText: { color: '#FF7F00', fontWeight: '700' },
    datesRow: {
        paddingVertical: height(1),
        backgroundColor: '#fff',
        paddingHorizontal: width(1),
    },
    dateBox: {
        alignItems: 'center',
        paddingVertical: height(0.5),
        marginRight: width(2),
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
        width: width(14),
        height: width(15),
    },
    selectedDate: {
        backgroundColor: '#FFF6EF',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
        elevation: 2,
    },
    dateText: { fontSize: 10, color: '#888' },
    dateNum: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    dateTextSmall: { fontSize: 10, color: '#999' },
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: width(4),
        paddingVertical: height(1),
        backgroundColor: '#ECECF1',
        justifyContent: 'space-between',
    },
    sortLabel: { fontSize: 14, color: '#555' },
    sortButton: {
        backgroundColor: '#fff',
        paddingHorizontal: width(4),
        paddingVertical: height(0.6),
        borderRadius: 10,
    },
    sortButtonText: { color: '#B35500', fontWeight: '600' },
    reportItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: width(4),
        backgroundColor: '#fff',
        marginVertical: height(0.5),
        marginHorizontal: width(2),
        borderRadius: 10,
    },
    iconBox: {
        width: width(12),
        height: width(12),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginRight: width(4),
    },
    reportTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
    reportDate: { fontSize: 14, color: '#555' },
});

export default Report;
