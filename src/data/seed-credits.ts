import type { UserCredits, CreditTransaction } from '@/models/types';
import { generateId, now } from '@/lib/utils';

// ─── Default Credit Configuration ──────────────────────
export const DEFAULT_CREDIT_CONFIG = {
  starting_balance: 0,
  credit_limit: 20.0,
  daily_existence_quota: 2.0,
  narrative_interaction_fee: 0.4,
  passive_scan_fee: 0.05,
  fragment_unlock_cost: 2.5,
} as const;

/**
 * Create a fresh UserCredits object for a new operator.
 */
export function createDefaultCredits(userId: string): UserCredits {
  const initialTransaction: CreditTransaction = {
    id: generateId('TX'),
    type: 'CREDIT',
    amount: DEFAULT_CREDIT_CONFIG.starting_balance,
    description: 'INITIAL_EXISTENCE_QUOTA // Life.OS Genesis Allocation',
    timestamp: now(),
  };

  return {
    balance: DEFAULT_CREDIT_CONFIG.starting_balance,
    limit: DEFAULT_CREDIT_CONFIG.credit_limit,
    transactions: [initialTransaction],
  };
}
