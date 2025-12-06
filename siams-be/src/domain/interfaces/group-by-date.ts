export const GroupByDateTypeConstants = {
  second: "second",
  minute: "minute",
  hour: "hour",
  day: "day",
  week: "week",
  month: "month"
} as const

export type GroupByDateType = typeof GroupByDateTypeConstants[keyof typeof GroupByDateTypeConstants]
