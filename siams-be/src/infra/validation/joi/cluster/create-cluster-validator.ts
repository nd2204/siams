import Joi from "joi";
import JOIValidator from "@infra/validation/joi/validator";
import { CreateClusterRequest } from "@feature/cluster/dtos/create-cluster-request";

export const createClusterValidator = new JOIValidator<CreateClusterRequest>(Joi.object({
  token: Joi.string().required(),
  orgId: Joi.string().uuid().required(),
  name: Joi.string().required(),
  location: Joi.string()
}))
