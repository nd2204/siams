import { OrganizationUserDataTable } from "@/components/org/OrganizaionUserDataTable";
import { organizationUserColumn } from "@/components/org/OrganizationUserColumn";
import { useOrgUsers } from "@/hooks/queries/use-org-users";
import { useAuth } from "@/hooks/use-auth";

export default function OrganizationPage() {
  const { activeOrg } = useAuth()
  const { data: org_users } = useOrgUsers(activeOrg?.id);

  console.log(org_users?.data)

  return (
    <div className="flex flex-col flex-1 px-6 py-6">
      <div className="mb-6">
        <h2 className="text-foreground font-bold text-xl">
          User Management
        </h2>
        <p className="text-muted-foreground mt-1 font-sm">
          Manage your team member and their account permission here
        </p>
      </div>

      <div>
        {org_users &&
          <OrganizationUserDataTable columns={organizationUserColumn} data={org_users.data} />
        }
      </div>
    </div>
  )
}

