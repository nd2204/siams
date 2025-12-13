import { createClusterValidator } from "./cluster/create-cluster-validator";
import { listClusterByOrgIdValidator } from "./cluster/list-cluster-by-org-id-validator";
import { registerDevicePayloadValidator, registerDeviceValidator } from "./device/device-register-validator";
import { createOrganizationValidator } from "./organization/create-org-validator";
import { pushStatusPayloadValidator, pushStatusValidator } from "./telemetry/device-status-validator";
import { pushTelemetryPayloadValidator, pushTelemetryValidator } from "./telemetry/push-telemetry-validator";
import { deviceVerifyPayloadValidator, deviceVerifyValidator } from "./device/device-verify-validator";
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
import { signedPayloadValidator } from "./device/signed-payload-validator";
import { getDeviceStatusValidator } from "./device/get-device-status-validator";
import { listRecentDeviceEventValidator } from "./device/list-recent-event-validator";
import { listOrgUserValidator } from "./organization/list-org-user-validator";

export const device = {
  telemetry: {
    pushTelemetryValidator,
    pushTelemetryPayloadValidator,
    listTelemetryValidator,
  },
  status: {
    pushStatusValidator,
    pushStatusPayloadValidator,
    getDeviceStatusValidator
  },
  event: {
    listRecentDeviceEventValidator
  },
  signedPayloadValidator,
  registerDeviceValidator,
  registerDevicePayloadValidator,
  deviceVerifyValidator,
  deviceVerifyPayloadValidator,
  getDeviceByIdValidator,
  getAllSensorsValidator,
  getAllCommandsValidator,
  getAllActuatorsValidator,
  deviceSendCommandValidator,
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

export const organization = {
  createOrganizationValidator,
  listDeviceByOrgIdValidator,
  listOrgUserValidator
}
