export interface CreateClusterResponse {
  cluster: {
    id: string,
    name: string,
    location: string,
    orgId: string,
    description?: string,
    createdAt?: Date
  },
  credentials: {
    loginId: string,
    password: string
  },
}
