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
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { width, height } from '../constants/theme';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/firebaseConfig';
import Toast from 'react-native-toast-message';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: '1047264981366-2ucpcokkvcu5q2njv5eto9b531s6ecim.apps.googleusercontent.com',
        androidClientId: '1047264981366-lc8micl2jcivoqsvk6am5k7q4ejdn1ri.apps.googleusercontent.com', // Optional for bare workflow
        iosClientId: 'YOUR_IOS_CLIENT_ID_HERE',         // Optional
        webClientId: '1047264981366-2ucpcokkvcu5q2njv5eto9b531s6ecim.apps.googleusercontent.com',
        // Using Expo's proxy redirect to avoid OAuth configuration errors
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
                    // Navigate to Home or Dashboard
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
            .then(userCredential => {
                const user = userCredential.user;
                console.log('User registered:', user.email);
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Registration successful!',
                });
                // Optionally: navigate to Home/Login
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
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
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
                            source={require('../assets/BeanPulze_logo.png')}
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
                                            : require('../assets/Eye off.png')
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
                                            : require('../assets/Eye off.png')
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
                        <TouchableOpacity style={styles.googleBtn} onPress={() => promptAsync()}>
                            <Image
                                source={require('../assets/google_icon.png')}
                                style={styles.googleIcon}
                            />
                            <Text style={styles.googleText}>Sign In with Google</Text>
                        </TouchableOpacity>

                        <Text style={styles.loginPrompt}>
                            Are you already have an account? <Text style={{ color: '#fff' }}>LogIn</Text>
                        </Text>
                    </View>
                </ImageBackground>
            </View>
        </SafeAreaView>
    );
};

export default Signup;

const styles = StyleSheet.create({
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
