import React from 'react';
import { View, Text, TextInput } from 'react-native';
import styles from '../../components/theme/styles';

export default function HoursField({ fromDate, toDate }) {
  const calculateHours = () => {
    if (!fromDate || !toDate) return 'N/A';
    const diffMs = toDate - fromDate; // Difference in milliseconds
    const diffHours = Math.abs(diffMs / (1000 * 60 * 60)); // Convert to hours
    return `${diffHours.toFixed(1)} Hours`; // Append " Hours"
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        value={calculateHours()}
        placeholder="Duration (hours)"
        editable={false}
      />
    </View>
  );
}