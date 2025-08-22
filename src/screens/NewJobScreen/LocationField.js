import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, ActivityIndicator, SafeAreaView, Dimensions } from 'react-native';
import styles from '../../components/theme/styles';

export default function LocationField({ location, onLocationChange }) {
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const fetchSuggestions = async (text) => {
    if (!text) {
      setSuggestions([]);
      return;
    }
    setLoadingSuggestions(true);
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&type=locality&limit=5&apiKey=61449e72d36d4499bb2467b8e8cdc167`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        setSuggestions(data.features.map((feature) => feature.properties.formatted));
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Fetch Suggestions Error:', error.message);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleLocationSelect = (selectedLocation) => {
    onLocationChange(selectedLocation);
    setLocationInput(selectedLocation);
    setSuggestions([]);
  };

  useEffect(() => {
    const timeout = setTimeout(() => fetchSuggestions(locationInput), 300);
    return () => clearTimeout(timeout);
  }, [locationInput]);

  return (
    <View>
      <TouchableOpacity
        style={[styles.input, { paddingHorizontal: 10 }]}
        onPress={() => setLocationModalVisible(true)}
      >
        <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: location ? '#333' : '#888', fontSize: 16 }}>
          {location || 'Location (Suburb, Town)'}
        </Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        visible={locationModalVisible}
        onRequestClose={() => {
          if (locationInput && !location) onLocationChange(locationInput);
          setLocationModalVisible(false);
        }}
      >
        <View style={localStyles.modalOverlay}>
          <SafeAreaView style={localStyles.modalContent}>
            <Text style={localStyles.modalTitle}>Select Location</Text>
            <TextInput
              style={styles.input}
              value={locationInput}
              onChangeText={setLocationInput}
              placeholder="Enter suburb or town"
              autoFocus
            />
            {loadingSuggestions && <ActivityIndicator size="small" color="#48d22b" />}
            <FlatList
              data={suggestions}
              renderItem={({ item }) => (
                <TouchableOpacity style={localStyles.suggestionItem} onPress={() => handleLocationSelect(item)}>
                  <Text style={localStyles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
              style={{ flex: 1, maxHeight: 400, marginBottom: 10 }}
              ListEmptyComponent={<Text style={localStyles.noSuggestionsText}>No suggestions</Text>}
            />
            <View style={localStyles.footer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  if (locationInput && !location) onLocationChange(locationInput);
                  setLocationModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

const localStyles = {
  modalOverlay: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#c5bfc3',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
  noSuggestionsText: {
    padding: 10,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  footer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#c5bfc3',
    paddingBottom: 60,
  },
};