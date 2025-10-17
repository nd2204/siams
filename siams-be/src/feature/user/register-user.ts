import { User } from "@/domain/entities/user";
import { IUseCase, IValidator } from "@/shared/interfaces";
import { IUserRepository } from "@domain/repositories";
import { UserRegisterRequest } from "./dtos/user-register-request";
import { ValidationError } from "@shared/errors";
import { AuthUser } from "@domain/entities";
import { UserRegisterResponse } from "./dtos/user-register-response";
import { v4 as uuidv4 } from "uuid";

export class RegisterUserUC implements IUseCase<UserRegisterResponse> {
  constructor(
    private repo: IUserRepository,
    private encryptPassword: (password: string) => Promise<{ password: string; salt: string }>,
    private validator: IValidator<UserRegisterRequest>
  ) { }

  async call(req: UserRegisterRequest): Promise<UserRegisterResponse> {
    const { value, errors } = this.validator.validate(req)
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid registration request", errors)
    }

    const user = await this.repo.findOneBy({ email: value.email })
    if (user) {
      throw new ValidationError("User with this email already exists")
    }

    const { password: password_hashed, salt } = await this.encryptPassword(value.password!);
    const savedUser = await this.repo.create(new AuthUser({
      id: uuidv4(),
      firstName: req.firstName,
      lastName: req.lastName,
      email: req.email,
      password: password_hashed,
      salt: salt
    }))

    return new UserRegisterResponse(
      savedUser.id,
      savedUser.email,
      savedUser.firstName,
      savedUser.lastName
    )
  }
}
