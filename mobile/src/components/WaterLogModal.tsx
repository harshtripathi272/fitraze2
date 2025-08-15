import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';
import * as Animatable from 'react-native-animatable';

import {useTheme} from '../context/ThemeContext';
import GlassCard from './GlassCard';

const {width} = Dimensions.get('window');

interface WaterLogModalProps {
  visible: boolean;
  onClose: () => void;
  currentIntake: number;
  goal: number;
  onWaterAdded: (amount: number) => void;
}

const quickAmounts = [
  {amount: 250, label: 'Glass', icon: 'cup'},
  {amount: 500, label: 'Bottle', icon: 'bottle-soda'},
  {amount: 1000, label: 'Large', icon: 'bottle-wine'},
];

const WaterLogModal: React.FC<WaterLogModalProps> = ({
  visible,
  onClose,
  currentIntake,
  goal,
  onWaterAdded,
}) => {
  const {theme} = useTheme();
  const [customAmount, setCustomAmount] = useState(250);
  const [isIceMode, setIsIceMode] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const bubbleAnim = useRef(new Animated.Value(0)).current;

  const progress = Math.min((currentIntake / goal) * 100, 100);

  useEffect(() => {
    if (visible) {
      // Animate water fill
      Animated.timing(animatedHeight, {
        toValue: progress,
        duration: 1000,
        useNativeDriver: false,
      }).start();

      // Bubble animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(bubbleAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(bubbleAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [visible, progress, animatedHeight, bubbleAnim]);

  const handleAddWater = (amount: number) => {
    onWaterAdded(amount);
  };

  const waterHeight = animatedHeight.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 150],
    extrapolate: 'clamp',
  });

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown">
      <LinearGradient
        colors={theme.colors.gradientSurface}
        style={styles.container}>
        <View style={styles.header}>
          <View style={styles.handle} />
          <View style={styles.headerContent}>
            <Icon name="water" size={24} color={theme.colors.primary} />
            <Text style={[styles.title, {color: theme.colors.text}]}>
              Add Water
            </Text>
          </View>
        </View>

        {/* Water Bottle Animation */}
        <View style={styles.bottleSection}>
          <View style={styles.bottleContainer}>
            <View style={[styles.bottle, {borderColor: theme.colors.primary}]}>
              {/* Water fill */}
              <Animated.View
                style={[
                  styles.waterFill,
                  {
                    height: waterHeight,
                    backgroundColor: isIceMode ? theme.colors.primary : theme.colors.accent,
                  },
                ]}>
                {/* Bubbles */}
                {progress > 0 && (
                  <View style={styles.bubblesContainer}>
                    {Array.from({length: 5}).map((_, i) => (
                      <Animatable.View
                        key={i}
                        animation="fadeInUp"
                        iterationCount="infinite"
                        duration={2000 + i * 200}
                        style={[
                          styles.bubble,
                          {
                            left: `${20 + i * 15}%`,
                            backgroundColor: 'rgba(255, 255, 255, 0.6)',
                          },
                        ]}
                      />
                    ))}
                  </View>
                )}
              </Animated.View>

              {/* Progress text */}
              <View style={styles.progressText}>
                <Text style={[styles.progressPercent, {color: theme.colors.primary}]}>
                  {Math.round(progress)}%
                </Text>
                <Text style={[styles.progressAmount, {color: theme.colors.textSecondary}]}>
                  {(currentIntake / 1000).toFixed(1)}L
                </Text>
              </View>
            </View>

            {/* Goal status */}
            <View style={styles.goalStatus}>
              <Text style={[styles.goalText, {color: theme.colors.textSecondary}]}>
                Daily Progress
              </Text>
              <Text style={[styles.goalNumbers, {color: theme.colors.text}]}>
                {(currentIntake / 1000).toFixed(1)}L of {(goal / 1000).toFixed(1)}L
              </Text>
              {progress >= 100 && (
                <Animatable.View animation="bounceIn" style={styles.goalBadge}>
                  <Icon name="trophy" size={16} color={theme.colors.accent} />
                  <Text style={[styles.goalBadgeText, {color: theme.colors.accent}]}>
                    Goal Reached! 🎉
                  </Text>
                </Animatable.View>
              )}
            </View>
          </View>
        </View>

        {/* Ice Mode Toggle */}
        <GlassCard style={styles.iceModeCard} glow="soft">
          <TouchableOpacity
            style={styles.iceModeContent}
            onPress={() => setIsIceMode(!isIceMode)}
            activeOpacity={0.8}>
            <View style={styles.iceModeLeft}>
              <Icon
                name="snowflake"
                size={20}
                color={isIceMode ? theme.colors.primary : theme.colors.textSecondary}
              />
              <Text style={[styles.iceModeText, {color: theme.colors.text}]}>
                Ice Mode
              </Text>
            </View>
            <View
              style={[
                styles.toggle,
                {
                  backgroundColor: isIceMode ? theme.colors.primary : theme.colors.border,
                },
              ]}>
              <View
                style={[
                  styles.toggleKnob,
                  {
                    backgroundColor: theme.colors.background,
                    transform: [{translateX: isIceMode ? 20 : 0}],
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
        </GlassCard>

        {/* Quick Add Buttons */}
        <View style={styles.quickAddSection}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Quick Add
          </Text>
          <View style={styles.quickButtonsRow}>
            {quickAmounts.map(item => (
              <TouchableOpacity
                key={item.amount}
                style={styles.quickButton}
                onPress={() => handleAddWater(item.amount)}
                activeOpacity={0.8}>
                <GlassCard style={styles.quickButtonCard} glow="primary">
                  <Icon name={item.icon} size={24} color={theme.colors.primary} />
                  <Text style={[styles.quickButtonAmount, {color: theme.colors.text}]}>
                    {item.amount}ml
                  </Text>
                  <Text style={[styles.quickButtonLabel, {color: theme.colors.textSecondary}]}>
                    {item.label}
                  </Text>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Amount */}
        <View style={styles.customSection}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Custom Amount
          </Text>
          <View style={styles.customInputRow}>
            <TextInput
              style={[styles.customInput, {color: theme.colors.text, borderColor: theme.colors.border}]}
              value={customAmount.toString()}
              onChangeText={text => setCustomAmount(parseInt(text) || 0)}
              keyboardType="numeric"
              placeholder="250"
              placeholderTextColor={theme.colors.textSecondary}
            />
            <Text style={[styles.unitText, {color: theme.colors.textSecondary}]}>
              ml
            </Text>
            <TouchableOpacity
              style={[styles.addCustomButton, {backgroundColor: theme.colors.accent}]}
              onPress={() => handleAddWater(customAmount)}
              disabled={customAmount <= 0}
              activeOpacity={0.8}>
              <Icon name="plus" size={20} color={theme.colors.background} />
            </TouchableOpacity>
          </View>

          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={50}
              maximumValue={1500}
              step={50}
              value={customAmount}
              onValueChange={setCustomAmount}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.border}
              thumbStyle={{backgroundColor: theme.colors.primary}}
            />
            <View style={styles.sliderLabels}>
              <Text style={[styles.sliderLabel, {color: theme.colors.textSecondary}]}>
                50ml
              </Text>
              <Text style={[styles.sliderLabel, {color: theme.colors.text}]}>
                {customAmount}ml
              </Text>
              <Text style={[styles.sliderLabel, {color: theme.colors.textSecondary}]}>
                1500ml
              </Text>
            </View>
          </View>
        </View>

        {/* Hydration Tip */}
        <GlassCard style={styles.tipCard} glow="accent">
          <View style={styles.tipContent}>
            <Icon name="heart" size={20} color={theme.colors.accent} />
            <View style={styles.tipText}>
              <Text style={[styles.tipTitle, {color: theme.colors.accent}]}>
                Did you know?
              </Text>
              <Text style={[styles.tipDescription, {color: theme.colors.textSecondary}]}>
                Staying hydrated boosts energy and brain function!
              </Text>
            </View>
          </View>
        </GlassCard>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    height: '85%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  bottleSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  bottleContainer: {
    alignItems: 'center',
  },
  bottle: {
    width: 80,
    height: 160,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    position: 'relative',
  },
  waterFill: {
    width: '100%',
    borderRadius: 6,
    position: 'relative',
  },
  bubblesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  bubble: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    bottom: '10%',
  },
  progressText: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    transform: [{translateY: -20}],
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressAmount: {
    fontSize: 12,
  },
  goalStatus: {
    alignItems: 'center',
    marginTop: 16,
  },
  goalText: {
    fontSize: 12,
    marginBottom: 4,
  },
  goalNumbers: {
    fontSize: 16,
    fontWeight: '600',
  },
  goalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  goalBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  iceModeCard: {
    marginBottom: 20,
  },
  iceModeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  iceModeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iceModeText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  quickAddSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  quickButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickButton: {
    flex: 1,
  },
  quickButtonCard: {
    padding: 16,
    alignItems: 'center',
    minHeight: 80,
  },
  quickButtonAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  quickButtonLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  customSection: {
    marginBottom: 20,
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  unitText: {
    fontSize: 16,
    marginHorizontal: 12,
  },
  addCustomButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderContainer: {
    marginTop: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 12,
  },
  tipCard: {
    marginBottom: 20,
  },
  tipContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  tipText: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
});

export default WaterLogModal;
