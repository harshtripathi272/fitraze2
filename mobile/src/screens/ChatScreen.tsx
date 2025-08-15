import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import {useTheme} from '../context/ThemeContext';
import GlassCard from '../components/GlassCard';

const ChatScreen = () => {
  const {theme} = useTheme();

  return (
    <LinearGradient
      colors={theme.colors.gradientBackground}
      style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        <Animatable.View animation="fadeInDown" delay={300}>
          <GlassCard style={styles.headerCard} glow="primary" intensity="high">
            <View style={styles.headerContent}>
              <View style={styles.headerTop}>
                <Icon name="robot" size={24} color={theme.colors.primary} />
                <Text style={[styles.headerTitle, {color: theme.colors.text}]}>
                  FitRaze AI
                </Text>
              </View>
              <Text style={[styles.headerSubtitle, {color: theme.colors.textSecondary}]}>
                Your personal fitness assistant
              </Text>
            </View>
          </GlassCard>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={600}>
          <GlassCard style={styles.comingSoonCard} glow="accent">
            <View style={styles.comingSoonContent}>
              <Icon name="message-text" size={48} color={theme.colors.accent} />
              <Text style={[styles.comingSoonTitle, {color: theme.colors.text}]}>
                AI Chat Coming Soon!
              </Text>
              <Text style={[styles.comingSoonDescription, {color: theme.colors.textSecondary}]}>
                Chat with your AI fitness coach for personalized advice,
                meal suggestions, and workout guidance.
              </Text>
            </View>
          </GlassCard>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={900}>
          <Text style={[styles.featureTitle, {color: theme.colors.text}]}>
            AI Features
          </Text>
          
          {[
            {icon: 'lightbulb', title: 'Smart Suggestions', desc: 'Personalized meal and workout recommendations'},
            {icon: 'chart-timeline-variant', title: 'Progress Analysis', desc: 'AI-powered insights on your fitness journey'},
            {icon: 'food', title: 'Nutrition Guidance', desc: 'Macro optimization and meal planning'},
            {icon: 'heart-pulse', title: 'Health Monitoring', desc: 'Track patterns and provide health insights'},
            {icon: 'target', title: 'Goal Setting', desc: 'AI-assisted realistic goal planning'},
          ].map((feature, index) => (
            <Animatable.View
              key={index}
              animation="fadeInLeft"
              delay={1200 + index * 200}>
              <GlassCard style={styles.featureCard} glow="soft">
                <View style={styles.featureContent}>
                  <Icon name={feature.icon} size={24} color={theme.colors.accent} />
                  <View style={styles.featureText}>
                    <Text style={[styles.featureCardTitle, {color: theme.colors.text}]}>
                      {feature.title}
                    </Text>
                    <Text style={[styles.featureCardDesc, {color: theme.colors.textSecondary}]}>
                      {feature.desc}
                    </Text>
                  </View>
                  <Icon name="arrow-right" size={20} color={theme.colors.textSecondary} />
                </View>
              </GlassCard>
            </Animatable.View>
          ))}
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
    marginBottom: 24,
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
  },
  comingSoonCard: {
    marginBottom: 32,
  },
  comingSoonContent: {
    padding: 32,
    alignItems: 'center',
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  comingSoonDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  featureCard: {
    marginBottom: 12,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  featureText: {
    flex: 1,
    marginLeft: 16,
  },
  featureCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureCardDesc: {
    fontSize: 12,
  },
});

export default ChatScreen;
