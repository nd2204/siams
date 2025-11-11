import { useDeviceTelemetry } from "@/hooks/queries/use-device-telemetry";
import { useParams } from "react-router"

export default function DeviceDetailPage() {
  const { id } = useParams();
  const { data: telemetry } = useDeviceTelemetry(id)

  console.log(telemetry)

  return (
    <div>{id}</div>
  )
}

