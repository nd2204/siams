export interface CreateClusterResponse {
  cluster: {
    name: string
    location: string
    orgId: string
    createdAt?: Date
  },
  credentials: {
    loginId: string,
    password: string
  },
}
