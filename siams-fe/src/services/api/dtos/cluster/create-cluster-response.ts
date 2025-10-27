import { ClusterCredential, Cluster } from "@domain/entities";

export class CreateClusterResponse {
  constructor(
    public cluster: Cluster,
    public credentials: { loginId: string, password: string },
  ) { }
}
