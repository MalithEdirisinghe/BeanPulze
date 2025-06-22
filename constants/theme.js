// constants/theme.js
import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const width = (percent) => screenWidth * (percent / 100);
export const height = (percent) => screenHeight * (percent / 100);
export const fontSize = (percent) => screenWidth * (percent / 100);
