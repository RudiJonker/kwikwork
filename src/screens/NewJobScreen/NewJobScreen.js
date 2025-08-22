import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import styles from '../../components/theme/styles';
import DateTimeFrom from './DateTimeFrom';
import DateTimeTo from './DateTimeTo';
import CategoryField from './CategoryField';
import LocationField from './LocationField';
import HoursField from './HoursField';
import PaymentField from './PaymentField';

export default function NewJobScreen({ navigation }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [location, setLocation] = useState('');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [payment, setPayment] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { width: '100%', paddingHorizontal: 16, paddingTop: 0, paddingBottom: 20 }]}>
        <Text style={styles.title}>Create New Job</Text>
        <CategoryField selectedCategories={selectedCategories} onCategoryChange={setSelectedCategories} />
        <LocationField location={location} onLocationChange={setLocation} />
        <DateTimeFrom value={fromDate} onChange={setFromDate} />
        <DateTimeTo value={toDate} onChange={setToDate} />
        <HoursField fromDate={fromDate} toDate={toDate} />
        <PaymentField onPaymentChange={setPayment} value={payment} />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}