import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import styles from '../components/theme/styles';
import supabase from '../utils/Supabase';

export default function PostedJobsScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        Alert.alert('Error', 'User not authenticated. Please log in.');
        navigation.navigate('Login');
        return;
      }

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setJobs(data);
      }
      setLoading(false);
    };

    fetchJobs();
  }, [navigation]);

  const renderJobCard = ({ item }) => (
    <TouchableOpacity
      style={[localStyles.card, { marginVertical: 8 }]}
      onPress={() => navigation.navigate('JobConfirmation', { jobData: item })}
    >
      <Text style={[styles.tagline, { fontWeight: 'bold' }]}>
        {item.reference_number}
      </Text>
      <Text style={styles.tagline}>Category: {item.category}</Text>
      <Text style={styles.tagline}>Location: {item.location}</Text>
      <Text style={styles.tagline}>Date: {item.date}</Text>
      <Text style={styles.tagline}>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { paddingHorizontal: 16, paddingVertical: 20 }]}>
        <Text style={styles.title}>My Jobs</Text>
        {jobs.length === 0 ? (
          <Text style={styles.tagline}>No jobs posted yet.</Text>
        ) : (
          <FlatList
            data={jobs}
            renderItem={renderJobCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});