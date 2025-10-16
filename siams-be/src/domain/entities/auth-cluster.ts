import { Cluster } from "./cluster";

export class AuthCluster extends Cluster {
  declare cluster_username: string
  declare cluster_password: string
}
