import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import styles from '../components/theme/styles';
import LocationField from './NewJobScreen/LocationField';
import CategoryField from './NewJobScreen/CategoryField';

export default function JobListScreen({ navigation }) {
  const [location, setLocation] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleSearch = () => {
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return;
    }
    navigation.navigate('JobResults', { location, categories: selectedCategories });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { paddingHorizontal: 16, paddingVertical: 20 }]}>
        <Text style={styles.title}>Find Jobs</Text>
        <LocationField
          location={location}
          onLocationChange={setLocation}
        />
        <CategoryField
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search Jobs</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}