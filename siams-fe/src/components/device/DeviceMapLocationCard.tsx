import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from 'react-leaflet';

import type { Device } from '@/types/device';
import { Card } from '../ui/card';

export default function DeviceMapLocationCard({
  device
}: {
  device: Device
}
) {
  const [lng, lat] = device.geom.coordinates
  const pos: [number, number] = [lat, lng]

  return (
    <Card className="relative h-10 w-10 p-0 overflow-hidden">
      <MapContainer
        center={[10.75, 106.67]}
        id="map"
        zoom={13}
        zoomControl={false}
        whenReady={() => { }}
        className="relative flex-1 z-0"
        attributionControl={false}
      >
        {/* <TileLayer */}
        {/*   url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" */}
        {/*   attribution="&copy; <a href='https://stadiamaps.com/'>Stadia Maps</a>" */}
        {/* /> */}
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://stadiamaps.com/'>Stadia Maps</a>"
        />
        <CircleMarker key={device.id} center={pos} radius={6}>
          <Popup>{device.name}</Popup>
        </CircleMarker>
        <div className="absolute right-4 top-4 z-1000">
          <div className="bg-background [--radius:9999px]" >

          </div>
        </div>
      </MapContainer>
    </Card>
  )
}

