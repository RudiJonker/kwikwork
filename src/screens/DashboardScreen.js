import { StyleSheet, Text, View } from 'react-native';
import styles from '../components/theme/styles';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
    </View>
  );
}