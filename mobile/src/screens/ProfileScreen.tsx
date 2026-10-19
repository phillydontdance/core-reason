import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Creator profile</Text>
      <Text style={styles.card}>Username: @nimba_kenya</Text>
      <Text style={styles.card}>Monthly price: KES 1,500</Text>
      <Text style={styles.card}>Bio: Lifestyle, music, and behind-the-scenes content.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 16 },
  card: { fontSize: 16, marginBottom: 12 },
});
