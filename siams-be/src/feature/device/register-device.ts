import { Device } from "@/domain/entities";
import { IClusterRepository, IDeviceRepository } from "@domain/repositories";
import { NotFoundError, ValidationError } from "@/shared/errors";
import { IUseCase, IValidator } from "@/shared/interfaces";
import { RegisterDeviceRequest } from "./dtos/register-device-request";
import { RegisterDeviceResponse } from "./dtos/register-device-response";
import { v4 as uuidv4 } from "uuid";

export class RegisterDeviceUC implements IUseCase<RegisterDeviceResponse> {
  constructor(
    private deviceRepo: IDeviceRepository,
    private clusterRepo: IClusterRepository,
    private validator: IValidator<RegisterDeviceRequest>
  ) { }

  async call(req: RegisterDeviceRequest): Promise<RegisterDeviceResponse> {
    const { value, errors } = this.validator.validate(req)

    if (errors && errors.length > 0) {
      throw new ValidationError("The request is invalid", errors)
    }

    const cluster = await this.clusterRepo.findOneBy({ id: value.clusterId })
    if (!cluster) {
      throw new NotFoundError(`Cannot found cluster with id=${value.clusterId} for device registration`)
    }

    const newDevice = new Device({
      id: uuidv4(),
      name: req.payload.name,
      clusterId: cluster.id,
      model: req.payload.model,
      firmwareVersion: req.payload.firmwareVersion,
      status: "online",
    })

    const savedDevice = await this.deviceRepo.create(newDevice);

    return new RegisterDeviceResponse(
      savedDevice.id,
      savedDevice.clusterId,
      savedDevice.status
    );
  }
}
