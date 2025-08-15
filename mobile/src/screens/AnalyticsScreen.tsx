import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {LineChart} from 'react-native-chart-kit';
import * as Animatable from 'react-native-animatable';

import {useTheme} from '../context/ThemeContext';
import GlassCard from '../components/GlassCard';

const {width} = Dimensions.get('window');

const AnalyticsScreen = () => {
  const {theme} = useTheme();
  const [activeTab, setActiveTab] = useState('calories');

  const tabs = [
    {id: 'calories', title: 'Calories', icon: 'fire'},
    {id: 'macros', title: 'Macros', icon: 'chart-line'},
    {id: 'weight', title: 'Weight', icon: 'scale-bathroom'},
  ];

  // Chart data
  const weeklyCalories = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [2100, 2300, 1950, 2180, 2050, 2400, 2150],
        color: (opacity = 1) => theme.colors.primary,
        strokeWidth: 3,
      },
      {
        data: [2200, 2200, 2200, 2200, 2200, 2200, 2200],
        color: (opacity = 1) => theme.colors.textSecondary,
        strokeWidth: 2,
        withDots: false,
        strokeDashArray: [5, 5],
      },
    ],
  };

  const weeklyMacros = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [140, 155, 125, 148, 135, 160, 145],
        color: (opacity = 1) => theme.colors.accent,
        strokeWidth: 3,
      },
      {
        data: [220, 200, 180, 210, 195, 240, 205],
        color: (opacity = 1) => theme.colors.primary,
        strokeWidth: 3,
      },
      {
        data: [75, 80, 65, 78, 70, 85, 72],
        color: (opacity = 1) => theme.colors.tertiary,
        strokeWidth: 3,
      },
    ],
  };

  const weightProgress = {
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
    datasets: [
      {
        data: [70.5, 70.2, 69.8, 69.5, 69.1, 68.8, 68.5],
        color: (opacity = 1) => theme.colors.accent,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => theme.colors.textSecondary,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: theme.colors.border,
      strokeOpacity: 0.3,
    },
  };

  const renderChart = () => {
    switch (activeTab) {
      case 'calories':
        return (
          <Animatable.View animation="fadeIn" key="calories">
            <GlassCard style={styles.chartCard} glow="primary">
              <View style={styles.chartHeader}>
                <Icon name="fire" size={20} color={theme.colors.primary} />
                <Text style={[styles.chartTitle, {color: theme.colors.text}]}>
                  Weekly Calorie Tracking
                </Text>
              </View>
              <LineChart
                data={weeklyCalories}
                width={width - 64}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                withVerticalLabels={true}
                withHorizontalLabels={true}
                withInnerLines={true}
                withOuterLines={false}
              />
            </GlassCard>

            <View style={styles.statsRow}>
              <GlassCard style={styles.statCard} glow="primary">
                <View style={styles.statContent}>
                  <Icon name="fire" size={24} color={theme.colors.primary} />
                  <Text style={[styles.statValue, {color: theme.colors.text}]}>
                    2,180
                  </Text>
                  <Text style={[styles.statLabel, {color: theme.colors.textSecondary}]}>
                    Avg Daily
                  </Text>
                </View>
              </GlassCard>

              <GlassCard style={styles.statCard} glow="accent">
                <View style={styles.statContent}>
                  <Icon name="target" size={24} color={theme.colors.accent} />
                  <Text style={[styles.statValue, {color: theme.colors.text}]}>
                    6/7
                  </Text>
                  <Text style={[styles.statLabel, {color: theme.colors.textSecondary}]}>
                    Goals Hit
                  </Text>
                </View>
              </GlassCard>
            </View>
          </Animatable.View>
        );

      case 'macros':
        return (
          <Animatable.View animation="fadeIn" key="macros">
            <GlassCard style={styles.chartCard} glow="accent">
              <View style={styles.chartHeader}>
                <Icon name="chart-line" size={20} color={theme.colors.accent} />
                <Text style={[styles.chartTitle, {color: theme.colors.text}]}>
                  Weekly Macro Intake Trends
                </Text>
              </View>
              
              {/* Legend */}
              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, {backgroundColor: theme.colors.accent}]} />
                  <Text style={[styles.legendText, {color: theme.colors.text}]}>Protein</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, {backgroundColor: theme.colors.primary}]} />
                  <Text style={[styles.legendText, {color: theme.colors.text}]}>Carbs</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, {backgroundColor: theme.colors.tertiary}]} />
                  <Text style={[styles.legendText, {color: theme.colors.text}]}>Fat</Text>
                </View>
              </View>

              <LineChart
                data={weeklyMacros}
                width={width - 64}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                yAxisLabel=""
                yAxisSuffix="g"
              />
            </GlassCard>

            <View style={styles.macroStatsRow}>
              <GlassCard style={styles.macroStatCard} glow="accent">
                <View style={styles.statContent}>
                  <Text style={[styles.statValue, {color: theme.colors.accent}]}>
                    142g
                  </Text>
                  <Text style={[styles.statLabel, {color: theme.colors.textSecondary}]}>
                    Avg Protein
                  </Text>
                </View>
              </GlassCard>

              <GlassCard style={styles.macroStatCard} glow="primary">
                <View style={styles.statContent}>
                  <Text style={[styles.statValue, {color: theme.colors.primary}]}>
                    207g
                  </Text>
                  <Text style={[styles.statLabel, {color: theme.colors.textSecondary}]}>
                    Avg Carbs
                  </Text>
                </View>
              </GlassCard>

              <GlassCard style={styles.macroStatCard} glow="tertiary">
                <View style={styles.statContent}>
                  <Text style={[styles.statValue, {color: theme.colors.tertiary}]}>
                    75g
                  </Text>
                  <Text style={[styles.statLabel, {color: theme.colors.textSecondary}]}>
                    Avg Fat
                  </Text>
                </View>
              </GlassCard>
            </View>
          </Animatable.View>
        );

      case 'weight':
        return (
          <Animatable.View animation="fadeIn" key="weight">
            <GlassCard style={styles.chartCard} glow="accent">
              <View style={styles.chartHeader}>
                <Icon name="trending-up" size={20} color={theme.colors.accent} />
                <Text style={[styles.chartTitle, {color: theme.colors.text}]}>
                  Weight Progress
                </Text>
              </View>
              <LineChart
                data={weightProgress}
                width={width - 64}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                yAxisSuffix="kg"
              />
            </GlassCard>

            <View style={styles.statsRow}>
              <GlassCard style={styles.statCard} glow="accent">
                <View style={styles.statContent}>
                  <Icon name="trophy" size={24} color={theme.colors.accent} />
                  <Text style={[styles.statValue, {color: theme.colors.accent}]}>
                    -2.0kg
                  </Text>
                  <Text style={[styles.statLabel, {color: theme.colors.textSecondary}]}>
                    Total Lost
                  </Text>
                </View>
              </GlassCard>

              <GlassCard style={styles.statCard} glow="primary">
                <View style={styles.statContent}>
                  <Icon name="target" size={24} color={theme.colors.primary} />
                  <Text style={[styles.statValue, {color: theme.colors.primary}]}>
                    1.5kg
                  </Text>
                  <Text style={[styles.statLabel, {color: theme.colors.textSecondary}]}>
                    To Goal
                  </Text>
                </View>
              </GlassCard>
            </View>
          </Animatable.View>
        );

      default:
        return null;
    }
  };

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
                <Icon name="chart-line" size={24} color={theme.colors.primary} />
                <Text style={[styles.headerTitle, {color: theme.colors.text}]}>
                  Analytics
                </Text>
              </View>
              <Text style={[styles.headerSubtitle, {color: theme.colors.textSecondary}]}>
                Track your progress and insights
              </Text>

              <View style={styles.statsOverview}>
                <View style={styles.overviewItem}>
                  <Text style={[styles.overviewValue, {color: theme.colors.primary}]}>
                    89%
                  </Text>
                  <Text style={[styles.overviewLabel, {color: theme.colors.textSecondary}]}>
                    Avg Goal Hit
                  </Text>
                </View>
                <View style={styles.overviewItem}>
                  <Text style={[styles.overviewValue, {color: theme.colors.accent}]}>
                    -2.0kg
                  </Text>
                  <Text style={[styles.overviewLabel, {color: theme.colors.textSecondary}]}>
                    Weight Lost
                  </Text>
                </View>
                <View style={styles.overviewItem}>
                  <Text style={[styles.overviewValue, {color: theme.colors.tertiary}]}>
                    24
                  </Text>
                  <Text style={[styles.overviewLabel, {color: theme.colors.textSecondary}]}>
                    Active Days
                  </Text>
                </View>
              </View>
            </View>
          </GlassCard>
        </Animatable.View>

        {/* Tabs */}
        <Animatable.View animation="fadeInUp" delay={600}>
          <GlassCard style={styles.tabContainer} glow="soft">
            <View style={styles.tabRow}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tab,
                    activeTab === tab.id && {
                      backgroundColor: theme.colors.primary + '20',
                    },
                  ]}
                  onPress={() => setActiveTab(tab.id)}
                  activeOpacity={0.8}>
                  <Icon
                    name={tab.icon}
                    size={16}
                    color={activeTab === tab.id ? theme.colors.primary : theme.colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      {
                        color: activeTab === tab.id ? theme.colors.primary : theme.colors.textSecondary,
                      },
                    ]}>
                    {tab.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>
        </Animatable.View>

        {/* Chart Content */}
        <Animatable.View animation="fadeInUp" delay={900}>
          {renderChart()}
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
  headerCard: {
    marginBottom: 20,
  },
  headerContent: {
    padding: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  statsOverview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overviewItem: {
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  overviewLabel: {
    fontSize: 10,
    marginTop: 4,
  },
  tabContainer: {
    marginBottom: 20,
  },
  tabRow: {
    flexDirection: 'row',
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  chartCard: {
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  macroStatsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  macroStatCard: {
    flex: 1,
  },
});

export default AnalyticsScreen;
