import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity, Image, Pressable, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const demoUri = 'demo'; // Identifier for the demo object

export default function HomeScreen({ navigation }) {
  const [xPositions, setXPositions] = useState({ [demoUri]: 0 });
  const [yPositions, setYPositions] = useState({ [demoUri]: 0 });
  const [rotations, setRotations] = useState({ [demoUri]: 0 });
  const [scales, setScales] = useState({ [demoUri]: 1 }); // Initialize with default scale value
  const [opacities, setOpacities] = useState({ [demoUri]: 1 }); // Initialize with default opacity value
  const [imageUris, setImageUris] = useState([demoUri]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageCommands, setImageCommands] = useState({ [demoUri]: [] });

  const animatedValues = useRef({
    [demoUri]: {
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      rotation: new Animated.Value(0),
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
    },
  }).current;

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) {
      console.log('Image picker was canceled');
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUris(prev => [...prev, uri]);
      setXPositions(prev => ({ ...prev, [uri]: 0 }));
      setYPositions(prev => ({ ...prev, [uri]: 0 }));
      setRotations(prev => ({ ...prev, [uri]: 0 }));
      setScales(prev => ({ ...prev, [uri]: 1 })); // Initialize scale
      setOpacities(prev => ({ ...prev, [uri]: 1 })); // Initialize opacity
      setImageCommands(prev => ({ ...prev, [uri]: [] })); // Initialize commands for new image
      animatedValues[uri] = {
        x: new Animated.Value(0),
        y: new Animated.Value(0),
        rotation: new Animated.Value(0),
        scale: new Animated.Value(1),
        opacity: new Animated.Value(1),
      };
    } else {
      console.log('No assets found in image picker result');
    }
  };

  const executeCommands = () => {
    imageUris.forEach(uri => {
      const commands = imageCommands[uri];
      if (!animatedValues[uri]) return; // Safeguard against undefined URI

      commands.forEach((command, index) => {
        setTimeout(() => {
          switch (command.type) {
            case 'moveX':
              Animated.timing(animatedValues[uri].x, {
                toValue: xPositions[uri] + command.value,
                duration: 500,
                useNativeDriver: false,
              }).start(() => setXPositions(prev => ({ ...prev, [uri]: prev[uri] + command.value })));
              break;
            case 'moveY':
              Animated.timing(animatedValues[uri].y, {
                toValue: yPositions[uri] + command.value,
                duration: 500,
                useNativeDriver: false,
              }).start(() => setYPositions(prev => ({ ...prev, [uri]: prev[uri] + command.value })));
              break;
            case 'rotate':
              Animated.timing(animatedValues[uri].rotation, {
                toValue: rotations[uri] + command.value,
                duration: 500,
                useNativeDriver: false,
              }).start(() => setRotations(prev => ({ ...prev, [uri]: prev[uri] + command.value })));
              break;
            case 'scale':
              Animated.timing(animatedValues[uri].scale, {
                toValue: scales[uri] + command.value,
                duration: 500,
                useNativeDriver: false,
              }).start(() => setScales(prev => ({ ...prev, [uri]: prev[uri] + command.value })));
              break;
            case 'opacity':
              Animated.timing(animatedValues[uri].opacity, {
                toValue: opacities[uri] + command.value,
                duration: 500,
                useNativeDriver: false,
              }).start(() => setOpacities(prev => ({ ...prev, [uri]: prev[uri] + command.value })));
              break;
            default:
              break;
          }
        }, index * 600); // Delay each command by 600ms
      });
    });
  };

  const handleImagePress = (index) => {
    setSelectedImageIndex(index);
    navigation.navigate('Commands', {
      commands: imageCommands[imageUris[index]],
      onCommandsUpdated: (newCommands) => {
        setImageCommands(prev => ({ ...prev, [imageUris[index]]: newCommands }));
      }
    });
  };

  const interpolatedRotation = (uri) => {
    if (!animatedValues[uri]) return '0deg'; // Default value for undefined URI
    return animatedValues[uri].rotation.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg'],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.boxContainer}>
        {imageUris.map((uri, index) => (
          <Animated.View
            key={uri}
            style={[
              styles.object,
              {
                left: '50%',
                top: '50%',
                transform: [
                  { translateX: Animated.subtract(animatedValues[uri]?.x || 0, 75) }, // Adjust center alignment
                  { translateY: Animated.subtract(animatedValues[uri]?.y || 0, 75) }, // Adjust center alignment
                  { rotate: interpolatedRotation(uri) },
                  { scale: animatedValues[uri]?.scale || 1 },
                ],
                opacity: animatedValues[uri]?.opacity || 1,
              },
            ]}
          >
            {uri === demoUri ? (
              <View style={styles.demoObject} />
            ) : (
              <Image source={{ uri }} style={styles.image} />
            )}
          </Animated.View>
        ))}
      </View>
      <View style={styles.infoContainer}>
        {selectedImageIndex !== null && (
          <>
            <Text>Current X Position: {xPositions[imageUris[selectedImageIndex]]}</Text>
            <Text>Current Y Position: {yPositions[imageUris[selectedImageIndex]]}</Text>
            <Text>Current Rotation: {rotations[imageUris[selectedImageIndex]]}°</Text>
            <Text>Current Scale: {scales[imageUris[selectedImageIndex]]}</Text>
            <Text>Current Opacity: {opacities[imageUris[selectedImageIndex]]}</Text>
          </>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={executeCommands}
        >
          <Ionicons name="play-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playButton} onPress={pickImage}>
          <Text style={styles.buttonText}>Select Image</Text>
        </TouchableOpacity>
      </View>
      {imageUris.length > 0 && (
        <View style={styles.selectedImageRow}>
          <FlatList
            data={imageUris}
            renderItem={({ item, index }) => (
              <View style={styles.selectedImageContainer}>
                <Pressable onPress={() => handleImagePress(index)}>
                  {item === demoUri ? (
                    <View style={styles.selectedDemoObject} />
                  ) : (
                    <Image source={{ uri: item }} style={styles.selectedImage} />
                  )}
                </Pressable>
                <View style={styles.actionStrip}>
                  <Text style={styles.actionText}>Action {index + 1}</Text>
                </View>
              </View>
            )}
            keyExtractor={(item, index) => `image-${index}`}
            horizontal
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  boxContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  object: {
    width: 150,
    height: 150,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoObject: {
    width: 150,
    height: 150,
    backgroundColor: 'gray',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
  },
  infoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  playButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedImageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f0f0f0',
  },
  selectedImageContainer: {
    alignItems: 'center',
    marginRight: 10,
    position: 'relative',
  },
  selectedImage: {
    width: 60,
    height: 60,
  },
  selectedDemoObject: {
    width: 60,
    height: 60,
    backgroundColor: 'gray',
  },
  actionStrip: {
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
