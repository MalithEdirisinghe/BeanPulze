import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { width, height, fontSize, colors } from '../constants/theme';
import Header from '../components/Header';
import { StatusBar } from 'expo-status-bar';
import { format, addDays } from 'date-fns';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../src/firebaseConfig';
import { useSelector } from 'react-redux';
import { startOfDay, endOfDay, isWithinInterval, parseISO } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Report = () => {
    const [activeTab, setActiveTab] = useState('Today');
    const today = new Date();
    const [baseDate, setBaseDate] = useState(new Date());
    const dateRange = Array.from({ length: 30 }, (_, i) => addDays(baseDate, i - 15));
    const [selectedDate, setSelectedDate] = useState(format(today, 'yyyy-MM-dd'));
    const scrollViewRef = useRef(null);
    const [reports, setReports] = useState([]);

    // Get logged-in user (assuming it's stored in redux)
    const user = useSelector(state => state.user); // check your actual state shape

    const scrollToToday = () => {
        const todayIndex = dateRange.findIndex(date =>
            format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
        );
        if (todayIndex !== -1 && scrollViewRef.current) {
            const scrollPosition = todayIndex * (width(14) + width(2)) - width(20);
            scrollViewRef.current.scrollTo({
                x: Math.max(0, scrollPosition),
                animated: true
            });
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            scrollToToday();
        }, 100);
        return () => clearTimeout(timer);
    }, [baseDate]);

    useEffect(() => {
        console.log('🧠 Redux user:', user);
    }, [user]);

    useEffect(() => {
        const fetchReports = async () => {
            if (!user?.uid) {
                console.log('❌ No UID found in Redux user.');
                return;
            }

            console.log('✅ Fetching for UID:', user.uid);
            console.log('📆 Selected date:', selectedDate);

            const predictionsPath = collection(db, 'users', user.uid, 'predictions');
            const predictionsWithImagePath = collection(db, 'users', user.uid, 'predictions_with_image');

            try {
                const [predictionsSnap, imagePredictionsSnap] = await Promise.all([
                    getDocs(predictionsPath),
                    getDocs(predictionsWithImagePath),
                ]);

                console.log('📦 Docs from predictions:', predictionsSnap.size);
                console.log('📷 Docs from predictions_with_image:', imagePredictionsSnap.size);

                const selected = parseISO(selectedDate);
                const filtered = [];

                const handleDoc = (doc, source = 'default') => {
                    const data = doc.data();

                    // Use `createdAt` for predictions and `timestamp` for predictions_with_image
                    const rawTimestamp = data.createdAt || data.timestamp;
                    const createdAt = rawTimestamp?.toDate?.();

                    console.log(`🔎 [${source}] Doc ID: ${doc.id}`);
                    console.log('  🔹 createdAt:', createdAt);

                    if (
                        createdAt &&
                        isWithinInterval(createdAt, {
                            start: startOfDay(selected),
                            end: endOfDay(selected),
                        })
                    ) {
                        console.log('✅ MATCHED:', doc.id);

                        filtered.push({
                            id: doc.id,
                            source,
                            label: data.category || data.predicted_class || 'Unknown',
                            date: format(createdAt, 'yyyy-MM-dd'),
                            color: '#D1ECFF',
                            iconColor: '#2196F3',
                            ...data,
                        });
                    } else {
                        console.log('❌ SKIPPED:', doc.id);
                    }
                };

                predictionsSnap.forEach(doc => handleDoc(doc, 'predictions'));
                imagePredictionsSnap.forEach(doc => handleDoc(doc, 'predictions_with_image'));

                console.log('✅ Final filtered reports:', filtered);
                setReports(filtered);
            } catch (error) {
                console.error('🔥 Firestore fetch error:', error);
            }
        };
        fetchReports();
    }, [selectedDate, user?.uid]);

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
                            onPress={() => {
                                const formatted = format(date, 'yyyy-MM-dd');
                                console.log('Date pressed:', formatted); // 🔍 log selected date
                                setSelectedDate(formatted);
                            }}
                            style={[
                                styles.dateBox,
                                isSelected && styles.selectedDate,
                                isToday && styles.todayDate
                            ]}
                        >
                            <Text style={[styles.dateText, isToday && styles.todayText]}>
                                {format(date, 'MMM').toUpperCase()}
                            </Text>
                            <Text style={[styles.dateNum, isToday && styles.todayText]}>
                                {format(date, 'dd')}
                            </Text>
                            <Text style={[styles.dateTextSmall, isToday && styles.todayText]}>
                                {format(date, 'EEE').toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Report List */}
            <FlatList
                data={reports}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.reportItem}>
                        <View style={[styles.iconBox, { backgroundColor: item.label?.toLowerCase() === 'disease' ? '#F9AA9D' : item.color || '#eee' }]}>
                            {/* <MaterialCommunityIcons  name="grain" size={24} color={item.iconColor || '#333'} /> */}
                            <Image source={require('../assets/beans_icon.png')}
                            style={styles.beanIcon}></Image>
                        </View>
                        <View>
                            <Text style={styles.reportTitle}>
                                {item.label?.charAt(0).toUpperCase() + item.label?.slice(1)}
                            </Text>
                            <Text style={styles.reportDate}>({item.date})</Text>
                        </View>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 40 }}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
                        No reports found for selected date.
                    </Text>
                }
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
        borderWidth: width(0.3),
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
        maxHeight: height(15)
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
        top: height(5)
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
    beanIcon: {
        height: height(3.15),
        width: width(6.6)
    },
    dropdownItemText: {
        fontSize: 14,
        color: '#B35500',
    },
    reportTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
    reportDate: { fontSize: 14, color: '#555' },
});

export default Report;