import { IUseCase, IValidator } from "@/shared/interfaces";
import { IUserRepository } from "@domain/repositories";
import { UserRegisterRequest } from "./dtos/user-register-request";
import { ValidationError } from "@shared/errors";
import { User } from "@domain/entities";
import { AuthResponse } from "./dtos/auth-response";
import { v4 as uuidv4 } from "uuid";

export class RegisterUserUC implements IUseCase<AuthResponse> {
  constructor(
    private repo: IUserRepository,
    private validator: IValidator<UserRegisterRequest>,
    private encryptPassword: (password: string) => Promise<{ password: string; salt: string }>,
    private issueToken: (payload: AuthResponse["user"]) => string,
  ) { }

  async call(req: UserRegisterRequest): Promise<AuthResponse> {
    const { value, errors } = this.validator.validate(req)
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid registration request", errors)
    }

    const user = await this.repo.findOneBy({ email: value.email })
    if (user) {
      throw new ValidationError("User with this email already exists", [{
        field: "email", message: "User with this email already exists"
      }])
    }

    const { password: password_hashed, salt } = await this.encryptPassword(value.password!);
    const savedUser = await this.repo.create(new User({
      id: uuidv4(),
      name: value.name!,
      email: value.email!,
      password: password_hashed,
      salt: salt
    }))

    const responseUser: AuthResponse["user"] = {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
    };

    return {
      user: responseUser,
      token: this.issueToken(responseUser),
    }
  }
}
