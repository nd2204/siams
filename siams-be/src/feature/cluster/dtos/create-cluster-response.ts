export interface CreateClusterResponse {
  cluster: {
    name: string
    location: string
    orgId: string
    description?: string
    createdAt?: Date
  },
  credentials: {
    loginId: string,
    password: string
  },
}
