import { IPaginated } from "@shared/interfaces";
import { ClusterDTO } from "./cluster-dto";

export interface ListClusterByOrgIdResponse extends IPaginated<ClusterDTO> { }
