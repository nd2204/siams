import React, { useEffect, useState } from 'react';
import { Box, Text, useInput } from 'ink';

// Local fallback hook for terminal dimensions so we don't rely on a specific
// ink version/type that may not export `useStdoutDimensions`.
function useStdoutDims(): [number, number] {
  const getDims = (): [number, number] => [process.stdout?.columns ?? 80, process.stdout?.rows ?? 24];
  const [dims, setDims] = useState<[number, number]>(getDims());
  useEffect(() => {
    const onResize = () => setDims(getDims());
    process.stdout?.on && process.stdout.on('resize', onResize);
    return () => { process.stdout?.off && process.stdout.off('resize', onResize); };
  }, []);
  return dims;
}
import EventEmitter from "events";
import { DeviceList } from './device-list';
import { DeviceLogs } from './device-log';
import { DeviceEvent, DevInfo, LogLevel } from '../data/types';

export const App: React.FC<{ emitter: EventEmitter }> = ({ emitter }) => {
  const [devices, setDevices] = useState<Record<string, DevInfo>>({});
  const [logs, setLogs] = useState<Record<string, { level: LogLevel, log: string }[]>>({});
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const ids = Object.keys(devices);

  useEffect(() => {
    const handler = (evt: DeviceEvent) => {
      switch (evt.type) {
        case "created": {
          const key = evt.tempId!;
          setDevices((prev) => ({
            ...prev, [key]: {
              tempId: key,
              id: key,
              sensors: evt.sensors,
              actuators: evt.actuators,
              registered: false,
              lastMessage: "created"
            }
          }));
          if (!selected) setSelected(key);
          break;
        }
        case "registered": {
          const key = evt.tempId!;
          setDevices((prev) => {
            return ({
              ...prev, [key]: {
                ...(prev[key]),
                id: evt.deviceId,
                registered: true,
                lastMessage: "registered"
              }
            })
          });
          if (!selected) setSelected(key);
          break;
        }
        case "telemetry": {
          const key = evt.tempId!;
          setDevices((prev) => ({
            ...prev, [key]: {
              ...(prev[key] ?? { id: key }),
              registered: true,
              reading: ({ ...prev[key].reading, [evt.localId]: evt.value }),
              lastMessage: `telemetry`
            }
          }));
          break;
        }
        case "status": {
          const key = evt.tempId!;
          setDevices((prev) => ({
            ...prev,
            [key]: {
              ...(prev[key]),
              cpu: evt.cpu,
              mem: evt.mem,
              wifi: evt.wifi,
              lastMessage: `status`
            }
          }));
          break;
        }
        case "log": {
          const key = evt.tempId!;
          appendLog(key, evt.level, `${evt.message}${evt.obj ? `\n${JSON.stringify(evt.obj)}` : ""}`);
          break;
        }
      }
    };

    emitter.on("event", handler);
    return () => {
      emitter.off("event", handler);
    };
  }, [emitter, selected]);

  useInput((input, key) => {
    // basic keyboard navigation: j/k
    if (key.downArrow || input === "j") {
      const i = ids.indexOf(selected || "");
      if (i < ids.length - 1) setSelected(ids[i + 1]);
    }
    if (key.upArrow || input === "k") {
      const i = ids.indexOf(selected || "");
      if (i > 0) setSelected(ids[i - 1]);
    }
    if (input === "q") {
      // exit
      process.exit(0);
    }
  });

  function appendLog(deviceId: string, level: LogLevel, line: string) {
    setLogs((prev) => {
      const arr = prev[deviceId] && prev[deviceId] ? [
        ...prev[deviceId],
        { level: level, log: `[${new Date().toLocaleTimeString()}] ${line} ` }
      ] : [{ level: level, log: `[${new Date().toLocaleTimeString()}] ${line} ` }];
      return { ...prev, [deviceId]: arr.slice(-200) }; // keep last 200 entries
    });
  }

  function getSensorReading(localId: number): string {
    const s = "No reading"
    if (!(selected && devices[selected])) return s
    const device = devices[selected]

    if (!device || !device.sensors) return s
    const sensor = device.sensors.find(s => s.localId === localId)
    const reading = device.reading

    if (sensor && reading && reading[localId]) {
      return (`${reading[localId]} ${sensor.unit}`)
    }
    return s
  }

  const [columns, rows] = useStdoutDims();
  const leftWidth = Math.max(16, Math.floor(columns * 0.30));

  return (
    // Use explicit dims so Ink re-measures on resize
    <Box width={columns} height={rows} flexDirection="column">
      <Box flexDirection="row" width={columns} height={rows - 3}>
        <Box flexDirection="column" marginRight={1} width={leftWidth} minWidth={16}>
          <DeviceList devices={devices} selected={selected} />
        </Box>
        {selected &&
          <>
            <Box flexDirection="column" flexGrow={1} minWidth={Math.max(40, columns - leftWidth - 2)}>
              <Box width="100%" height={3} paddingLeft={1} borderStyle="single" justifyContent="space-between">
                <Text>Device ID: {devices[selected]?.id}</Text>
              </Box>
              <Box flexGrow={1} flexDirection="row" width={columns - leftWidth - 2}>
                <Box flexGrow={1} paddingLeft={1} paddingRight={1} borderStyle="single" flexDirection="column" minWidth={20}>
                  <Text color="green">Sensors</Text>
                  {devices[selected]?.sensors?.map((s, idx) => (
                    <Box key={idx} justifyContent="space-between">
                      <Text>{s.localId} - {s.type}</Text>
                      <Text>{getSensorReading(s.localId)}</Text>
                    </Box>
                  ))}
                </Box>
                <Box flexGrow={1} paddingLeft={1} borderStyle="single" flexDirection="column" minWidth={20}>
                  <Text color="green">Actuators</Text>
                  {devices[selected]?.actuators?.map((a, idx) => (
                    <Text key={idx}>{a.localId} - {a.type}</Text>
                  ))}
                </Box>
              </Box>
              <Box borderStyle="single" paddingLeft={1} paddingRight={1} flexBasis={Math.max(10, Math.floor(rows * 0.40))}>
                <DeviceLogs sliceCount={-20} logs={
                  selected ? logs[selected] ?? [{}] : [{ log: "No device selected" }]
                } />
              </Box>
            </Box >
          </>
        }
      </Box>
      <Box flexDirection="row-reverse" justifyContent="space-between" borderStyle="single" paddingLeft={1} paddingRight={1} height={3}>
        <Box>
          {selected && devices[selected] &&
            <>
              {devices[selected].cpu && <Text>CPU: {devices[selected].cpu} </Text>}
              {devices[selected].mem && <Text>RAM: {devices[selected].mem} </Text>}
              {devices[selected].wifi && <Text>WFI: {devices[selected].wifi} </Text>}
            </>
          }
        </Box>
        <Text>Controls: j/k navigate — q quit</Text>
      </Box>
    </Box>
  );
}
