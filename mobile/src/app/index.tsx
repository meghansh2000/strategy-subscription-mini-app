import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Link } from 'expo-router';

import { getStrategies } from '../Services/strategyService';

import { Strategy } from '../types/strategy';

type RiskFilter = 'All' | 'Low' | 'Medium' | 'High';

const riskFilters: RiskFilter[] = ['All', 'Low', 'Medium', 'High'];

const riskStyles: Record<
  Exclude<RiskFilter, 'All'>,
  {
    backgroundColor: string;
    color: string;
  }
> = {
  Low: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  Medium: {
    backgroundColor: '#ffedd5',
    color: '#9a3412',
  },
  High: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const getRiskStyle = (riskLevel: string) => {
  if (
    riskLevel === 'Low' ||
    riskLevel === 'Medium' ||
    riskLevel === 'High'
  ) {
    return riskStyles[riskLevel];
  }

  return {
    backgroundColor: '#e5e7eb',
    color: '#374151',
  };
};

export default function HomeScreen() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedRisk, setSelectedRisk] =
    useState<RiskFilter>('All');

  const fetchStrategies = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getStrategies();

      setStrategies(data);
      setError('');
    } catch {
      setError('Failed to load strategies.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStrategies();
  }, [fetchStrategies]);

  const filteredStrategies = useMemo(() => {
    if (selectedRisk === 'All') {
      return strategies;
    }

    return strategies.filter(
      (strategy) => strategy.riskLevel === selectedRisk
    );
  }, [selectedRisk, strategies]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color="#111827" size="large" />
        <Text style={styles.stateText}>Loading strategies...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Unable to load strategies</Text>
        <Text style={styles.stateText}>{error}</Text>

        <TouchableOpacity
          activeOpacity={0.82}
          onPress={() => fetchStrategies()}
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={filteredStrategies}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No strategies found</Text>
            <Text style={styles.stateText}>
              Try a different risk filter.
            </Text>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Strategies</Text>
            <Text style={styles.subtitle}>
              Compare available strategies and choose the risk profile
              that fits your plan.
            </Text>

            <View style={styles.filters}>
              {riskFilters.map((filter) => {
                const selected = selectedRisk === filter;

                return (
                  <TouchableOpacity
                    activeOpacity={0.82}
                    key={filter}
                    onPress={() => setSelectedRisk(filter)}
                    style={[
                      styles.filterChip,
                      selected && styles.filterChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        selected && styles.filterTextSelected,
                      ]}
                    >
                      {filter}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        }
        refreshControl={
          <RefreshControl
            onRefresh={() => fetchStrategies(true)}
            refreshing={refreshing}
            tintColor="#111827"
          />
        }
        renderItem={({ item }) => {
          const riskStyle = getRiskStyle(item.riskLevel);

          return (
            <Link
              asChild
              href={{
                pathname: '/strategy/[id]',
                params: {
                  id: item.id.toString(),
                },
              }}
            >
              <TouchableOpacity
              activeOpacity={0.86}
              style={styles.card}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleWrap}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.tapHint}>Tap to view details</Text>
                  </View>

                  <Text style={styles.chevron}>{'>'}</Text>
                </View>

                <View style={styles.badgeRow}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>
                      {item.category}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.riskBadge,
                      {
                        backgroundColor: riskStyle.backgroundColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.riskText,
                        {
                          color: riskStyle.color,
                        },
                      ]}
                    >
                      {item.riskLevel} Risk
                    </Text>
                  </View>
                </View>

                <View style={styles.metricRow}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Min Capital</Text>
                    <Text style={styles.metricValue}>
                      {formatCurrency(item.minCapital)}
                    </Text>
                  </View>

                  <View style={styles.metricDivider} />

                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>
                      Expected Return
                    </Text>
                    <Text style={styles.metricValue}>
                      {item.expectedReturnPct}%
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 24,
  },

  listContainer: {
    padding: 20,
    paddingBottom: 32,
  },

  header: {
    marginBottom: 18,
  },

  title: {
    color: '#111827',
    fontSize: 30,
    fontWeight: '800',
  },

  subtitle: {
    color: '#6b7280',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },

  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 18,
  },

  filterChip: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },

  filterChipSelected: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },

  filterText: {
    color: '#4b5563',
    fontSize: 14,
    fontWeight: '700',
  },

  filterTextSelected: {
    color: '#ffffff',
  },

  card: {
    backgroundColor: '#ffffff',
    borderColor: '#eef2f7',
    borderRadius: 18,
    borderWidth: 1,
    elevation: 4,
    marginBottom: 14,
    padding: 18,
    shadowColor: '#0f172a',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },

  cardHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cardTitleWrap: {
    flex: 1,
    paddingRight: 14,
  },

  name: {
    color: '#111827',
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 25,
  },

  tapHint: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },

  chevron: {
    color: '#9ca3af',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },

  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },

  categoryBadge: {
    backgroundColor: '#eef2ff',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  categoryText: {
    color: '#3730a3',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  riskBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  riskText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  metricRow: {
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    padding: 14,
  },

  metricItem: {
    flex: 1,
  },

  metricDivider: {
    backgroundColor: '#e5e7eb',
    marginHorizontal: 14,
    width: 1,
  },

  metricLabel: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
  },

  metricValue: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
  },

  retryButton: {
    marginTop: 18,
    paddingHorizontal: 22,
    paddingVertical: 13,
    backgroundColor: '#111827',
    borderRadius: 12,
  },

  retryText: {
    color: '#ffffff',
    fontWeight: '800',
  },

  errorTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },

  stateText: {
    color: '#6b7280',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    textAlign: 'center',
  },

  emptyState: {
    alignItems: 'center',
    padding: 28,
  },

  emptyTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
  },
});
