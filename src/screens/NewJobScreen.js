import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
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
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={localStyles.modalContainer}>
            <View style={localStyles.modalContent}>
              <Text style={localStyles.modalTitle}>Select Categories</Text>
              <FlatList
                data={jobCategories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item}
                style={localStyles.categoryList}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
            </View>
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

        {/* Other Fields (Static) */}
        <TextInput
          style={styles.input}
          placeholder="Location (Street or Suburb)"
          editable={false}
        />
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
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
};