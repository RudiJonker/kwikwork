import { StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native';
import { useState, useRef } from 'react';
import supabase from '../utils/Supabase';
import styles from '../components/theme/styles';
import 'react-native-get-random-values';
import PhoneInput from 'react-native-phone-number-input';

export default function SignupScreen({ navigation }) {
  const [role, setRole] = useState('seeker');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const phoneInput = useRef(null);

  const handleSignup = async () => {
    // Validate name is not blank
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a valid name');
      return;
    }

    // Stronger email validation: requires valid username, domain, and disallows .co as standalone TLD
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.(?!co$)[a-zA-Z]{2,})$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address (e.g., user@domain.com or user@domain.co.za, not user@domain.co)');
      return;
    }

    const isValid = phoneInput.current?.isValidNumber(formattedPhone);
    if (!formattedPhone || !isValid) {
      Alert.alert('Error', 'Please enter a valid phone number with the correct format (e.g., +27 812345678)');
      return;
    }

    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    const { error: dbError } = await supabase.from('users').insert([
      { id: user.id, name, email, phone: formattedPhone, role },
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
      <PhoneInput
        ref={phoneInput}
        defaultCode="ZA"
        layout="first"
        onChangeText={(text) => setPhone(text)}
        onChangeFormattedText={(text) => setFormattedPhone(text)}
        containerStyle={{ ...styles.input, flexDirection: 'row', alignItems: 'center', height: 40 }}
        textContainerStyle={{ flex: 1, paddingVertical: 0, paddingHorizontal:-5,height: 35, justifyContent: 'center', backgroundColor: '#fff' }}
        textInputStyle={{ fontSize: 16, height: '100%', textAlignVertical: 'center', paddingTop: 0, paddingBottom: 0 }}
        codeTextStyle={{ fontSize: 16, textAlignVertical: 'center' }}
        placeholder="Phone"
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