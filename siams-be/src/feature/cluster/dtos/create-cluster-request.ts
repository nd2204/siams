export class CreateClusterRequest {
  constructor(
    public token?: string,
    public orgId?: string,
    public name?: string,
    public location?: string,
  ) { }
}
