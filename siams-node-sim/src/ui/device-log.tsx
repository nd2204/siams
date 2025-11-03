import React from "react";
import { Box, Text } from "ink";
import { LogLevel } from "../data/types";

const logLevelToColor: Record<LogLevel, string> = {
  "Info": "white",
  "Warn": "yellow",
  "Error": "red",
  "Important": "green"
}

export const DeviceLogs: React.FC<{
  logs: { level?: LogLevel, log: string }[],
  sliceCount?: number
}> = ({ logs, sliceCount }) => {
  const tail = logs.slice(sliceCount ?? -10);
  return (
    <Box flexDirection="column" flexGrow={1} flexShrink={1}>
      {tail.map((l, idx) => {
        const parts = (l.log || "").toString().split('\n');
        return (
          <Box key={idx} flexDirection="column">
            {parts.map((p, i) => (
              <Box key={`${idx}-${i}`}>
                <Text color={logLevelToColor[l.level ?? "Info"]}>{p}</Text>
              </Box>
            ))}
          </Box>
        );
      })}
    </Box>
  );
};
