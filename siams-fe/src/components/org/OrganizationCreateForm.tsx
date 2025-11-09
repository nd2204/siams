import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { orgServices } from "@/services/api/org-service";
import type { CreateOrganizationRequest } from "@/services/api/dtos/org/create-from-user-request";
import { useEffect, useState } from "react";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Button } from "../ui/button";

export default function OrganizationCreateForm() {
  const { user, setOrg } = useAuth();
  const [slug, setSlug] = useState<string>("")
  const [name, setName] = useState<string>("")

  const mutation = useMutation({
    mutationFn: (req: CreateOrganizationRequest) => {
      return orgServices.create(req)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ slug: slug, name: name, userId: user!.id })
  }

  useEffect(() => {
    if (mutation.isSuccess) {
      setOrg(mutation.data);
      mutation.reset();
    }
  }, [mutation.isSuccess]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Organization</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <DialogHeader>
              <DialogTitle>Create a New Organization</DialogTitle>
              <DialogDescription>
                Set up your organization’s details below. You can edit these settings later if needed.
              </DialogDescription>
            </DialogHeader>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="org-name">Organization Name</FieldLabel>
                <Input
                  id="org-name"
                  name="name"
                  value={name}
                  placeholder="e.g., Acme Corporation"
                  onChange={(v) => setName(v.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="org-slug">Slug</FieldLabel>
                <Input
                  id="org-slug"
                  name="slug"
                  value={slug}
                  onChange={(v) => setSlug(v.target.value)}
                  placeholder="e.g., acme-corp"
                  required
                />
                <FieldDescription>
                  This will be used in your organization’s URL.
                </FieldDescription>

                {mutation.isError && <FieldError>{mutation.error.message}</FieldError>}
              </Field>

            </FieldGroup>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Creating..." : "Create"}</Button>
            </DialogFooter>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog >
  )
}

