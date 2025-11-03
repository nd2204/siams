import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Cpu,
  MoreVertical,
  Plus,
  Filter,
  Search,
} from 'lucide-react';

// Data types for the farm IoT system
export type SensorType =
  | 'temperature'
  | 'humidity'
  | 'soil_moisture'
  | 'ph'
  | 'light'
  | 'pressure'
  | 'npk'
  | 'wind_speed';

export type ActuatorType =
  | 'valve'
  | 'pump'
  | 'fan'
  | 'heater'
  | 'cooler'
  | 'led_light'
  | 'motor'
  | 'relay';

export type DeviceStatus = 'online' | 'offline' | 'warning';

export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  unit: string;
  currentValue: number;
  status: 'active' | 'inactive' | 'error';
  lastUpdate: string;
}

export interface Actuator {
  id: string;
  name: string;
  type: ActuatorType;
  state: 'on' | 'off';
  value?: number; // For actuators with variable control (0-100)
  unit?: string; // %, RPM, etc.
  status: 'active' | 'inactive' | 'error';
  lastCommand: string;
  controlType: 'toggle' | 'slider'; // UI control type
}

export interface Device {
  id: string;
  name: string;
  type: string; // MCU type: ESP32, Arduino, etc.
  clusterId: string;
  status: DeviceStatus;
  battery: number;
  sensors: Sensor[];
  actuators: Actuator[];
  lastUpdate: string;
}

export interface Cluster {
  id: string;
  name: string;
  location: string;
  devices: Device[];
  coordinates: { x: number; y: number };
  credentials?: {
    loginId: string;
    password: string;
    createdAt: string;
  };
}

// Mock data
export const farmData: Cluster[] = [
  {
    id: 'CLS-001',
    name: 'North Field Cluster',
    location: 'North Field',
    coordinates: { x: 20, y: 30 },
    devices: [
      {
        id: 'MCU-001',
        name: 'ESP32 Field Monitor',
        type: 'ESP32',
        clusterId: 'CLS-001',
        status: 'online',
        battery: 87,
        lastUpdate: '2 min ago',
        sensors: [
          {
            id: 'SEN-001',
            name: 'Soil Temperature',
            type: 'temperature',
            unit: '°C',
            currentValue: 22.5,
            status: 'active',
            lastUpdate: '2 min ago',
          },
          {
            id: 'SEN-002',
            name: 'Soil Moisture',
            type: 'soil_moisture',
            unit: '%',
            currentValue: 65,
            status: 'active',
            lastUpdate: '2 min ago',
          },
          {
            id: 'SEN-003',
            name: 'Air Temperature',
            type: 'temperature',
            unit: '°C',
            currentValue: 24.8,
            status: 'active',
            lastUpdate: '2 min ago',
          },
          {
            id: 'SEN-004',
            name: 'Air Humidity',
            type: 'humidity',
            unit: '%',
            currentValue: 58,
            status: 'active',
            lastUpdate: '2 min ago',
          },
        ],
        actuators: [
          {
            id: 'ACT-001',
            name: 'Irrigation Valve A',
            type: 'valve',
            state: 'on',
            value: 75,
            unit: '%',
            status: 'active',
            lastCommand: '5 min ago',
            controlType: 'slider',
          },
          {
            id: 'ACT-002',
            name: 'Field Fan',
            type: 'fan',
            state: 'off',
            status: 'active',
            lastCommand: '1 hour ago',
            controlType: 'toggle',
          },
        ],
      },
      {
        id: 'MCU-007',
        name: 'NodeMCU Wind Sensor',
        type: 'NodeMCU',
        clusterId: 'CLS-001',
        status: 'online',
        battery: 68,
        lastUpdate: '4 min ago',
        sensors: [
          {
            id: 'SEN-021',
            name: 'Wind Speed',
            type: 'wind_speed',
            unit: 'km/h',
            currentValue: 12,
            status: 'active',
            lastUpdate: '4 min ago',
          },
          {
            id: 'SEN-022',
            name: 'Wind Direction',
            type: 'wind_speed',
            unit: '°',
            currentValue: 245,
            status: 'active',
            lastUpdate: '4 min ago',
          },
        ],
        actuators: [],
      },
    ],
  },
  {
    id: 'CLS-002',
    name: 'East Orchard Cluster',
    location: 'East Orchard',
    coordinates: { x: 45, y: 25 },
    devices: [
      {
        id: 'MCU-002',
        name: 'Arduino Soil Monitor',
        type: 'Arduino Mega',
        clusterId: 'CLS-002',
        status: 'online',
        battery: 92,
        lastUpdate: '1 min ago',
        sensors: [
          {
            id: 'SEN-005',
            name: 'Soil pH',
            type: 'ph',
            unit: 'pH',
            currentValue: 6.8,
            status: 'active',
            lastUpdate: '1 min ago',
          },
          {
            id: 'SEN-006',
            name: 'Soil Moisture',
            type: 'soil_moisture',
            unit: '%',
            currentValue: 72,
            status: 'active',
            lastUpdate: '1 min ago',
          },
          {
            id: 'SEN-007',
            name: 'Soil Temperature',
            type: 'temperature',
            unit: '°C',
            currentValue: 21.3,
            status: 'active',
            lastUpdate: '1 min ago',
          },
        ],
        actuators: [
          {
            id: 'ACT-003',
            name: 'Water Pump',
            type: 'pump',
            state: 'on',
            value: 60,
            unit: '%',
            status: 'active',
            lastCommand: '10 min ago',
            controlType: 'slider',
          },
        ],
      },
    ],
  },
  {
    id: 'CLS-003',
    name: 'South Pasture Cluster',
    location: 'South Pasture',
    coordinates: { x: 70, y: 35 },
    devices: [
      {
        id: 'MCU-003',
        name: 'RPi Irrigation Control',
        type: 'Raspberry Pi',
        clusterId: 'CLS-003',
        status: 'warning',
        battery: 23,
        lastUpdate: '5 min ago',
        sensors: [
          {
            id: 'SEN-008',
            name: 'Water Pressure',
            type: 'pressure',
            unit: 'bar',
            currentValue: 2.4,
            status: 'active',
            lastUpdate: '5 min ago',
          },
          {
            id: 'SEN-009',
            name: 'Flow Rate',
            type: 'pressure',
            unit: 'L/min',
            currentValue: 45,
            status: 'active',
            lastUpdate: '5 min ago',
          },
          {
            id: 'SEN-010',
            name: 'Water Temperature',
            type: 'temperature',
            unit: '°C',
            currentValue: 18.5,
            status: 'active',
            lastUpdate: '5 min ago',
          },
          {
            id: 'SEN-011',
            name: 'Valve Position',
            type: 'pressure',
            unit: '%',
            currentValue: 65,
            status: 'error',
            lastUpdate: '25 min ago',
          },
        ],
        actuators: [
          {
            id: 'ACT-004',
            name: 'Main Valve',
            type: 'valve',
            state: 'on',
            value: 65,
            unit: '%',
            status: 'error',
            lastCommand: '25 min ago',
            controlType: 'slider',
          },
          {
            id: 'ACT-005',
            name: 'Backup Pump',
            type: 'pump',
            state: 'off',
            status: 'active',
            lastCommand: '2 hours ago',
            controlType: 'toggle',
          },
          {
            id: 'ACT-006',
            name: 'Zone 1 Valve',
            type: 'valve',
            state: 'off',
            status: 'active',
            lastCommand: '15 min ago',
            controlType: 'toggle',
          },
        ],
      },
    ],
  },
  {
    id: 'CLS-004',
    name: 'Greenhouse Cluster',
    location: 'West Greenhouse',
    coordinates: { x: 35, y: 60 },
    devices: [
      {
        id: 'MCU-004',
        name: 'ESP8266 Light Monitor',
        type: 'ESP8266',
        clusterId: 'CLS-004',
        status: 'online',
        battery: 78,
        lastUpdate: '3 min ago',
        sensors: [
          {
            id: 'SEN-012',
            name: 'Light Intensity',
            type: 'light',
            unit: 'lux',
            currentValue: 12500,
            status: 'active',
            lastUpdate: '3 min ago',
          },
          {
            id: 'SEN-013',
            name: 'UV Index',
            type: 'light',
            unit: 'UV',
            currentValue: 6.2,
            status: 'active',
            lastUpdate: '3 min ago',
          },
          {
            id: 'SEN-014',
            name: 'Internal Temperature',
            type: 'temperature',
            unit: '°C',
            currentValue: 28.5,
            status: 'active',
            lastUpdate: '3 min ago',
          },
        ],
        actuators: [
          {
            id: 'ACT-007',
            name: 'Greenhouse LED',
            type: 'led_light',
            state: 'on',
            value: 85,
            unit: '%',
            status: 'active',
            lastCommand: '30 min ago',
            controlType: 'slider',
          },
          {
            id: 'ACT-008',
            name: 'Ventilation Fan',
            type: 'fan',
            state: 'on',
            value: 45,
            unit: '%',
            status: 'active',
            lastCommand: '3 min ago',
            controlType: 'slider',
          },
          {
            id: 'ACT-009',
            name: 'Heating System',
            type: 'heater',
            state: 'off',
            status: 'active',
            lastCommand: '6 hours ago',
            controlType: 'toggle',
          },
        ],
      },
    ],
  },
  {
    id: 'CLS-005',
    name: 'Central Crop Cluster',
    location: 'Central Crop',
    coordinates: { x: 60, y: 55 },
    devices: [
      {
        id: 'MCU-005',
        name: 'Arduino Weather Station',
        type: 'Arduino Uno',
        clusterId: 'CLS-005',
        status: 'offline',
        battery: 15,
        lastUpdate: '2 hours ago',
        sensors: [
          {
            id: 'SEN-015',
            name: 'Air Temperature',
            type: 'temperature',
            unit: '°C',
            currentValue: 21.8,
            status: 'inactive',
            lastUpdate: '2 hours ago',
          },
          {
            id: 'SEN-016',
            name: 'Humidity',
            type: 'humidity',
            unit: '%',
            currentValue: 62,
            status: 'inactive',
            lastUpdate: '2 hours ago',
          },
          {
            id: 'SEN-017',
            name: 'Barometric Pressure',
            type: 'pressure',
            unit: 'hPa',
            currentValue: 1013,
            status: 'inactive',
            lastUpdate: '2 hours ago',
          },
        ],
        actuators: [],
      },
      {
        id: 'MCU-008',
        name: 'ESP32 NPK Monitor',
        type: 'ESP32',
        clusterId: 'CLS-005',
        status: 'online',
        battery: 81,
        lastUpdate: '2 min ago',
        sensors: [
          {
            id: 'SEN-023',
            name: 'Nitrogen (N)',
            type: 'npk',
            unit: 'mg/kg',
            currentValue: 45,
            status: 'active',
            lastUpdate: '2 min ago',
          },
          {
            id: 'SEN-024',
            name: 'Phosphorus (P)',
            type: 'npk',
            unit: 'mg/kg',
            currentValue: 32,
            status: 'active',
            lastUpdate: '2 min ago',
          },
          {
            id: 'SEN-025',
            name: 'Potassium (K)',
            type: 'npk',
            unit: 'mg/kg',
            currentValue: 28,
            status: 'active',
            lastUpdate: '2 min ago',
          },
        ],
        actuators: [
          {
            id: 'ACT-010',
            name: 'Fertilizer Pump',
            type: 'pump',
            state: 'off',
            status: 'active',
            lastCommand: '4 hours ago',
            controlType: 'toggle',
          },
        ],
      },
    ],
  },
  {
    id: 'CLS-006',
    name: 'Vineyard Cluster',
    location: 'Vineyard Plot',
    coordinates: { x: 80, y: 65 },
    devices: [
      {
        id: 'MCU-006',
        name: 'ESP32 pH Monitor',
        type: 'ESP32',
        clusterId: 'CLS-006',
        status: 'online',
        battery: 95,
        lastUpdate: '1 min ago',
        sensors: [
          {
            id: 'SEN-018',
            name: 'Soil pH',
            type: 'ph',
            unit: 'pH',
            currentValue: 6.8,
            status: 'active',
            lastUpdate: '1 min ago',
          },
          {
            id: 'SEN-019',
            name: 'Soil EC',
            type: 'ph',
            unit: 'mS/cm',
            currentValue: 1.8,
            status: 'active',
            lastUpdate: '1 min ago',
          },
          {
            id: 'SEN-020',
            name: 'Soil Temperature',
            type: 'temperature',
            unit: '°C',
            currentValue: 20.5,
            status: 'active',
            lastUpdate: '1 min ago',
          },
        ],
        actuators: [
          {
            id: 'ACT-011',
            name: 'Drip Valve',
            type: 'valve',
            state: 'on',
            value: 50,
            unit: '%',
            status: 'active',
            lastCommand: '5 min ago',
            controlType: 'slider',
          },
        ],
      },
    ],
  },
];

// Helper functions to get aggregated data
export function getAllDevices(): Device[] {
  return farmData.flatMap(cluster => cluster.devices);
}

export function getAllSensors(): Sensor[] {
  return getAllDevices().flatMap(device => device.sensors);
}

export function getAllActuators(): Actuator[] {
  return getAllDevices().flatMap(device => device.actuators);
}

export function getDevicesByCluster(clusterId: string): Device[] {
  const cluster = farmData.find(c => c.id === clusterId);
  return cluster?.devices || [];
}

export function getSensorsByDevice(deviceId: string): Sensor[] {
  const device = getAllDevices().find(d => d.id === deviceId);
  return device?.sensors || [];
}

export function getActuatorsByDevice(deviceId: string): Actuator[] {
  const device = getAllDevices().find(d => d.id === deviceId);
  return device?.actuators || [];
}

export function getClusterStats() {
  const allDevices = getAllDevices();
  const allSensors = getAllSensors();
  const allActuators = getAllActuators();

  return {
    totalClusters: farmData.length,
    totalDevices: allDevices.length,
    onlineDevices: allDevices.filter(d => d.status === 'online').length,
    offlineDevices: allDevices.filter(d => d.status === 'offline').length,
    warningDevices: allDevices.filter(d => d.status === 'warning').length,
    totalSensors: allSensors.length,
    activeSensors: allSensors.filter(s => s.status === 'active').length,
    inactiveSensors: allSensors.filter(s => s.status === 'inactive').length,
    errorSensors: allSensors.filter(s => s.status === 'error').length,
    totalActuators: allActuators.length,
    activeActuators: allActuators.filter(a => a.state === 'on').length,
    inactiveActuators: allActuators.filter(a => a.state === 'off').length,
    errorActuators: allActuators.filter(a => a.status === 'error').length,
  };
}

export function getDeviceWithCluster(deviceId: string) {
  for (const cluster of farmData) {
    const device = cluster.devices.find(d => d.id === deviceId);
    if (device) {
      return { device, cluster };
    }
  }
  return null;
}

// Generate random credentials
function generateLoginId(): string {
  const prefix = 'CLS';
  const randomNum = Math.floor(Math.random() * 900000) + 100000;
  return `${prefix}${randomNum}`;
}

function generatePassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Add new cluster
export function addCluster(name: string, location: string): Cluster {
  const newClusterId = `CLS-${String(farmData.length + 1).padStart(3, '0')}`;

  const newCluster: Cluster = {
    id: newClusterId,
    name,
    location,
    devices: [],
    coordinates: {
      x: Math.floor(Math.random() * 80) + 10,
      y: Math.floor(Math.random() * 60) + 20
    },
    credentials: {
      loginId: generateLoginId(),
      password: generatePassword(),
      createdAt: new Date().toISOString(),
    },
  };

  farmData.push(newCluster);
  return newCluster;
}

// Get cluster credentials
export function getClusterCredentials(clusterId: string) {
  const cluster = farmData.find(c => c.id === clusterId);
  return cluster?.credentials || null;
}

export default function DevicePage() {
  const [selectedDevice, setSelectedDevice] = useState<{ device: Device; clusterName: string } | null>(null);
  const allDevices = getAllDevices();
  const stats = getClusterStats();

  // if (selectedDevice) {
  //   return (
  //     <div className="px-6 py-6">
  //       <DeviceDetail
  //         device={selectedDevice.device}
  //         clusterName={selectedDevice.clusterName}
  //         onBack={() => setSelectedDevice(null)}
  //       />
  //     </div>
  //   );
  // }
  const getStatusBadge = (status: string) => {
    const variants = {
      online: 'default',
      offline: 'destructive',
      warning: 'secondary',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status}
      </Badge>
    );
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 50) return 'text-green-600';
    if (battery > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="px-6 py-6">
      <div className="mb-6">
        <h2 className="text-foreground">Device Management</h2>
        <p className="text-muted-foreground mt-1">
          Manage MCU devices and their connected sensors across all clusters
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-4">
          <div className="text-foreground mb-1">Total Devices</div>
          <div className="text-foreground">{stats.totalDevices}</div>
        </Card>
        <Card className="p-4">
          <div className="text-foreground mb-1">Online</div>
          <div className="text-foreground">{stats.onlineDevices}</div>
        </Card>
        <Card className="p-4">
          <div className="text-foreground mb-1">Warning</div>
          <div className="text-yellow-600">{stats.warningDevices}</div>
        </Card>
        <Card className="p-4">
          <div className="text-foreground mb-1">Offline</div>
          <div className="text-red-600">{stats.offlineDevices}</div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search devices..." className="pl-9" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="MCU Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="esp32">ESP32</SelectItem>
              <SelectItem value="esp8266">ESP8266</SelectItem>
              <SelectItem value="arduino">Arduino</SelectItem>
              <SelectItem value="raspberry">Raspberry Pi</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Device
          </Button>
        </div>

        {/* Device Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device (MCU)</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Cluster</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sensors</TableHead>
                <TableHead>Battery</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allDevices.map((device) => {
                const deviceInfo = getDeviceWithCluster(device.id);
                const activeSensors = device.sensors.filter(s => s.status === 'active').length;

                return (
                  <TableRow
                    key={device.id}
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => setSelectedDevice({
                      device,
                      clusterName: deviceInfo?.cluster.name || 'Unknown'
                    })}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="bg-muted p-2 rounded-lg">
                          <Cpu className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="text-foreground">{device.name}</div>
                          <div className="text-muted-foreground">{device.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{device.type}</TableCell>
                    <TableCell>
                      <div className="text-foreground">{deviceInfo?.cluster.name}</div>
                      <div className="text-muted-foreground">{deviceInfo?.cluster.location}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(device.status)}</TableCell>
                    <TableCell>
                      <div className="text-foreground">
                        {activeSensors}/{device.sensors.length}
                      </div>
                      <div className="text-muted-foreground">active</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-muted outline-2 outline-offset-3 outline-muted h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${device.battery > 50
                              ? 'bg-green-500'
                              : device.battery > 20
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                              }`}
                            style={{ width: `${device.battery}%` }}
                          />
                        </div>
                        <span className={getBatteryColor(device.battery)}>
                          {device.battery}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{device.lastUpdate}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle more options
                        }}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-muted-foreground">Showing {allDevices.length} of {stats.totalDevices} devices</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
