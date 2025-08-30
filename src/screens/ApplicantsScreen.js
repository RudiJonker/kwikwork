import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
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
        const applicantsWithDetails = await Promise.all(data.map(async (app) => {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('name, profile_pic')
            .eq('user_number', app.user_number)
            .single();
          if (userError) {
            console.log('User fetch error:', userError);
            return { ...app, name: app.email, profile_pic: null };
          }
          return { ...app, ...userData };
        }));
        setApplicants(applicantsWithDetails);
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

  const renderApplicant = ({ item }) => {
    const profileUrl = item.profile_pic ? `https://xvkzynoobfzwjyndglxh.supabase.co/storage/v1/object/public/profile-pics/${item.profile_pic}` : 'https://via.placeholder.com/50';
    return (
      <TouchableOpacity
        style={localStyles.card}
        onPress={() => navigation.navigate('SeekerDetails', { userNumber: item.user_number })}
      >
        <View style={localStyles.cardContent}>
          <Image source={{ uri: profileUrl }} style={localStyles.profilePic} />
          <View style={localStyles.textContainer}>
            <Text style={localStyles.name}>{item.name}</Text>
            <Text style={localStyles.rating}>★★★</Text>
            <Text style={localStyles.detail}>Email: {item.email}</Text>
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
  };

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
    flexDirection: 'row',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePic: {
    width: 60, // Slightly larger
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  rating: {
    fontSize: 16,
    color: '#888',
    marginVertical: 5,
  },
  detail: {
    fontSize: 14,
    color: '#666',
  },
  buttons: {
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
  },
  button: {
    padding: 8,
    borderRadius: 6,
    width: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});