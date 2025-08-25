import React from 'react';
import { View, TextInput } from 'react-native';
import styles from '../../components/theme/styles';

export default function JobDescriptionField({ value, onChange }) {
  return (
    <View>
      <TextInput
        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
        placeholder="Short description (e.g., Mow lawn)"
        value={value}
        onChangeText={onChange}
        multiline
        maxLength={50}
      />
    </View>
  );
}