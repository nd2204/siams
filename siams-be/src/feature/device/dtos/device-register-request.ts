import { DeviceActuator, DeviceCommand, DeviceSensor } from "@domain/entities"
import { SignedDevicePayload, SigningMethod } from "./signed-device-payload";

export interface DeviceRegisterPayload {
  model: string,
  fw_ver: string,
  hw_id: string,
  sensors: Pick<DeviceSensor, "local_id" | "name" | "type" | "unit">[],
  actuators: Pick<DeviceActuator, "local_id" | "name" | "type">[],
  commands: Omit<DeviceCommand, "device_id">[],
  lon: number;
  lat: number;
  cluster_id?: string;
  signing: SigningMethod,
  pubkey?: string,
  name?: string;
}

export interface DeviceRegisterRequest {
  payload: SignedDevicePayload,
  orgId: string,
}
