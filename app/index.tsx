import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useAssets } from 'expo-asset';
import { ResizeMode, Video } from 'expo-av';
import { Link } from 'expo-router';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';

const Page = () => {
  const [assets] = useAssets([require('@/assets/videos/intro.mp4')]);
  return (
    <View style={styles.container}>
      {assets && (
        <Video
          resizeMode={ResizeMode.COVER}
          isMuted
          shouldPlay
          isLooping
          source={{ uri: assets[0].uri }}
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
          }}
        />
      )}
      <View style={{ marginTop: 80, padding: 20 }}>
        <Text style={styles.header}>Ready to change the way you money?</Text>
      </View>
      <View style={styles.buttons}>
        <Link
          href={'/login'}
          asChild
          style={[
            defaultStyles.pillButton,
            { flex: 1, backgroundColor: Colors.dark },
          ]}
        >
          <TouchableOpacity>
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '500' }}>
              Log in
            </Text>
          </TouchableOpacity>
        </Link>
        <Link
          href={'/signup'}
          asChild
          style={[
            defaultStyles.pillButton,
            { flex: 1, backgroundColor: '#fff' },
          ]}
        >
          <TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: '500' }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 60,
    marginHorizontal:16
  },
});
