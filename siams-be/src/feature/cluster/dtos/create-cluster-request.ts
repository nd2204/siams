export class CreateClusterRequest {
  constructor(
    public orgId: string,
    public name: string,
    public location: string,
  ) { }
}
