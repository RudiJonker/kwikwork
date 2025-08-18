import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import supabase from '../utils/Supabase';
import styles from '../components/theme/styles';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const [userData, setUserData] = useState({ id: '', name: '', email: '', phone: '', role: '', bio: '', business_name: '', profile_pic: null });
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          console.error('Auth error:', authError?.message || 'No user session');
          navigation.navigate('Login');
          return;
        }

        const { data, error } = await supabase
          .from('users')
          .select('id, name, email, phone, role, bio, business_name, profile_pic')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Fetch user data error:', error.message);
          setUserData({ id: user.id, name: 'Unknown', email: user.email, phone: 'N/A', role: 'seeker', bio: '', business_name: '', profile_pic: null });
        } else {
          setUserData(data);
        }
      } catch (e) {
        console.error('Unexpected error:', e.message);
        navigation.navigate('Login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#48d22b" />
      </View>
    );
  }

  const renderProfileContent = () => {
    switch (userData.role) {
      case 'seeker':
        return (
          <>
            <Text style={styles.title}>Seeker Profile</Text>
            <Text style={styles.label}>Name: {userData.name}</Text>
            <Text style={styles.label}>Email: {userData.email}</Text>
            <Text style={styles.label}>Phone: {userData.phone}</Text>
            <Text style={styles.label}>Bio: {userData.bio || 'Not provided'}</Text>
          </>
        );
      case 'employer':
        return (
          <>
            <Text style={styles.title}>Employer Profile</Text>
            <Text style={styles.label}>Name: {userData.name}</Text>
            <Text style={styles.label}>Email: {userData.email}</Text>
            <Text style={styles.label}>Phone: {userData.phone}</Text>
            <Text style={styles.label}>Business Name: {userData.business_name || 'Not provided'}</Text>
          </>
        );
      case 'admin':
        return (
          <>
            <Text style={styles.title}>Admin Profile</Text>
            <Text style={styles.label}>Name: {userData.name}</Text>
            <Text style={styles.label}>Email: {userData.email}</Text>
            <Text style={styles.label}>Phone: {userData.phone}</Text>
          </>
        );
      default:
        return <Text style={styles.title}>Unknown Role</Text>;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.scrollContent, { justifyContent: 'center' }]}>
      {renderProfileContent()}
    </ScrollView>
  );
}