import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../components/theme/styles';

export default function JobConfirmationScreen({ navigation, route }) {
  const { jobData } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 20,
          paddingBottom: 100,
        }}
      >
        <Text style={styles.title}>Job Posted Successfully!</Text>
        <View style={{ marginVertical: 20 }}>
          <Text style={[styles.tagline, { textAlign: 'left' }]}>Reference Number: {jobData.reference_number}</Text>
          <Text style={[styles.tagline, { textAlign: 'left' }]}>Category: {jobData.category}</Text>
          <Text style={[styles.tagline, { textAlign: 'left' }]}>Description: {jobData.description}</Text>
          <Text style={[styles.tagline, { textAlign: 'left' }]}>Location: {jobData.location}</Text>
          <Text style={[styles.tagline, { textAlign: 'left' }]}>Date: {jobData.date}</Text>
          <Text style={[styles.tagline, { textAlign: 'left' }]}>Time: {jobData.time_from} - {jobData.time_to}</Text>
          <Text style={[styles.tagline, { textAlign: 'left' }]}>Duration: {jobData.duration} hours</Text>
          <Text style={[styles.tagline, { textAlign: 'left' }]}>Payment: {jobData.payment} ZAR</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Tabs')}
        >
          <Text style={styles.buttonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}