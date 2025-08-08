import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { width, height } from '../constants/theme';
import CustomBackHandler from '../components/CustomBackHandler';
import { auth } from '../src/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { makeRedirectUri } from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/userSlice';

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '1047264981366-2ucpcokkvcu5q2njv5eto9b531s6ecim.apps.googleusercontent.com',
    androidClientId: '1047264981366-3434ft65tuvpgd7m687mt6g1eceouk3g.apps.googleusercontent.com',
    redirectUri: makeRedirectUri({
      native: 'com.googleusercontent.apps.1047264981366-3434ft65tuvpgd7m687mt6g1eceouk3g:/oauthredirect',
      useProxy: false,
    }),
  });

  useEffect(() => {
    console.log('🔥 UID from Redux:', user?.uid);
  }, [user]);

  React.useEffect(() => {
    if (response?.type === 'success') {
      const id_token = response?.authentication?.idToken;

      if (!id_token) {
        console.error('❌ id_token is missing in response:', response?.authentication);
        Toast.show({
          type: 'error',
          text1: 'Google Sign-In Failed',
          text2: 'Missing Google ID token.',
        });
        return;
      }

      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(userCredential => {
          const user = userCredential.user;

          // Store in Redux
          dispatch(setUser({
            username: user.displayName || '',
            email: user.email,
            uid: user.uid,
          }));

          Toast.show({
            type: 'success',
            text1: 'Logged In',
            text2: `Welcome ${user.displayName}`,
          });

          navigation.navigate('Home');
        })
        .catch(error => {
          console.error('❌ signInWithCredential error:', error.message);
          Toast.show({
            type: 'error',
            text1: 'Google Sign-In Failed',
            text2: error.message,
          });
        });
    }
  }, [response]);

  const handleLogin = () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing Credentials',
        text2: 'Please enter email and password',
      });
      return;
    }

    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Store in Redux
        dispatch(setUser({
          username: user.displayName || '', // in case it's null
          email: user.email,
          uid: user.uid,
        }));

        await AsyncStorage.setItem('isLoggedIn', 'true');

        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: `Welcome back, ${user.displayName}`,
        });

        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      })

      .catch(error => {
        console.error('Login error:', error.code);

        let message = 'Login failed. Please try again.';

        switch (error.code) {
          case 'auth/invalid-email':
            message = 'Invalid email address';
            break;
          case 'auth/user-not-found':
            message = 'No account found with this email';
            break;
          case 'auth/wrong-password':
            message = 'Incorrect password';
            break;
          case 'auth/network-request-failed':
            message = 'Network error. Try again';
            break;
          case 'auth/invalid-credential':
            message = 'Incorrect credentials provided';
            break;
          default:
            message = error.message;
        }

        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomBackHandler navigateTo="Authentication" />

      <StatusBar barStyle="light-content" backgroundColor="#5E2C04" translucent />
      <View style={styles.baseLayer}>
        <ImageBackground
          source={require('../assets/bg-pattern.png')}
          resizeMode="cover"
          style={styles.imageLayer}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.contentWrapper}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
            />
            <Text style={styles.heading}>Welcome to BeanPulze !</Text>
            <Text style={styles.subHeading}>LOG IN</Text>

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

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && { opacity: 0.6 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginText}>LOG IN</Text>
              )}
            </TouchableOpacity>

            {/* Google Button */}
            <TouchableOpacity style={styles.googleBtn} onPress={() => promptAsync({ useProxy: false })}>
              <Image
                source={require('../assets/google_icon.png')}
                style={styles.googleIcon}
              />
              <Text style={styles.googleText}>Log In with Google</Text>
            </TouchableOpacity>

            <Text style={styles.signupPrompt}
              onPress={() => navigation.navigate('Signup')}>
              Are you don’t have an account? <Text style={{ color: '#fff' }}>Sign In</Text>
            </Text>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default Login;

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
  loginBtn: {
    backgroundColor: '#FF2E00',
    paddingVertical: height(1.5),
    borderRadius: 50,
    alignItems: 'center',
    marginTop: height(2),
  },
  loginText: {
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
  signupPrompt: {
    textAlign: 'center',
    marginTop: height(2),
    color: '#eee',
    fontSize: width(3.8),
  },
});
