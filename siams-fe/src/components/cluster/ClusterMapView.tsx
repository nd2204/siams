import {
  MapContainer,
  TileLayer,
  Polygon,
} from 'react-leaflet';

import L from 'leaflet';

import SearchClusterCard from '@/components/cluster/SearchClusterCard';
import { useAuth } from '@/hooks/use-auth';

const farms: { id: number, name: string, area: L.LatLngExpression[] }[] = [
  { id: 1, name: "Farm A", area: [[10.75, 106.67], [10.76, 106.68], [10.75, 106.69]] },
  { id: 2, name: "Farm B", area: [[10.77, 106.65], [10.78, 106.66], [10.77, 106.67]] }
];

export default function ClusterMapView() {
  const { activeOrg } = useAuth()
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
        {/* <TileLayer */}
        {/*   url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" */}
        {/*   attribution="&copy; <a href='https://stadiamaps.com/'>Stadia Maps</a>" */}
        {/* /> */}
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://stadiamaps.com/'>Stadia Maps</a>"
        />
        {farms.map(f => (
          <Polygon key={f.id} positions={f.area} pathOptions={{ color: 'green' }} />
        ))}
        <div className="absolute top-4 left-4 z-[1000]">
          {activeOrg && <SearchClusterCard orgId={activeOrg.id} />}
        </div>
        <div className="absolute right-4 top-4 z-[1000]">
          <div className="bg-background [--radius:9999px]" >

          </div>
        </div>
      </MapContainer>
    </div>
  )
}

