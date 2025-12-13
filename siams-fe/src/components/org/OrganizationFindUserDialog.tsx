import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTrigger } from "../ui/dialog"
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { Search } from "lucide-react"
import { IconPlus } from "@tabler/icons-react"
import { Button } from "../ui/button"
import { memo } from "react"

const OrganizationFindUserDialog = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"outline"} className="cursor-pointer">
          <IconPlus />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add people</DialogTitle>
        <DialogDescription>Find and add user to your organization</DialogDescription>
        <InputGroup>
          <InputGroupInput placeholder="Find people..." />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end"></InputGroupAddon>
        </InputGroup>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" variant="default" disabled={true}>
            Send invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default memo(OrganizationFindUserDialog)
