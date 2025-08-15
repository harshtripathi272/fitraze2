import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';
import {useTheme} from '../context/ThemeContext';

interface SleepLogModalProps {
  visible: boolean;
  onClose: () => void;
  onSleepLogged: (sleepData: {duration: number; quality: number}) => void;
}

const SleepLogModal: React.FC<SleepLogModalProps> = ({
  visible,
  onClose,
  onSleepLogged,
}) => {
  const {theme} = useTheme();
  const [duration, setDuration] = useState(7.5);
  const [quality, setQuality] = useState(4);

  const handleLogSleep = () => {
    onSleepLogged({duration, quality});
    onClose();
  };

  const getQualityLabel = () => {
    const labels = ['Poor', 'Fair', 'Good', 'Great', 'Excellent'];
    return labels[quality - 1] || 'Good';
  };

  const getQualityEmoji = () => {
    const emojis = ['😴', '😪', '🙂', '😊', '😄'];
    return emojis[quality - 1] || '🙂';
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={styles.modal}
      backdropOpacity={0.5}>
      <LinearGradient
        colors={theme.colors.gradientSurface}
        style={styles.container}>
        <View style={styles.header}>
          <Icon name="sleep" size={24} color={theme.colors.primary} />
          <Text style={[styles.title, {color: theme.colors.text}]}>
            Log Sleep
          </Text>
        </View>

        {/* Duration */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Sleep Duration
          </Text>
          <Text style={[styles.durationValue, {color: theme.colors.primary}]}>
            {duration.toFixed(1)} hours
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={4}
            maximumValue={12}
            step={0.5}
            value={duration}
            onValueChange={setDuration}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
            thumbStyle={{backgroundColor: theme.colors.primary}}
          />
          <View style={styles.sliderLabels}>
            <Text style={[styles.sliderLabel, {color: theme.colors.textSecondary}]}>
              4h
            </Text>
            <Text style={[styles.sliderLabel, {color: theme.colors.textSecondary}]}>
              12h
            </Text>
          </View>
        </View>

        {/* Quality */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Sleep Quality
          </Text>
          <View style={styles.qualityDisplay}>
            <Text style={styles.qualityEmoji}>{getQualityEmoji()}</Text>
            <Text style={[styles.qualityLabel, {color: theme.colors.accent}]}>
              {getQualityLabel()}
            </Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={5}
            step={1}
            value={quality}
            onValueChange={setQuality}
            minimumTrackTintColor={theme.colors.accent}
            maximumTrackTintColor={theme.colors.border}
            thumbStyle={{backgroundColor: theme.colors.accent}}
          />
          <View style={styles.sliderLabels}>
            <Text style={[styles.sliderLabel, {color: theme.colors.textSecondary}]}>
              Poor
            </Text>
            <Text style={[styles.sliderLabel, {color: theme.colors.textSecondary}]}>
              Excellent
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.logButton, {backgroundColor: theme.colors.primary}]}
          onPress={handleLogSleep}>
          <Icon name="check" size={20} color={theme.colors.background} />
          <Text style={[styles.logButtonText, {color: theme.colors.background}]}>
            Log Sleep ({duration.toFixed(1)}h)
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    borderRadius: 16,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  durationValue: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  qualityDisplay: {
    alignItems: 'center',
    marginBottom: 16,
  },
  qualityEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  qualityLabel: {
    fontSize: 16,
    fontWeight: '600',
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
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  logButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SleepLogModal;
