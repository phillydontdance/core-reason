import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fan feed</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Exclusive behind-the-scenes</Text>
        <Text>Paid content · requires active subscription</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Free preview clip</Text>
        <Text>Public content</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 16 },
  card: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 16, marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
});
