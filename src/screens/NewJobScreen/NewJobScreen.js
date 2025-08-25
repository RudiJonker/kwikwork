import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, TouchableOpacity, Text, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import styles from '../../components/theme/styles';
import DateTimeFrom from './DateTimeFrom';
import DateTimeTo from './DateTimeTo';
import CategoryField from './CategoryField';
import LocationField from './LocationField';
import HoursField from './HoursField';
import PaymentField from './PaymentField';
import JobDescriptionField from './JobDescriptionField';
import supabase from '../../utils/Supabase';

export default function NewJobScreen({ navigation }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [location, setLocation] = useState('');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [payment, setPayment] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    // Validate categories
    if (selectedCategories.length === 0) {
      Alert.alert('Error', 'Please select at least one job category');
      return;
    }

    // Validate description
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a job description');
      return;
    }

    // Validate location
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a valid location');
      return;
    }

    // Validate dates
    if (!fromDate || !toDate) {
      Alert.alert('Error', 'Please select both start and end dates');
      return;
    }
    if (toDate <= fromDate) {
      Alert.alert('Error', 'End date must be after start date');
      return;
    }

    // Validate payment
    if (!payment.trim() || isNaN(payment) || Number(payment) <= 0) {
      Alert.alert('Error', 'Please enter a valid payment amount');
      return;
    }

    // Get user ID from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      Alert.alert('Error', 'User not authenticated. Please log in.');
      return;
    }

    // Calculate duration in hours
    const diffMs = toDate - fromDate;
    const duration = Math.abs(diffMs / (1000 * 60 * 60));

    // Format date and times for Supabase
    const date = fromDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const time_from = fromDate.toISOString().slice(11, 16); // HH:MM
    const time_to = toDate.toISOString().slice(11, 16); // HH:MM

    // Prepare job data
    const jobData = {
      employer_id: user.id,
      category: selectedCategories.join(','), // Join array into string
      description,
      location,
      date,
      time_from,
      time_to,
      duration,
      payment: Number(payment),
      currency: 'ZAR', // Default for now
      status: 'open',
    };

    // Insert into Supabase jobs table
    const { error } = await supabase.from('jobs').insert([jobData]);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    Alert.alert('Success', 'Job posted successfully!');
    navigation.navigate('Tabs'); // Navigate to dashboard after success
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              width: '100%',
              paddingHorizontal: 16,
              paddingTop: 0,
              paddingBottom: 100,
            },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Create New Job</Text>
          <CategoryField selectedCategories={selectedCategories} onCategoryChange={setSelectedCategories} />
          <JobDescriptionField value={description} onChange={setDescription} />
          <LocationField location={location} onLocationChange={setLocation} />
          <DateTimeFrom value={fromDate} onChange={setFromDate} />
          <DateTimeTo value={toDate} onChange={setToDate} />
          <HoursField fromDate={fromDate} toDate={toDate} />
          <PaymentField onPaymentChange={setPayment} value={payment} />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}