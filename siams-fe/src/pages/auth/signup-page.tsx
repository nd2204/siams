import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { formReducer, ValidationInput } from "@/components/ui/validation-input"
import { useAuth } from "@/hooks/use-auth"
import type { ValidationError } from "@/types/validation-error"
import { useReducer, useState } from "react"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"

type FormField = "name" | "email" | "password" | "confirmPassword"

export default function SignupPage() {
  const [form, dispatch] = useReducer(formReducer<FormField>, {
    name: { value: "", error: false, error_msg: null },
    email: { value: "", error: false, error_msg: null },
    password: { value: "", error: false, error_msg: null },
    confirmPassword: { value: "", error: false, error_msg: null }
  });
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const formValid = () => {
    if (form.confirmPassword.value !== form.password.value) {
      dispatch({
        type: 'SET_ERROR',
        field: "confirmPassword",
        error_msg: "password does not match"
      })
      return false;
    }
    return true;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formValid()) return;
    setLoading(true)
    const result = await signup(
      form.name.value ?? form.email.value.split("@")[0],
      form.email.value,
      form.password.value
    )
    setLoading(false)
    const error = result.error;
    if (!error) {
      navigate("/");
      return;
    }

    if (typeof error === 'string') {
      toast.error(result.error)
    } else {
      if (error.status == 422) {
        const validation_error: ValidationError = error as ValidationError;
        validation_error.details.forEach((d) => {
          // I'm assuming the validation field match the formField
          dispatch({ type: 'SET_ERROR', field: d.field as FormField, error_msg: d.message })
        })
      } else {
        error.message && toast.error(error.message);
        toast.error(JSON.stringify(error))
      }
    }
  }

  return (
    <>
      <Card className="bg-background outline-2 outline-offset-2 outline-input">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <fieldset disabled={loading}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <ValidationInput
                    fieldName="name"
                    fieldData={form.name}
                    dispatch={dispatch}
                    id="name"
                    type="text"
                    placeholder="John Doe" />
                </Field>
                <Field>
                  <ValidationInput
                    fieldLabel="Email"
                    fieldName="email"
                    fieldData={form.email}
                    dispatch={dispatch}
                    placeholder="m@example.com"
                    value={form.email.value}
                    id="email"
                    type="email"
                  />
                </Field>
                <Field>
                  <Field className="grid grid-cols-2 gap-4">
                    <Field>
                      <ValidationInput
                        fieldLabel="Password"
                        id="password"
                        placeholder="Password"
                        type="password"
                        fieldName={"password"}
                        fieldData={form.password}
                        dispatch={dispatch}
                        required />
                    </Field>
                    <Field>
                      <ValidationInput
                        fieldLabel="Confirm Password"
                        id="confirm-password"
                        placeholder="Confirm"
                        type="password"
                        fieldName={"confirmPassword"}
                        fieldData={form.confirmPassword}
                        dispatch={dispatch}
                        required
                      />
                    </Field>
                  </Field>
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                </Field>
                <Field>
                  <Button
                    variant="outline"
                    type="submit"
                  >
                    {loading ? <>Creating <Spinner /></> : " Create Account "}
                  </Button>
                  <FieldDescription className="text-center">
                    Already have an account? <Link to="/auth">Sign in</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </fieldset>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

