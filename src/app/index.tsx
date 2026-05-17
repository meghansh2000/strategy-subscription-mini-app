import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useEffect, useState } from 'react';

import { router } from 'expo-router';

import { getStrategies } from '../Services/strategyService';

import { Strategy } from '../types/strategy';

export default function HomeScreen() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStrategies = async () => {
    try {
      setLoading(true);

      const data = await getStrategies();

      setStrategies(data);

      setError('');
    } catch (err) {
      setError('Failed to load strategies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text>{error}</Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchStrategies}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={strategies}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <TouchableOpacity
  style={styles.card}
  onPress={() =>
    router.push({
      pathname: '/strategy/[id]',
      params: {
        id: item.id.toString(), 
      },
    })
  }
>
          <Text style={styles.name}>
            {item.name}
          </Text>

          <Text>
            Category: {item.category}
          </Text>

          <Text>
            Risk: {item.riskLevel}
          </Text>

          <Text>
            Min Capital: ₹{item.minCapital}
          </Text>

          <Text>
            Expected Return: {item.expectedReturnPct}%
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listContainer: {
    padding: 16,
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  retryButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'black',
    borderRadius: 8,
  },

  retryText: {
    color: 'white',
  },
});