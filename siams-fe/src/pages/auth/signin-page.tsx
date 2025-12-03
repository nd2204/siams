import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { formReducer, ValidationInput } from "@/components/ui/validation-input"
import { useAuth } from "@/hooks/use-auth"
import { useReducer, useState } from "react"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"

type FormField = "email" | "password"

export default function SigninPage() {
  const [form, dispatch] = useReducer(formReducer<FormField>, {
    email: { value: "", error: false, error_msg: null },
    password: { value: "", error: false, error_msg: null },
  });
  const { login } = useAuth()
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const formHandler = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true);
    const result = await login(form.email.value, form.password.value)
    const error = result.error
    if (error) {
      if (typeof error === 'string') {
        toast.error(error)
      } else {
        toast.error(error.message || JSON.stringify(error))
        if (error.message) {
          dispatch({ type: "SET_ERROR_AND_CLEAR", field: "password", error_msg: error.message })
        }
      }
    } else {
      navigate("/")
    }
    setLoading(false);
  }

  return (
    <Card className="bg-background outline-2 outline-offset-2 outline-input">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>
          Login with your Apple or Google account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formHandler}>
          <fieldset disabled={loading}>
            <FieldGroup>
              <Field>
                <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Apple
                </Button>
                <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field>
                <ValidationInput
                  fieldLabel="Email"
                  fieldName="email"
                  fieldData={form.email}
                  dispatch={dispatch}
                  id="email"
                  type="email"
                  // value={form.email.value}
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <ValidationInput
                  fieldName="password"
                  fieldData={form.password}
                  dispatch={dispatch}
                  id="password"
                  placeholder="Enter your password"
                  type="password" required />
              </Field>
              <Field>
                <Button variant="outline" type="submit">
                  {loading ? <>Logging in <Spinner /></> : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link to="/auth/signup">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>

          </fieldset>
        </form>
      </CardContent>
    </Card>
  )
}
