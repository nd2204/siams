import { createClusterValidator } from "./cluster/create-cluster-validator";
import { listClusterByOrgIdValidator } from "./cluster/list-cluster-by-org-id-validator";
import { registerDeviceValidator } from "./device/register-device-validator";
import { createOrganizationValidator } from "./organization/create-org-validator";
import { deviceStatusValidator } from "./telemetry/device-status-validator";
import { deviceTelemetryValidator } from "./telemetry/device-telemetry-validator";
import { deviceVerifyValidator } from "./device/device-verify-validator";
import { registerUserValidator } from "./user/register-user-validator";
import { loginValidator } from "./user/login-validator";
import { listDevicesByClusterIdValidator } from "./cluster/list-device-by-cluster-id-validator";
import { listDeviceByOrgIdValidator } from "./organization/list-device-by-org-id-validator";
import { getClusterValidator } from "./cluster/get-by-id-validator";
import { getDeviceByIdValidator } from "./device/get-by-id-validator";
import { getAllSensorsValidator } from "./device/get-all-sensors-validator";
import { getAllCommandsValidator } from "./device/get-all-commands-validator";
import { getAllActuatorsValidator } from "./device/get-all-actuators-validator";
import { listTelemetryValidator } from "./device/list-telemetry-validator";
import { deviceSendCommandValidator } from "./device/send-command-validator";

export const device = {
  registerDeviceValidator,
  deviceStatusValidator,
  deviceTelemetryValidator,
  deviceVerifyValidator,
  getDeviceByIdValidator,
  getAllSensorsValidator,
  getAllCommandsValidator,
  getAllActuatorsValidator,
  listTelemetryValidator,
  deviceSendCommandValidator
}

export const cluster = {
  createClusterValidator,
  listClusterByOrgIdValidator,
  listDevicesByClusterIdValidator,
  getClusterValidator
}

export const user = {
  registerUserValidator,
  loginValidator
}

export const telemetry = {
  deviceStatusValidator,
}

export const organization = {
  createOrganizationValidator,
  listDeviceByOrgIdValidator
}
