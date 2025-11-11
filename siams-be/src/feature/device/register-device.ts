import { Device, DeviceCommand } from "@/domain/entities";
import {
  IDeviceActuatorRepository,
  IClusterRepository,
  IDeviceRepository,
  IDeviceSensorRepository,
  IDeviceCommandRepository
} from "@domain/repositories";
import { NotFoundError, ValidationError } from "@/shared/errors";
import { IUseCase, IValidator } from "@/shared/interfaces";
import { RegisterDeviceRequest } from "./dtos/register-device-request";
import { RegisterDeviceResponse } from "./dtos/register-device-response";
import { v4 as uuidv4 } from "uuid";
import { IEventBus } from "@domain/interfaces/events";

/* TODO: Add Unit of work */
export class RegisterDeviceUC implements IUseCase<RegisterDeviceResponse> {
  constructor(
    private clusterRepo: IClusterRepository,
    private deviceRepo: IDeviceRepository,
    private sensorRepo: IDeviceSensorRepository,
    private actuatorRepo: IDeviceActuatorRepository,
    private commandRepo: IDeviceCommandRepository,
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

    const savedDevice = await this.deviceRepo.create(
      new Device({
        id: uuidv4(),
        name: req.payload.name,
        clusterId: cluster.id,
        model: req.payload.model,
        geom: req.payload.location,
        firmwareVersion: req.payload.firmwareVersion,
        status: "offline",
      })
    );

    await this.clusterRepo.updateClusterArea(cluster.id);
    const payload = req.payload

    // Sensors
    let sensorCount = 0;
    for (const s of value.payload.capabilities.sensors ?? []) {
      await this.sensorRepo.upsert({
        id: uuidv4(),
        deviceId: savedDevice.id,
        type: s.type,
        name: s.name,
        unit: s.unit,
        localId: s.localId,
      });
      sensorCount++
    }

    // Actuators
    let actuatorCount = 0;
    for (const a of payload.capabilities?.actuators ?? []) {
      await this.actuatorRepo.upsert({
        id: uuidv4(),
        deviceId: savedDevice.id,
        name: a.name,
        type: a.type,
        localId: a.localId,
      });
      actuatorCount++;
    }

    // Commands
    let commandCount = 0;
    for (const c of value.payload.capabilities.commands ?? []) {
      await this.commandRepo.create(new DeviceCommand({
        id: uuidv4(),
        name: c.name,
        type: c.type,
        deviceId: savedDevice.id,
        localId: c.localId,
        commands: c.commands
      }))
      commandCount++
    }

    return new RegisterDeviceResponse(
      savedDevice.id,
      savedDevice.clusterId,
      savedDevice.status,
      sensorCount,
      actuatorCount,
      commandCount
    );
  }
}
