import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import supabase from '../utils/Supabase';
import styles from '../components/theme/styles';

export default function ApplicantsScreen({ navigation }) {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('applications')
        .select('id, seeker_id, jobs (reference_number)')
        .eq('employer_id', user.id)
        .eq('status', 'pending');
      if (error) console.log(error);
      else {
        const applicantsWithDetails = await Promise.all(data.map(async (app) => {
          const { data: userData } = await supabase
            .from('users')
            .select('name, profile_pic')
            .eq('id', app.seeker_id)
            .single();
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
    if (approveError) Alert.alert('Error', 'Approve failed');
    else {
      const { error: rejectError } = await supabase
        .from('applications')
        .update({ status: 'rejected' })
        .eq('job_id', jobId)
        .neq('id', applicationId);
      const { error: jobError } = await supabase
        .from('jobs')
        .update({ status: 'filled' })
        .eq('id', jobId);
      if (rejectError || jobError) Alert.alert('Error', 'Update failed');
      else setApplicants(applicants.filter(a => a.id !== applicationId));
    }
  };

  const handleReject = async (applicationId) => {
    const { error } = await supabase
      .from('applications')
      .update({ status: 'rejected' })
      .eq('id', applicationId);
    if (error) Alert.alert('Error', 'Reject failed');
    else setApplicants(applicants.filter(a => a.id !== applicationId));
  };

  const renderApplicant = ({ item }) => {
    const profileUrl = item.profile_pic ? `https://xvkzynoobfzwjyndglxh.supabase.co/storage/v1/object/public/profile-pics/${item.profile_pic}` : null;
    return (
      <TouchableOpacity style={localStyles.card} onPress={() => navigation.navigate('SeekerDetails', { seekerId: item.seeker_id })}>
        <View style={localStyles.cardContent}>
          <Image source={{ uri: profileUrl || 'https://via.placeholder.com/50' }} style={localStyles.profilePic} />
          <View style={localStyles.textContainer}>
            <Text style={localStyles.name}>{item.name}</Text>
            <Text style={localStyles.rating}>★★★</Text>
          </View>
          <View style={localStyles.buttons}>
            <TouchableOpacity style={[localStyles.button, { backgroundColor: '#4caf50' }]} onPress={() => handleApprove(item.id, item.jobs.id)}>
              <Text style={localStyles.buttonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[localStyles.button, { backgroundColor: '#f44336' }]} onPress={() => handleReject(item.id)}>
              <Text style={localStyles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={applicants}
        renderItem={renderApplicant}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    color: '#333',
  },
  rating: {
    fontSize: 14,
    color: '#888',
  },
  buttons: {
    flexDirection: 'row',
    gap: 5,
  },
  button: {
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
  },
});