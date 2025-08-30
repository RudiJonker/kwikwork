import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import supabase from '../utils/Supabase';
import styles from '../components/theme/styles';

export default function AppliedJobsScreen({ navigation }) {
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('user_number')
        .eq('id', user.id)
        .single();
      if (userError) {
        console.log('User fetch error:', userError);
        Alert.alert('Error', 'Failed to fetch user data');
        return;
      }
      const { data, error } = await supabase
        .from('applications')
        .select('id, job_id, status, jobs (reference_number, category, location, date, time_from, time_to, duration, payment, description)')
        .eq('user_number', userData.user_number);
      if (error) {
        console.log('Fetch applied jobs error:', error);
        Alert.alert('Error', 'Failed to fetch applied jobs');
      } else {
        console.log('Fetched applied jobs:', data);
        setAppliedJobs(data);
      }
    };
    fetchAppliedJobs();
  }, []);

  const renderJob = ({ item }) => (
    <TouchableOpacity
      style={localStyles.card}
      onPress={() => navigation.navigate('JobDetails', { jobData: item.jobs })}
    >
      <View style={localStyles.cardContent}>
        <Text style={localStyles.name}>{item.jobs.reference_number} - {item.jobs.category}</Text>
        <Text style={localStyles.detail}>Status: {item.status}</Text>
        <Text style={localStyles.detail}>Location: {item.jobs.location}</Text>
        <Text style={localStyles.detail}>Payment: {item.jobs.payment} ZAR</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {appliedJobs.length === 0 ? (
        <Text style={styles.tagline}>No applied jobs</Text>
      ) : (
        <FlatList
          data={appliedJobs}
          renderItem={renderJob}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  card: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    color: '#333',
  },
  detail: {
    fontSize: 12,
    color: '#666',
  },
});