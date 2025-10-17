import { createClusterRequestValidator } from "./cluster/create-cluster-request-validator";
import { registerValidator } from "./device/register-device-validator";
import { createOrganizationValidator } from "./organization/create-org-validator";
import { registerRequestValidator } from "./user/register-user-validator";

export const device = {
  registerValidator,
}

export const cluster = {
  createClusterRequestValidator,
}

export const user = {
  registerRequestValidator
}

export const organization = {
  createOrganizationValidator
}
