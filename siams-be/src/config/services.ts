import { ClusterRepositoryMock } from '@infra/data/mock/cluster-repo-mock'
import { DeviceRepositoryMock } from '@infra/data/mock/device-repo-mock'
import { UserRepositoryMock } from '@infra/data/mock/user-repo-mock'

import { encryptPassword, issueToken, comparePasswords, verifyToken } from '@infra/utils/auth'
import * as validators from '@infra/validation/joi'
import { SMLogger } from "@shared/logger"

export default {
  device: {
    validators: validators.device,
    repository: new DeviceRepositoryMock(),
  },
  user: {
    repository: new UserRepositoryMock(encryptPassword, new SMLogger()),
  },
  cluster: {
    repository: new ClusterRepositoryMock(),
    validators: validators.cluster
  },
  utils: {
    encryptPassword,
    issueToken,
    verifyToken,
    comparePasswords,
    logger: new SMLogger
  },
}
