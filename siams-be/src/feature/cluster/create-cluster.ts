import { IUseCase, IValidator } from "@shared/interfaces";
import { Cluster, ClusterCredential } from "@domain/entities";
import { IClusterCredentialRepository, IClusterRepository } from "@domain/repositories";
import { v4 as uuidv4 } from "uuid"
import { ValidationError } from "@shared/errors";
import { CreateClusterRequest } from "./dtos/create-cluster-request";
import { CreateClusterResponse } from "./dtos/create-cluster-response";

export class CreateClusterUC implements IUseCase<CreateClusterResponse> {
  constructor(
    private repo: IClusterRepository,
    private credRepo: IClusterCredentialRepository,
    private validator: IValidator<CreateClusterRequest>,
    private encryptPassword: (password: string) => Promise<{ password: string; salt: string }>
  ) { }

  async call(req: CreateClusterRequest): Promise<CreateClusterResponse> {
    const { value, errors } = this.validator.validate(req)
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid cluster data", errors)
    }

    const cluster = new Cluster({
      id: uuidv4(),
      name: value.name,
      location: value.location,
      orgId: value.orgId
    })

    const savedCluster = await this.repo.create(cluster);
    const loginId = `cluster_${cluster.id}`
    const passwordRaw = uuidv4().slice(0, 12); // random password
    const { password: password_hashed, salt } = await this.encryptPassword(passwordRaw);

    const cred = new ClusterCredential({
      id: uuidv4(),
      clusterId: savedCluster.id,
      loginId: loginId,
      password: password_hashed,
      salt: salt
    });

    await this.credRepo.create(cred)

    return new CreateClusterResponse(
      savedCluster,
      { loginId: loginId, password: passwordRaw }
    )
  }
}
