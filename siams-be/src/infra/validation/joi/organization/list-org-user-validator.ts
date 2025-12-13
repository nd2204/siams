import Joi from "joi";
import JOIValidator from "../validator";
import { ListOrgUserRequest } from "@feature/organization/dtos";

export const listOrgUserValidator = new JOIValidator(Joi.object<ListOrgUserRequest>({
  token: Joi.string().required(),
  org_id: Joi.string().required(),
  page: Joi.number().min(1).optional(),
  perPage: Joi.number().min(1).optional()
}))
