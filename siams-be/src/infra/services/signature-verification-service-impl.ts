import { ICryptoService } from "@domain/services/crypto-service";
import { SignedDevicePayload } from "@feature/device/dtos";
import { IValidationResult, IValidator, ILogger } from "@shared/interfaces";
import { ISignatureVerificationService } from "@domain/services/signature-verification-service";
import { Device } from "@domain/entities";
import { IDeviceRepository } from "@domain/repositories";
import { NotFoundError, ValidationError } from "@shared/errors";
import { DeviceNotFoundError } from "@domain/errors/device-not-found";

/**
 * Implementation of ISignedPayloadValidator with three-phase validation pipeline.
 * 
 * PHASE 1: Validate wrapper structure
 * - Checks required fields (version, deviceId, raw_payload, signing)
 * - Validates signature presence based on signing method
 * 
 * PHASE 2: Verify cryptographic signature
 * - HMAC: Uses backend secret via cryptoService.verify_payload_hmac()
 * - ECDSA: Uses device public key via cryptoService.verify_signed_payload()
 * - None: Skips verification (graceful degradation)
 * 
 * PHASE 3: Parse payload
 * - Parses raw_payload JSON string
 * 
 * Additional: Nonce replay protection with TTL-based expiration
 * Design: No device repository lookups or side effects - pure validation
 */
export class SignatureVerificationService implements ISignatureVerificationService {
  // Nonce store: key is "nonce@timestamp" for easy TTL tracking
  private nonceStore = new Map<string, number>(); // key -> expiresAt ms

  constructor(
    private deviceRepo: IDeviceRepository,
    private cryptoService: ICryptoService,
    private validator: IValidator<SignedDevicePayload>,
    private logger: ILogger
  ) { }

  validate_payload<T>(signed_payload: SignedDevicePayload, validator: IValidator<T>): IValidationResult<T> {
    const validation_result = this.validator.validate(signed_payload);
    if (validation_result.errors && validation_result.errors.length > 0) {
      return {
        value: null as any,
        errors: validation_result.errors
      }
    };

    const payload = this.parsePayload<T>(signed_payload.raw_payload);
    if (payload.errors && payload.errors.length > 0) {
      return {
        value: null as any,
        errors: payload.errors
      }
    }

    return validator.validate(payload.value)
  }

  private async verifySignature(
    device: Device,
    payload: SignedDevicePayload,
    maxAgeMs: number
  ): Promise<{ success: boolean; error?: string }> {
    // Check timestamp freshness
    const age = Date.now() - payload.ts;
    if (age > maxAgeMs) {
      return {
        success: false,
        error: `Payload timestamp out of range. Age: ${age}ms, Max: ${maxAgeMs}ms`,
      };
    }

    // Check nonce replay (if provided)
    if (payload.nonce) {
      const nonceKey = `${payload.nonce}@${device.id}`;
      const storedExpiry = this.nonceStore.get(nonceKey);

      if (storedExpiry && storedExpiry > Date.now()) {
        this.logger.warn({
          msg: "Nonce replay attack detected",
          obj: { nonce: payload.nonce, deviceId: device.id },
        });
        return {
          success: false,
          error: "Nonce already used (replay attack detected)",
        };
      }

      // Store nonce with expiration
      this.nonceStore.set(nonceKey, Date.now() + maxAgeMs);
    }

    // Verify signature based on signing method
    switch (device.trust_level) {
      case "SECRET": {
        if (!payload.sig) {
          return {
            success: false,
            error: "HMAC signature required but not provided",
          };
        }
        try {
          const isValid = this.cryptoService.verify_payload_hmac(
            payload.raw_payload,
            payload.sig,
            device.device_secret
          );
          if (!isValid) {
            this.logger.warn({
              msg: "HMAC signature verification failed",
              obj: { deviceId: device.id },
            });
            return {
              success: false,
              error: "HMAC signature verification failed",
            };
          }
        } catch (err) {
          const error = err as Error;
          this.logger.error({
            msg: "HMAC verification error",
            obj: { error: error.message, deviceId: device.id },
          });
          return {
            success: false,
            error: `HMAC verification error: ${error.message}`,
          };
        }
        return { success: true };
      }

      case "SIGNED": {
        if (!payload.sig || !device.pubkey) {
          return {
            success: false,
            error: "ECDSA signature or public key not found on device",
          };
        }
        try {
          const isValid = this.cryptoService.verify_signed_payload(
            JSON.parse(payload.raw_payload),
            device.pubkey,
            payload.sig
          );
          if (!isValid) {
            this.logger.warn({
              msg: "ECDSA signature verification failed",
              obj: { deviceId: device.id },
            });
            return {
              success: false,
              error: "ECDSA signature verification failed",
            };
          }
        } catch (err) {
          const error = err as Error;
          this.logger.error({
            msg: "ECDSA verification error",
            obj: { error: error.message, deviceId: device.id },
          });
          return {
            success: false,
            error: `ECDSA verification error: ${error.message}`,
          };
        }
        return { success: true };
      }

      case "EPHEMERAL":
        // Graceful degradation - no signature required
        return { success: true };

      default:
        return {
          success: false,
        };
    }
  }

  /**
   * PHASE 3: Parse raw_payload JSON
   */
  private parsePayload<T>(
    rawPayloadStr: string,
    validator?: IValidator<T>,
  ): IValidationResult<T> {
    // Parse raw_payload from JSON string
    let parsedPayload: T;
    try {
      parsedPayload = JSON.parse(rawPayloadStr);
    } catch (err) {
      const error = err as Error;
      this.logger.error({ msg: "Failed to parse raw_payload JSON", obj: { error: error.message } });
      return {
        value: null as any,
        errors: [
          {
            field: "raw_payload",
            message: `JSON parse error: ${error.message}`,
          },
        ],
      };
    }

    if (validator) {
      return validator.validate(parsedPayload)
    } else {
      return { value: parsedPayload };
    }
  }

  /**
   * Main validation method - orchestrates three phases
   */
  async verify<T>(
    device: Device,
    signed_payload: SignedDevicePayload,
    validator?: IValidator<T>,
    maxAgeMs: number = 300000 // 10 minutes default
  ): Promise<T> {
    // PHASE 2: Verify signature
    const signatureResult = await this.verifySignature(device, signed_payload, maxAgeMs);
    if (!signatureResult.success) {
      throw new ValidationError("Invalid signed payload format", [{
        field: "sig",
        message: signatureResult.error || "Signature verification failed",
      }])
    }

    // PHASE 3: Parse payload
    const { value, errors } = this.parsePayload<T>(
      signed_payload.raw_payload,
      validator
    );

    if (errors && errors.length > 0) {
      this.logger.warn({
        msg: "Signed payload content validation failed",
        obj: { errors: errors, deviceId: device.id },
      });
      throw new ValidationError("Signed payload content validation failed", errors)
    }

    return value;
  }

  async verify_with_device_id<T>(
    device_id: Device["id"],
    signed_payload: SignedDevicePayload,
    validator?: IValidator<T>,
    maxAgeMs: number = 300000 // 10 minutes default
  ): Promise<T> {
    const device = await this.deviceRepo.findOneBy({ id: device_id })
    if (!device) {
      throw new DeviceNotFoundError(device_id);
    }
    return this.verify<T>(device, signed_payload, validator, maxAgeMs);
  }

  /**
   * Periodic cleanup of expired nonces
   * Call this periodically (e.g., every 5 minutes) to prevent unbounded memory growth
   */
  clearExpiredNonces(): void {
    const now = Date.now();
    let cleared = 0;

    for (const [key, expiresAt] of this.nonceStore.entries()) {
      if (expiresAt <= now) {
        this.nonceStore.delete(key);
        cleared++;
      }
    }

    if (cleared > 0) {
      this.logger.debug({
        msg: "Cleared expired nonces",
        obj: { count: cleared, remaining: this.nonceStore.size },
      });
    }
  }
}
