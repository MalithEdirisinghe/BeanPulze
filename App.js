import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './components/SplashScreen';
import Authentication from './screens/Authentication';
import Signup from './screens/Signup';
import Login from './screens/Login';
import Home from './screens/Home'
import Capture from './screens/Capture'
import More from './screens/More'
import Disease from './screens/Disease'
import EditProfile from './screens/EditProfile'
import Report from './screens/Report'
import Advice from './screens/Advice';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      setInitialRoute(isLoggedIn === 'true' ? 'Home' : 'Login');
    };
    checkLogin();
  }, []);

  if (!initialRoute) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Authentication" component={Authentication} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Capture' component={Capture} />
        <Stack.Screen name='More' component={More} />
        <Stack.Screen name='EditProfile' component={EditProfile} />
        <Stack.Screen name='Disease' component={Disease} />
        <Stack.Screen name='Report' component={Report} />
        <Stack.Screen name='Advice' component={Advice} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}
