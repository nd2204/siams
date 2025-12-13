export interface ICryptoService {
  generate_nonce(): string;
  generate_token(): string;
  canonicalize(payload: any): string;
  hash_canonicalize(payload: any): string;
  create_hmac_256(message: string, secret?: string): string;
  verify_payload_hmac(message: string, hmac: string, secret?: string): boolean;
  verify_signed_payload(payload: any, pubKey: string, signature: string): boolean;
}
