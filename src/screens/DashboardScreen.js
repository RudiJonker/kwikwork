import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Animated, Dimensions, Text, Easing, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import supabase from '../utils/Supabase';

// Dimensions
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_MARGIN = 8;
const CONTAINER_PADDING = 16;
const CARD_WIDTH = (SCREEN_WIDTH - (CONTAINER_PADDING * 2) - CARD_MARGIN) / 2;

export default function DashboardScreen({ navigation }) {
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const textWidth = SCREEN_WIDTH * 3.5;

  useEffect(() => {
    let isMounted = true;
    const fetchRole = async () => {
      console.log('Fetching user...');
      if (!supabase || !supabase.auth) {
        console.error('Supabase client not initialized. Check import path or .env file:', { supabase });
        if (isMounted) {
          setLoading(false);
          navigation.navigate('Login');
        }
        return;
      }
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (!isMounted) return;
        if (authError || !user) {
          console.error('Auth error:', authError?.message || 'No user session');
          if (isMounted) navigation.navigate('Login');
          return;
        }
        console.log('User fetched:', user.id, 'Email:', user.email);
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        if (!isMounted) return;
        if (error) {
          console.error('Fetch role error:', error.message, 'Code:', error.code, 'Details:', error.details);
          if (error.code === 'PGRST116') {
            console.log('No user record found, inserting default role...');
            const { error: insertError } = await supabase
              .from('users')
              .insert({ id: user.id, role: 'seeker', email: user.email, name: 'Default User' });
            if (insertError) {
              console.error('Insert error:', insertError.message);
            } else {
              setRole('seeker');
            }
          } else {
            if (isMounted) setRole('employer');
          }
        } else {
          console.log('Role fetched:', data.role);
          if (isMounted) setRole(data.role);
        }
      } catch (e) {
        console.error('Unexpected error:', e.message);
        if (isMounted) navigation.navigate('Login');
      } finally {
        if (isMounted) {
          setLoading(false);
          console.log('Loading set to false');
        }
      }
    };
    fetchRole();

    return () => {
      isMounted = false;
    };
  }, [navigation]);

  useEffect(() => {
    const duration = 25000;
    const animate = () => {
      scrollX.setValue(SCREEN_WIDTH);
      Animated.timing(scrollX, {
        toValue: -textWidth,
        duration,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start(() => animate());
    };
    animate();
  }, [scrollX, textWidth]);

  const seekerBannerText = 'You are in the Top 10% of job Seekers with 247 points - keep up the good work! ... 123623 IzziJobs Users worldwide!';
  const employerBannerText = 'You are managing top jobs with 150 points - keep it up! ... 123623 IzziJobs Users worldwide!';
  const adminBannerText = 'Admin Dashboard - Monitoring 123623 Users ...';

  const seekerCards = [
    { id: 'rank', title: 'Rank', icon: 'crown', color: '#333', onPress: () => {} },
    { id: 'rating', title: 'Rating', icon: 'star', color: '#ff9800', onPress: () => {} },
    { id: 'weather', title: 'Weather', icon: 'weather-partly-cloudy', color: '#ffeb3b', onPress: () => {} },
    { id: 'calendar', title: 'Calendar', icon: 'calendar', color: '#4caf50', onPress: () => {} },
    { id: 'bank', title: 'Bank', icon: 'bank', color: '#2196f3', onPress: () => {} },
    { id: 'help', title: 'Help', icon: 'help-circle', color: '#007bff', onPress: () => {} },
    { id: 'jobs', title: 'Jobs', icon: 'briefcase', color: '#ff4500', onPress: () => {} },
    { id: 'applied', title: 'Applied', icon: 'file-document', color: '#48d22b', onPress: () => {} },
  ];

  const employerCards = [
    { id: 'weather', title: 'Weather', icon: 'weather-partly-cloudy', color: '#ffeb3b', onPress: () => {} },
    { id: 'calendar', title: 'Calendar', icon: 'calendar', color: '#4caf50', onPress: () => {} },
    { id: 'alerts', title: 'Alerts', icon: 'alert', color: '#b00020', onPress: () => {} },
    { id: 'history', title: 'History', icon: 'history', color: '#6a1b9a', onPress: () => {} },
    { id: 'salaries', title: 'Salaries', icon: 'cash', color: '#2196f3', onPress: () => {} },
    { id: 'help', title: 'Help', icon: 'help-circle', color: '#007bff', onPress: () => {} },
    { id: 'jobPosts', title: 'Job Posts', icon: 'briefcase', color: '#ff4500', onPress: () => {} },
    { id: 'applicants', title: 'Applicants', icon: 'account-group', color: '#48d22b', onPress: () => {} },
  ];

  const adminCards = [
    { id: 'users', title: 'Users', icon: 'account-multiple', color: '#333', onPress: () => {} },
    { id: 'stats', title: 'Stats', icon: 'chart-line', color: '#ff9800', onPress: () => {} },
    { id: 'calls', title: 'API Calls', icon: 'api', color: '#007bff', onPress: () => {} },
    { id: 'errors', title: 'Errors', icon: 'alert', color: '#6a1b9a', onPress: () => {} },
    { id: 'db', title: 'DB Rows', icon: 'database', color: '#2196f3', onPress: () => {} },
    { id: '', title: '', icon: '', color: '', onPress: () => {} },
    { id: '', title: '', icon: '', color: '', onPress: () => {} },
    { id: '', title: '', icon: '', color: '', onPress: () => {} },
  ];

  const renderCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        onPress={item.onPress}
        style={styles.card}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name={item.icon} size={32} color={item.color} />
        <Text style={styles.itemText}>{item.title}</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const getBannerText = () => {
    switch (role) {
      case 'seeker':
        return seekerBannerText;
      case 'employer':
        return employerBannerText;
      case 'admin':
        return adminBannerText;
      default:
        return 'Welcome to IzziJobs!';
    }
  };

  const getCards = () => {
    switch (role) {
      case 'seeker':
        return seekerCards;
      case 'employer':
        return employerCards;
      case 'admin':
        return adminCards;
      default:
        return employerCards;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Animated.View style={{ transform: [{ translateX: scrollX }], width: textWidth }}>
          <Text style={styles.bannerText} numberOfLines={1}>
            {getBannerText()}
          </Text>
        </Animated.View>
      </View>
      <FlatList
        data={getCards()}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    height: 40,
    backgroundColor: '#48d22b',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    top: 7,
    left: 0,
    zIndex: 1,
    overflow: 'hidden',
  },
  bannerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  flatList: {
    marginTop: 65,
  },
  listContainer: {
    paddingHorizontal: CONTAINER_PADDING,
    paddingBottom: 16,
    alignItems: 'center', // Center the entire grid
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: CARD_MARGIN * 2,
    width: '88%', // Ensure columns span the container
  },
  cardContainer: {
    width: CARD_WIDTH * 0.8, // 80% of original card width
    alignItems: 'center', // Center each card within its container
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 90,
    width: '100%', // Card fills the cardContainer
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  itemText: {
    fontSize: 11,
    textAlign: 'center',
    color: '#333',
    marginTop: 4,
  },
});