// import { Device, DeviceCommand } from "@/domain/entities";
// import {
//   IDeviceActuatorRepository,
//   IClusterRepository,
//   IDeviceRepository,
//   IDeviceSensorRepository,
//   IDeviceCommandRepository,
//   IOrganizationRepository
// } from "@domain/repositories";
// import { NotFoundError, ValidationError } from "@/shared/errors";
// import { IUseCase, IValidator } from "@/shared/interfaces";
// import { DeviceRegisterPayload, DeviceRegisterRequest } from "./dtos/device-register-request";
// import { DeviceRegisterResponse } from "./dtos/device-register-response";
// import { v4 as uuidv4 } from "uuid";
// import { ICryptoService } from "@domain/services/crypto-service";
// import { ISignatureVerificationService } from "@domain/services/signature-verification-service";
//
// /* TODO: Add Unit of work */
// export class egisterDeviceUC implements IUseCase<DeviceRegisterResponse> {
//   constructor(
//     private clusterRepo: IClusterRepository,
//     private orgRepo: IOrganizationRepository,
//     private deviceRepo: IDeviceRepository,
//     private sensorRepo: IDeviceSensorRepository,
//     private actuatorRepo: IDeviceActuatorRepository,
//     private commandRepo: IDeviceCommandRepository,
//     private cryptoService: ICryptoService,
//     private signatureVerificationService: ISignatureVerificationService,
//     private requestValidator: IValidator<DeviceRegisterRequest>,
//     private payloadValidator: IValidator<DeviceRegisterPayload>,
//   ) { }
//
//   async call(req: DeviceRegisterRequest): Promise<DeviceRegisterResponse> {
//     const request = this.requestValidator.validate(req);
//     if (request.errors && request.errors.length > 0) {
//       throw new ValidationError("The request is invalid", request.errors)
//     }
//
//     const payload = this.signatureVerificationService.validate_payload<DeviceRegisterPayload>(
//       req.payload,
//       this.payloadValidator
//     );
//     if (payload.errors && payload.errors.length > 0) {
//       throw new ValidationError("The request is invalid", payload.errors)
//     }
//
//     const r = request.value;
//     const p = payload.value;
//
//     const org = await this.orgRepo.findOneBy({ id: r.orgId })
//     if (!org) {
//       throw new NotFoundError(`Cannot found org with id=${r.orgId}`)
//     }
//
//     let device = new Device({
//       id: uuidv4(),
//       hardware_id: p.hw_id,
//       name: p.name,
//       org_id: org.id,
//       trust_level: "EPHEMERAL",
//       model: p.model,
//       geom: { lon: p.lon, lat: p.lat },
//       fw_ver: p.fw_ver,
//       status: "offline",
//     })
//
//     let response: DeviceRegisterResponse = {
//       status: "",
//       deviceId: "",
//       assignedOrg: ""
//     };
//
//     if (p.cluster_id) {
//       const cluster = await this.clusterRepo.findOneBy({ id: p.cluster_id })
//       if (!cluster) {
//         throw new NotFoundError(`Cannot found cluster with id=${p.cluster_id} for device registration`)
//       }
//       device.cluster_id = cluster.id;
//       await this.clusterRepo.updateClusterArea(cluster.id);
//       response.assignedCluster = cluster.id;
//     }
//
//     device = await this.configureDevice(device, p);
//     const savedDevice = await this.deviceRepo.create(device);
//     response.deviceId = savedDevice.id;
//     response.status = savedDevice.status;
//     response.assignedOrg = savedDevice.org_id;
//     response.device_secret = savedDevice.device_secret
//
//     // Sensors
//     for (const s of p.sensors ?? []) {
//       await this.sensorRepo.upsert({
//         id: uuidv4(),
//         deviceId: savedDevice.id,
//         type: s.type,
//         name: s.name,
//         unit: s.unit,
//         localId: s.localId,
//       });
//     }
//
//     // Actuators
//     for (const a of p.actuators ?? []) {
//       await this.actuatorRepo.upsert({
//         id: uuidv4(),
//         deviceId: savedDevice.id,
//         name: a.name,
//         type: a.type,
//         localId: a.localId,
//       });
//     }
//
//     // Commands
//     for (const c of p.commands ?? []) {
//       await this.commandRepo.upsert(new DeviceCommand({
//         id: uuidv4(),
//         name: c.name,
//         type: c.type,
//         device_id: savedDevice.id,
//         local_id: c.local_id,
//         commands: c.commands
//       }), ["local_id", "device_id"])
//     }
//
//     return response;
//   }
//
//   async configureDevice(device: Device, payload: DeviceRegisterPayload): Promise<Device> {
//     switch (payload.signing) {
//       case "ecdsa": {
//         if (!payload.pubkey) {
//           throw new Error("ECDSA configuration requires pubkey, and rawPayload");
//         }
//         // Configure device with SIGNED trust level
//         device.trust_level = "SIGNED";
//         device.pubkey = payload.pubkey;
//         break;
//       }
//       case "hmac": {
//         device.device_secret = this.cryptoService.create_hmac_256(
//           payload.hw_id + this.cryptoService.generate_nonce()
//         );
//         break;
//       }
//       case "none":
//       default:
//         device.trust_level = "EPHEMERAL";
//         break;
//     }
//
//     return device;
//   }
// }
