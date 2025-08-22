import React from 'react';
import { View, TextInput } from 'react-native';
import styles from '../../components/theme/styles';

export default function PaymentField({ onPaymentChange, value }) {
  const handleChange = (text) => {
    const numericValue = text.replace(/[^0-9.]/g, ''); // Allow only numbers and decimal
    onPaymentChange(numericValue);
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={handleChange}
        placeholder="Payment (e.g., 300)"
        keyboardType="numeric"
      />
    </View>
  );
}