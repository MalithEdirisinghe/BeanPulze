import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { width, height, fontSize } from '../constants/theme';
import { StatusBar } from 'expo-status-bar';
import { auth } from '../src/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import CaptureOptionModal from '../components/CaptureOptionModal';
import HelpModal from '../components/HelpModal';
import { useSelector, useDispatch } from 'react-redux';
import { updateUsername } from '../redux/userSlice';

const Home = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [helpVisible, setHelpVisible] = useState(false);
    const dispatch = useDispatch();
    const username = useSelector((state) => state.user.username)

    const handleOptionSelect = (option) => {
        setModalVisible(false);
        if (option === 'quality') {
            navigation.navigate('Capture');
        } else if (option === 'diseases') {
            navigation.navigate('Disease');
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && user.displayName) {
                dispatch(updateUsername(user.displayName));
            } else if (user) {
                const fallbackName = user.email?.split('@')[0] || 'User';
                dispatch(updateUsername(fallbackName));
            }
        });

        return unsubscribe;
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="light" backgroundColor="#2F1606" />
            <View style={styles.homeContent}>
                <ImageBackground
                    source={require('../assets/spoon.png')}
                    resizeMode="repeat"
                    style={styles.imageLayer}
                >
                    {/* Greeting Section */}
                    <View style={styles.greetingRow}>
                        <Text style={styles.greeting}>Greetings, {username}!</Text> 
                        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                            <Image
                                source={require('../assets/profile_icon.png')}
                                style={styles.profileIcon}
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.heading}>Home</Text>
                    <Text style={styles.subHeading}>Capture. Analyze. Perfect Your Bean.</Text>
                </ImageBackground>
            </View>

            {/* Quick Actions */}
            <View style={styles.textContain}>
                <Text style={styles.quickActionsText}>Quick Actions</Text>
                <Text style={styles.quickActionsSubText}>
                    Get started quickly with capture and report review tools.
                </Text>
            </View>

            {/* Quick Action Buttons */}
            <View style={styles.quickActionsContainer}>
                <TouchableOpacity
                    style={styles.quickActionButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Image
                        source={require('../assets/Rectangle.png')}
                        style={styles.icon}
                    />
                    <Text style={styles.buttonText}>Take a photo to check quality {"\n"}   OR {"\n"} Check Diseases</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickActionButton2} onPress={() => navigation.navigate('Report')}>
                    <Image
                        source={require('../assets/analyses.png')}
                        style={styles.icon}
                    />
                    <Text style={styles.buttonText}>View your past analyses</Text>
                </TouchableOpacity>
            </View>

            {/* Bottom Navigation Bar */}
            <View style={styles.bottomNav}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Image
                        source={require('../assets/home.png')}
                        style={styles.navIcon}
                    />
                    <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setHelpVisible(true)}>
                    <Image
                        source={require('../assets/help_icon.png')}
                        style={styles.navIcon}
                    />
                    <Text style={styles.navText}>Help and Support</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('More')}>
                    <Image
                        source={require('../assets/more_icon.png')}
                        style={styles.navIcon}
                    />
                    <Text style={styles.navText}>More Options</Text>
                </TouchableOpacity>
            </View>
            <CaptureOptionModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSelectOption={handleOptionSelect}
            />
            <HelpModal visible={helpVisible} onClose={() => setHelpVisible(false)} />
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    homeContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'left',
        padding: width(1),
        backgroundColor: '#2F1606',
        bottom: height(35),
    },
    textContain: {
        position: 'absolute',
        top: height(44),
        backgroundColor: 'white',
        width: width(100),
        height: height(100),
    },
    imageLayer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: width(5),
        top: height(43),
    },
    greetingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: width(90),
        paddingHorizontal: width(15),
        marginBottom: height(0),
    },

    profileIcon: {
        width: width(12),
        height: width(12),
        borderRadius: width(6),
        borderWidth: 1,
        borderColor: '#451700',
        bottom: height(32),
        left: width(5),
    },
    greeting: {
        fontSize: fontSize(5.5),
        fontWeight: 'bold',
        color: '#fff',
        bottom: height(32),
        right: width(18),
        paddingRight: width(14),
    },
    heading: {
        fontSize: fontSize(8),
        fontWeight: 'bold',
        color: '#fff',
        bottom: height(13),
        alignSelf: 'flex-start',
        right: width(2),
    },
    subHeading: {
        fontSize: fontSize(3.5),
        color: '#c3c5c5',
        marginBottom: height(2),
        bottom: height(13),
        alignSelf: 'flex-start',
        right: width(2),
    },
    quickActionsText: {
        fontSize: width(5),
        fontWeight: 'bold',
        color: '#000',
        marginTop: height(4),
        left: width(5),
        paddingBottom: height(1),
    },
    quickActionsSubText: {
        fontSize: width(4),
        fontWeight: '450',
        color: '#979c9c',
        textAlign: 'auto',
        marginBottom: height(3),
        left: width(5),
    },
    quickActionsContainer: {
        width: width(95),
        alignSelf: 'center',
        marginTop: height(4),
        paddingHorizontal: width(5),
        bottom: height(24),
        height: height(20),
    },
    quickActionButton: {
        backgroundColor: '#FFF5EE',
        borderRadius: width(4),
        padding: width(4),
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: height(3),
        height: height(15),
        elevation: 6,
    },
    quickActionButton2: {
        backgroundColor: '#FFF5EE',
        borderRadius: width(4),
        padding: width(4),
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: height(3),
        height: height(15),
        elevation: 6,
        flexDirection: 'row-reverse',
    },
    icon: {
        width: width(42),
        height: width(22),
        marginRight: width(4),
        borderRadius: width(15),
    },
    buttonText: {
        fontSize: width(4),
        fontWeight: '600',
        color: '#000',
        flexShrink: 1,
        textAlign: 'center',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        paddingVertical: height(1.5),
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    navIcon: {
        alignSelf: 'center',
        width: width(6),
        height: width(5),
    },
    navText: {
        fontSize: width(3),
        color: '#000',
        marginTop: height(0.5),
        textAlign: 'center',
    },
});
