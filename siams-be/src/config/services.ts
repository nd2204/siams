import { SMLogger } from "@shared/logger"

import {
  OrganizationRepositoryPg,
  DeviceRepositoryPg,
  UserRepositoryPg,
  ClusterRepositoryPg,
  ClusterCredentialRepositoryPg,
  DeviceSensorRepositoryPg,
  DeviceActuatorRepositoryPg,
  DeviceStatusRepositoryPg,
  DeviceTelemetryRepositoryPg,
  DeviceCommandRepositoryPg
} from "@infra/data/postgres/repositories"

import { pool } from '@infra/data/postgres/pool-pg'
import { encryptPassword, issueToken, comparePasswords, verifyToken } from '@infra/utils/auth'
import * as validators from '@infra/validation/joi'
import { RoleRepositoryPg } from "@infra/data/postgres/repositories/user-role-repo-pg"
import { OrganizationUserRepositoryPg } from "@infra/data/postgres/repositories/organization-user-repo-pg"
import { OutboxRepositoryPg } from "@infra/data/postgres/repositories/outbox-repo-pg"
import { NodeEventBus } from "@infra/events/node-event-bus"
import { DeviceEventRepositoryPg } from "@infra/data/postgres/repositories/device-event-repo-pg"
import { CryptoService } from "@infra/services/crypto-service-impl"
import { app } from "./app"
import { DeviceEventPublisher } from "@infra/services/device-event-publisher-impl"
import { SignatureVerificationService } from "@infra/services/signature-verification-service-impl"
import { AuthService } from "@infra/services/auth-services-impl"

const orgRepo = new OrganizationRepositoryPg(pool)
const orgUserRepo = new OrganizationUserRepositoryPg(pool)
const userRepo = new UserRepositoryPg(pool)
const roleRepo = new RoleRepositoryPg(pool)

// Cluster aggregate
const clusterRepo = new ClusterRepositoryPg(pool)
const clusterCredRepo = new ClusterCredentialRepositoryPg(pool)

// Device aggregate
const deviceRepo = new DeviceRepositoryPg(pool)
const deviceEventRepo = new DeviceEventRepositoryPg(pool)
const deviceStatusRepo = new DeviceStatusRepositoryPg(pool)
const deviceSensorRepo = new DeviceSensorRepositoryPg(pool)
const deviceActuatorRepo = new DeviceActuatorRepositoryPg(pool)
const deviceTelemetryRepo = new DeviceTelemetryRepositoryPg(pool)
const deviceCommandRepo = new DeviceCommandRepositoryPg(pool)
const outboxRepo = new OutboxRepositoryPg(pool);

const authService = new AuthService(orgRepo, orgUserRepo, clusterRepo, deviceRepo, verifyToken)
const eventBus = new NodeEventBus()
const cryptoService = new CryptoService(app);
const deviceEventPublisher = new DeviceEventPublisher(
  deviceEventRepo,
  eventBus,
  cryptoService,
  outboxRepo,
  validators.device.publishDeviceEventValidator,
  new SMLogger("infra:service:DeviceService")
)
const signatureVerificationService = new SignatureVerificationService(
  deviceRepo,
  cryptoService,
  validators.device.signedPayloadValidator,
  new SMLogger("infra:service:SignatureVerificationService")
)

export const services = {
  device: {
    repositories: {
      base: deviceRepo,
      status: deviceStatusRepo,
      sensors: deviceSensorRepo,
      actuators: deviceActuatorRepo,
      telemetry: deviceTelemetryRepo,
      commands: deviceCommandRepo,
      event: deviceEventRepo
    },
    validators: validators.device,
    services: {
      deviceEventPublisher, signatureVerificationService
    },
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
  outbox: {
    repository: outboxRepo
  },
  authService,
  eventBus,
  cryptoService,
  utils: {
    encryptPassword,
    issueToken,
    verifyToken,
    comparePasswords,
    logger: new SMLogger("app")
  },
}
