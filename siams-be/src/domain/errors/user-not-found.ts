import { User } from "@domain/entities";
import { NotFoundError } from "@shared/errors";
import { IError } from "@shared/interfaces";

export class UserNotFoundError extends NotFoundError implements IError {
  details?: unknown;

  constructor(user_id: User["id"], details?: any) {
    super(`User with id=${user_id} not found`);
    this.details = details;
  }
}
