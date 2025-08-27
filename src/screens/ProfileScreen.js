import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
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
  const [profileImageUrl, setProfileImageUrl] = useState('');

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
      if (dbError) console.log('Fetch error:', dbError.message);
      else {
        setUserData(data || {});
        setEditedName(data.name || '');
        setEditedPhone(data.phone || '');
        if (data.profile_pic && !data.profile_pic.startsWith('http')) {
          console.log('Checking profile_pic:', data.profile_pic);
          const { data: signedData, error: signedError } = await supabase.storage
            .from('profile-pics')
            .createSignedUrl(data.profile_pic, 3600);
          if (signedError) {
            console.log('Signed URL error:', signedError.message);
            setProfileImageUrl('');
          } else {
            setProfileImageUrl(signedData.signedUrl);
            console.log('Signed URL:', signedData.signedUrl);
          }
        } else {
          setProfileImageUrl('');
        }
      }
    };
    fetchUserData();
  }, [navigation]);

  const pickImage = async () => {
    console.log('pickImage triggered');
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Permission to access media library is required!');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const { uri } = result.assets[0];
        const fileExt = uri.split('.').pop().toLowerCase();
        const mimeType = fileExt === 'jpg' || fileExt === 'jpeg' ? 'image/jpeg' : 'image/png';
        const fileName = `${(await supabase.auth.getUser()).data.user.id}-${Date.now()}.${fileExt}`;

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
          console.log('Session error:', sessionError?.message);
          Alert.alert('Error', 'No active session');
          return;
        }

        const uploadResponse = await FileSystem.uploadAsync(
          `https://xvkzynoobfzwjyndglxh.supabase.co/storage/v1/object/profile-pics/${fileName}`,
          uri,
          {
            headers: { 'Content-Type': mimeType, 'Authorization': `Bearer ${session.access_token}` },
            httpMethod: 'PUT',
            uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          }
        );

        if (uploadResponse.status !== 200) {
          console.log('Upload failed:', uploadResponse.body);
          Alert.alert('Error', `Upload failed: ${uploadResponse.body}`);
          return;
        }

        console.log('Upload successful:', uploadResponse.body);

        const { error: dbError } = await supabase
          .from('users')
          .update({ profile_pic: fileName })
          .eq('id', (await supabase.auth.getUser()).data.user.id);

        if (dbError) {
          console.log('Update error:', dbError.message);
          Alert.alert('Error', 'Failed to update profile picture: ' + dbError.message);
          return;
        }

        const { data: signedData, error: signedError } = await supabase.storage
          .from('profile-pics')
          .createSignedUrl(fileName, 3600);

        if (signedError) {
          console.log('Signed URL error:', signedError.message);
          Alert.alert('Error', 'Failed to generate image URL: ' + signedError.message);
        } else {
          setProfileImageUrl(signedData.signedUrl);
          setUserData({ ...userData, profile_pic: fileName });
          console.log('Signed URL:', signedData.signedUrl);
          Alert.alert('Success', 'Profile picture updated');
        }
      }
    } catch (error) {
      console.log('Image picker error:', error.message);
      Alert.alert('Error', 'Failed to pick image: ' + error.message);
    }
  };

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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert('Error', 'Logout failed');
    else navigation.navigate('Welcome');
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
            <TouchableOpacity onPress={pickImage} style={localStyles.avatarContainer} activeOpacity={0.7}>
              <Image
                style={localStyles.profilePic}
                source={profileImageUrl ? { uri: profileImageUrl } : require('../../assets/default-avatar.png')}
                resizeMode="cover"
                onError={(e) => {
                  console.log('Image load error:', e.nativeEvent.error);
                  setProfileImageUrl('');
                }}
              />
            </TouchableOpacity>
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
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={styles.buttonText}>Log Out</Text>
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
  avatarContainer: {
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 52,
    marginBottom: 10,
    padding: 4,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
});