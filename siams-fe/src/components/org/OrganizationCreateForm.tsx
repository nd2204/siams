import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Button } from "../ui/button";
import { useCreateOrganization } from "@/hooks/mutations/use-create-org";

export default function OrganizationCreateForm() {
  const { user, setOrg } = useAuth();
  const [slug, setSlug] = useState<string>("")
  const [name, setName] = useState<string>("")
  const {
    mutate: createOrg,
    data: createdOrg,
    isPending,
    isSuccess,
    isError,
    reset: resetOrgData,
    error: createOrgError
  } = useCreateOrganization()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    createOrg({ slug: slug, name: name, userId: user!.id })
  }

  useEffect(() => {
    if (isSuccess) {
      setOrg(createdOrg);
      resetOrgData()
    }
  }, [isSuccess]);

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

                {isError && <FieldError>{createOrgError.message}</FieldError>}
              </Field>

            </FieldGroup>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>{
                isPending ? "Creating..." : "Create"
              }</Button>
            </DialogFooter>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog >
  )
}

