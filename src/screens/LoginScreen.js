import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, ScrollView, SafeAreaView } from 'react-native';
import { useState } from 'react';
import supabase from '../utils/Supabase';
import styles from '../components/theme/styles';

export default function LoginScreen({ navigation, route }) {
  const [email, setEmail] = useState(route.params?.email || '');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    Alert.alert('Success', 'Logging in');
    navigation.navigate('Tabs'); // Changed from 'Dashboard' to 'Tabs'
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={require('../../assets/logo.png')} style={[styles.logo, { marginTop: 5 }]} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.link}>Don't have an account yet? Sign Up</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}