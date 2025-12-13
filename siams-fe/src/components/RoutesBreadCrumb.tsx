import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { NavLink, useLocation } from "react-router"
import { Badge } from "./ui/badge";
import { Copy } from "lucide-react";
import { Button } from "./ui/button";

export function RoutesBreadcrumb() {
  const location = useLocation();
  const paths = location.pathname.split("/");
  paths.shift()

  let currentPath = paths.at(-1) || ""
  if (currentPath.length > 16) {
    currentPath = currentPath.slice(0, 7) + "..." + currentPath.slice(-6, -1);
  }

  if (paths.length <= 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className="align-middle">
        {/* <BreadcrumbItem> */}
        {/*   <BreadcrumbLink asChild> */}
        {/*     <Link to={"/"}><HomeIcon size={14} /></Link> */}
        {/*   </BreadcrumbLink> */}
        {/* </BreadcrumbItem> */}
        {/* <BreadcrumbSeparator /> */}
        {paths.slice(0, paths.length - 1).map((p, idx) =>
          <>
            {/* {console.log("/" + paths.slice(0, idx + 1).join("/"))} */}
            <BreadcrumbItem key={p}>
              <BreadcrumbLink asChild>
                <NavLink
                  to={"/" + paths.slice(0, idx + 1).join("/")}
                  className="font-semibold">
                  {p}
                </NavLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Badge variant="secondary" className="text-foreground font-mono">
              {currentPath}
            </Badge>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <Button
          variant={"ghost"}
          size="icon"
          className="size-5 hover:cursor-pointer p-1"
        >
          <Copy />
        </Button>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
