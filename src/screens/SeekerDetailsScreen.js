import React, { useState, useEffect } from 'react';
import { View, Text, Image, SafeAreaView, ScrollView } from 'react-native';
import supabase from '../utils/Supabase';
import styles from '../components/theme/styles';

export default function SeekerDetailsScreen({ route }) {
  const { seekerId } = route.params;
  const [seekerData, setSeekerData] = useState({ name: '', bio: '', profile_pic: '' });

  useEffect(() => {
    const fetchSeekerData = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('name, bio, profile_pic')
        .eq('id', seekerId)
        .single();
      if (error) console.log(error);
      else {
        setSeekerData(data);
        if (data.profile_pic && !data.profile_pic.startsWith('http')) {
          const { data: signedData } = await supabase.storage
            .from('profile-pics')
            .createSignedUrl(data.profile_pic, 3600);
          setSeekerData(prev => ({ ...prev, profile_pic: signedData.signedUrl }));
        }
      }
    };
    fetchSeekerData();
  }, [seekerId]);

  const profileUrl = seekerData.profile_pic || 'https://via.placeholder.com/100';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Image source={{ uri: profileUrl }} style={{ width: 100, height: 100, borderRadius: 50 }} />
          <Text style={[styles.tagline, { textAlign: 'center', marginTop: 10 }]}>★★★</Text>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Text style={[styles.tagline, { textAlign: 'left' }]}>Name: {seekerData.name}</Text>
          <Text style={[styles.tagline, { textAlign: 'left' }]}>Bio: {seekerData.bio || 'No bio available'}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}