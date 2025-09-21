import pretty from "pino-pretty";

// Map full level -> single character
const getColorizedLogLabel = (level, colors) => {
  const levelMap = {
    10: { lbl: "T", clr: colors.white },
    20: { lbl: "D", clr: colors.cyan },
    30: { lbl: "I", clr: colors.green },
    40: { lbl: "W", clr: colors.yellow },
    50: { lbl: "E", clr: colors.red },
    60: { lbl: "F", clr: colors.bgRed },
  };

  let config = levelMap[level];
  return config.clr(`|${config.lbl}|`);
};

function formatTimestamp() {
  const date = new Date();
  const YYYY = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const DD = String(date.getDate()).padStart(2, "0");
  return `${YYYY}-${MM}-${DD}`;
}

export default (opts) =>
  pretty({
    ...opts,
    messageFormat: (log, messageKey, levelLabel, { colors }) => {
      let tag = log["tag"];
      return `${tag ? colors.blue(`|${tag}| `) : ""}${log[messageKey]}`;
    },
    customPrettifiers: {
      time: (timestamp) => `[${formatTimestamp()}][${timestamp}]`,
      level: (logLevel, key, log, { label, labelColorized, colors }) =>
        `${getColorizedLogLabel(logLevel, colors)}`,
      hostname: (hostname) => `MY HOST: ${hostname}`,
      pid: (pid) => pid,
      name: (name, key, log, { colors }) => `${colors.blue(name)}`,
      caller: (caller, key, log, { colors }) => `${colors.greenBright(caller)}`,
      ["tag"]: (output, keyName, logObj, extras) => undefined,
    },
  });
