import { IAppConfig } from "@domain/interfaces/config";
import { ICryptoService } from "@domain/services/crypto-service";
import crypto from 'crypto'
import { canonicalize as jc_canonicalize } from "json-canonicalize";

export class CryptoService implements ICryptoService {
  constructor(private config: IAppConfig) { }

  canonicalize(payload: any): string {
    return jc_canonicalize(payload);
  }

  hash_canonicalize(obj: any): string {
    return crypto.hash('sha256', jc_canonicalize(obj));
  }

  generate_nonce(): string {
    return crypto
      .randomBytes(16)
      .toString("base64url")
  }

  create_hmac_256(message: string, secret?: string): string {
    return crypto
      .createHmac('sha256', secret || this.config.beSecret)
      .update(message)
      .digest("hex")
  }

  verify_payload_hmac(message: string, recv_hmac: string, secret?: string): boolean {
    const hmac = this.create_hmac_256(message, secret);
    // console.log(hmac, recv_hmac);
    return crypto.timingSafeEqual(
      Buffer.from(hmac, "utf8"),
      Buffer.from(recv_hmac, "utf8"),
    )
  }

  verify_signed_payload(payload: any, pubKey: string, signature: string): boolean {
    const verify = crypto.createVerify('sha256');
    verify.update(this.canonicalize(payload));
    verify.end();
    return verify.verify(pubKey, signature, 'hex')
  }

}
