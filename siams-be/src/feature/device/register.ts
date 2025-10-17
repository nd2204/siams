import { Device } from "@/domain/entities";
import { IDeviceRepository } from "@domain/repositories";
import { ValidationError } from "@/shared/errors";
import { IUseCase, IValidator } from "@/shared/interfaces";

export class RegisterDeviceUC implements IUseCase<Device> {
  constructor(
    private deviceRepo: IDeviceRepository,
    private validator: IValidator<Device>
  ) { }

  async call(payload: Device): Promise<Device> {
    const { value, errors } = this.validator.validate(payload)

    if (errors && errors.length > 0) {
      throw new ValidationError("The input device is invalid", errors)
    }

    return await this.deviceRepo.create(value);
  }
}
