import { SMLogger } from "@shared/logger"

import { OrganizationRepositoryPg } from '@infra/data/postgres/organization-repo-pg'
import { DeviceRepositoryPg } from '@infra/data/postgres/device-repo-pg'
import { UserRepositoryPg } from '@infra/data/postgres/user-repo-pg'
import { ClusterRepositoryPg } from '@infra/data/postgres/cluster-repo-pg'
import { ClusterCredentialRepositoryPg } from "@infra/data/postgres/cluster-crendential-repo-pg"

import { pool } from '@infra/data/postgres/pool-pg'
import { encryptPassword, issueToken, comparePasswords, verifyToken } from '@infra/utils/auth'
import * as validators from '@infra/validation/joi'

const orgRepo = new OrganizationRepositoryPg(pool)
const deviceRepo = new DeviceRepositoryPg(pool)
const userRepo = new UserRepositoryPg(pool)
const clusterRepo = new ClusterRepositoryPg(pool)
const clusterCredRepo = new ClusterCredentialRepositoryPg(pool)
const logger = new SMLogger()

export const services = {
  device: {
    repository: deviceRepo,
    validators: validators.device,
  },
  user: {
    repository: userRepo,
    validators: validators.user
  },
  cluster: {
    repository: clusterRepo,
    validators: validators.cluster
  },
  clusterCredential: {
    repository: clusterCredRepo,
    validators: null
  },
  organization: {
    repository: orgRepo,
    validators: validators.organization
  },
  utils: {
    encryptPassword,
    issueToken,
    verifyToken,
    comparePasswords,
    logger: logger
  },
}
