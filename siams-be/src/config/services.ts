import { DeviceRepositoryMock, UserRepositoryMock } from '@infra/data/mock'
import { encryptPassword, issueToken, comparePasswords, verifyToken } from '@infra/utils/auth'
// import * as validators from '@infra/validation/joi'
import { SMLogger } from "@shared/logger"

export default {
  device: {
    // validators: validators.device,
    repository: new DeviceRepositoryMock(),
  },
  user: {
    repository: new UserRepositoryMock(encryptPassword, new SMLogger()),
  },
  utils: {
    encryptPassword,
    issueToken,
    verifyToken,
    comparePasswords,
    logger: new SMLogger
  },
}
