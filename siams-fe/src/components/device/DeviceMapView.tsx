import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from 'react-leaflet';

import type { Device } from '@/types/device';
import { FitBounds, latLngFromGeoJsonPoint } from '@/utils/map-utils';
import { ButtonGroup } from '../ui/button-group';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { IconArrowsMaximize, IconArrowsMinimize, IconDroplet, IconExternalLink, IconTemperature } from '@tabler/icons-react';
import { useNavigate } from 'react-router';

export default function DeviceMapView({
  devices,
  fullscreen = false,
  onFullscreenToggle
}: {
  fullscreen?: boolean,
  onFullscreenToggle: () => void,
  devices: Device[]
}
) {
  const navigate = useNavigate()

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[10.75, 106.67]}
        id="map"
        zoom={13}
        zoomControl={false}
        whenReady={() => { }}
        className="relative flex-1 z-0"
        attributionControl={false}
      >
        <ButtonGroup className="absolute right-2 top-2 z-9999" orientation={"vertical"}>
          <ButtonGroup>
            <Card className="p-0 border-none rounded-md">
              <Button variant="outline" size="icon" onClick={onFullscreenToggle} aria-label="Go Back">
                {!!fullscreen ?
                  <IconArrowsMinimize />
                  :
                  <IconArrowsMaximize />
                }
              </Button>
            </Card>
          </ButtonGroup>
          <Card className="p-0 border-none rounded-md rounded-t-full">
            <ButtonGroup orientation={"vertical"}>
              <Button variant="outline" size="icon" onClick={undefined} aria-label="Go Back">
                <IconTemperature />
              </Button>
              <Button variant="outline" size="icon" onClick={undefined} aria-label="Go Back">
                <IconDroplet />
              </Button>
            </ButtonGroup>
          </Card>
        </ButtonGroup>
        {/* <TileLayer */}
        {/*   url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" */}
        {/*   attribution="&copy; <a href='https://stadiamaps.com/'>Stadia Maps</a>" */}
        {/* /> */}
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://stadiamaps.com/'>Stadia Maps</a>"
        />
        <FitBounds
          items={devices}
          once
          getLatLng={(it) => latLngFromGeoJsonPoint(it.geom)}
        />

        {devices.map((d) => {
          const [lng, lat] = d.geom.coordinates
          const pos: [number, number] = [lat, lng]
          const isOnline = d.status === "online"

          return (
            <CircleMarker
              key={d.id}
              center={pos}
              radius={10}
              pathOptions={{
                // Tailwind SVG utilities + Tailwind animation
                className: isOnline
                  ? "fill-accent-green/80 stroke-accent-green animate-pulse"
                  : "fill-gray-600 stroke-gray-500",
                weight: 2,
                fillOpacity: 0.9,
              }}
            >
              <Popup>
                {d.name}
                <Button variant="ghost" className="cursor-pointer" onClick={() => navigate(`/device/${d.id}`)}>
                  <IconExternalLink />
                </Button>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>
    </div>
  )
}

