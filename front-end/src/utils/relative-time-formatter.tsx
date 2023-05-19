const ONE_MILLISECOND = 1;
const ONE_SECOND = 1000 * ONE_MILLISECOND;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_WEEK = 7 * ONE_DAY;
const ONE_MONTH = 30 * ONE_DAY;
const ONE_YEAR = 12 * ONE_MONTH;

const relativeTimeFormat = new Intl.RelativeTimeFormat('en', {
  style: 'short',
});

export function getCorrectTimestampValue(inputTime: Date, currentTime: Date) {
  const timeDiff = currentTime.getTime() - inputTime.getTime();

  if (timeDiff < ONE_MINUTE) return Math.floor(timeDiff / ONE_MINUTE);
  if (timeDiff < ONE_HOUR) return Math.floor(timeDiff / ONE_MINUTE);
  if (timeDiff < ONE_DAY) return Math.floor(timeDiff / ONE_HOUR);
  if (timeDiff < ONE_WEEK) return Math.floor(timeDiff / ONE_DAY);
  if (timeDiff < ONE_MONTH) return Math.floor(timeDiff / ONE_WEEK);
  if (timeDiff < ONE_YEAR) return Math.floor(timeDiff / ONE_MONTH);

  return Math.round(timeDiff / ONE_YEAR);
}

export function getUnit(
  inputTime: Date,
  currentTime: Date,
):
  | 'year'
  | 'quarter'
  | 'month'
  | 'week'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second' {
  const timeDiff = Math.abs(currentTime.getTime() - inputTime.getTime());

  if (timeDiff < ONE_MINUTE) return 'minute';
  if (timeDiff < ONE_HOUR) return 'minute';
  if (timeDiff < ONE_DAY) return 'hour';
  if (timeDiff < ONE_WEEK) return 'day';
  if (timeDiff < ONE_MONTH) return 'week';
  if (timeDiff < ONE_YEAR) return 'month';

  return 'year';
}

export function relativeTimeFormatter(
  inputTime: Date,
  currentTime: Date = new Date(),
) {
  return relativeTimeFormat.format(
    getCorrectTimestampValue(inputTime, currentTime),
    getUnit(inputTime, currentTime),
  );
}
