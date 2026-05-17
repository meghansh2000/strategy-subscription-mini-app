import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function StrategyDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>
        Strategy Detail Screen
      </Text>

      <Text>
        Strategy ID: {id}
      </Text>
    </View>
  );
}