import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { width, height, fontSize } from '../constants/theme';
import { StatusBar } from 'expo-status-bar';
import Header from '../components/Header';
import { auth } from '../src/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const More = () => {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && user.displayName) {
                setUserName(user.displayName);
            } else if (user) {
                // fallback if no display name is set
                setUserName(user.email?.split('@')[0] || 'User');
            }
        });

        return unsubscribe;
    }, []);

    const handleLogout = () => {
        // Add logout logic
    };

    return (
        <ScrollView style={styles.container}>
            <StatusBar style="dark" backgroundColor="#F4F4F4" />
            <Header title="More Options" onBackPress={() => navigation.goBack()} />

            {/* Profile Section */}
            <View style={styles.profileContainer}>
                <Image
                    source={require('../assets/profile_icon.png')}
                    style={styles.profileImage}
                />
                <View style={styles.profileTextContainer}>
                    <Text style={styles.profileName}>{userName}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                        <Text style={styles.editProfile}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Section: Contact & Policies */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact & Policies</Text>

                <TouchableOpacity style={styles.optionRow}>
                    <Ionicons name="help-circle-outline" size={24} color="#5A39A2" />
                    <Text style={styles.optionText}>Contact Us</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionRow}>
                    <Ionicons name="shield-checkmark-outline" size={24} color="#F3A105" />
                    <Text style={styles.optionText}>Privacy policy</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionRow}>
                    <Ionicons name="document-text-outline" size={24} color="#000" />
                    <Text style={styles.optionText}>Terms & Conditions</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionRow}>
                    <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
                    <Text style={styles.optionText}>About</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
            </View>

            {/* Section: User */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>User</Text>
                <TouchableOpacity style={styles.optionRow} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#C41E3A" />
                    <Text style={[styles.optionText, { color: '#C41E3A' }]}>Log out</Text>
                </TouchableOpacity>
            </View>

            {/* App Version */}
            <Text style={styles.versionText}>App Version 1.1.01</Text>
        </ScrollView>
    );
};

export default More;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: width(4),
        paddingVertical: height(2),
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerTitle: {
        fontSize: width(5),
        fontWeight: 'bold',
        marginLeft: width(4),
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: width(4),
        backgroundColor: '#EDEAF1',
    },
    profileImage: {
        width: width(15),
        height: width(15),
        borderRadius: width(7.5),
        marginRight: width(4),
    },
    profileTextContainer: {
        flex: 1,
    },
    profileName: {
        fontSize: width(4.2),
        fontWeight: 'bold',
        color: '#000',
    },
    editProfile: {
        fontSize: width(3.6),
        color: '#C15500',
        marginTop: 2,
    },
    section: {
        backgroundColor: '#F4F4F4',
        paddingHorizontal: width(4),
        marginTop: height(2),
    },
    sectionTitle: {
        fontSize: width(4),
        fontWeight: '600',
        color: '#444',
        marginBottom: height(1),
    },
    optionRow: {
        backgroundColor: '#fff',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        padding: width(4),
        marginBottom: height(1),
        elevation: 1,
        shadowColor: '#00000020',
        justifyContent: 'space-between',
    },
    optionText: {
        flex: 1,
        fontSize: width(4),
        marginLeft: width(3),
        color: '#000',
    },
    versionText: {
        textAlign: 'center',
        fontSize: width(3.5),
        color: '#444',
        marginVertical: height(3),
    },
});
