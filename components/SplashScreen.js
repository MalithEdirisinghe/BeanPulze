import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { width, height } from '../constants/theme'; // ✅ These are your helpers
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Authentication');
        }, 2000);
        return () => clearTimeout(timer);
    }, []);


    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/beans.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            />
            <View style={styles.logoWrapper}>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
            <Text style={styles.aiPowered}>AI-POWERED</Text>
            <StatusBar style="light" />
        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#181008',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: width(120),
        height: width(110),
        top: -height(18),
        left: width(10),
        transform: [{ rotate: '270deg' }],
    },
    logoWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: width(40),
        height: width(40),
        borderRadius: width(50),
    },
    aiPowered: {
        marginBottom: height(6),
        color: '#FF8000',
        fontSize: width(4.5),
        fontWeight: '600',
    },
});
