import { Card, CardContent } from '@/components/ui/card';
import ClusterMapView from '@/components/cluster/ClusterMapView';
import { Button } from '@/components/ui/button';
import { Field, FieldSet } from '@/components/ui/field';
import { ButtonGroup } from '@/components/ui/button-group';
import { IconList, IconMap } from '@tabler/icons-react';
import ClusterCreateButton from '@/components/cluster/ClusterCreateButton';
import { DataTable } from '@/components/ui/data-table';
import { useClusterByOrg } from '@/hooks/queries/use-cluster-by-org';
import { useAuth } from '@/hooks/use-auth';
import { clusterColumns } from '@/components/cluster/ClusterColumn';

export default function ClusterPage() {
  const { activeOrg } = useAuth()
  const { data: clusters, status: clusterQueryStatus } = useClusterByOrg(activeOrg?.id);
  console.log(clusters)

  // const [query, setQuery] = useState('');
  // const [currentView, setCurrentView] = useState('list-view');
  // useEffect(() => {
  // }, [])

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6 flex flex-row justify-between items-center">
            <div className="flex flex-col">
              <h3 className='text-lg font-bold'>Clusters Management</h3>
              <p className="text-muted-foreground mt-1 font-sm">
                Manage device clusters in your organization
              </p>
            </div>
            <ClusterCreateButton />
          </div>
          {/* <ClusterAggregateInfoSection /> */}
          <div className="px-4 lg:px-6 flex flex-1">
            <Card className="@container/card flex-1 overflow-hidden pt-2 pb-0 gap-0">
              <CardContent className="px-2">
                <FieldSet>
                  <Field>
                    {/*Filters*/}
                    <ButtonGroup className="justify-between">
                      <ButtonGroup>
                        <Button variant="outline">
                          <IconList />
                          List View
                        </Button>
                        <Button variant="outline">
                          <IconMap />
                          Map View
                        </Button>
                      </ButtonGroup>
                      <ButtonGroup>
                      </ButtonGroup>
                    </ButtonGroup>
                  </Field>
                </FieldSet>
              </CardContent>
              <Card className="@container/card flex flex-1 overflow-hidden p-0 m-2">
                <ClusterMapView />
              </Card>
            </Card>
          </div>
          <div className="px-4 lg:px-6 flex flex-1">
            {clusterQueryStatus === 'success' &&
              <DataTable className="flex-1" data={clusters.data} columns={clusterColumns} />
            }
          </div>
        </div>
      </div>
    </div>
  )
}
