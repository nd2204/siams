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

const orgRepo = new OrganizationRepositoryPg(pool)
const userRepo = new UserRepositoryPg(pool)

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
    logger: new SMLogger("app")
  },
}
