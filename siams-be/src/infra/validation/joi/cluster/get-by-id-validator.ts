import Joi from "joi";
import JOIValidator from "../validator";
import { GetClusterByIdRequest } from "@feature/cluster/dtos/get-cluster-by-id-request";

export const getClusterValidator = new JOIValidator(Joi.object<GetClusterByIdRequest>({
  token: Joi.string().required(),
  clusterId: Joi.string().uuid().required()
}))
