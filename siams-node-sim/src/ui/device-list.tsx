import React from "react";
import { Box, Text } from "ink";
import { type DevInfo } from "../data/types";

export const DeviceList: React.FC<{
  devices: Record<string, DevInfo>,
  selected?: string
}> =
  ({ devices, selected }) => {
    const rows = Object.values(devices);
    return (
      <>
        <Box borderStyle="single" paddingLeft={1}>
          <Text bold>Devices ({rows.length})</Text>
        </Box>
        <Box borderStyle="single" flexDirection="column" flexGrow={1}>
          {rows.map((d) => (
            <Box
              borderColor={d.tempId === selected ? "green" : "white"}
              borderStyle="single" width="100%" paddingLeft={1}>
              <Text color={d.tempId === selected ? "green" : "white"} >
                {d.tempId} {d.registered && `(${d.id.slice(0, 8)})`} {d.lastMessage && `- ${d.lastMessage}`}
              </Text>
            </Box>
          ))}
        </Box>
      </>
    );
  };
