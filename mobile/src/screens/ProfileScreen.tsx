import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import {useTheme} from '../context/ThemeContext';
import GlassCard from '../components/GlassCard';

const ProfileScreen = () => {
  const {theme} = useTheme();

  const profileStats = [
    {label: 'Calories Logged', value: '2.2k', icon: 'fire'},
    {label: 'Workouts', value: '156', icon: 'dumbbell'},
    {label: 'Goal Rate', value: '89%', icon: 'target'},
  ];

  const profileActions = [
    {title: 'Settings & Preferences', icon: 'cog', color: theme.colors.primary},
    {title: 'Meal Planning', icon: 'food', color: theme.colors.accent},
    {title: 'Account Information', icon: 'account', color: theme.colors.tertiary},
    {title: 'Health Data', icon: 'heart-pulse', color: theme.colors.primary},
    {title: 'Notifications', icon: 'bell', color: theme.colors.accent},
    {title: 'Privacy & Security', icon: 'shield-check', color: theme.colors.tertiary},
  ];

  return (
    <LinearGradient
      colors={theme.colors.gradientBackground}
      style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Header */}
        <Animatable.View animation="fadeInDown" delay={300}>
          <GlassCard style={styles.profileCard} glow="primary" intensity="high">
            <View style={styles.profileContent}>
              <View style={styles.profileTop}>
                <View style={styles.avatarContainer}>
                  <LinearGradient
                    colors={theme.colors.gradientPrimary}
                    style={styles.avatar}>
                    <Text style={[styles.avatarText, {color: theme.colors.background}]}>
                      AJ
                    </Text>
                  </LinearGradient>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={[styles.profileName, {color: theme.colors.text}]}>
                    Alex Johnson
                  </Text>
                  <Text style={[styles.profileHandle, {color: theme.colors.textSecondary}]}>
                    @alexfitness
                  </Text>
                  <View style={styles.badges}>
                    <View style={[styles.badge, {backgroundColor: theme.colors.accent + '20'}]}>
                      <Icon name="trophy" size={12} color={theme.colors.accent} />
                      <Text style={[styles.badgeText, {color: theme.colors.accent}]}>
                        Advanced
                      </Text>
                    </View>
                    <View style={[styles.badge, {backgroundColor: theme.colors.primary + '20'}]}>
                      <Icon name="fire" size={12} color={theme.colors.primary} />
                      <Text style={[styles.badgeText, {color: theme.colors.primary}]}>
                        12 Day Streak
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.statsGrid}>
                {profileStats.map((stat, index) => (
                  <Animatable.View
                    key={index}
                    animation="zoomIn"
                    delay={600 + index * 200}
                    style={styles.statItem}>
                    <GlassCard style={styles.statCard} glow="soft">
                      <Icon name={stat.icon} size={20} color={theme.colors.primary} />
                      <Text style={[styles.statValue, {color: theme.colors.text}]}>
                        {stat.value}
                      </Text>
                      <Text style={[styles.statLabel, {color: theme.colors.textSecondary}]}>
                        {stat.label}
                      </Text>
                    </GlassCard>
                  </Animatable.View>
                ))}
              </View>
            </View>
          </GlassCard>
        </Animatable.View>

        {/* Health Stats */}
        <Animatable.View animation="fadeInUp" delay={1200}>
          <View style={styles.healthStats}>
            <GlassCard style={styles.healthCard} glow="accent">
              <View style={styles.healthContent}>
                <Icon name="scale-bathroom" size={24} color={theme.colors.accent} />
                <View style={styles.healthInfo}>
                  <Text style={[styles.healthValue, {color: theme.colors.text}]}>
                    68.5 kg
                  </Text>
                  <Text style={[styles.healthLabel, {color: theme.colors.textSecondary}]}>
                    Current Weight
                  </Text>
                </View>
              </View>
            </GlassCard>

            <GlassCard style={styles.healthCard} glow="primary">
              <View style={styles.healthContent}>
                <Icon name="human-male-height" size={24} color={theme.colors.primary} />
                <View style={styles.healthInfo}>
                  <Text style={[styles.healthValue, {color: theme.colors.text}]}>
                    175 cm
                  </Text>
                  <Text style={[styles.healthLabel, {color: theme.colors.textSecondary}]}>
                    Height
                  </Text>
                </View>
              </View>
            </GlassCard>
          </View>
        </Animatable.View>

        {/* Current Goals */}
        <Animatable.View animation="fadeInUp" delay={1500}>
          <GlassCard style={styles.goalsCard} glow="tertiary">
            <View style={styles.goalsHeader}>
              <Icon name="target" size={20} color={theme.colors.tertiary} />
              <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
                Current Goals
              </Text>
            </View>
            <View style={styles.goalsContent}>
              {[
                {label: 'Daily Calories', value: '2,200 kcal'},
                {label: 'Target Weight', value: '65 kg'},
                {label: 'Weekly Workouts', value: '4 sessions'},
                {label: 'Daily Water', value: '8 glasses'},
              ].map((goal, index) => (
                <View key={index} style={styles.goalItem}>
                  <Text style={[styles.goalLabel, {color: theme.colors.textSecondary}]}>
                    {goal.label}
                  </Text>
                  <Text style={[styles.goalValue, {color: theme.colors.text}]}>
                    {goal.value}
                  </Text>
                </View>
              ))}
            </View>
          </GlassCard>
        </Animatable.View>

        {/* Profile Actions */}
        <Animatable.View animation="fadeInUp" delay={1800}>
          <Text style={[styles.actionsTitle, {color: theme.colors.text}]}>
            Account & Settings
          </Text>
          <View style={styles.actionsContainer}>
            {profileActions.map((action, index) => (
              <Animatable.View
                key={index}
                animation="fadeInLeft"
                delay={2000 + index * 100}>
                <TouchableOpacity activeOpacity={0.8}>
                  <GlassCard style={styles.actionCard} glow="soft">
                    <View style={styles.actionContent}>
                      <Icon name={action.icon} size={20} color={action.color} />
                      <Text style={[styles.actionText, {color: theme.colors.text}]}>
                        {action.title}
                      </Text>
                      <Icon name="chevron-right" size={20} color={theme.colors.textSecondary} />
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </View>
        </Animatable.View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  profileCard: {
    marginBottom: 24,
  },
  profileContent: {
    padding: 20,
  },
  profileTop: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileHandle: {
    fontSize: 14,
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
  },
  statCard: {
    padding: 12,
    alignItems: 'center',
    minHeight: 80,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  healthStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  healthCard: {
    flex: 1,
  },
  healthContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  healthInfo: {
    marginLeft: 12,
  },
  healthValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  healthLabel: {
    fontSize: 12,
  },
  goalsCard: {
    marginBottom: 24,
  },
  goalsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  goalsContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  goalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  goalLabel: {
    fontSize: 14,
  },
  goalValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionsContainer: {
    gap: 8,
  },
  actionCard: {
    marginBottom: 4,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
});

export default ProfileScreen;
