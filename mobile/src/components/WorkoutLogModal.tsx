import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../context/ThemeContext';

interface WorkoutLogModalProps {
  visible: boolean;
  onClose: () => void;
  onWorkoutCompleted: (workout: {exercisesCompleted: number}) => void;
}

const WorkoutLogModal: React.FC<WorkoutLogModalProps> = ({
  visible,
  onClose,
  onWorkoutCompleted,
}) => {
  const {theme} = useTheme();

  const handleComplete = () => {
    onWorkoutCompleted({exercisesCompleted: 8});
    onClose();
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
          <Icon name="dumbbell" size={24} color={theme.colors.primary} />
          <Text style={[styles.title, {color: theme.colors.text}]}>
            Log Workout
          </Text>
        </View>
        
        <Text style={[styles.description, {color: theme.colors.textSecondary}]}>
          Workout logging feature coming soon!
        </Text>
        
        <TouchableOpacity
          style={[styles.button, {backgroundColor: theme.colors.primary}]}
          onPress={handleComplete}>
          <Text style={[styles.buttonText, {color: theme.colors.background}]}>
            Complete Mock Workout
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
    width: '80%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WorkoutLogModal;
