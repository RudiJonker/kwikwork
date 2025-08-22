import React, { useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import styles from '../../components/theme/styles';

export default function DateTimeTo({ value, onChange }) {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);
  const handleConfirm = (selectedDate) => {
    onChange(selectedDate);
    hideDatePicker();
  };

  return (
    <View>
      <TouchableOpacity style={styles.input} onPress={showDatePicker}>
        <Text>{value?.toLocaleString() || 'Date & Time (To)'}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={value || new Date()}
      />
    </View>
  );
}