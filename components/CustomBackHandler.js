import React, { useCallback } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const CustomBackHandler = ({ navigateTo }) => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate(navigateTo); // navigate to passed screen name
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [navigation, navigateTo])
  );

  return null;
};

export default CustomBackHandler;
