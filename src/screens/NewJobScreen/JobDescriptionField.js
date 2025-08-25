import React from 'react';
import { View, TextInput } from 'react-native';
import styles from '../../components/theme/styles';

export default function JobDescriptionField({ value, onChange }) {
  return (
    <View>
      <TextInput
        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
        placeholder="Job Description (min 100 characters)"
        value={value}
        onChangeText={onChange}
        multiline
        maxLength={500}
      />
    </View>
  );
}