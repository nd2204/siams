export interface CommandDesc {
  action: string,
  params?: {
    name: string,
    type: string,
    enums?: string[]
  }[]
}
