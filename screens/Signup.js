import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    StatusBar,
    ImageBackground,
    ActivityIndicator,
    Platform
} from 'react-native';
import { width, height } from '../constants/theme';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/firebaseConfig';
import Toast from 'react-native-toast-message';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { signInWithCredential, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { makeRedirectUri } from 'expo-auth-session';
import { useNavigation } from '@react-navigation/native';
import CustomBackHandler from '../components/CustomBackHandler';

WebBrowser.maybeCompleteAuthSession();

const Signup = () => {
    const navigation = useNavigation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: '1047264981366-2ucpcokkvcu5q2njv5eto9b531s6ecim.apps.googleusercontent.com',
        androidClientId: '1047264981366-3434ft65tuvpgd7m687mt6g1eceouk3g.apps.googleusercontent.com',
        redirectUri: makeRedirectUri({
            native: 'com.googleusercontent.apps.1047264981366-3434ft65tuvpgd7m687mt6g1eceouk3g:/oauthredirect',
            useProxy: false,
        })
    });

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.authentication;
            const credential = GoogleAuthProvider.credential(id_token);

            signInWithCredential(auth, credential)
                .then(userCredential => {
                    Toast.show({
                        type: 'success',
                        text1: 'Logged In',
                        text2: `Welcome ${userCredential.user.email}`,
                    });
                    navigation.navigate('Home');
                })
                .catch(error => {
                    console.error('Google Sign-In Error:', error.message);
                    Toast.show({
                        type: 'error',
                        text1: 'Google Sign-In Failed',
                        text2: error.message,
                    });
                });
        }
    }, [response]);

    const handleSignUp = () => {
        if (!name || !email || !password || !confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Missing Information',
                text2: 'Please fill all fields',
            });
            return;
        }

        if (password !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Password Mismatch',
                text2: 'Passwords do not match',
            });
            return;
        }

        setLoading(true);

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;

                // ✅ Update display name
                await updateProfile(user, {
                    displayName: name,
                });

                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Registration successful!',
                });
                navigation.navigate('Login'); // Navigate to Login after successful signup
            })
            .catch(error => {
                console.error('Registration error:', error.code);

                let message = 'Something went wrong. Please try again.';

                switch (error.code) {
                    case 'auth/email-already-in-use':
                        message = 'This email is already registered.';
                        break;
                    case 'auth/invalid-email':
                        message = 'Please enter a valid email address.';
                        break;
                    case 'auth/weak-password':
                        message = 'Password should be at least 6 characters.';
                        break;
                    case 'auth/network-request-failed':
                        message = 'Network error. Please try again later.';
                        break;
                    default:
                        message = error.message;
                }
                Toast.show({
                    type: 'error',
                    text1: 'Signup Failed',
                    text2: message,
                });
            })
            .finally(() => {
                setLoading(false); // Stop loading in both success & failure
            });
    };

    return (
        <View style={styles.container}>
            <CustomBackHandler navigateTo="Authentication" />

            <StatusBar barStyle="light-content" backgroundColor="#5E2C04" translucent />

            {/* Solid Brown Background Layer */}
            <View style={styles.baseLayer}>
                {/* Pattern Image Layer */}
                <ImageBackground
                    source={require('../assets/bg-pattern.png')}
                    resizeMode="cover"
                    style={styles.imageLayer}
                    imageStyle={styles.imageStyle}
                >
                    {/* Form Content Layer */}
                    <View style={styles.contentWrapper}>
                        <Image
                            source={require('../assets/logo.png')}
                            style={styles.logo}
                        />
                        <Text style={styles.heading}>Welcome to BeanPulze !</Text>
                        <Text style={styles.subHeading}>SIGN IN</Text>

                        {/* Owner Name */}
                        <Text style={styles.label}>Owner Name :</Text>
                        <TextInput style={styles.input}
                            placeholder="Type your name"
                            placeholderTextColor="#999"
                            value={name}
                            onChangeText={setName} />
                        <Text style={styles.placeholder}>Ex: User</Text>

                        {/* Email */}
                        <Text style={styles.label}>Email :</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Type your email address"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <Text style={styles.placeholder}>Ex: user@gmail.com</Text>

                        {/* Password */}
                        <Text style={styles.label}>Password :</Text>
                        <View style={styles.passwordWrapper}>
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                secureTextEntry={!showPassword}
                                placeholder="********"
                                placeholderTextColor="#999"
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Image
                                    source={
                                        showPassword
                                            ? require('../assets/eye.png')
                                            : require('../assets/hideeye.png')
                                    }
                                    style={styles.eyeIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.placeholder}>Ex: Example@123</Text>

                        {/* Confirm Password */}
                        <Text style={styles.label}>Confirm Password :</Text>
                        <View style={styles.passwordWrapper}>
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                secureTextEntry={!showConfirm}
                                placeholder="********"
                                placeholderTextColor="#999"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                                <Image
                                    source={
                                        showConfirm
                                            ? require('../assets/eye.png')
                                            : require('../assets/hideeye.png')
                                    }
                                    style={styles.eyeIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.placeholder}>Ex: Example@123</Text>

                        {/* Sign In Button */}
                        <TouchableOpacity
                            style={[styles.signinBtn, loading && { opacity: 0.6 }]}
                            onPress={handleSignUp}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.signinText}>SIGN IN</Text>
                            )}
                        </TouchableOpacity>

                        {/* Google Sign-In */}
                        <TouchableOpacity style={styles.googleBtn} onPress={() => promptAsync({ useProxy: false })}>
                            <Image source={require('../assets/google_icon.png')} style={styles.googleIcon} />
                            <Text style={styles.googleText}>Sign In with Google</Text>
                        </TouchableOpacity>

                        <Text style={styles.loginPrompt}
                            onPress={() => navigation.navigate('Login')}>
                            Are you already have an account? <Text style={{ color: '#fff' }}>LogIn</Text>
                        </Text>
                    </View>
                </ImageBackground>
            </View>
        </View>
    );
};

export default Signup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },

    baseLayer: {
        flex: 1,
        backgroundColor: '#5E2C04',
        justifyContent: 'center',
        alignItems: 'center',
    },

    imageLayer: {
        width: width(96),
        height: height(98),
        borderRadius: 30,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5E2C04',
    },

    imageStyle: {
        borderRadius: 30,
    },

    contentWrapper: {
        width: '90%',
        paddingVertical: height(3),
    },
    logo: {
        alignSelf: 'center',
        width: width(20),
        height: width(20),
        marginBottom: height(2),
        borderRadius: width(10),
    },
    heading: {
        fontSize: width(6.2),
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    subHeading: {
        fontSize: width(5),
        color: '#FF5C00',
        textAlign: 'center',
        marginVertical: height(2),
        fontWeight: 'bold',
    },
    label: {
        color: '#fff',
        fontSize: width(4),
        fontWeight: '600',
        marginTop: height(1),
    },
    input: {
        backgroundColor: '#F9F6FC',
        borderRadius: 10,
        paddingHorizontal: width(4),
        paddingVertical: height(1.2),
        marginTop: height(1),
        color: '#000',
    },
    placeholder: {
        fontSize: width(3.2),
        color: '#ddd',
        marginBottom: height(1),
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F6FC',
        borderRadius: 10,
        paddingHorizontal: width(2),
        marginTop: height(1),
    },
    eyeIcon: {
        width: width(5),
        height: width(5),
        tintColor: '#888',
        marginLeft: width(2),
    },
    signinBtn: {
        backgroundColor: '#FF2E00',
        paddingVertical: height(1.5),
        borderRadius: 50,
        alignItems: 'center',
        marginTop: height(2),
    },
    signinText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: width(4.5),
    },
    googleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFE8C3',
        borderRadius: 50,
        justifyContent: 'center',
        marginTop: height(2),
        paddingVertical: height(1.5),
    },
    googleIcon: {
        width: width(5),
        height: width(5),
        marginRight: width(2),
    },
    googleText: {
        color: '#000',
        fontSize: width(4),
        fontWeight: '600',
    },
    loginPrompt: {
        textAlign: 'center',
        marginTop: height(2),
        color: '#eee',
        fontSize: width(3.8),
    },
});