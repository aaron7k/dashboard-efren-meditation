import { Tabs } from 'expo-router';
import { Library, Sparkles, Volume2 } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(116, 57, 254, 0.1)',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          paddingTop: Platform.OS === 'web' ? 8 : 10,
          paddingBottom: Platform.OS === 'web' ? 8 : 10,
          height: Platform.OS === 'web' ? 60 : 70,
          backdropFilter: Platform.OS === 'web' ? 'blur(20px)' : undefined,
        },
        tabBarActiveTintColor: '#7439fe',
        tabBarInactiveTintColor: 'rgba(116, 57, 254, 0.4)',
        tabBarLabelStyle: {
          fontSize: Platform.OS === 'web' ? 11 : 12,
          fontFamily: 'Sora-Medium',
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Biblioteca',
          tabBarIcon: ({ size, color }) => (
            <Library size={Platform.OS === 'web' ? 20 : size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="generator"
        options={{
          title: 'Efren IA',
          tabBarIcon: ({ size, color }) => (
            <Sparkles size={Platform.OS === 'web' ? 20 : size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mixer"
        options={{
          title: 'Sonidos',
          tabBarIcon: ({ size, color }) => (
            <Volume2 size={Platform.OS === 'web' ? 20 : size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}