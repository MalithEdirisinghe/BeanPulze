import React, { useState, useRef, useEffect } from 'react';
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
    const dateRange = Array.from({ length: 30 }, (_, i) => addDays(baseDate, i - 15));
    const [selectedDate, setSelectedDate] = useState(format(today, 'yyyy-MM-dd'));
    const scrollViewRef = useRef(null);
    const [sortVisible, setSortVisible] = useState(false);
    const [selectedSort, setSelectedSort] = useState('All');

    // Function to scroll to today's date
    const scrollToToday = () => {
        const todayIndex = dateRange.findIndex(date =>
            format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
        );

        if (todayIndex !== -1 && scrollViewRef.current) {
            // Calculate scroll position (each date box width + margin)
            const scrollPosition = todayIndex * (width(14) + width(2)) - width(20); // Offset to center
            scrollViewRef.current.scrollTo({
                x: Math.max(0, scrollPosition),
                animated: true
            });
        }
    };

    // Scroll to today when component mounts or baseDate changes
    useEffect(() => {
        // Small delay to ensure ScrollView is rendered
        const timer = setTimeout(() => {
            scrollToToday();
        }, 100);

        return () => clearTimeout(timer);
    }, [baseDate]);

    const filteredReports = selectedSort === 'All'
        ? reports
        : reports.filter(r => r.label === selectedSort);

    return (
        <View style={styles.container}>
            <StatusBar style="light" backgroundColor="#F9F8FD" />
            <Header title="View Past Reports" showBack />

            {/* Date Selector */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() => {
                        const newDate = addDays(baseDate, -30);
                        setBaseDate(newDate);
                        setActiveTab('Last Month');
                    }}
                >
                    <Text style={[styles.tabText, activeTab === 'Last Month' && styles.tabActiveText]}>Last Month</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'Today' && styles.tabActive]}
                    onPress={() => {
                        setBaseDate(new Date());
                        setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
                        setActiveTab('Today');
                    }}
                >
                    <Text style={[styles.tabText, activeTab === 'Today' && styles.tabActiveText]}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'Next Month' && styles.tabActive]}
                    onPress={() => {
                        const newDate = addDays(baseDate, 30);
                        setBaseDate(newDate);
                        setActiveTab('Next Month');
                    }}
                >
                    <Text style={[styles.tabText, activeTab === 'Next Month' && styles.tabActiveText]}>Next Month</Text>
                </TouchableOpacity>
            </View>

            {/* Dates Row */}
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.datesRow}
                contentContainerStyle={{ paddingHorizontal: width(2) }}
            >
                {dateRange.map((date, i) => {
                    const isSelected = format(date, 'yyyy-MM-dd') === selectedDate;
                    const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

                    return (
                        <TouchableOpacity
                            key={i}
                            onPress={() => setSelectedDate(format(date, 'yyyy-MM-dd'))}
                            style={[
                                styles.dateBox,
                                isSelected && styles.selectedDate,
                                isToday && styles.todayDate
                            ]}
                        >
                            <Text style={[
                                styles.dateText,
                                isToday && styles.todayText
                            ]}>
                                {format(date, 'MMM').toUpperCase()}
                            </Text>
                            <Text style={[
                                styles.dateNum,
                                isToday && styles.todayText
                            ]}>
                                {format(date, 'dd')}
                            </Text>
                            <Text style={[
                                styles.dateTextSmall,
                                isToday && styles.todayText
                            ]}>
                                {format(date, 'EEE').toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Sorting Dropdown (static for now) */}
            <View style={styles.sortContainer}>
                <Text style={styles.sortLabel}>Sorting Options :</Text>
                <TouchableOpacity
                    style={styles.sortButton}
                    onPress={() => setSortVisible(!sortVisible)}
                >
                    <Text style={styles.sortButtonText}>
                        {selectedSort} ▾
                    </Text>
                </TouchableOpacity>
            </View>

            {sortVisible && (
                <View style={styles.dropdown}>
                    {['All', 'High Quality', 'Medium Quality', 'Defective', 'Diseased'].map(option => (
                        <TouchableOpacity
                            key={option}
                            style={styles.dropdownItem}
                            onPress={() => {
                                setSelectedSort(option);
                                setSortVisible(false);
                            }}
                        >
                            <Text style={styles.dropdownItemText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Report List */}
            <FlatList
                data={filteredReports}
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
    todayDate: {
        backgroundColor: '#FFF3E9',
    },
    dateText: { fontSize: 10, color: '#888' },
    dateNum: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    dateTextSmall: { fontSize: 10, color: '#999' },
    todayText: { color: '#000' },
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
    dropdown: {
        backgroundColor: '#fff',
        marginHorizontal: width(4),
        borderRadius: 8,
        marginBottom: height(1),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    dropdownItem: {
        paddingVertical: height(1),
        paddingHorizontal: width(4),
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    dropdownItemText: {
        fontSize: 14,
        color: '#B35500',
    },
    reportTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
    reportDate: { fontSize: 14, color: '#555' },
});

export default Report;