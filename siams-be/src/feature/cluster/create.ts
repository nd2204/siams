import { IUseCase, IValidator } from "@shared/interfaces";
import { Cluster } from "@domain/entities";
import { IClusterRepository } from "@domain/interfaces/cluster-repo";
import { v4 as uuidv4 } from "uuid"
import { ValidationError } from "@shared/errors";
import { sm_info } from "@shared/logger";

export class CreateClusterUC implements IUseCase<Cluster> {
  constructor(
    private clusterRepo: IClusterRepository,
    private validator: IValidator<Omit<Partial<Cluster>, "id">>
  ) { }

  async call(payload?: Omit<Partial<Cluster>, "id">): Promise<Cluster> {
    if (!payload) {
      throw new ValidationError("request must not be empty")
    }

    const { value, errors } = this.validator.validate(payload);

    if (errors && errors.length > 0) {
      throw new ValidationError("The cluster data is invalid", errors)
    }

    const cluster = new Cluster({
      id: uuidv4(),
      name: value.name,
      location: value.location,
      ownerId: value.ownerId
    })

    sm_info({ obj: cluster });

    return await this.clusterRepo.create(cluster);
  }
}
