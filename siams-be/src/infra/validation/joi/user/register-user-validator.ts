import Joi from "joi";
import JOIValidator from "@infra/validation/joi/validator";
import { UserRegisterRequest } from "@feature/user/dtos/user-register-request";

export const registerRequestValidator = new JOIValidator<UserRegisterRequest>(Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
}))
