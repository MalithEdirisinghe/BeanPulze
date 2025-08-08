import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import { height, width, fontSize } from '../constants/theme';

const Loader = ({ text = "PROCESSING" }) => {
  const letters = text.split('');
  
  const animatedValues = useRef(
    Array.from({ length: letters.length }, () => ({
      translateY: new Animated.Value(0),
      scale: new Animated.Value(1),
      opacity: new Animated.Value(0.6),
    }))
  ).current;

  const delays = letters.map((_, index) => index * 100);

  useEffect(() => {
    const createAnimation = (index) => {
      const { translateY, scale, opacity } = animatedValues[index];
      
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delays[index]),
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: -20,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 1.2,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.6,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          Animated.delay(2000 - delays[index]), // Adjusted for 10 letters
        ])
      );
    };

    const animations = animatedValues.map((_, index) => createAnimation(index));
    
    animations.forEach(animation => animation.start());

    return () => {
      animations.forEach(animation => animation.stop());
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {letters.map((letter, index) => (
          <Animated.View
            key={index}
            style={[
              styles.cube,
              {
                transform: [
                  { translateY: animatedValues[index].translateY },
                  { scale: animatedValues[index].scale },
                ],
                opacity: animatedValues[index].opacity,
                zIndex: Math.floor(letters.length / 2) - Math.abs(index - Math.floor(letters.length / 2)),
              },
            ]}
          >
            <View style={styles.face}>
              <Text style={styles.letter}>{letter}</Text>
            </View>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap', // Added to handle longer text
  },
  cube: {
    marginHorizontal: 2, // Reduced margin for better fit
  },
  face: {
    width: width(8), // Slightly smaller for better fit
    height: width(9),
    backgroundColor: '#FF7A00',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000ff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  letter: {
    fontSize: fontSize(4), // Slightly smaller font
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },
};

export default Loader;