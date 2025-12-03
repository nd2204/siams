import { Device } from "@domain/entities";
import { NotFoundError } from "@shared/errors";
import { IError } from "@shared/interfaces";

export class DeviceNotFoundError extends NotFoundError implements IError {
  details?: unknown;

  constructor(device_id: Device["id"], details?: any) {
    super(`Device with id=${device_id} not found`);
    this.details = details;
  }
}
