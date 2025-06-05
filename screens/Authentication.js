import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { width, height } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';

const Authentication = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            <Image
                source={require('../assets/coffee-beans-splash-burst-aromatic-energy.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            />

            <View style={styles.logoWrapper}>
                <Image
                    source={require('../assets/BeanPulze_logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <Text style={styles.welcome}>Welcome!</Text>
            <Text style={styles.subTitle}>AI-POWERED</Text>
            <Text style={styles.caption}>Coffee Bean Checker</Text>

            <TouchableOpacity style={styles.loginBtn}>
                <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signupBtn}
                onPress={() => navigation.navigate('Signup')}
            >
                <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Authentication;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: width(120),
        height: width(110),
        top: -height(18),
        left: width(10),
        transform: [{ rotate: '270deg' }],
        position: 'absolute',
    },
    logoWrapper: {
        marginTop: height(6),
        marginBottom: height(3),
    },
    logo: {
        width: width(40),
        height: width(40),
        borderRadius: width(50),
    },
    welcome: {
        fontSize: width(8),
        color: '#fff',
        fontWeight: 'bold',
        marginTop: height(1),
    },
    subTitle: {
        fontSize: width(4.5),
        color: '#fff',
        fontWeight: '500',
    },
    caption: {
        fontSize: width(4),
        color: '#fff',
        marginBottom: height(4),
    },
    loginBtn: {
        width: '85%',
        backgroundColor: '#FF8000',
        paddingVertical: height(2),
        borderRadius: width(10),
        alignItems: 'center',
        marginBottom: height(2),
    },
    loginText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: width(4.2),
    },
    signupBtn: {
        width: '85%',
        borderColor: '#fff',
        borderWidth: 1,
        paddingVertical: height(2),
        borderRadius: width(10),
        alignItems: 'center',
    },
    signupText: {
        color: '#fff',
        fontWeight: '500',
        fontSize: width(4),
    },
});
