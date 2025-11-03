// import React from "react";
// import { Box, Text } from "ink";
// import { DeviceLogs } from "./device-log";
// import { DevInfo } from "./device-info";
// import { LogLevel } from "src/device";
//
// export const DeviceBlock: React.FC<{
//   selected?: string,
//   device: DevInfo,
//   logs: { level?: LogLevel, log: string }[]
// }> =
//   ({ device, logs, selected }) => {
//     return (
//       <>
//         <Box
//           height={12}
//           width="50%"
//           borderStyle="single"
//           borderColor={device.tempId === selected ? "green" : "grey"}
//           paddingLeft={1}
//           paddingRight={1}
//           flexDirection="column"
//         >
//           <Text color="green">{device.id}{device.registered && " [registered]"}</Text>
//           <DeviceLogs logs={logs} />
//         </Box >
//       </>
//     );
//   };
