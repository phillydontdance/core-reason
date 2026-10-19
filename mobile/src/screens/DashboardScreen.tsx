import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Creator dashboard</Text>
      <View style={styles.grid}>
        <View style={styles.statBox}><Text style={styles.label}>Subscribers</Text><Text style={styles.value}>2,480</Text></View>
        <View style={styles.statBox}><Text style={styles.label}>Earnings</Text><Text style={styles.value}>KES 248,000</Text></View>
        <View style={styles.statBox}><Text style={styles.label}>Active</Text><Text style={styles.value}>1,326</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 16 },
  grid: { gap: 12 },
  statBox: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 18 },
  label: { color: '#666', fontSize: 14 },
  value: { fontSize: 26, fontWeight: '700', marginTop: 6 },
});
