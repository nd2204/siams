import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Button } from "../ui/button";
import { clusterServices } from "@/services/api/cluster-service";
import type { CreateClusterRequest } from "@/services/api/dtos/cluster/create-cluster-request";
import { QUERIES } from "@/hooks/queries/query-keys";
import { toast } from "sonner"
import { Textarea } from "../ui/textarea";

export default function ClusterCreateButton() {
  const { activeOrg } = useAuth();
  const [locName, setLocationName] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (req: CreateClusterRequest) => {
      return clusterServices.create(req)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    toast.promise(
      mutation.mutateAsync({
        location: locName,
        name,
        orgId: activeOrg!.id,
      }),
      {
        loading: "Creating cluster...",
        success: (data) => {
          return `Cluster "${data.cluster.name}" has been created successfully.`
        },
        error: (err) =>
          err?.message || "Failed to create cluster. Please try again.",
      }
    )
  }

  useEffect(() => {
    if (mutation.isSuccess) {
      queryClient.invalidateQueries({
        queryKey: QUERIES.ORG.LIST_CLUSTERS(activeOrg?.id)
      })
      mutation.reset();
    }
  }, [mutation.isSuccess]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create New</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <DialogHeader>
              <DialogTitle>Create a New Cluster</DialogTitle>
              <DialogDescription>
                Define a new cluster to organize and manage your devices. You can modify these settings later as needed.
              </DialogDescription>
            </DialogHeader>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="cluster-name">Cluster Name</FieldLabel>
                <Input
                  id="cluster-name"
                  name="name"
                  value={name}
                  placeholder="e.g., Production Cluster"
                  onChange={(v) => setName(v.target.value)}
                  required
                />
                <FieldDescription>
                  A human-readable name to identify this cluster.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="cluster-location">Location Name</FieldLabel>
                <Input
                  id="cluster-location"
                  name="locationName"
                  value={locName}
                  onChange={(v) => setLocationName(v.target.value)}
                  placeholder="e.g., us-west-1"
                  required
                />
                <FieldDescription>
                  Specify the logical or physical location for this cluster.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="cluster-description">Description <span className="text-muted-foreground">(optional)</span></FieldLabel>
                <Textarea
                  id="cluster-description"
                  name="description"
                  value={description}
                  onChange={(v) => setDescription(v.target.value)}
                  placeholder="e.g., Main production floor handling sensor nodes for Line 3."
                />
                <FieldDescription>
                  Optional: Provide details about the cluster’s purpose, environment, or connected devices.
                </FieldDescription>
              </Field>
            </FieldGroup>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  )
}

