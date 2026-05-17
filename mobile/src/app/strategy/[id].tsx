import axios from 'axios';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { router, useLocalSearchParams } from 'expo-router';

import { subscribeToStrategy } from '../../Services/subscriptionService';
import { getStrategyById } from '../../Services/strategyService';

import { Strategy } from '../../types/strategy';

type ApiErrorResponse = {
  message?: string;
  title?: string;
  errors?: Record<string, string[]>;
};

const riskStyles: Record<
  string,
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

const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const validationMessages = error.response?.data?.errors
      ? Object.values(error.response.data.errors).flat()
      : [];

    return (
      error.response?.data?.message ||
      error.response?.data?.title ||
      validationMessages[0] ||
      'Subscription failed. Please try again.'
    );
  }

  return 'Subscription failed. Please try again.';
};

const getRiskStyle = (riskLevel: string) =>
  riskStyles[riskLevel] ?? {
    backgroundColor: '#e5e7eb',
    color: '#374151',
  };

const getActiveStatus = (strategy: Strategy) => {
  if (typeof strategy.isActive === 'boolean') {
    return strategy.isActive ? 'Active' : 'Inactive';
  }

  if (typeof strategy.active === 'boolean') {
    return strategy.active ? 'Active' : 'Inactive';
  }

  return strategy.status || 'Active';
};

export default function StrategyDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const strategyId = useMemo(() => Number(id), [id]);

  const [strategy, setStrategy] =
    useState<Strategy | null>(null);
  const [loading, setLoading] = useState(true);
  const [allocatedCapital, setAllocatedCapital] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [capitalError, setCapitalError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchStrategy = useCallback(async () => {
    if (!Number.isFinite(strategyId)) {
      setLoadError('Invalid strategy selected.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setLoadError('');

      const data = await getStrategyById(strategyId);

      setStrategy(data);
    } catch {
      setLoadError('Failed to load strategy.');
    } finally {
      setLoading(false);
    }
  }, [strategyId]);

  useEffect(() => {
    fetchStrategy();
  }, [fetchStrategy]);

  const validateCapital = () => {
    if (!strategy) {
      return false;
    }

    const trimmedCapital = allocatedCapital.trim();
    const capital = Number(trimmedCapital);

    if (!trimmedCapital) {
      setCapitalError('Enter the capital you want to allocate.');
      return false;
    }

    if (!Number.isFinite(capital) || capital <= 0) {
      setCapitalError('Enter a valid capital amount.');
      return false;
    }

    if (capital < strategy.minCapital) {
      setCapitalError(
        `Minimum capital for this strategy is ${formatCurrency(
          strategy.minCapital
        )}.`
      );
      return false;
    }

    setCapitalError('');
    return true;
  };

  const handleSubscribe = async () => {
    if (!strategy || !validateCapital()) {
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError('');
      setSuccessMessage('');

      await subscribeToStrategy(
        strategy.id,
        Number(allocatedCapital.trim())
      );

      setSuccessMessage('Subscription created successfully.');

      Alert.alert(
        'Subscription created',
        'You have subscribed to this strategy successfully.',
        [
          {
            text: 'Done',
            onPress: () => router.replace('/'),
          },
        ]
      );
    } catch (error: unknown) {
      setSubmitError(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color="#111827" size="large" />
        <Text style={styles.stateText}>Loading strategy...</Text>
      </View>
    );
  }

  if (!strategy) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Strategy unavailable</Text>
        <Text style={styles.stateText}>{loadError}</Text>
        <TouchableOpacity
          activeOpacity={0.82}
          onPress={fetchStrategy}
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const riskStyle = getRiskStyle(strategy.riskLevel);
  const subscribeDisabled = submitting;
  const activeStatus = getActiveStatus(strategy);
  const isActive = activeStatus.toLowerCase() === 'active';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>{'<'}</Text>
          </TouchableOpacity>

          <View style={styles.titleWrap}>
            <Text style={styles.title}>{strategy.name}</Text>
            <Text style={styles.subtitle}>
              Review the strategy profile before allocating capital.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {strategy.category}
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
                {strategy.riskLevel} Risk
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                isActive
                  ? styles.statusBadgeActive
                  : styles.statusBadgeInactive,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  isActive
                    ? styles.statusTextActive
                    : styles.statusTextInactive,
                ]}
              >
                {activeStatus}
              </Text>
            </View>
          </View>

          <View style={styles.metricGrid}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Minimum Capital</Text>
              <Text style={styles.metricValue}>
                {formatCurrency(strategy.minCapital)}
              </Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Expected Return</Text>
              <Text style={styles.metricValue}>
                {strategy.expectedReturnPct}%
              </Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Active Status</Text>
              <Text style={styles.metricValue}>{activeStatus}</Text>
            </View>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Subscribe</Text>
          <Text style={styles.fieldLabel}>Allocated Capital</Text>

          <TextInput
            keyboardType="numeric"
            onChangeText={(value) => {
              setAllocatedCapital(value);
              setCapitalError('');
              setSubmitError('');
              setSuccessMessage('');
            }}
            placeholder="Enter amount"
            placeholderTextColor="#9ca3af"
            style={[
              styles.input,
              Boolean(capitalError) && styles.inputError,
            ]}
            value={allocatedCapital}
          />

          {capitalError ? (
            <Text style={styles.inlineError}>{capitalError}</Text>
          ) : null}

          {submitError ? (
            <Text style={styles.inlineError}>{submitError}</Text>
          ) : null}

          {successMessage ? (
            <Text style={styles.successText}>{successMessage}</Text>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.86}
            disabled={subscribeDisabled}
            onPress={handleSubscribe}
            style={[
              styles.button,
              subscribeDisabled && styles.buttonDisabled,
            ]}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Subscribe</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },

  content: {
    padding: 20,
    paddingBottom: 36,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 24,
  },

  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 14,
    marginBottom: 18,
  },

  backButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 14,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },

  backButtonText: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '800',
  },

  titleWrap: {
    flex: 1,
  },

  title: {
    color: '#111827',
    fontSize: 27,
    fontWeight: '800',
    lineHeight: 34,
  },

  subtitle: {
    color: '#6b7280',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },

  card: {
    backgroundColor: '#ffffff',
    borderColor: '#eef2f7',
    borderRadius: 18,
    borderWidth: 1,
    elevation: 4,
    padding: 18,
    shadowColor: '#0f172a',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },

  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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

  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  statusBadgeActive: {
    backgroundColor: '#ecfdf5',
  },

  statusBadgeInactive: {
    backgroundColor: '#f3f4f6',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  statusTextActive: {
    color: '#047857',
  },

  statusTextInactive: {
    color: '#4b5563',
  },

  metricGrid: {
    gap: 12,
    marginTop: 18,
  },

  metricBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 14,
  },

  metricLabel: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },

  metricValue: {
    color: '#111827',
    fontSize: 21,
    fontWeight: '800',
  },

  formCard: {
    backgroundColor: '#ffffff',
    borderColor: '#eef2f7',
    borderRadius: 18,
    borderWidth: 1,
    elevation: 3,
    marginTop: 16,
    padding: 18,
    shadowColor: '#0f172a',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },

  sectionTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },

  fieldLabel: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db',
    borderRadius: 14,
    borderWidth: 1,
    color: '#111827',
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },

  inputError: {
    borderColor: '#dc2626',
  },

  button: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 14,
    justifyContent: 'center',
    marginTop: 18,
    minHeight: 52,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },

  buttonDisabled: {
    backgroundColor: '#6b7280',
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },

  inlineError: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: 8,
  },

  successText: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 19,
    marginTop: 8,
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
});
