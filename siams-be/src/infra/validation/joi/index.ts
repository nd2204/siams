import { createClusterValidator } from "./cluster/create-cluster-validator";
import { listClusterByOrgIdValidator } from "./cluster/list-cluster-by-org-id-validator";
import { registerDeviceValidator } from "./device/register-device-validator";
import { createOrganizationValidator } from "./organization/create-org-validator";
import { deviceStatusValidator } from "./telemetry/device-status-validator";
import { deviceTelemetryValidator } from "./telemetry/device-telemetry-validator";
import { registerRequestValidator } from "./user/register-user-validator";

export const device = {
  registerDeviceValidator,
  deviceStatusValidator,
  deviceTelemetryValidator
}

export const cluster = {
  createClusterValidator,
  listClusterByOrgIdValidator,
}

export const user = {
  registerRequestValidator
}

export const telemetry = {
  deviceStatusValidator,
}

export const organization = {
  createOrganizationValidator,
}
