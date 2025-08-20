import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import supabase from '../utils/Supabase';
import styles from '../components/theme/styles';

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [userData, setUserData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    bio: '', 
    business_name: '', 
    profile_pic: '',
    role: ''
  });
  const [editedName, setEditedName] = useState('');
  const [editedPhone, setEditedPhone] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        navigation.navigate('Login');
        return;
      }
      const { data, error: dbError } = await supabase
        .from('users')
        .select('name, email, phone, bio, business_name, profile_pic, role')
        .eq('id', user.id)
        .single();
      if (dbError) console.log(dbError.message);
      else {
        setUserData(data || {});
        setEditedName(data.name || '');
        setEditedPhone(data.phone || '');
      }
    };
    fetchUserData();
  }, [navigation]);

  const handleSave = async () => {
    const updateData = {
      name: editedName,
      phone: editedPhone,
      bio: userData.role === 'seeker' ? userData.bio : null,
      business_name: userData.role === 'employer' ? userData.business_name : null
    };
    console.log('Updating with:', updateData);
    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', (await supabase.auth.getUser()).data.user.id);
    if (error) {
      console.log('Update error:', error.message);
      Alert.alert('Error', error.message);
    } else {
      console.log('Profile updated');
      Alert.alert('Success', 'Profile updated');
    }
  };

  const renderContent = () => {
    if (userData.role === 'employer') {
      return (
        <TextInput
          style={[styles.input, { height: 40 }]}
          placeholder="Business Name"
          value={userData.business_name || ''}
          onChangeText={(text) => setUserData({ ...userData, business_name: text })}
        />
      );
    }
    return (
      <TextInput
        style={[styles.input, localStyles.bioInput]}
        placeholder="Bio (Optional Experience Summary)"
        value={userData.bio || ''}
        onChangeText={(text) => {
          const words = text.trim().split(/\s+/).length;
          if (words <= 50) setUserData({ ...userData, bio: text });
        }}
        multiline
        numberOfLines={4}
        maxLength={250}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', paddingTop: 5, paddingBottom: insets.bottom + 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={localStyles.profileContainer}>
            <Image
              style={localStyles.profilePic}
              source={userData.profile_pic ? { uri: userData.profile_pic } : require('../../assets/default-avatar.png')}
            />
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editedName}
              onChangeText={setEditedName}
            />
            <TextInput
              style={[styles.input, { color: '#888' }]}
              placeholder="Email"
              value={userData.email}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={editedPhone}
              onChangeText={setEditedPhone}
              keyboardType="phone-pad"
            />
            {renderContent()}
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const localStyles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    padding: 16,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
});