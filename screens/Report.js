// // Report.js
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
import { width, height } from '../constants/theme';
import Header from '../components/Header';
import { StatusBar } from 'expo-status-bar';
import { format, addDays } from 'date-fns';
import {
    collection,
    query,
    where,
    getDocs,
    Timestamp,
} from 'firebase/firestore';
import { db } from '../src/firebaseConfig';
import { useSelector } from 'react-redux';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import Loader from '../components/Loader';
import { useNavigation } from '@react-navigation/native';

const Report = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Today');
    const today = new Date();
    const [baseDate, setBaseDate] = useState(new Date());
    const dateRange = Array.from({ length: 30 }, (_, i) => addDays(baseDate, i - 15));
    const [selectedDate, setSelectedDate] = useState(format(today, 'yyyy-MM-dd'));
    const scrollViewRef = useRef(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get logged-in user (assuming it's stored in redux)
    const user = useSelector((state) => state.user);

    const scrollToToday = () => {
        const todayIndex = dateRange.findIndex(
            (date) => format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
        );
        if (todayIndex !== -1 && scrollViewRef.current) {
            const scrollPosition = todayIndex * (width(14) + width(2)) - width(20);
            scrollViewRef.current.scrollTo({
                x: Math.max(0, scrollPosition),
                animated: true,
            });
        }
    };

    useEffect(() => {
        const timer = setTimeout(scrollToToday, 100);
        return () => clearTimeout(timer);
    }, [baseDate]);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            setReports([]);
            try {
                if (!user?.uid) {
                    console.log('❌ No UID found in Redux user.');
                    setLoading(false);
                    return;
                }

                // Selected day's time window
                const selected = parseISO(selectedDate);
                const start = startOfDay(selected);
                const end = endOfDay(selected);

                const startTs = Timestamp.fromDate(start);
                const endTs = Timestamp.fromDate(end);

                // Build one query per collection, filtered by its own timestamp field
                const predictionsCol = collection(db, 'users', user.uid, 'predictions');
                const predictionsQ = query(
                    predictionsCol,
                    where('createdAt', '>=', startTs),
                    where('createdAt', '<=', endTs)
                );

                const imgPredCol = collection(db, 'users', user.uid, 'predictions_with_image');
                const imgPredQ = query(
                    imgPredCol,
                    where('timestamp', '>=', startTs),
                    where('timestamp', '<=', endTs)
                );

                const [predictionsSnap, imagePredictionsSnap] = await Promise.all([
                    getDocs(predictionsQ),
                    getDocs(imgPredQ),
                ]);

                const results = [];

                predictionsSnap.forEach((doc) => {
                    const data = doc.data();
                    const createdAt = data?.createdAt?.toDate?.();
                    if (!createdAt) return;

                    results.push({
                        id: doc.id,
                        source: 'predictions',
                        label: data.category || data.predicted_class || 'Unknown',
                        date: format(createdAt, 'yyyy-MM-dd'),
                        createdAt,
                        // spread the whole doc so Advice can show everything
                        ...data,
                    });
                });

                imagePredictionsSnap.forEach((doc) => {
                    const data = doc.data();
                    const ts = data?.timestamp?.toDate?.();
                    if (!ts) return;

                    results.push({
                        id: doc.id,
                        source: 'predictions_with_image',
                        label: data.category || data.predicted_class || 'Unknown',
                        date: format(ts, 'yyyy-MM-dd'),
                        createdAt: ts,
                        ...data,
                    });
                });

                const normalize = (data, source) => {
                    // Coffee type candidates your backend may use:
                    const coffeeType =
                        data.coffeeType ?? data.beanType ?? data.bean ?? data.variety ?? data.species ?? null;

                    // Quality score candidates (normalize to 0..100)
                    const rawScore = data.qualityScore ?? data.score ?? data.confidence ?? null;
                    let qualityScore = null;
                    if (rawScore != null) {
                        const num = Number(rawScore);
                        if (!Number.isNaN(num)) {
                            qualityScore = num <= 1 ? +(num * 100).toFixed(1) : +num.toFixed(1);
                        }
                    }

                    // Quality mode: prefer explicit field from DB; else derive from score
                    const explicitMode =
                        data.qualityMode ?? data.quality_label ?? data.grade ?? null;

                    const derivedMode =
                        qualityScore == null
                            ? null
                            : qualityScore >= 80
                                ? 'Green (Good)'
                                : qualityScore >= 60
                                    ? 'Yellow (Fair)'
                                    : 'Red (Low)';

                    const qualityMode = explicitMode ?? derivedMode ?? null;

                    return {
                        coffeeType,
                        qualityMode,
                        qualityScore,
                    };
                };

                // Optional: sort by time descending
                results.sort((a, b) => (b.createdAt?.getTime?.() ?? 0) - (a.createdAt?.getTime?.() ?? 0));

                setReports(results);
            } catch (err) {
                console.error('🔥 Firestore fetch error:', err);
            } finally {
                setLoading(false);
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
                    <Text style={[styles.tabText, activeTab === 'Last Month' && styles.tabActiveText]}>
                        Last Month
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'Today' && styles.tabActive]}
                    onPress={() => {
                        const now = new Date();
                        setBaseDate(now);
                        setSelectedDate(format(now, 'yyyy-MM-dd'));
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
                    <Text style={[styles.tabText, activeTab === 'Next Month' && styles.tabActiveText]}>
                        Next Month
                    </Text>
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
                                setSelectedDate(formatted);
                            }}
                            style={[
                                styles.dateBox,
                                isSelected && styles.selectedDate,
                                isToday && styles.todayDate,
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
            {loading ? (
                <Loader text="LOADING" />
            ) : (
                <FlatList
                    data={reports}
                    keyExtractor={(item) => `${item.source}:${item.id}`}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Advice', { report: item })}
                            style={styles.reportItem}
                        >
                            <View
                                style={[
                                    styles.iconBox,
                                    {
                                        backgroundColor:
                                            (item.label?.toLowerCase?.() === 'disease' && '#F9AA9D') ||
                                            '#D1ECFF',
                                    },
                                ]}
                            >
                                <Image
                                    source={require('../assets/beans.png')}
                                    style={styles.beanIcon}
                                    resizeMode="contain"
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text numberOfLines={1} style={styles.reportTitle}>
                                    {(item.label ?? 'Unknown')
                                        .toString()
                                        .replace(/^./, (c) => c.toUpperCase())}
                                </Text>
                                <Text style={styles.reportDate}>
                                    ({item.date}) • {item.source === 'predictions_with_image' ? 'With Image' : 'Text'}
                                </Text>
                            </View>
                            <Text style={{ color: '#B35500', fontWeight: '600' }}>View</Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
                            No reports found for selected date.
                        </Text>
                    }
                />
            )}
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
        maxHeight: height(15),
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
    todayDate: { backgroundColor: '#FFF3E9' },
    dateText: { fontSize: 10, color: '#888' },
    dateNum: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    dateTextSmall: { fontSize: 10, color: '#999' },
    todayText: { color: '#000' },
    reportItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: width(4),
        backgroundColor: '#fff',
        marginVertical: height(0.5),
        marginHorizontal: width(2),
        borderRadius: 10,
        top: height(1),
    },
    iconBox: {
        width: width(12),
        height: width(12),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginRight: width(4),
    },
    beanIcon: { height: height(3.15), width: width(6.6) },
    reportTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
    reportDate: { fontSize: 14, color: '#555' },
});

export default Report;
