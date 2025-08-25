import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from 'react-native';
import styles from '../../components/theme/styles';
import DateTimeFrom from './DateTimeFrom';
import DateTimeTo from './DateTimeTo';
import CategoryField from './CategoryField';
import LocationField from './LocationField';
import HoursField from './HoursField';
import PaymentField from './PaymentField';
import JobDescriptionField from './JobDescriptionField';

export default function NewJobScreen({ navigation }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [location, setLocation] = useState('');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [payment, setPayment] = useState('');
  const [description, setDescription] = useState('');

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
              paddingBottom: 100, // Increased bottom padding to avoid navigation bar
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
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}