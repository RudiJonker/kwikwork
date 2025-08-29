import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import styles from '../components/theme/styles';
import supabase from '../utils/Supabase';

export default function JobResultsScreen({ route, navigation }) {
  const { location, categories } = route.params;
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      let query = supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .ilike('location', `%${location}%`)
        .limit(20)
        .order('created_at', { ascending: false });

      if (categories.length > 0) {
        const categoryFilters = categories.map((cat) => `category.ilike.%${cat}%`).join(',');
        query = query.or(categoryFilters);
      }

      const { data, error } = await query;
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setJobs(data);
      }
      setLoading(false);
    };

    fetchJobs();
  }, [location, categories]);

  const renderJobCard = ({ item }) => (
    <TouchableOpacity
      style={[localStyles.card, { marginVertical: 8 }]}
      onPress={() => navigation.navigate('JobDetails', { jobData: item })}
    >
      <Text style={[localStyles.cardText]}>
        {item.category} - {item.payment} ZAR
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { paddingHorizontal: 16, paddingVertical: 20 }]}>
        <Text style={styles.title}>Job Results</Text>
        {loading ? (
          <Text style={styles.tagline}>Loading...</Text>
        ) : jobs.length === 0 ? (
          <Text style={styles.tagline}>No jobs found. Try different filters.</Text>
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
    padding: 8,
    marginHorizontal: 16,
    minHeight: 40,
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center', // Ensure card centers content
  },
  cardText: {
    fontSize: 14, // Match tagline font size
    color: '#333', // Match tagline color
    textAlign: 'center', // Center text horizontally
    lineHeight: 24, // Ensure vertical centering
  },
});