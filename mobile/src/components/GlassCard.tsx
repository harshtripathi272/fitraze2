import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../context/ThemeContext';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glow?: 'none' | 'primary' | 'accent' | 'tertiary' | 'soft';
  intensity?: 'low' | 'medium' | 'high';
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  glow = 'none',
  intensity = 'medium',
}) => {
  const {theme} = useTheme();

  const getGlowStyle = () => {
    if (glow === 'none') return {};
    
    const glowStyles = {
      primary: theme.glow.primary,
      accent: theme.glow.accent,
      tertiary: theme.glow.tertiary,
      soft: theme.glow.soft,
    };

    return glowStyles[glow] || {};
  };

  const getIntensityOpacity = () => {
    switch (intensity) {
      case 'low':
        return 0.1;
      case 'medium':
        return 0.3;
      case 'high':
        return 0.5;
      default:
        return 0.3;
    }
  };

  return (
    <View
      style={[
        styles.container,
        getGlowStyle(),
        style,
      ]}>
      <LinearGradient
        colors={[
          `${theme.colors.surface}${Math.round(getIntensityOpacity() * 255).toString(16).padStart(2, '0')}`,
          `${theme.colors.surfaceVariant}${Math.round(getIntensityOpacity() * 255).toString(16).padStart(2, '0')}`,
        ]}
        style={styles.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <View
          style={[
            styles.border,
            {
              borderColor: theme.colors.glassBorder,
            },
          ]}>
          {children}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  border: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});

export default GlassCard;
