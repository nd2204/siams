import Joi from "joi";
import JOIValidator from "../validator";
import { UserLoginRequest } from "@feature/user/dtos/user-login-request";

export const loginValidator = new JOIValidator<UserLoginRequest>(Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
}))
