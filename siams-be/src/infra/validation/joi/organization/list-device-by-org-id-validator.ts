import Joi from 'joi'
import JOIValidator from '../validator'
import { ListDeviceByOrgIdRequest } from '@feature/device/dtos/list-device-by-org-id-request'

export const listDeviceByOrgIdValidator = new JOIValidator(Joi.object<ListDeviceByOrgIdRequest>({
  token: Joi.string().required(),
  orgId: Joi.string().required().uuid(),
  page: Joi.number().min(1).optional().default(1),
  perPage: Joi.number().min(1).optional()
}))
