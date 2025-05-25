import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Correct import for Expo


export default function App() {
  const [formData, setFormData] = useState({
    sepal_length: '',
    sepal_width: '',
    petal_length: '',
    petal_width: '',
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [flowerType, setFlowerType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const showMessage = (message: string) => {
    setErrorMessage(message);
    setModalVisible(true);
  };

  const hideMessage = () => {
    setModalVisible(false);
    setErrorMessage('');
  };

  const handleSubmit = async () => {
    const { sepal_length, sepal_width, petal_length, petal_width } = formData;
    if (!sepal_length || !sepal_width || !petal_length || !petal_width) {
      showMessage('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.9:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature_array: [
            parseFloat(sepal_length),
            parseFloat(sepal_width),
            parseFloat(petal_length),
            parseFloat(petal_width),
          ],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const pred = data.prediction[0];
        setPrediction(pred);

        if (pred === 0) setFlowerType('Setosa');
        else if (pred === 1) setFlowerType('Versicolor');
        else if (pred === 2) setFlowerType('Virginica');
        else setFlowerType('Unknown');
      } else {
        setPrediction(null);
        setFlowerType('Error: ' + (data.error || 'An unknown error occurred.'));
        showMessage('Prediction Error: ' + (data.error || 'Please try again.'));
      }
    } catch (error) {
      console.error('Error fetching prediction:', error);
      setPrediction(null);
      setFlowerType('Error connecting to the server.');
      showMessage('Failed to connect to the server. Ensure the server is running and accessible.');
    }
  };

  const getInputStyle = (inputName: string) => [
    styles.inputField,
    focusedInput === inputName && styles.inputFieldFocused,
  ];

  return (
    <LinearGradient
      colors={['#8A2BE2', '#4B0082']}
      style={styles.appContainer}
    >
      <SafeAreaView style={styles.safeAreaContent}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.mainCard}>
              <Text style={styles.title}>Iris Flower Predictor</Text>
              <Text style={styles.subtitle}>
                Enter the measurements below to predict the iris flower species
              </Text>

              <View style={styles.formContainer}>
                <TextInput
                  style={getInputStyle('sepal_length')}
                  placeholder="Sepal Length (cm)"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                  value={formData.sepal_length}
                  onChangeText={(value) => handleChange('sepal_length', value)}
                  onFocus={() => setFocusedInput('sepal_length')}
                  onBlur={() => setFocusedInput(null)}
                />
                <TextInput
                  style={getInputStyle('sepal_width')}
                  placeholder="Sepal Width (cm)"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                  value={formData.sepal_width}
                  onChangeText={(value) => handleChange('sepal_width', value)}
                  onFocus={() => setFocusedInput('sepal_width')}
                  onBlur={() => setFocusedInput(null)}
                />
                <TextInput
                  style={getInputStyle('petal_length')}
                  placeholder="Petal Length (cm)"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                  value={formData.petal_length}
                  onChangeText={(value) => handleChange('petal_length', value)}
                  onFocus={() => setFocusedInput('petal_length')}
                  onBlur={() => setFocusedInput(null)}
                />
                <TextInput
                  style={getInputStyle('petal_width')}
                  placeholder="Petal Width (cm)"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                  value={formData.petal_width}
                  onChangeText={(value) => handleChange('petal_width', value)}
                  onFocus={() => setFocusedInput('petal_width')}
                  onBlur={() => setFocusedInput(null)}
                />

                <TouchableOpacity
                  onPress={handleSubmit}
                  style={styles.predictButtonWrapper}
                >
                  <LinearGradient
                    colors={['#EC4899', '#EF4444']}
                    style={styles.predictButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.predictButtonText}>Predict</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {prediction !== null && (
                <View style={styles.resultContainer}>
                  <Text style={styles.resultLabel}>Prediction:</Text>
                  <Text style={styles.resultValue}>{flowerType}</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Modal for error messages */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={hideMessage}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{errorMessage}</Text>
            <TouchableOpacity onPress={hideMessage} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  safeAreaContent: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16, // Equivalent to p-4
  },
  mainCard: {
    maxWidth: 672, // Equivalent to max-w-xl (56rem, but adjusted for mobile)
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 24, // Equivalent to rounded-3xl
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 }, // Equivalent to shadow-2xl
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10, // For Android shadow
    padding: 32, // Equivalent to p-8
    alignItems: 'center',
  },
  title: {
    fontSize: 32, // Equivalent to text-4xl
    fontWeight: '800', // Equivalent to font-extrabold
    color: '#1a202c', // Equivalent to text-gray-900
    marginBottom: 24, // Equivalent to mb-6
    textAlign: 'center',
    lineHeight: 38, // Adjusted for leading-tight
    letterSpacing: -0.5, // Adjusted for tracking-tight
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Equivalent to drop-shadow-md
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18, // Equivalent to text-lg
    color: '#4a5568', // Equivalent to text-gray-700
    marginBottom: 40, // Equivalent to mb-10
    textAlign: 'center',
    maxWidth: 448, // Equivalent to max-w-md
  },
  formContainer: {
    width: '100%',
    maxWidth: 384, // Equivalent to max-w-sm
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#d1d5db', // Equivalent to border-gray-300
    borderRadius: 12, // Equivalent to rounded-xl
    paddingHorizontal: 16, // Equivalent to px-4
    paddingVertical: 12, // Equivalent to py-3
    marginBottom: 16, // Equivalent to mb-4
    fontSize: 18, // Equivalent to text-lg
    color: '#374151', // Equivalent to text-gray-800
    backgroundColor: '#f9fafb', // Equivalent to bg-gray-50
    // No direct outline or ring properties in RN, handled by focused style
    shadowColor: 'rgba(0,0,0,0.05)', // Equivalent to shadow-sm
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1, // Android shadow
  },
  inputFieldFocused: {
    borderColor: '#8B5CF6', // Equivalent to focus:ring-purple-600
    shadowColor: 'rgba(139, 92, 246, 0.5)', // Equivalent to focus:ring-2 focus:ring-purple-600
    shadowOffset: { width: 0, height: 4 }, // Equivalent to shadow-md
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4, // Android shadow
  },
  predictButtonWrapper: {
    width: '100%',
    marginTop: 24, // Equivalent to mt-6
    borderRadius: 16, // Equivalent to rounded-2xl
    overflow: 'hidden', // Ensures gradient respects border radius
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 }, // Equivalent to shadow-lg
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8, // Android shadow
  },
  predictButtonGradient: {
    paddingVertical: 16, // Equivalent to py-4
    paddingHorizontal: 24, // Equivalent to px-6
    alignItems: 'center',
    justifyContent: 'center',
  },
  predictButtonText: {
    color: 'white',
    fontSize: 24, // Equivalent to text-2xl
    fontWeight: '700', // Equivalent to font-bold
    textTransform: 'uppercase', // Equivalent to uppercase
    letterSpacing: 1.25, // Adjusted for tracking-wide
  },
  resultContainer: {
    marginTop: 40, // Equivalent to mt-10
    padding: 24, // Equivalent to p-6
    backgroundColor: 'rgba(245, 243, 255, 0.9)', // Equivalent to bg-purple-50 with opacity
    borderRadius: 16, // Equivalent to rounded-2xl
    shadowColor: '#000', // Equivalent to shadow-inner
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // Android shadow
    textAlign: 'center',
    width: '100%',
    maxWidth: 384, // Equivalent to max-w-sm
  },
  resultLabel: {
    fontSize: 20, // Equivalent to text-xl
    color: '#553c9a', // Equivalent to text-purple-800
    fontWeight: '600', // Equivalent to font-semibold
    marginBottom: 8, // Equivalent to mb-2
  },
  resultValue: {
    fontSize: 30, // Equivalent to text-3xl
    fontWeight: '800', // Equivalent to font-extrabold
    color: '#DC2626', // Equivalent to text-red-600
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Equivalent to bg-black bg-opacity-60
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16, // Equivalent to p-4
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24, // Equivalent to rounded-2xl
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 }, // Equivalent to shadow-xl
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20, // Android shadow
    padding: 32, // Equivalent to p-8
    maxWidth: 384, // Equivalent to max-w-sm
    width: '100%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20, // Equivalent to text-xl
    fontWeight: '500', // Equivalent to font-medium
    color: '#1a202c', // Equivalent to text-gray-800
    marginBottom: 24, // Equivalent to mb-6
    textAlign: 'center',
  },
  modalButton: {
    paddingVertical: 12, // Equivalent to py-3
    paddingHorizontal: 32, // Equivalent to px-8
    backgroundColor: '#8B5CF6', // Equivalent to bg-purple-600
    borderRadius: 12, // Equivalent to rounded-xl
    // No direct focus:ring or focus:ring-offset in RN
    shadowColor: '#000', // Mimic shadow for button
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4, // Android shadow
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '700', // Equivalent to font-bold
    fontSize: 18, // Equivalent to text-xl
  },
});
