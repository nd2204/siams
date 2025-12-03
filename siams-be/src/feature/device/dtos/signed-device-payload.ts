export const SigningMethodConstants = {
  ecdsa: "ecdsa",
  hmac: "hmac",
  none: "none"
} as const;

export type SigningMethod = typeof SigningMethodConstants[keyof typeof SigningMethodConstants]

/**
 * Generic signed payload wrapper for all device messages.
 * Can wrap any device payload (register, telemetry, status, verify, etc.)
 */
export interface SignedDevicePayload {
  version: "1.0"; // Metadata
  nonce?: string;
  raw_payload: string;
  sig?: string;
  ts: number; // unix ms
}
