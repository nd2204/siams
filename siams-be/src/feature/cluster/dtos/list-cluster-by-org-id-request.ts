export class ListClusterByOrgIdRequest {
  constructor(
    public token?: string,
    public orgId?: string,
    public page?: number,
    public perPage?: number
  ) { }
}
