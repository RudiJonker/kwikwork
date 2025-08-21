import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../components/theme/styles';

export default function NewJobScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 20 }]}>
        <Text style={styles.title}>Create New Job</Text>
        
        {/* Job Category Dropdown (Static) */}
        <View style={styles.input}>
          <Text style={{ color: '#888', fontSize: 16 }}>Job Category (e.g., Gardening, Tiling)</Text>
        </View>

        {/* Location */}
        <TextInput
          style={styles.input}
          placeholder="Location (Street or Suburb)"
          editable={false}
        />

        {/* Date Picker (From) */}
        <View style={styles.input}>
          <Text style={{ color: '#888', fontSize: 16 }}>Date & Time (From)</Text>
        </View>

        {/* Date Picker (To) */}
        <View style={styles.input}>
          <Text style={{ color: '#888', fontSize: 16 }}>Date & Time (To)</Text>
        </View>

        {/* Duration */}
        <TextInput
          style={styles.input}
          placeholder="Duration (e.g., 2.5 hours)"
          editable={false}
        />

        {/* Payment */}
        <View style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}>
          <Text style={{ fontSize: 16, marginRight: 10, color: '#333' }}>R</Text>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Payment (e.g., 300)"
            editable={false}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}