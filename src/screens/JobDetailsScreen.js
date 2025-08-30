import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import styles from '../components/theme/styles';
import supabase from '../utils/Supabase';

export default function JobDetailsScreen({ navigation, route }) {
  const { jobData } = route.params;

  const handleApply = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  const { data: existing, error: checkError } = await supabase
    .from('applications')
    .select('id')
    .eq('user_number', (await supabase.from('users').select('user_number').eq('id', user.id).single()).data.user_number)
    .eq('job_id', jobData.id);
  if (checkError) {
    Alert.alert('Error', 'Check failed');
    return;
  }
  if (existing.length > 0) {
    Alert.alert('Notice', 'You have already applied for this job');
    return;
  }
  Alert.alert(
    'Confirm Application',
    'Are you sure you want to apply for this job?',
    [
      { text: 'Back', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          const { data: userData } = await supabase
            .from('users')
            .select('email, user_number')
            .eq('id', user.id)
            .single();
          const { data: jobDataFull } = await supabase
            .from('jobs')
            .select('employer_id')
            .eq('id', jobData.id)
            .single();
          const { error } = await supabase
            .from('applications')
            .insert({
              job_id: jobData.id,
              user_number: userData.user_number,
              employer_id: jobDataFull.employer_id,
              email: userData.email,
              reference_number: jobData.reference_number,
              status: 'pending',
            });
          if (error) Alert.alert('Error', 'Application failed');
          else Alert.alert('Success', 'Applied successfully');
        },
      },
    ]
  );
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 80 }]}>
        <View style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}>
          <Text style={styles.tagline}>Future Ad Placeholder</Text>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Text style={[styles.tagline, { textAlign: 'left' }]}>Job ID: {jobData.reference_number}</Text>
          <Text style={[styles.tagline, { textAlign: 'left' }]}>Category: {jobData.category}</Text>
          <Text style={[styles.tagline, { textAlign: 'left' }]}>Location: {jobData.location}</Text>
          <Text style={[styles.tagline, { textAlign: 'left' }]}>Date: {jobData.date}</Text>
          <Text style={[styles.tagline, { textAlign: 'left' }]}>Time: {jobData.time_from} - {jobData.time_to}</Text>
          <Text style={[styles.tagline, { textAlign: 'left' }]}>Duration: {jobData.duration} hours</Text>
          <Text style={[styles.tagline, { textAlign: 'left' }]}>Payment: {jobData.payment}</Text>
          <Text style={[styles.tagline, { textAlign: 'left' }]}>Description: {jobData.description}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleApply}>
          <Text style={styles.buttonText}>Apply</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}