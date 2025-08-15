import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import {useTheme} from '../context/ThemeContext';

interface StartupSplashProps {
  onComplete: () => void;
}

const {width, height} = Dimensions.get('window');

const StartupSplash: React.FC<StartupSplashProps> = ({onComplete}) => {
  const {theme} = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo entrance animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        {iterations: 2},
      ),
    ]).start(() => {
      setTimeout(onComplete, 500);
    });
  }, [fadeAnim, scaleAnim, glowAnim, onComplete]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <LinearGradient
      colors={theme.colors.gradientBackground}
      style={styles.container}>
      {/* Background particles */}
      <View style={styles.particlesContainer}>
        {Array.from({length: 20}).map((_, i) => (
          <Animatable.View
            key={i}
            animation="pulse"
            iterationCount="infinite"
            duration={2000 + Math.random() * 2000}
            delay={Math.random() * 3000}
            style={[
              styles.particle,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                backgroundColor: theme.colors.primary,
              },
            ]}
          />
        ))}
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo container */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{scale: scaleAnim}],
            },
          ]}>
          {/* Glow effect */}
          <Animated.View
            style={[
              styles.glow,
              {
                opacity: glowOpacity,
              },
            ]}>
            <LinearGradient
              colors={theme.colors.gradientPrimary}
              style={styles.glowGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
            />
          </Animated.View>

          {/* Logo text */}
          <Text style={[styles.logoText, {color: theme.colors.primary}]}>
            FitRaze
          </Text>
        </Animated.View>

        {/* Loading dots */}
        <Animatable.View
          animation="fadeInUp"
          delay={1000}
          style={styles.loadingContainer}>
          <View style={styles.dotsContainer}>
            {Array.from({length: 3}).map((_, i) => (
              <Animatable.View
                key={i}
                animation="pulse"
                iterationCount="infinite"
                duration={1000}
                delay={i * 200}
                style={[
                  styles.dot,
                  {backgroundColor: theme.colors.primary},
                ]}
              />
            ))}
          </View>
        </Animatable.View>

        {/* Tagline */}
        <Animatable.Text
          animation="fadeInUp"
          delay={1500}
          style={[styles.tagline, {color: theme.colors.textSecondary}]}>
          Your Fitness Journey Starts Here
        </Animatable.Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    opacity: 0.6,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 100,
    borderRadius: 50,
  },
  glowGradient: {
    flex: 1,
    borderRadius: 50,
    opacity: 0.3,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
  },
  loadingContainer: {
    marginTop: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  tagline: {
    fontSize: 16,
    marginTop: 30,
    fontWeight: '500',
    letterSpacing: 1,
  },
});

export default StartupSplash;
