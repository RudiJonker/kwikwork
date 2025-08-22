import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, SafeAreaView, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../../components/theme/styles';

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

export default function CategoryField({ selectedCategories, onCategoryChange }) {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleCategory = (category) => {
    const newSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((item) => item !== category)
      : [...selectedCategories, category];
    onCategoryChange(newSelectedCategories);
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
    <View>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: selectedCategories.length > 0 ? '#333' : '#888', fontSize: 16 }}>
          {selectedCategories.length > 0 ? 'Selected Categories' : 'Job Category (e.g., Gardening, Tiling)'}
        </Text>
      </TouchableOpacity>
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
      {selectedCategories.length > 0 && (
        <View style={localStyles.selectedCategoriesContainer}>
          {selectedCategories.map((item) => (
            <View key={item} style={localStyles.selectedCategoryCard}>
              <Text style={localStyles.selectedCategoryText}>{item}</Text>
            </View>
          ))}
        </View>
      )}
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
  footer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#c5bfc3',
    paddingBottom: 60,
  },
};