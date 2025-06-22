import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { width, height, fontSize } from '../constants/theme';
import Header from '../components/Header';
import { auth } from '../src/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const EditProfile = () => {
    const [username, setUsername] = useState('hansani_a');
    const [email, setEmail] = useState('user@gmail.com');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email);
                setUserName(user.displayName)
            }
        });

        return unsubscribe;
    }, []);

    const clearInput = (setter) => () => setter('');

    const handleUpdate = () => {
        // Add update logic here
    };

    return (
        <ScrollView style={styles.container}>
            <Header title="Profile" />
            <View style={styles.profileCard}>
                <Image
                    source={require('../assets/profile_banner.jpg')}
                    style={styles.banner}
                />
                <View style={styles.profileTextOverlay}>
                    <Text style={styles.profileName}>{userName || 'Username'}</Text>
                    <Text style={styles.profileEmail}>{userEmail || 'email@example.com'}</Text>
                </View>
            </View>

            <View style={styles.form}>
                {[
                    { label: 'New Username', value: username, setter: setUsername },
                    { label: 'New Email', value: email, setter: setEmail },
                    { label: 'Current Password', value: currentPassword, setter: setCurrentPassword, secure: true },
                    { label: 'New Password', value: newPassword, setter: setNewPassword, secure: true },
                    { label: 'Confirm New Password', value: confirmPassword, setter: setConfirmPassword, secure: true },
                ].map(({ label, value, setter, secure = false }, i) => (
                    <View key={i} style={styles.inputGroup}>
                        <Text style={styles.label}>{label}</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder={label.toLowerCase()}
                                placeholderTextColor="#999"
                                value={value}
                                secureTextEntry={secure}
                                onChangeText={setter}
                            />
                            <TouchableOpacity onPress={clearInput(setter)}>
                                <Ionicons name="close-circle" size={20} color="#999" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                    <Text style={styles.updateText}>Update</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    profileCard: {
        marginHorizontal: width(4),
        marginTop: height(2),
        position: 'relative',
    },
    banner: {
        width: '100%',
        height: height(20),
        borderRadius: 14,
    },
    profileTextOverlay: {
        position: 'absolute',
        left: width(4),
        bottom: height(2),
    },
    profileName: {
        fontSize: fontSize(4.5),
        fontWeight: 'bold',
        color: '#fff',
    },
    profileEmail: {
        fontSize: fontSize(3.5),
        color: '#fff',
        marginTop: 2,
    },
    form: {
        marginTop: height(2),
        paddingHorizontal: width(4),
    },
    inputGroup: {
        marginBottom: height(2),
    },
    label: {
        fontSize: width(3.5),
        color: '#6e6e6e',
        marginBottom: height(0.8),
    },
    inputWrapper: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: width(4),
        paddingVertical: height(1.5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
    },
    input: {
        flex: 1,
        color: '#000',
    },
    updateButton: {
        backgroundColor: '#FF7A00',
        paddingVertical: height(2),
        borderRadius: 10,
        alignItems: 'center',
        marginTop: height(2),
    },
    updateText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: width(4),
    },
});
