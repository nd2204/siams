// components/device-event-timeline.tsx
"use client";

import type {
  VerificationState,
} from "@/types/device/"; // adjust paths
import { cn } from "@/lib/utils";

import {
  Card,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useDeviceEvent } from "@/hooks/queries/use-device-event";
import { IconAlertTriangle } from "@tabler/icons-react";
import DeviceEventTimelineCard, { DeviceEventTimelineSkeleton } from "./DeviceEventTimelineCard";
import { Badge } from "../ui/badge";
import { FormatRelativeDayFromISO, MilitaryTimeFromISO } from "@/utils/time-utils";

interface DeviceEventTimelineProps {
  deviceId: string;
  showRawPayload?: boolean;
  blockExplorerBaseUrl?: string; // e.g. "https://etherscan.io/tx/"
  className?: string;
}

export function DeviceEventTimeline({
  deviceId,
  blockExplorerBaseUrl,
  className,
}: DeviceEventTimelineProps) {
  const {
    data: deviceEvents,
    status: deviceEventsQueryStatus,
    error: deviceEventsQueryError
  } = useDeviceEvent(deviceId)

  const handleVerifyClick = async (eventUuid?: string) => {
    // if (!eventUuid) return;
    // try {
    //   setVerifyingUuid(eventUuid);
    //   const res = await verifyEventOnChain(eventUuid);
    //   if (!res.ok) {
    //     alert(res.message || "Verification failed on backend");
    //   } else {
    //     alert("Verification request sent / confirmed!");
    //     // optional: re-fetch items here
    //   }
    // } catch (err) {
    //   alert((err as Error).message || "Verification error");
    // } finally {
    //   setVerifyingUuid(null);
    // }
  };

  if (deviceEventsQueryStatus === 'pending') {
    return (
      <DeviceEventTimelineSkeleton className={className} />
    );
  }

  if (deviceEventsQueryStatus === 'error') {
    return (
      <Alert variant="destructive" className={className}>
        <IconAlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{deviceEventsQueryError.message}</AlertDescription>
      </Alert>
    );
  }

  if (!deviceEvents.length) {
    return (
      <Card className={cn("w-full", className)}>
        <CardDescription>No events recorded for this device yet.</CardDescription>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <ScrollArea className="h-full">
        <div className={cn("flex flex-col gap-4 mb-40", className)}>
          {deviceEvents.map((bucket, index) => {
            return (
              <>
                <Badge
                  variant={"default"}
                  className={cn(
                    "px-3 py-1.5",
                    index === 0
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground"
                  )}
                >
                  {FormatRelativeDayFromISO(bucket.bucket_name)}
                </Badge>
                {bucket.data.map((event, index) => {
                  const eventUuid = event.event_uuid ?? `index-${index}`;
                  return (
                    <div key={eventUuid} className="flex gap-4">
                      {/* Left: marker & line */}
                      <div className="flex w-6 flex-col items-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {/* <Badge variant={"secondary"} */}
                            {/*   className={cn( */}
                            {/*     "z-10 p-2 rounded-full border-1 bg-background", */}
                            {/*     markerClasses(verificationState) */}
                            {/*   )} */}
                            {/* > */}
                            {/*   <IconGitBranch /> */}
                            {/* </Badge> */}
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            {/* <p>{verificationLabel(verificationState)}</p> */}
                          </TooltipContent>
                        </Tooltip>

                        <div className={cn("mt-1 h-full w-px border-dashed border-l")} aria-hidden="true" />
                      </div>

                      {/* Right: event card */}
                      <div className="flex flex-1 flex-row gap-4">
                        <div className="text-muted-foreground text-xs font-mono">
                          {MilitaryTimeFromISO(event.created_at, { second: undefined })}
                        </div>
                        <DeviceEventTimelineCard event={event} />
                      </div>
                    </div>
                  );
                })}
              </>
            )
          })}
        </div>
      </ScrollArea>
    </TooltipProvider >
  );
}

function verificationLabel(state: VerificationState): string {
  switch (state) {
    case "NOT_ANCHORED":
      return "Not anchored";
    case "ANCHOR_PENDING":
      return "Pending...";
    case "ANCHOR_CONFIRMED":
      return "On-chain";
    case "ANCHOR_FAILED":
      return "Anchor failed";
    default:
      return "Unknown";
  }
}

