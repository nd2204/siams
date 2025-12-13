// verification.ts
import type { Anchor } from '@/types/anchor';
import type { VerificationState } from '@/types/device/';

export function getVerificationState(anchor?: Anchor): VerificationState {
  if (!anchor || !anchor.aggregate_id) return 'NOT_ANCHORED';

  const status = anchor.status?.toUpperCase();

  if (status === 'CONFIRMED') return 'ANCHOR_CONFIRMED';
  if (status === 'PENDING' || status === 'SENT') return 'ANCHOR_PENDING';
  if (status === 'FAILED' || status === 'ERROR') return 'ANCHOR_FAILED';

  return 'NOT_ANCHORED';
}
