export interface CreateClusterResponse {
  cluster: {
    id: string,
    name: string,
    loc_name?: string,
    orgId: string,
    geom?: object,
    description?: string,
    createdAt?: Date
  },
  credentials: {
    loginId: string,
    password: string
  },
}
