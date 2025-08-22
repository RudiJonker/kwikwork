import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform, Dimensions, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../components/theme/styles';

const jobCategories = [
  'Gardening',
  'Domestic House Work',
  'Tiling',
  'Painting',
  'Cleaning',
  'Washing',
  'Roof Work',
  'Cabling',
  'Construction Site',
  'General'
];

export default function NewJobScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [location, setLocation] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((item) => item !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={localStyles.categoryItem}
      onPress={() => toggleCategory(item)}
    >
      <View style={selectedCategories.includes(item) ? localStyles.selectedCheck : localStyles.unselectedCheck}>
        {selectedCategories.includes(item) && (
          <MaterialCommunityIcons name="check" size={16} color="#fff" />
        )}
      </View>
      <Text style={localStyles.categoryText}>{item}</Text>
    </TouchableOpacity>
  );

  const fetchSuggestions = async (text) => {
    if (!text) {
      setSuggestions([]);
      console.log('No text input, clearing suggestions');
      return;
    }
    setLoadingSuggestions(true);
    console.log('Fetching suggestions for:', text);
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&type=locality&limit=5&apiKey=61449e72d36d4499bb2467b8e8cdc167`
      );
      const data = await response.json();
      console.log('API Response:', data);
      if (data.features && data.features.length > 0) {
        setSuggestions(data.features.map((feature) => feature.properties.formatted));
      } else {
        setSuggestions([]);
        console.log('No features in response');
      }
    } catch (error) {
      console.error('Fetch Suggestions Error:', error.message);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setLocationInput(selectedLocation);
    setSuggestions([]);
  };

  useEffect(() => {
    const timeout = setTimeout(() => fetchSuggestions(locationInput), 300);
    return () => clearTimeout(timeout);
  }, [locationInput]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 20, paddingHorizontal: 16, paddingTop: 0 }]}>
        <Text style={styles.title}>Create New Job</Text>

        {/* Job Category Dropdown */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: selectedCategories.length > 0 ? '#333' : '#888', fontSize: 16 }}>
            {selectedCategories.length > 0 ? 'Selected Categories' : 'Job Category (e.g., Gardening, Tiling)'}
          </Text>
        </TouchableOpacity>

        {/* Modal for Category Selection */}
        <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={localStyles.modalOverlay}>
            <SafeAreaView style={localStyles.modalContent}>
              <Text style={localStyles.modalTitle}>Select Categories</Text>
              <FlatList
                data={jobCategories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item}
                style={localStyles.categoryList}
              />
              <View style={localStyles.footer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>
        </Modal>

        {/* Selected Categories as Cards */}
        {selectedCategories.length > 0 && (
          <View style={localStyles.selectedCategoriesContainer}>
            {selectedCategories.map((item) => (
              <View key={item} style={localStyles.selectedCategoryCard}>
                <Text style={localStyles.selectedCategoryText}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Location Field */}
        <TouchableOpacity
          style={[styles.input, { paddingHorizontal: 10 }]}
          onPress={() => setLocationModalVisible(true)}
        >
          <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: location ? '#333' : '#888', fontSize: 16 }}>
            {location || 'Location (Suburb, Town)'}
          </Text>
        </TouchableOpacity>

        {/* Modal for Location Selection */}
        <Modal
          animationType="slide"
          visible={locationModalVisible}
          onRequestClose={() => {
            if (locationInput && !location) setLocation(locationInput);
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
                    if (locationInput && !location) setLocation(locationInput);
                    setLocationModalVisible(false);
                  }}
                >
                  <Text style={styles.buttonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>
        </Modal>

        {/* Other Fields (Static) */}
        <View style={styles.input}>
          <Text style={{ color: '#888', fontSize: 16 }}>Date & Time (From)</Text>
        </View>
        <View style={styles.input}>
          <Text style={{ color: '#888', fontSize: 16 }}>Date & Time (To)</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Duration (e.g., 2.5 hours)"
          editable={false}
        />
        <View style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}>
          <Text style={{ fontSize: 16, marginRight: 10, color: '#333' }}>R</Text>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Payment (e.g., 300)"
            editable={false}
          />
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
  categoryList: {
    marginBottom: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  selectedCheck: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#48d22b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselectedCheck: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#333',
  },
  selectedCategoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
    marginHorizontal: -4,
  },
  selectedCategoryCard: {
    backgroundColor: '#48d22b',
    borderRadius: 16,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 4,
    flexGrow: 0,
  },
  selectedCategoryText: {
    color: '#fff',
    fontSize: 14,
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
    paddingBottom: 60, // Added padding to keep it above the safe area bottom
  },
};