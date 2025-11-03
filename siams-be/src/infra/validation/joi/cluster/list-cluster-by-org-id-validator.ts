import Joi from 'joi'
import JOIValidator from '../validator'
import { ListClusterByOrgIdRequest } from '@feature/cluster/dtos/list-cluster-by-org-id-request'

export const listClusterByOrgIdValidator = new JOIValidator(Joi.object<ListClusterByOrgIdRequest>({
  token: Joi.string().required(),
  orgId: Joi.string().required().uuid(),
  page: Joi.number().min(1).optional().default(1),
  perPage: Joi.number().min(1).optional()
}))
