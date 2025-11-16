import { useCallback, useMemo, useState } from 'react';
import {
  Terminal,
  Power,
  Info,
  Play,
  Settings,
  ChevronRight,
  Zap,
  Radio,
} from 'lucide-react';
import type { Actuator, Command, CommandDesc, Device, Sensor } from '@/types/device';
import { Card } from '@/components/ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { useDeviceCommand } from '@/hooks/queries/use-device-command';
import { Skeleton } from '../ui/skeleton';
import { useDeviceSensors } from '@/hooks/queries/use-device-sensor';
import { useDeviceActuators } from '@/hooks/queries/use-device-actuator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '@/lib/utils';
import { useDeviceCommandSender } from '@/hooks/mutations/use-device-command-sender';
import type { DeviceCommandPayload } from '@/services/api/dtos/device/device-send-command-request';
import { SmartInput } from './SmartInput';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';

type SensorCommand = Sensor & {
  localId: number;
  commandId: string;
  commands: CommandDesc[];
};

type ActuatorCommand = Actuator & {
  localId: number;
  commandId: string;
  commands: CommandDesc[];
};

type SelectedItem = {
  type: 'sensor' | 'actuator' | 'device'
  data: SensorCommand | ActuatorCommand | Command
  selectedCommand: CommandDesc | null
}

type DeviceCommandsPanelProps = {
  device: Device,
}

interface ActuatorCommandsSectionProps {
  actuatorCommands: ActuatorCommand[];
  selectedItem: SelectedItem | null;
  onSelect: (actuator: ActuatorCommand) => void;
}

const ActuatorCommandsSection = ({ actuatorCommands, selectedItem, onSelect }: ActuatorCommandsSectionProps) => {
  return <>
    {actuatorCommands.length > 0 && (
      <div>
        <div className="flex items-center gap-2 mb-2 px-2">
          <Power className="w-4 h-4 text-accent-green" />
          <span className="">Actuators</span>
          <Badge variant="secondary" className="ml-auto text-xs">
            {actuatorCommands.length}
          </Badge>
        </div>
        <div className="space-y-1.5">
          {actuatorCommands.map(actuator => (
            <button
              key={actuator.id}
              onClick={() => onSelect(actuator)}
              className={`w-full text-left p-3 rounded-lg transition-all ${selectedItem?.type === 'actuator' && selectedItem.data.id === actuator.id
                ? 'border border-accent-green/35 from-accent-green/10 to-card bg-card bg-gradient-to-t shadow-xs'
                : 'bg-card border-1 border-border hover:border-accent-green/35 hover:from-accent-green/10 hover:to-card hover:bg-gradient-to-t hover:shadow-xs'
                }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-foreground">{actuator.name}</span>
                <ChevronRight className={cn(
                  `w-4 h-4 transition-transform`,
                  selectedItem?.type === 'actuator' && selectedItem.data.id === actuator.id ? 'text-accent-green transform translate-x-1' : 'text-muted-foreground/50'
                )} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-mono">Local ID: {actuator.localId}</span>
                <Badge variant='outline' className="text-xs font-mono font-semibold text-muted-foreground"
                >
                  {actuator.commands.length} {actuator.commands.length <= 1 ? "cmd" : "cmds"}
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </div>
    )}
  </>
};

interface DeviceCommandsSectionProps {
  deviceCommands: Command[];
  commands: Command[];
  selectedItem: SelectedItem | null;
  onSelect: (command: Command) => void;
}

const DeviceCommandsSection = ({ deviceCommands, commands, selectedItem, onSelect }: DeviceCommandsSectionProps) => {
  return (
    <>
      {deviceCommands.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2 px-2">
            <Terminal className="w-4 h-4 text-accent-blue" />
            <span className="font-sm text-muted-foreground font-medium">Device Commands</span>
            <Badge variant="outline" className="ml-auto text-xs text-accent-blue">
              {commands.length}
            </Badge>
          </div>
          <div className="space-y-1.5">
            {deviceCommands.map(command => (
              <button
                key={command.id}
                onClick={() => onSelect(command)}
                className={`w-full text-left p-3 rounded-lg transition-all ${selectedItem?.type === 'device' && selectedItem.data.id === command.id
                  ? 'border border-accent-blue/35 from-accent-blue/10 to-card bg-card bg-gradient-to-t shadow-xs'
                  : 'bg-card border-1 border-border hover:border-accent-blue/35 hover:from-accent-blue/10 hover:to-card hover:bg-gradient-to-t hover:shadow-xs'
                  }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-foreground font-mono">{command.name}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${selectedItem?.type === 'device' && selectedItem.data.id === command.id
                    ? 'text-accent-blue transform translate-x-1'
                    : 'text-accent-blue/50'
                    }`} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs font-mono">Local ID: {command.localId}</span>
                  <Badge variant='outline' className="text-xs font-mono font-semibold text-muted-foreground"
                  >
                    {command.commands.length} {command.commands.length <= 1 ? "cmd" : "cmds"}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

interface CommandViewProps {
  selectedItem: SelectedItem | null;
  device: Device;
  onSelectCommandAction: (value: string) => void;
  paramValues: Record<string, number | string | boolean>;
  handleParamChange: (name: string, value: any) => void;
  executeCommand: (localId: number, action: string) => void;
}

const CommandView = ({
  selectedItem,
  device,
  onSelectCommandAction,
  paramValues,
  handleParamChange,
  executeCommand,
}: CommandViewProps) => {
  return (
    <div className="col-span-8 bg-background relative">
      {selectedItem ? (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-start gap-3 mb-4">
              <div className={cn(
                `p-3 border-2 rounded-xl bg-gradient-to-br`,
                selectedItem.type === 'sensor' ? 'from-accent-blue/20'
                  : selectedItem.type === 'actuator' ? 'from-accent-green/20'
                    : 'from-accent-blue/20',
                'to-card'
              )}>
                {selectedItem.type === 'sensor' ? <Radio className={`w-6 h-6 text-accent-aqua`} />
                  : selectedItem.type === 'actuator' ? <Power className={`w-6 h-6 text-accent-green`} />
                    : <Terminal className={`w-6 h-6 text-accent-blue`} />
                }
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-foreground">{selectedItem.data.name}</h3>
                  <Badge variant="outline" className="capitalize">
                    {selectedItem.type}
                  </Badge>
                </div>
                {selectedItem.data && 'localId' in selectedItem.data && (
                  <p className="text-muted-foreground text-sm font-mono">Local ID: {selectedItem.data.localId}</p>
                )}
              </div>
            </div>
            {/* Command Action Selector */}
            <div className="space-y-2">
              <Label className="text-foreground">Select Command Action</Label>
              <Select
                value={selectedItem.selectedCommand?.action || ''}
                onValueChange={onSelectCommandAction}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a command action..." />
                </SelectTrigger>
                <SelectContent>
                  {selectedItem.data.commands.map(cmd => (
                    <SelectItem key={cmd.action} value={cmd.action}>
                      <div className="flex items-center justify-between gap-4">
                        <span className="capitalize">{cmd.action.replace(/([A-Z])/g, ' $1').trim()}</span>
                        {cmd.params.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {cmd.params.length} param{cmd.params.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {selectedItem.selectedCommand ? (
                <>
                  {/* Command Parameters */}
                  {selectedItem.selectedCommand.params.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-muted-foreground" />
                        <Label className="text-foreground">Command Parameters</Label>
                      </div>
                      {selectedItem.selectedCommand.params.map((param) => (
                        <div key={param.name} className="space-y-2 bg-card p-4 rounded-md">
                          <Label className="text-foreground text-sm capitalize">
                            {param.name.replace(/([A-Z])/g, ' $1').trim()}
                            <span className="text-xs text-muted-foreground">{param.type}</span>
                          </Label>
                          {/* if has enum */}
                          {param.enums && param.enums.length > 0 ? (
                            <Select
                              value={paramValues[param.name] ? paramValues[param.name] as string : ''}
                              onValueChange={(value) => handleParamChange(param.name, value)}
                              disabled={device.status === 'offline'}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={`Select ${param.name}...`} />
                              </SelectTrigger>
                              <SelectContent>
                                {param.enums.map(enumValue => (
                                  <SelectItem key={enumValue} value={enumValue}>
                                    {enumValue}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <SmartInput
                              onChange={handleParamChange}
                              value={paramValues[param.name] ?? ''}
                              param={param}
                              placeholder={`Enter ${param.name}...`}
                              disabled={device.status === 'offline'}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                      <Info className="w-5 h-5 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-600 text-sm">This command requires no parameters</p>
                    </div>
                  )}

                  {device.status === 'offline' && (
                    <div className="flex items-center gap-2 p-3 bg-accent-yellow/15 border border-accent-yellow/25 rounded-lg">
                      <Info className="w-4 h-4 text-accent-yellow" />
                      <span className="text-accent-yellow text-sm">
                        Device is offline. Command execution is disabled.
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h4 className="text-foreground mb-1">Select a Command Action</h4>
                  <p className="text-muted-foreground text-sm">
                    Choose a command action from the dropdown above
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer - Execute Button */}
          {selectedItem.selectedCommand && (
            <div className="p-0 border-t absolute bottom-0 left-0 right-0">
              <Button
                variant={"ghost"}
                className="w-full py-2 hover:rounded-none hover:cursor-pointer"
                onClick={() => executeCommand(selectedItem.data.localId, selectedItem.selectedCommand!.action)}
                disabled={device.status === 'offline'}
              >
                <Play className="w-4 h-4 mr-2" />
                Execute {selectedItem.selectedCommand.action.replace(/([A-Z])/g, ' $1').trim()}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <div className="bg-gradient-to-br from-card to-secondary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-10 h-10 text-muted-foreground" />
            </div>
            <h4 className="text-foreground mb-2">No Item Selected</h4>
            <p className="text-muted-foreground text-sm">
              Select a sensor, actuator, or device from the list to view and execute commands
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

interface CommandListProps {
  actuatorCommands: ActuatorCommand[];
  deviceCommands: Command[];
  commands: Command[];
  selectedItem: SelectedItem | null;
  onSelectActuator: (actuator: ActuatorCommand) => void;
  onSelectDevice: (command: Command) => void;
}

const CommandList = ({
  actuatorCommands,
  deviceCommands,
  commands,
  selectedItem,
  onSelectActuator,
  onSelectDevice,
}: CommandListProps) => {
  return (
    <div className="col-span-4 bg-background">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-foreground">Commands</h3>
          <Badge variant="outline">{commands.length} total</Badge>
        </div>
        <p className="text-muted-foreground text-sm">Select a command to configure</p>
      </div>
      <ScrollArea className="bg-card h-[calc(600px-88px)]">
        <div className="p-4 space-y-4">
          {/* Actuators Section */}
          <ActuatorCommandsSection
            actuatorCommands={actuatorCommands}
            selectedItem={selectedItem}
            onSelect={onSelectActuator}
          />
          {/* Commands Section */}
          <DeviceCommandsSection
            deviceCommands={deviceCommands}
            commands={commands}
            selectedItem={selectedItem}
            onSelect={onSelectDevice}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export function DeviceCommandsPanel({ device }: DeviceCommandsPanelProps) {
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [paramValues, setParamValues] = useState<Record<string, number | string | boolean>>({});
  const { data: sensors, status: sensorsStatus } = useDeviceSensors(device?.id);
  const { data: actuators, status: actuatorsStatus } = useDeviceActuators(device?.id);
  const { data: commands, status: commandsStatus } = useDeviceCommand(device.id)
  const commandSender = useDeviceCommandSender();

  const isLoading =
    sensorsStatus === 'pending' ||
    actuatorsStatus === 'pending' ||
    commandsStatus === 'pending' ||
    !sensors ||
    !actuators ||
    !commands;

  const executeCommand = (localId: number, action: string) => {
    const payload: DeviceCommandPayload = {
      localId,
      action,
      params: paramValues
    }

    alert(JSON.stringify(payload))

    toast.promise(
      commandSender.mutateAsync({
        deviceId: device.id,
        payload
      }),
      {
        loading: "Sending command...",
        success: (data) => {
          if (data.success) {
            return `${data.message}`
          }
        },
        error: (err: AxiosError) => {
          return err?.message || "Send command failed. Please try again."
        }
      }
    )
  }

  // stable action select handler (uses selectedItem.data.commands at call time)
  const onSelectCommandAction = useCallback((value: string) => {
    setSelectedItem(prev => {
      if (!prev) return prev;
      const cmd = prev.data.commands.find(c => c.action === value) || null;
      return { ...prev, selectedCommand: cmd };
    });
    setParamValues({});
  }, []);

  const handleParamChange = useCallback((name: string, value: any) => {
    setParamValues(prev => ({ ...prev, [name]: value }));
  }, []);

  // Build command lists using useMemo for reactivity
  const { actuatorCommands, deviceCommands } = useMemo(() => {
    const sc: SensorCommand[] = [];
    const ac: ActuatorCommand[] = [];

    if (isLoading) return { actuatorCommands: [], deviceCommands: [] };

    sensors.forEach((s) => {
      const cmd = commands.find((c) => c.localId === s.localId);
      if (cmd && cmd.commands.length > 0) {
        sc.push({
          ...s,
          localId: cmd.localId,
          commandId: cmd.id,
          commands: cmd.commands,
        });
      }
    });

    actuators.forEach((a) => {
      const cmd = commands.find((c) => c.localId === a.localId);
      if (cmd && cmd.commands.length > 0) {
        ac.push({
          ...a,
          localId: cmd.localId,
          commandId: cmd.id,
          commands: cmd.commands,
        });
      }
    });

    const dc = commands.filter(
      (cmd) => (!sensors.some((s) => s.localId === cmd.localId) &&
        !actuators.some((a) => a.localId === cmd.localId))
    );

    return { actuatorCommands: ac, deviceCommands: dc };
  }, [sensors, actuators, commands, isLoading]);

  if (isLoading) return <Skeleton className="h-[600px]" />;

  const handleSelectActuator = (actuator: ActuatorCommand) => {
    setSelectedItem({ type: 'actuator', data: actuator, selectedCommand: null });
  };

  const handleSelectDevice = (command: Command) => {
    setSelectedItem({ type: 'device', data: command, selectedCommand: null });
  };

  return (
    <Card className="overflow-hidden bg-background p-0 divide-y divide-border">
      <div className="grid grid-cols-12 divide-x divide-border h-[600px]">
        <CommandList
          actuatorCommands={actuatorCommands}
          deviceCommands={deviceCommands}
          commands={commands}
          selectedItem={selectedItem}
          onSelectActuator={handleSelectActuator}
          onSelectDevice={handleSelectDevice}
        />
        <CommandView
          selectedItem={selectedItem}
          device={device}
          onSelectCommandAction={onSelectCommandAction}
          paramValues={paramValues}
          handleParamChange={handleParamChange}
          executeCommand={executeCommand}
        />
      </div>
    </Card>
  );
}

