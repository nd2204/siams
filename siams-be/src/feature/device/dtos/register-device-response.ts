export class RegisterDeviceResponse {
  constructor(
    public deviceId: string,
    public assignedCluster: string,
    public status: string
  ) { }
}
