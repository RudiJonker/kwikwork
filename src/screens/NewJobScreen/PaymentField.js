import React from 'react';
import { View, TextInput } from 'react-native';
import styles from '../../components/theme/styles';

export default function PaymentField({ value, onPaymentChange }) {
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Payment Amount"
        value={value}
        onChangeText={onPaymentChange}
        keyboardType="numeric"
      />
    </View>
  );
}