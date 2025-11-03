import { PinoPretty } from "pino-pretty";

// Map full level -> single character
const getColorizedLogLabel = (level: number, colors: any): string => {
  const levelMap: Record<number, { clr: CallableFunction; lbl: string }> = {
    "10": { clr: colors.white, lbl: "T" },
    "20": { clr: colors.cyan, lbl: "D" },
    "30": { clr: colors.green, lbl: "I" },
    "40": { clr: colors.yellow, lbl: "W" },
    "50": { clr: colors.red, lbl: "E" },
    "60": { clr: colors.bgRed, lbl: "F" },
  } as const;

  const lbl = levelMap[level].lbl;
  const clr = levelMap[level].clr;
  return clr(`|${lbl}|`);
};

function formatTimestamp() {
  const date = new Date();
  const YYYY = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const DD = String(date.getDate()).padStart(2, "0");
  return `${YYYY}-${MM}-${DD}`;
}

export default (opts?: any) => {
  return PinoPretty({
    ...opts,
    colorize: true,
    customPrettifiers: {
      level: (logLevel: number, _key: string, _log, { colors }): string =>
        getColorizedLogLabel(logLevel, colors),
      name: (name: string, _key: string, _log, { colors }) => colors.blue(name),
      pid: (pid: string) => pid,
      tag: () => undefined,
      time: (timestamp) => `[${formatTimestamp()}][${timestamp}]`,
    },
    messageFormat: (log, messageKey, _levelLabel, { colors }) => {
      return `${log.tag ? colors.blue(`|${log.tag}| `) : ""}${log[messageKey]}`;
    },
  });
}
