import { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Audio } from 'expo-av';
import { Entypo } from '@expo/vector-icons';

export default function App() {
  const [sound, setSound] = useState();
  const [isMuted, setIsMuted] = useState(true);
  const [playbackPosition, setPlaybackPosition] = useState(0);

  async function playSound() {
    try {
      console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync(require('./assets/lord.mp4.mp3'));
      setSound(sound);

      console.log('Setting Playback Position');
      await sound.setPositionAsync(playbackPosition);

      console.log('Playing Sound');
      await sound.playAsync();
      setIsMuted(false); 
    } catch (error) {
      console.error('Error loading or playing sound', error);
    }
  }

  async function toggleMute() {
    if (sound) {
      try {
        await sound.setIsMutedAsync(!isMuted);
        setIsMuted(!isMuted);
      } catch (error) {
        console.error('Error toggling mute', error);
      }
    }
  }

  useEffect(() => {
    return sound
      ? async () => {
          console.log('Saving Playback Position');
          const position = await sound.getStatusAsync();
          setPlaybackPosition(position.positionMillis);

          console.log('Unloading Sound');
          await sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <Pressable onPress={isMuted ? playSound : toggleMute}>
        <Entypo name={isMuted ? 'sound-mute' : 'sound'} size={24} color="black" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
});
