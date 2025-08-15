import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {PieChart} from 'react-native-chart-kit';
import * as Animatable from 'react-native-animatable';

import {useTheme} from '../context/ThemeContext';
import GlassCard from '../components/GlassCard';
import ProgressRing from '../components/ProgressRing';
import FoodLogModal from '../components/FoodLogModal';
import WaterLogModal from '../components/WaterLogModal';
import WorkoutLogModal from '../components/WorkoutLogModal';
import SleepLogModal from '../components/SleepLogModal';

const {width} = Dimensions.get('window');

interface DailyStats {
  calories: {current: number; goal: number};
  protein: {current: number; goal: number};
  carbs: {current: number; goal: number};
  fat: {current: number; goal: number};
  water: {current: number; goal: number};
  sleep: {current: number; goal: number};
}

const HomeScreen = () => {
  const {theme} = useTheme();
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    calories: {current: 1847, goal: 2200},
    protein: {current: 98, goal: 140},
    carbs: {current: 180, goal: 220},
    fat: {current: 65, goal: 85},
    water: {current: 6000, goal: 8000},
    sleep: {current: 7.5, goal: 8},
  });

  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);

  const calorieProgress = (dailyStats.calories.current / dailyStats.calories.goal) * 100;
  const proteinProgress = (dailyStats.protein.current / dailyStats.protein.goal) * 100;
  const waterProgress = (dailyStats.water.current / dailyStats.water.goal) * 100;

  // Macro distribution data
  const macroData = [
    {
      name: 'Protein',
      population: Math.round((dailyStats.protein.current * 4 / dailyStats.calories.current) * 100),
      color: theme.colors.accent,
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
    {
      name: 'Carbs',
      population: Math.round((dailyStats.carbs.current * 4 / dailyStats.calories.current) * 100),
      color: theme.colors.primary,
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
    {
      name: 'Fat',
      population: Math.round((dailyStats.fat.current * 9 / dailyStats.calories.current) * 100),
      color: theme.colors.tertiary,
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
  ];

  const quickActions = [
    {
      title: 'Log Food',
      icon: 'plus',
      color: theme.colors.primary,
      onPress: () => setShowFoodModal(true),
    },
    {
      title: 'Add Water',
      icon: 'water',
      color: theme.colors.accent,
      onPress: () => setShowWaterModal(true),
    },
    {
      title: 'Log Workout',
      icon: 'dumbbell',
      color: theme.colors.primary,
      onPress: () => setShowWorkoutModal(true),
    },
    {
      title: 'Log Sleep',
      icon: 'sleep',
      color: theme.colors.accent,
      onPress: () => setShowSleepModal(true),
    },
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <LinearGradient
      colors={theme.colors.gradientBackground}
      style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <Animatable.View animation="fadeInDown" delay={300}>
          <GlassCard style={styles.headerCard} glow="primary" intensity="high">
            <View style={styles.headerContent}>
              <View style={styles.headerTop}>
                <View>
                  <Text style={[styles.logoText, {color: theme.colors.primary}]}>
                    FitRaze
                  </Text>
                  <Text style={[styles.welcomeText, {color: theme.colors.textSecondary}]}>
                    Welcome back, Alex!
                  </Text>
                </View>
                <View style={styles.streakBadge}>
                  <Icon name="fire" size={16} color={theme.colors.accent} />
                  <Text style={[styles.streakText, {color: theme.colors.text}]}>
                    12d
                  </Text>
                </View>
              </View>

              <View style={styles.calorieSection}>
                <Text style={[styles.sectionTitle, {color: theme.colors.textSecondary}]}>
                  Today's Calorie Goal
                </Text>
                <View style={styles.progressContainer}>
                  <ProgressRing progress={calorieProgress} size={100} color="primary">
                    <Text style={[styles.calorieNumber, {color: theme.colors.primary}]}>
                      {dailyStats.calories.current}
                    </Text>
                    <Text style={[styles.calorieGoal, {color: theme.colors.textSecondary}]}>
                      of {dailyStats.calories.goal}
                    </Text>
                  </ProgressRing>
                </View>
              </View>
            </View>
          </GlassCard>
        </Animatable.View>

        {/* Quick Stats */}
        <Animatable.View animation="fadeInUp" delay={600}>
          <Text style={[styles.sectionHeader, {color: theme.colors.text}]}>
            Today's Progress
          </Text>
          <View style={styles.statsGrid}>
            <GlassCard style={styles.statCard} glow="accent" intensity="medium">
              <View style={styles.statContent}>
                <ProgressRing progress={proteinProgress} size={70} color="accent">
                  <Text style={[styles.statValue, {color: theme.colors.accent}]}>
                    {dailyStats.protein.current}g
                  </Text>
                  <Text style={[styles.statLabel, {color: theme.colors.textSecondary}]}>
                    Protein
                  </Text>
                </ProgressRing>
              </View>
            </GlassCard>

            <GlassCard style={styles.statCard} glow="primary" intensity="medium">
              <View style={styles.statContent}>
                <ProgressRing progress={waterProgress} size={70} color="primary">
                  <Text style={[styles.statValue, {color: theme.colors.primary}]}>
                    {(dailyStats.water.current / 1000).toFixed(1)}L
                  </Text>
                  <Text style={[styles.statLabel, {color: theme.colors.textSecondary}]}>
                    Water
                  </Text>
                </ProgressRing>
              </View>
            </GlassCard>
          </View>
        </Animatable.View>

        {/* Macro Distribution */}
        <Animatable.View animation="fadeInUp" delay={900}>
          <GlassCard style={styles.macroCard} glow="accent" intensity="medium">
            <View style={styles.macroHeader}>
              <Icon name="chart-pie" size={20} color={theme.colors.accent} />
              <Text style={[styles.cardTitle, {color: theme.colors.text}]}>
                Today's Macro Distribution
              </Text>
            </View>
            <View style={styles.macroContent}>
              <PieChart
                data={macroData}
                width={width * 0.4}
                height={120}
                chartConfig={{
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="0"
                hasLegend={false}
              />
              <View style={styles.macroLegend}>
                {macroData.map((macro, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View style={styles.legendRow}>
                      <View style={[styles.legendDot, {backgroundColor: macro.color}]} />
                      <Text style={[styles.legendLabel, {color: theme.colors.text}]}>
                        {macro.name}
                      </Text>
                    </View>
                    <View style={styles.legendValues}>
                      <Text style={[styles.legendPercent, {color: theme.colors.text}]}>
                        {macro.population}%
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </GlassCard>
        </Animatable.View>

        {/* Quick Actions */}
        <Animatable.View animation="fadeInUp" delay={1200}>
          <Text style={[styles.sectionHeader, {color: theme.colors.text}]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={action.onPress}
                activeOpacity={0.8}>
                <GlassCard style={styles.actionCard} glow="soft">
                  <View style={styles.actionContent}>
                    <Icon name={action.icon} size={24} color={action.color} />
                    <Text style={[styles.actionText, {color: theme.colors.text}]}>
                      {action.title}
                    </Text>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>
        </Animatable.View>

        {/* Week Overview */}
        <Animatable.View animation="fadeInUp" delay={1500}>
          <GlassCard style={styles.weekCard} glow="accent" intensity="medium">
            <View style={styles.weekHeader}>
              <Icon name="trending-up" size={20} color={theme.colors.accent} />
              <Text style={[styles.cardTitle, {color: theme.colors.text}]}>
                This Week
              </Text>
            </View>
            <View style={styles.weekGrid}>
              {weekDays.map((day, index) => {
                const isToday = index === 3;
                const completed = index < 4;
                return (
                  <View key={day} style={styles.dayItem}>
                    <Text style={[styles.dayLabel, {color: theme.colors.textSecondary}]}>
                      {day}
                    </Text>
                    <View
                      style={[
                        styles.dayIndicator,
                        {
                          borderColor: isToday
                            ? theme.colors.primary
                            : completed
                            ? theme.colors.accent
                            : theme.colors.border,
                          backgroundColor: isToday
                            ? `${theme.colors.primary}30`
                            : completed
                            ? `${theme.colors.accent}30`
                            : 'transparent',
                        },
                      ]}>
                      {completed && (
                        <View
                          style={[
                            styles.dayDot,
                            {backgroundColor: isToday ? theme.colors.primary : theme.colors.accent},
                          ]}
                        />
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </GlassCard>
        </Animatable.View>
      </ScrollView>

      {/* Modals */}
      <FoodLogModal
        visible={showFoodModal}
        onClose={() => setShowFoodModal(false)}
        onFoodAdded={(food, mealType) => {
          // Update stats logic here
          Alert.alert('Food Added', `${food.name} added to ${mealType}`);
        }}
      />

      <WaterLogModal
        visible={showWaterModal}
        onClose={() => setShowWaterModal(false)}
        currentIntake={dailyStats.water.current}
        goal={dailyStats.water.goal}
        onWaterAdded={(amount) => {
          setDailyStats(prev => ({
            ...prev,
            water: {
              ...prev.water,
              current: Math.min(prev.water.current + amount, prev.water.goal + 2000),
            },
          }));
        }}
      />

      <WorkoutLogModal
        visible={showWorkoutModal}
        onClose={() => setShowWorkoutModal(false)}
        onWorkoutCompleted={(workout) => {
          Alert.alert('Workout Completed', `${workout.exercisesCompleted} exercises completed!`);
        }}
      />

      <SleepLogModal
        visible={showSleepModal}
        onClose={() => setShowSleepModal(false)}
        onSleepLogged={(sleepData) => {
          setDailyStats(prev => ({
            ...prev,
            sleep: {
              ...prev.sleep,
              current: sleepData.duration,
            },
          }));
          Alert.alert('Sleep Logged', `${sleepData.duration} hours of sleep logged`);
        }}
      />
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
  headerCard: {
    marginBottom: 24,
  },
  headerContent: {
    padding: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  welcomeText: {
    fontSize: 14,
    marginTop: 4,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  calorieSection: {
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    marginBottom: 12,
  },
  progressContainer: {
    alignItems: 'center',
  },
  calorieNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  calorieGoal: {
    fontSize: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 10,
  },
  macroCard: {
    marginBottom: 24,
  },
  macroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  macroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  macroLegend: {
    flex: 1,
    marginLeft: 16,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  legendValues: {
    alignItems: 'flex-end',
  },
  legendPercent: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    width: (width - 48) / 2,
  },
  actionContent: {
    padding: 16,
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  weekCard: {
    marginBottom: 24,
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  weekGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  dayItem: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 10,
    marginBottom: 8,
  },
  dayIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default HomeScreen;
