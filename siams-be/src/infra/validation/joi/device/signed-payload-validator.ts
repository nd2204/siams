import Joi from "joi";
import JOIValidator from "../validator";
import { SignedDevicePayload } from "@feature/device/dtos";

export const signedPayloadValidator = new JOIValidator(Joi.object<SignedDevicePayload>({
  nonce: Joi.string().optional(),
  raw_payload: Joi.string().required(),
  sig: Joi.string().optional(),
  ts: Joi.date().timestamp('javascript').required(),
}))
