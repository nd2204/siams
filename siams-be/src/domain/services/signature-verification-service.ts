import { IValidationResult, IValidator } from "@shared/interfaces";
import { SignedDevicePayload } from "@feature/device/dtos/signed-device-payload";
import { Device } from "@domain/entities";

export interface ISignatureVerificationService {
  validate_payload<T>(signed_payload: SignedDevicePayload, validator: IValidator<T>): IValidationResult<T>;

  verify<T>(
    device: Device,
    signed_payload: SignedDevicePayload,
    validator?: IValidator<T>,
    maxAgeMs?: number
  ): Promise<T>;

  verify_with_device_id<T>(
    device_id: Device["id"],
    signed_payload: SignedDevicePayload,
    validator?: IValidator<T>,
    maxAgeMs?: number
  ): Promise<T>;

  /**
   * Clear expired nonces from replay protection store.
   * Useful for periodic cleanup in long-running processes.
   */
  clearExpiredNonces(): void;
}
