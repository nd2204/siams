import { createValidator } from "./cluster/create";
import { registerValidator } from "./device/register";

export const device = {
  registerValidator,
}

export const cluster = {
  createValidator,
}
