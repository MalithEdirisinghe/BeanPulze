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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { width, height } from '../constants/theme';

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

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
                        <TextInput style={styles.input} placeholder="Type your name" placeholderTextColor="#999" />
                        <Text style={styles.placeholder}>Ex: User</Text>

                        {/* Email */}
                        <Text style={styles.label}>Email :</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Type your email address"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
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
                        <TouchableOpacity style={styles.signinBtn}>
                            <Text style={styles.signinText}>SIGN IN</Text>
                        </TouchableOpacity>

                        {/* Google Sign-In */}
                        <TouchableOpacity style={styles.googleBtn}>
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
