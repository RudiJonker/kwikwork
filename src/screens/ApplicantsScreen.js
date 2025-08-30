import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import supabase from '../utils/Supabase';
import styles from '../components/theme/styles';

export default function ApplicantsScreen({ navigation }) {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }
      const { data, error } = await supabase
        .from('applications')
        .select('id, user_number, job_id, email, reference_number, jobs (reference_number)')
        .eq('employer_id', user.id)
        .eq('status', 'pending');
      if (error) {
        console.log('Fetch applicants error:', error);
        Alert.alert('Error', 'Failed to fetch applicants');
      } else {
        console.log('Fetched applicants:', data);
        setApplicants(data);
      }
    };
    fetchApplicants();
  }, []);

  const handleApprove = async (applicationId, jobId) => {
    const { error: approveError } = await supabase
      .from('applications')
      .update({ status: 'approved' })
      .eq('id', applicationId);
    if (approveError) {
      Alert.alert('Error', 'Approve failed');
    } else {
      const { error: rejectError } = await supabase
        .from('applications')
        .update({ status: 'rejected' })
        .eq('job_id', jobId)
        .neq('id', applicationId);
      const { error: jobError } = await supabase
        .from('jobs')
        .update({ status: 'filled' })
        .eq('id', jobId);
      if (rejectError || jobError) {
        Alert.alert('Error', 'Update failed');
      } else {
        setApplicants(applicants.filter(a => a.id !== applicationId));
      }
    }
  };

  const handleReject = async (applicationId) => {
    const { error } = await supabase
      .from('applications')
      .update({ status: 'rejected' })
      .eq('id', applicationId);
    if (error) {
      Alert.alert('Error', 'Reject failed');
    } else {
      setApplicants(applicants.filter(a => a.id !== applicationId));
    }
  };

  const renderApplicant = ({ item }) => (
    <TouchableOpacity
      style={localStyles.card}
      onPress={() => navigation.navigate('SeekerDetails', { userNumber: item.user_number })}
    >
      <View style={localStyles.cardContent}>
        <View style={localStyles.textContainer}>
          <Text style={localStyles.name}>{item.email}</Text>
          <Text style={localStyles.rating}>★★★</Text>
          <Text style={localStyles.detail}>Ref: {item.reference_number}</Text>
          <Text style={localStyles.detail}>Job: {item.jobs.reference_number}</Text>
        </View>
        <View style={localStyles.buttons}>
          <TouchableOpacity
            style={[localStyles.button, { backgroundColor: '#4caf50' }]}
            onPress={() => handleApprove(item.id, item.job_id)}
          >
            <Text style={localStyles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[localStyles.button, { backgroundColor: '#f44336' }]}
            onPress={() => handleReject(item.id)}
          >
            <Text style={localStyles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {applicants.length === 0 ? (
        <Text style={styles.tagline}>No pending applicants</Text>
      ) : (
        <FlatList
          data={applicants}
          renderItem={renderApplicant}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  textContainer: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  rating: {
    fontSize: 16,
    color: '#888',
    marginVertical: 5,
    textAlign: 'left',
  },
  detail: {
    fontSize: 14,
    color: '#666',
    textAlign: 'left',
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  button: {
    padding: 8,
    borderRadius: 6,
    width: 100, // Increased from 80 to 100
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});