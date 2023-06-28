const msPerUnit = Object.freeze({
  ms: 1,
  s: 1000,
  m: 60000,
  h: 3600000,
  d: 86400000,
  second: 1000,
  day: 86400000,
  hour: 3600000,
  minute: 60000,
  millisecond: 1,
});

/**
 * converts millisecond duration to hh:mm:ss format
 * */
export function formatDurationMsAsHMS(arg: {
  duration: number;
  separator?: string;
  showUnit?: boolean;
  padWithZero?: boolean;
  filterZeroValues?: boolean;
}) {
  let { duration } = arg;
  if (!Number.isInteger(duration) || duration < 0)
    throw new Error(`Duration must be a non negative integer.`);

  const formatted = {
    h: 0,
    m: 0,
    s: 0,
  };

  {
    for (const unit of ["h", "m", "s"] as const) {
      const msInUnit = msPerUnit[unit];
      {
        const result = Math.floor(duration / msInUnit);
        formatted[unit] = result;
      }

      duration = duration % msInUnit;
    }
  }

  const {
    showUnit = false,
    padWithZero = true,
    filterZeroValues = false,
  } = arg;

  let durationUnitPair = Object.entries(formatted).map(([unit, duration]) => ({
    unit,
    duration,
  }));

  if (filterZeroValues)
    durationUnitPair = durationUnitPair.filter(({ duration }) =>
      Boolean(duration)
    );

  return durationUnitPair
    .map(({ unit, duration }) => {
      let formatted =
        padWithZero && duration < 10 ? `0${duration}` : duration.toString();
      if (showUnit) formatted += unit;
      return formatted;
    })
    .join(arg.separator || " ");
}

interface ConvertDurationArgument {
  duration: number;
  toUnit: DurationUnit;
  fromUnit: DurationUnit;
}

export type DurationUnit =
  | "h"
  | "m"
  | "s"
  | "d"
  | "day"
  | "ms"
  | "hour"
  | "minute"
  | "second"
  | "millisecond";

export type ConvertDuration = (arg: ConvertDurationArgument) => number;

export const convertDuration: ConvertDuration = function _convertDuration(arg) {
  const { fromUnit, toUnit, duration } = arg;

  const durationMS = duration * msPerUnit[fromUnit];
  return durationMS / msPerUnit[toUnit];
};
