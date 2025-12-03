import Joi from "joi";
import JOIValidator from "@infra/validation/joi/validator";
import {
  DeviceRegisterRequest,
} from "@feature/device/dtos/device-register-request";

export const deviceSignedPayloadValidator = new JOIValidator<DeviceRegisterRequest>(Joi.object({
  raw_payload: Joi.string().required(),
  sig: Joi.string().when('signing', {
    is: Joi.valid("hmac", "ecdsa"),
    then: Joi.string().required(),
    otherwise: Joi.string().optional()
  })
}))
