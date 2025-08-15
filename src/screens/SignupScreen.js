import { StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native';
import { useState } from 'react';
import supabase from '../utils/Supabase';
import styles from '../components/theme/styles';

export default function SignupScreen({ navigation }) {
  const [role, setRole] = useState('seeker');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleSignup = async () => {
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    const { error: dbError } = await supabase.from('users').insert([
      { id: user.id, name, email, phone, role },
    ]);

    if (dbError) {
      Alert.alert('Error', dbError.message);
      return;
    }

    Alert.alert('Success', 'You have successfully Signed Up!');
    navigation.navigate('Login', { email });
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
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
      <TextInput
        style={styles.input}
        placeholder="Phone"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <View style={localStyles.radioGroup}>
        <Pressable style={localStyles.radioContainer} onPress={() => setRole('seeker')}>
          <View style={styles.radioButton}>
            {role === 'seeker' && <View style={styles.radioSelected} />}
          </View>
          <Text style={localStyles.radioText}>Seeker</Text>
        </Pressable>
        <Pressable style={localStyles.radioContainer} onPress={() => setRole('employer')}>
          <View style={styles.radioButton}>
            {role === 'employer' && <View style={styles.radioSelected} />}
          </View>
          <Text style={localStyles.radioText}>Employer</Text>
        </Pressable>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login', { email })}>
        <Text style={styles.link}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const localStyles = StyleSheet.create({
  radioGroup: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginVertical: 15,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  radioText: {
    fontSize: 16,
    color: styles.text,
  },
});