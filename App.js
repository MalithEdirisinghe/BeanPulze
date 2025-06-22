import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './components/SplashScreen';
import Authentication from './screens/Authentication';
import Signup from './screens/Signup';
import Login from './screens/Login';
import Home from './screens/Home'
import Capture from './screens/Capture'
import More from './screens/More'
import EditProfile from './screens/EditProfile'
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Authentication" component={Authentication} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name='Home' component={Home}/>
        <Stack.Screen name='Capture' component={Capture}/>
        <Stack.Screen name='More' component={More}/>
        <Stack.Screen name='EditProfile' component={EditProfile}/>
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}
