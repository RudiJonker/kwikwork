import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import theme from '../components/theme/theme';
import styles from '../components/theme/styles';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome to Kwikwork!</Text>
      <Text style={styles.tagline}>Local casual work at your fingertips!</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}