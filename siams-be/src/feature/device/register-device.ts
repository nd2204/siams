import { Device, DeviceCommand } from "@/domain/entities";
import {
  IDeviceActuatorRepository,
  IClusterRepository,
  IDeviceRepository,
  IDeviceSensorRepository,
  IDeviceCommandRepository,
  IOrganizationRepository
} from "@domain/repositories";
import { ValidationError } from "@/shared/errors";
import { IUseCase, IValidator } from "@/shared/interfaces";
import { DeviceRegisterPayload, DeviceRegisterRequest } from "./dtos/device-register-request";
import { DeviceRegisterResponse } from "./dtos/device-register-response";
import { v4 as uuidv4 } from "uuid";
import { ICryptoService } from "@domain/services/crypto-service";
import { ISignatureVerificationService } from "@domain/services/signature-verification-service";
import { IDeviceEventPublisher } from "@domain/services/device-event-publisher";
import { ClusterNotFoundError } from "@domain/errors/cluster-not-found";
import { OrganizationNotFoundError } from "@domain/errors";

/* TODO: Add Unit of work */
export class RegisterDeviceUC implements IUseCase<DeviceRegisterResponse> {
  constructor(
    private readonly clusterRepo: IClusterRepository,
    private readonly orgRepo: IOrganizationRepository,
    private readonly deviceRepo: IDeviceRepository,
    private readonly sensorRepo: IDeviceSensorRepository,
    private readonly actuatorRepo: IDeviceActuatorRepository,
    private readonly commandRepo: IDeviceCommandRepository,
    private readonly cryptoService: ICryptoService,
    private readonly deviceEventPublisher: IDeviceEventPublisher,
    private readonly signatureVerificationService: ISignatureVerificationService,
    private readonly requestValidator: IValidator<DeviceRegisterRequest>,
    private readonly payloadValidator: IValidator<DeviceRegisterPayload>,
  ) { }

  async call(req: DeviceRegisterRequest): Promise<DeviceRegisterResponse> {
    const request = this.requestValidator.validate(req);
    if (request.errors && request.errors.length > 0) {
      throw new ValidationError("The request is invalid", request.errors)
    }

    const payload = this.signatureVerificationService.validate_payload<DeviceRegisterPayload>(
      req.payload,
      this.payloadValidator
    );
    if (payload.errors && payload.errors.length > 0) {
      throw new ValidationError("The request is invalid", payload.errors)
    }

    const r = request.value;
    const p = payload.value;

    // sm_info({ obj: p });

    const org = await this.orgRepo.findOneBy({ id: r.orgId })
    if (!org) {
      throw new OrganizationNotFoundError(r.orgId)
    }

    let device = new Device({
      id: uuidv4(),
      hardware_id: p.hw_id,
      name: p.name,
      org_id: org.id,
      trust_level: "EPHEMERAL",
      model: p.model,
      geom: { lon: p.lon, lat: p.lat },
      fw_ver: p.fw_ver,
      status: "offline",
    })

    let response: DeviceRegisterResponse = {
      status: "",
      deviceId: "",
      assignedOrg: ""
    };

    if (p.cluster_id) {
      const cluster = await this.clusterRepo.findOneBy({ id: p.cluster_id })
      if (!cluster) {
        throw new ClusterNotFoundError(p.cluster_id)
      }
      device.cluster_id = cluster.id;
      await this.clusterRepo.updateClusterArea(cluster.id);
      response.assignedCluster = cluster.id;
    }

    device = await this.configureDevice(device, p);
    const savedDevice = await this.deviceRepo.upsert(device, ["id", "hardware_id"]);
    response.deviceId = savedDevice.id;
    response.status = savedDevice.status;
    response.assignedOrg = savedDevice.org_id;
    response.device_secret = savedDevice.device_secret

    // Sensors
    for (const s of p.sensors ?? []) {
      await this.sensorRepo.upsert({
        id: uuidv4(),
        device_id: savedDevice.id,
        type: s.type,
        name: s.name,
        unit: s.unit,
        local_id: s.local_id,
      });
    }

    // Actuators
    for (const a of p.actuators ?? []) {
      await this.actuatorRepo.upsert({
        id: uuidv4(),
        device_id: savedDevice.id,
        name: a.name,
        type: a.type,
        local_id: a.local_id,
      });
    }

    // Commands
    for (const c of p.commands ?? []) {
      await this.commandRepo.upsert(new DeviceCommand({
        id: uuidv4(),
        name: c.name,
        type: c.type,
        device_id: savedDevice.id,
        local_id: c.local_id,
        commands: c.commands
      }), ["local_id", "device_id"])
    }

    // Publish device event
    this.deviceEventPublisher.publish({
      org_id: org.id,
      device_id: device.id,
      cluster_id: device.cluster_id,
      store_event: true,
      raw_payload: r.payload.raw_payload,
      event_type: "device.registered",
      event_payload: { device_id: device.id }
    })

    return response;
  }

  async configureDevice(device: Device, payload: DeviceRegisterPayload): Promise<Device> {
    switch (payload.signing) {
      case "ecdsa": {
        if (!payload.pubkey) {
          throw new Error("ECDSA configuration requires pubkey, and rawPayload");
        }
        // Configure device with SIGNED trust level
        device.trust_level = "SIGNED";
        device.pubkey = payload.pubkey;
        break;
      }
      case "hmac": {
        device.trust_level = "SECRET";
        device.device_secret = this.cryptoService.create_hmac_256(
          payload.hw_id + this.cryptoService.generate_nonce()
        );
        break;
      }
      case "none":
      default:
        device.trust_level = "EPHEMERAL";
        break;
    }

    return device;
  }
}
