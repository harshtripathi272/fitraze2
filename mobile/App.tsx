import React, {useState, useEffect} from 'react';
import {StatusBar, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import DailyLogScreen from './src/screens/DailyLogScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import StartupSplash from './src/components/StartupSplash';

// Theme
import {ThemeProvider} from './src/context/ThemeContext';
import {theme} from './src/theme/colors';

const Tab = createBottomTabNavigator();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <GestureHandlerRootView style={{flex: 1}}>
        <ThemeProvider>
          <StartupSplash onComplete={() => setShowSplash(false)} />
        </ThemeProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ThemeProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.colors.background}
          translucent={false}
        />
        <NavigationContainer
          theme={{
            dark: true,
            colors: {
              primary: theme.colors.primary,
              background: theme.colors.background,
              card: theme.colors.surface,
              text: theme.colors.text,
              border: theme.colors.border,
              notification: theme.colors.accent,
            },
          }}>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: theme.colors.surface,
                borderTopColor: theme.colors.border,
                borderTopWidth: 1,
                paddingBottom: Platform.OS === 'ios' ? 20 : 10,
                paddingTop: 10,
                height: Platform.OS === 'ios' ? 80 : 60,
              },
              tabBarActiveTintColor: theme.colors.primary,
              tabBarInactiveTintColor: theme.colors.textSecondary,
              tabBarLabelStyle: {
                fontSize: 10,
                fontWeight: '600',
              },
            }}>
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                tabBarIcon: ({color, size}) => (
                  <Icon name="home" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Log"
              component={DailyLogScreen}
              options={{
                tabBarIcon: ({color, size}) => (
                  <Icon name="calendar-today" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Analytics"
              component={AnalyticsScreen}
              options={{
                tabBarIcon: ({color, size}) => (
                  <Icon name="chart-line" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Chat"
              component={ChatScreen}
              options={{
                tabBarIcon: ({color, size}) => (
                  <Icon name="message-text" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                tabBarIcon: ({color, size}) => (
                  <Icon name="account" size={size} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
