import { createClusterValidator } from "./cluster/create-cluster-validator";
import { listClusterByOrgIdValidator } from "./cluster/list-cluster-by-org-id-validator";
import { registerValidator } from "./device/register-device-validator";
import { createOrganizationValidator } from "./organization/create-org-validator";
import { registerRequestValidator } from "./user/register-user-validator";

export const device = {
  registerValidator,
}

export const cluster = {
  createClusterValidator,
  listClusterByOrgIdValidator,
}

export const user = {
  registerRequestValidator
}

export const organization = {
  createOrganizationValidator,
}
