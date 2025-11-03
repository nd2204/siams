import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/hooks/use-auth"
import { useRef, useState } from "react"
import { Link } from "react-router"

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const formValidRef = useRef(false)

  const validateForm = () => {
    if (form.confirmPassword !== form.password) {
      alert("password does not match")
      formValidRef.current = false
      return;
    }
    formValidRef.current = true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await signup(
      form.name ?? form.email.split("@")[0],
      form.email,
      form.password
    )
    if (result.error) {
      if (typeof result.error === 'string') {
        alert(result.error)
      } else {
        // TODO: handle validation error from backend
      }
    }
    setLoading(false)
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
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe" />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  placeholder="m@example.com"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Password"
                      type="password"
                      required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      placeholder="Confirm"
                      type="password"
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      required />
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button
                  onClick={validateForm}
                  variant="outline"
                  type="submit"
                  disabled={loading}>
                  {loading ? <Spinner /> : " Create Account "}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link to="/auth">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

