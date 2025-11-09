import L from 'leaflet';
import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { Card } from '../ui/card';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group';
import { Search } from 'lucide-react';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from '../ui/item';
import React from 'react';
import { useClusterByOrg } from '@/hooks/queries/use-cluster-by-org';
import type { Cluster } from '@/types/device';
import { Spinner } from '../ui/spinner';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '../ui/button';
import { IconExternalLink, IconMapPin, IconMapPinFilled, IconMapPinOff, IconScanPosition } from '@tabler/icons-react';
import { ButtonGroup } from '../ui/button-group';
import { useNavigate } from 'react-router';

interface SearchCardProps {
  clusters: Cluster[];
}

export default function SearchClusterCard({ orgId }: { orgId: string }) {
  const [query, setQuery] = useState('');
  const { data: clusters, isPending } = useClusterByOrg(orgId)
  console.log(clusters);
  const navigate = useNavigate();
  const map = useMap()

  const handleFocusCluster = (c: Cluster) => {
    // const area = c.geom as L.LatLngExpression[]
    // if (c.area.length > 0) {
    //   const bounds = L.latLngBounds(area);
    //   map.flyToBounds(bounds, { duration: 0.6, maxZoom: 15.0, easeLinearity: 0.25 });
    // }
  };

  if (!clusters) {
    return <>Data not available</>
  }

  // useEffect(() => {
  //   L.geoJSON();
  // }, [clusters])

  const results = clusters.data.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const ListFarm = ({ clusters }: SearchCardProps) => {
    return (
      <ItemGroup className="flex w-full max-w-md flex-col gap-0">
        <p className="text-muted-foreground/80 font-bold p-2">clusters</p>
        <ItemSeparator />
        {clusters.map((c, i) => (
          <React.Fragment key={c.id}>
            <Item
              className="p-2 m-0 rounded transition-colors items-center"
            >
              <ItemMedia className="flex items-center justify-center text-center gap-2 bg-transparent shrink-0">
                <div className="relative flex h-2 w-2 items-center justify-center translate-y-[3.5px]">
                  <div className="absolute h-2 w-2 rounded-full bg-green-600 opacity-75 animate-ping"></div>
                  <div className="relative h-2 w-2 rounded-full bg-green-600"></div>
                </div>
              </ItemMedia>
              <ItemContent className="gap-1">
                <ItemTitle>{c.name}</ItemTitle>
                <ItemDescription className="text-sm">{c.locName}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ButtonGroup>
                  {c.geom ?
                    <Button variant="outline" className="cursor-pointer "><IconMapPinFilled /></Button>
                    :
                    <Button variant="outline" disabled><IconMapPinOff /></Button>
                  }
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => navigate(`/cluster/${c.id}`)}
                  >
                    < IconExternalLink />
                  </Button>
                </ButtonGroup>
              </ItemActions>
            </Item>
            {i !== clusters.length - 1 && <ItemSeparator />}
          </React.Fragment>
        ))}
        <ItemSeparator />
      </ItemGroup>
    )
  }


  return (
    <div className="p-2 flex flex-col h-full">
      <Card className='p-0 [--radius:9999px] mb-2'>
        <InputGroup className="[--radius:9999px] dark:bg-input/10">
          <InputGroupInput
            placeholder="Search for cluster..."
            id="input-secure-19"
            value={query}
            onChange={(r) => setQuery(r.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            {isPending ? <Spinner /> : `${results.length} results`}
          </InputGroupAddon>
        </InputGroup>
      </Card>

      {query ? (
        results.length > 0 && (
          <Card className="p-0 overflow-hidden border">
            <ListFarm clusters={results} />
          </Card>
        )
      ) : (clusters.data.length > 0 && (
        <Card className="p-0 overflow-hidden border">
          <ListFarm clusters={clusters.data} />
        </Card>)
      )}
    </div>
  );
}
