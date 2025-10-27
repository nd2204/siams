import Joi from "joi";
import JOIValidator from "@infra/validation/joi/validator";
import { UserRegisterRequest } from "@feature/user/dtos/user-register-request";

export const registerValidator = new JOIValidator<UserRegisterRequest>(Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
  name: Joi.string().required(),
}))
