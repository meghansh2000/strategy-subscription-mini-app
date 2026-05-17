import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StrategyDetailScreen from '../Screens/StrategyDetailScreen';
import StrategyListScreen from '../Screens/StrategyListScreen';

export type RootStackParamList = {
  StrategyList: undefined;
  StrategyDetail: {
    strategyId: number;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StrategyList"
        component={StrategyListScreen}
        options={{ title: 'Strategies' }}
      />

      <Stack.Screen
        name="StrategyDetail"
        component={StrategyDetailScreen}
        options={{ title: 'Strategy Detail' }}
      />
    </Stack.Navigator>
  );
}