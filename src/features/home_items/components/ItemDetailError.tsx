import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

interface ItemDetailErrorProps {
  error?: Error;
}

export const ItemDetailError: React.FC<ItemDetailErrorProps> = ({ error }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.errorContainer}>
      <Icon name="alert-circle-outline" size={64} color="#d1d5db" />
      <Text style={styles.errorText}>
        {error ? 'Error Loading Item' : 'Item not found'}
      </Text>
      <Text style={styles.errorSubtext}>
        {error?.message || 'The item you are looking for does not exist'}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
