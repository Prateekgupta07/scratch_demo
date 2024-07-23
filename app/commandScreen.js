import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const availableCommands = [
  { id: 'moveX+10', label: 'Move X +10', type: 'moveX', value: 10 },
  { id: 'moveX-10', label: 'Move X -10', type: 'moveX', value: -10 },
  { id: 'moveY+10', label: 'Move Y +10', type: 'moveY', value: 10 },
  { id: 'moveY-10', label: 'Move Y -10', type: 'moveY', value: -10 },
  { id: 'rotate+10', label: 'Rotate +10°', type: 'rotate', value: 10 },
  { id: 'rotate+360', label: 'Rotate +360°', type: 'rotate', value: 360 },
  { id: 'rotate-10', label: 'Rotate -10°', type: 'rotate', value: -10 },
  { id: 'scale+0.1', label: 'Scale +0.1', type: 'scale', value: 0.1 },
  { id: 'scale-0.1', label: 'Scale -0.1', type: 'scale', value: -0.1 },
  { id: 'opacity+0.1', label: 'Increase Opacity by 0.1', type: 'opacity', value: 0.1 },
  { id: 'opacity-0.1', label: 'Decrease Opacity by 0.1', type: 'opacity', value: -0.1 },
];

export default function CommandsScreen({ route, navigation }) {
  const { commands, onCommandsUpdated } = route.params;
  const [selectedCommands, setSelectedCommands] = useState(commands);

  const addCommand = (command) => {
    setSelectedCommands((prev) => [...prev, command]);
  };

  const removeCommand = (index) => {
    setSelectedCommands((prev) => prev.filter((_, i) => i !== index));
  };

  const saveCommands = () => {
    onCommandsUpdated(selectedCommands);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.commandsContainer}>
        <Text style={styles.header}>Available Commands</Text>
        <FlatList
          data={availableCommands}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.commandButton}
              onPress={() => addCommand({ type: item.type, value: item.value })}
            >
              <Text style={styles.commandText}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.selectedCommandsContainer}>
        <Text style={styles.header}>Selected Commands</Text>
        <FlatList
          data={selectedCommands}
          keyExtractor={(_, index) => `selected-${index}`}
          renderItem={({ item, index }) => (
            <View style={styles.commandButton}>
              <Text style={styles.commandText}>{`${item.type}, Value: ${item.value}`}</Text>
              <TouchableOpacity onPress={() => removeCommand(index)}>
              <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={saveCommands}>
        <Text style={styles.saveButtonText}>Save Commands</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
  },
  commandsContainer: {
    flex: 1,
    marginRight: 10,
  },
  selectedCommandsContainer: {
    flex: 1,
    marginLeft: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commandButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  commandText: {
    fontSize: 16,
  },
  removeText: {
    color: 'red',
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -50 }],
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
