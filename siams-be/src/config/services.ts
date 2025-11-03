import { SMLogger } from "@shared/logger"

import {
  OrganizationRepositoryPg,
  DeviceRepositoryPg,
  UserRepositoryPg,
  ClusterRepositoryPg,
  ClusterCredentialRepositoryPg,
  DeviceSensorRepositoryPg,
  DeviceActuatorRepositoryPg,
  DeviceCapabilitiesRepositoryPg,
  DeviceStatusRepositoryPg,
  DeviceTelemetryRepositoryPg,
  DeviceCommandRepositoryPg
} from "@infra/data/postgres/repositories"

import { pool } from '@infra/data/postgres/pool-pg'
import { encryptPassword, issueToken, comparePasswords, verifyToken } from '@infra/utils/auth'
import * as validators from '@infra/validation/joi'
import { RoleRepositoryPg } from "@infra/data/postgres/repositories/user-role-repo-pg"
import { OrganizationUserRepositoryPg } from "@infra/data/postgres/repositories/organization-user-repo-pg"

const orgRepo = new OrganizationRepositoryPg(pool)
const orgUserRepo = new OrganizationUserRepositoryPg(pool)
const userRepo = new UserRepositoryPg(pool)
const roleRepo = new RoleRepositoryPg(pool)

// Cluster aggregate
const clusterRepo = new ClusterRepositoryPg(pool)
const clusterCredRepo = new ClusterCredentialRepositoryPg(pool)

// Device aggregate
const deviceRepo = new DeviceRepositoryPg(pool)
const deviceCapabilitesRepo = new DeviceCapabilitiesRepositoryPg(pool)
const deviceStatusRepo = new DeviceStatusRepositoryPg(pool)
const deviceSensorRepo = new DeviceSensorRepositoryPg(pool)
const deviceActuatorRepo = new DeviceActuatorRepositoryPg(pool)
const deviceTelemetryRepo = new DeviceTelemetryRepositoryPg(pool)
const deviceCommandRepo = new DeviceCommandRepositoryPg(pool)

export const services = {
  device: {
    repositories: {
      base: deviceRepo,
      status: deviceStatusRepo,
      capabilities: deviceCapabilitesRepo,
      sensors: deviceSensorRepo,
      actuators: deviceActuatorRepo,
      telemetry: deviceTelemetryRepo,
      commands: deviceCommandRepo,
    },
    validators: validators.device,
  },
  user: {
    repositories: {
      base: userRepo,
      role: roleRepo
    },
    validators: validators.user
  },
  cluster: {
    repositories: {
      base: clusterRepo,
      credential: clusterCredRepo,
    },
    validators: validators.cluster
  },
  organization: {
    repositories: {
      base: orgRepo,
      user: orgUserRepo
    },
    validators: validators.organization
  },
  utils: {
    encryptPassword,
    issueToken,
    verifyToken,
    comparePasswords,
    logger: new SMLogger("app")
  },
}
