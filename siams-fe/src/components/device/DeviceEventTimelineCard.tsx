"use client";

// TODO: Refactor this to smaller, modular device event card

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import type { DeviceEvent, DeviceEventType, VerificationState } from "@/types/device";
import type { Anchor } from "@/types/anchor";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import React from "react";
import { Skeleton } from "../ui/skeleton";
import { IconActivity, IconLogin, IconPlugConnected, IconPlugConnectedX, type TablerIcon } from "@tabler/icons-react";
import { Spinner } from "../ui/spinner";

const eventTypeMap: Record<DeviceEventType, {
  label: string,
  Icon: TablerIcon,
  card_style?: string,
}> = {
  "device.registered": {
    label: "Registered",
    Icon: IconLogin,
    card_style: "from-accent-blue/15 to-background dark:bg-background bg-gradient-to-br  border-accent-blue/30"
  },
  "device.telemetry": {
    label: "Telemetry Received",
    Icon: IconLogin,
    card_style: "from-primary/5 to-background dark:bg-background bg-gradient-to-b"
  },
  "device.status": {
    label: "Status Received",
    Icon: IconLogin,
    card_style: "from-primary/5 to-background dark:bg-background bg-gradient-to-b"
  },
  "device.rule.triggered": {
    label: "Rule Triggered",
    Icon: IconLogin,
    card_style: "from-primary/5 to-background dark:bg-background bg-gradient-to-b"
  },
  "device.status.offline": {
    label: "Went Offline",
    Icon: IconPlugConnectedX,
    card_style: "from-primary/5 to-background dark:bg-background bg-gradient-to-b"
  },
  "device.status.online": {
    label: "Went Online",
    Icon: IconPlugConnected,
    card_style: "from-accent-green/15 to-background dark:bg-background bg-gradient-to-br border-accent-green/30"
  }
}

const verificationStateMap: Record<VerificationState, {
  icon_style: string,
  verification_badge_style: string,
  verification_label: string
}> = {
  "NOT_ANCHORED": {
    icon_style: "border-muted bg-muted text-muted-foreground",
    verification_badge_style: "status-badge-muted",
    verification_label: "Not anchored",
  },
  "ANCHOR_PENDING": {
    icon_style: "border-accent-yellow/50 bg-accent-yellow/20 text-background",
    verification_badge_style: "status-badge-yellow text-accent-yellow",
    verification_label: "Pending On-chain...",
  },
  "ANCHOR_CONFIRMED": {
    icon_style: "border-accent-green/50 bg-accent-green/20 text-accent-green",
    verification_badge_style: "status-badge-green text-accent-green",
    verification_label: "On-chain verified",
  },
  "ANCHOR_FAILED": {
    icon_style: "border-accent-red/50 bg-accent-red text-accent-red",
    verification_badge_style: "status-badge-red text-accent-red",
    verification_label: "Anchor failed",
  }
} as const;

export default function DeviceEventTimelineCard({
  event,
  showRawPayload = false,
  variant = "default",
  blockExplorerBaseUrl,
}: {
  event: DeviceEvent
  showRawPayload?: boolean;
  variant?: "compact" | "default";
  blockExplorerBaseUrl?: string; // e.g. "https://etherscan.io/tx/"
}) {
  const eventUuid = event.event_uuid ?? crypto.randomUUID();
  const [verifyingUuid, setVerifyingUuid] = React.useState<string | null>(null);
  const { label: eventLabel, Icon: EventIcon, card_style } = eventTypeMap[event.event_type] ?? {
    label: "unknown", Icon: IconActivity, card_style: "from-primary/5 to-background dark:bg-background bg-gradient-to-t"
  }

  const TitleCard = () => {
    return (
      <Card className={cn("flex flex-1 flex-row justify-between mx-3 p-3", card_style)}>
        <CardTitle className="flex flex-row items-center gap-3 text-sm font-semibold leading-tight">
          <div className="border p-1.5 rounded-md"><EventIcon size={18} /></div>
          {eventLabel}
        </CardTitle>
        {/* <VerificationBadge state={verificationState} anchor={anchor} /> */}
      </Card>
    )
  }

  const CardDetail = () => {
    return (
      <>
        <div className="grid gap-x-6 gap-y-2 text-xs md:grid-cols-3">
          <Field label="Org">{event.org_id}</Field>

          {event.cluster_id && (
            <Field label="Cluster">{event.cluster_id}</Field>
          )}

          <Field label="Data hash" mono>
            {event.data_hash}
          </Field>

          {/* {anchor && ( */}
          {/*   <> */}
          {/*     {anchor.tx_hash && ( */}
          {/*       <Field label="Tx hash" mono> */}
          {/*         {blockExplorerBaseUrl ? ( */}
          {/*           <Button */}
          {/*             asChild */}
          {/*             variant="link" */}
          {/*             size="sm" */}
          {/*             className="h-auto px-0 text-xs" */}
          {/*           > */}
          {/*             <a */}
          {/*               href={`${blockExplorerBaseUrl}${anchor.tx_hash}`} */}
          {/*               target="_blank" */}
          {/*               rel="noreferrer" */}
          {/*             > */}
          {/*               {anchor.tx_hash} */}
          {/*             </a> */}
          {/*           </Button> */}
          {/*         ) : ( */}
          {/*           anchor.tx_hash */}
          {/*         )} */}
          {/*       </Field> */}
          {/*     )} */}
          {/**/}
          {/*     {anchor.block_number && ( */}
          {/*       <Field label="Block #"> */}
          {/*         {anchor.block_number.toString()} */}
          {/*       </Field> */}
          {/*     )} */}
          {/*   </> */}
          {/* )} */}
        </div>

        {
          showRawPayload && (
            <Collapsible>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Raw payload
                </span>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="h-6 px-2 text-xs">
                    Toggle
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="mt-2 rounded-md bg-muted p-2">
                  <pre className="max-h-52 overflow-auto whitespace-pre-wrap break-all font-mono text-[11px] leading-snug">
                    {prettyPrintJSON(event.raw_payload)}
                  </pre>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        }
      </>
    )
  }

  if (variant === "compact") {
    return (
      <TitleCard />
    )
  }

  return (
    <Card className={cn("flex-1 gap-3 bg-background py-3")}>
      <TitleCard />
      <CardContent className="space-y-3 pt-1">
        <CardDetail />
      </CardContent>

      <CardFooter className="flex items-center justify-end pt-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!event.event_uuid || verifyingUuid === eventUuid}
        // onClick={() => handleVerifyClick(event.event_uuid)}
        >
          {verifyingUuid === eventUuid ? "Verifying…" : "Verify on-chain"}
        </Button>
      </CardFooter>
    </Card >
  )
}

function VerificationBadge({ state, anchor }: {
  state: VerificationState;
  anchor?: Anchor;
}) {
  const s = verificationStateMap[state]
  return (
    <Badge
      variant="outline"
      className={cn(
        "border text-[11px] font-medium",
        s.verification_badge_style
      )}
    >

      {state === "ANCHOR_PENDING" && <Spinner />}
      {s.verification_label}
      {anchor?.publisher && (
        <span className="ml-1 text-[10px] font-normal opacity-75">
          · {anchor.publisher}
        </span>
      )}
    </Badge>
  );
}

/* ---------- Loading skeleton ---------- */

export function DeviceEventTimelineSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex w-6 flex-col items-center">
            <Skeleton className="mt-1 h-3 w-3 rounded-full" />
            {i < 2 && <div className="mt-1 h-full w-px bg-muted" />}
          </div>

          <Card className="flex-1">
            <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
              <div className="space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent className="space-y-2 pt-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-3/5" />
            </CardContent>
            <CardFooter className="justify-end pt-2">
              <Skeleton className="h-7 w-24" />
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
}


/* ---------- Helpers ---------- */

function prettyPrintJSON(raw: string): string {
  try {
    const parsed = JSON.parse(raw);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return raw;
  }
}

/* ---------- Small presentational pieces ---------- */
function Field({
  label,
  children,
  mono,
}: {
  label: string;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="space-y-0.5">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div
        className={cn(
          "text-xs text-foreground border rounded-md p-3",
          mono && "font-mono break-all text-[11px]"
        )}
      >
        {children}
      </div>
    </div>
  );
}
