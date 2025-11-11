import Joi from 'joi'
import JOIValidator from '../validator'
import { ListDeviceByClusterIdRequest } from '@feature/device/dtos/list-by-cluster-id-request'

export const listDevicesByClusterIdValidator = new JOIValidator(
  Joi.object<ListDeviceByClusterIdRequest>({
    token: Joi.string().required(),
    clusterId: Joi.string().required().uuid(),
    page: Joi.number().min(1).optional().default(1),
    perPage: Joi.number().min(1).optional()
  })
)
