import { Device } from "@/domain/entities";
import {
  IDeviceActuatorRepository,
  IClusterRepository,
  IDeviceRepository,
  IDeviceSensorRepository
} from "@domain/repositories";
import { NotFoundError, ValidationError } from "@/shared/errors";
import { IUseCase, IValidator } from "@/shared/interfaces";
import { RegisterDeviceRequest } from "./dtos/register-device-request";
import { ActuatorCapabilityResponse, RegisterDeviceResponse, SensorCapabilityResponse } from "./dtos/register-device-response";
import { v4 as uuidv4 } from "uuid";
import { IDeviceCapabilitiesRepository } from "@domain/repositories";
import { DeviceCapabilities } from "@domain/entities";

/* TODO: Add Unit of work */
export class RegisterDeviceUC implements IUseCase<RegisterDeviceResponse> {
  constructor(
    private clusterRepo: IClusterRepository,
    private deviceRepo: IDeviceRepository,
    private sensorRepo: IDeviceSensorRepository,
    private actuatorRepo: IDeviceActuatorRepository,
    private capabilitiesRepo: IDeviceCapabilitiesRepository,
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
        firmwareVersion: req.payload.firmwareVersion,
        status: "online",
      })
    );

    const payload = req.payload

    await this.capabilitiesRepo.create(new DeviceCapabilities({
      id: uuidv4(),
      deviceId: savedDevice.id,
      sensors: value.payload.capabilities.sensors,
      actuators: value.payload.capabilities.actuators,
      commands: value.payload.capabilities.commands,
      reportedAt: new Date()
    }))

    // Sensors
    const sensorsAck: SensorCapabilityResponse[] = [];
    for (const s of value.payload.capabilities?.sensors ?? []) {
      const sensor = await this.sensorRepo.upsert({
        deviceId: savedDevice.id,
        type: s.type,
        unit: s.unit,
        localId: s.localId,
      });
      sensorsAck.push({ localId: sensor.localId, sensorId: sensor.id });
    }

    // Actuators
    const actuatorsAck: ActuatorCapabilityResponse[] = [];
    for (const a of payload.capabilities?.actuators ?? []) {
      const act = await this.actuatorRepo.upsert({
        deviceId: savedDevice.id,
        type: a.type,
        localId: a.localId,
      });
      actuatorsAck.push({ localId: a.localId, actuatorId: act.id });
    }

    return new RegisterDeviceResponse(
      savedDevice.id,
      savedDevice.clusterId,
      savedDevice.status,
      sensorsAck,
      actuatorsAck,
    );
  }
}
