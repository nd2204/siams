import AuthController from "@/adapters/http/v1/controllers/auth-controller";
import services from "@/config/services";
import { LoginUserUC, RegisterUserUC, AuthorizeUserUC, UpdateUserUC, UserProfileUC } from "@/feature/user";
import { NextFunction, Router, Request, Response } from "express";
import { getAuthToken } from "../get-auth-token";

const authController = new AuthController(
  new RegisterUserUC(
    services.user.repository,
    services.utils.encryptPassword,
    services.user.validators.registerRequestValidator,
  ),
  new LoginUserUC(
    services.utils.comparePasswords,
    services.user.repository,
    services.utils.issueToken
  ),
  new AuthorizeUserUC(
    services.user.repository,
    services.utils.verifyToken
  ),
  new UpdateUserUC(),
  new UserProfileUC()
)

export function authRouter(): Router {
  const router = Router();

  router.post("/login", async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await authController.login({ body: req.body })
      res.send(result)
    } catch (err) {
      return next(err)
    }
  })

  router.post("/register", async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await authController.register({ body: req.body })
      res.send(result)
    } catch (err) {
      return next(err)
    }
  })

  router.get("/me", async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page, perPage } = req.query as unknown as { page: number; perPage: number }
      const token = getAuthToken(req)
      const result = await authController.me({ token, params: { page, perPage } })
      res.send(result)
    } catch (err) {
      return next(err)
    }
  })

  router.put("/me", async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = getAuthToken(req)
      const { email, password, firstName, lastName, confirmPassword } = req.body
      const success = await authController.update({
        token,
        body: { email, password, firstName, lastName, confirmPassword },
      })
      res.send({ success })
    } catch (err) {
      return next(err)
    }
  })

  return router;
}
