import {
  getCorrectTimestampValue,
  getUnit,
  relativeTimeFormatter,
} from './relative-time-formatter';

describe('getCorrectTimestampValue', () => {
  it('should return the value in minutes when the time diff < one minute', () => {
    const inputTime = new Date(2023, 2, 1, 0, 0, 0);
    const curTime = new Date(2023, 2, 1, 0, 0, 39);

    expect(getCorrectTimestampValue(inputTime, curTime)).toBe(0);
  });
  it('should return the value in minutes when the time diff < one hour', () => {
    const inputTime = new Date(2023, 2, 1, 0, 0, 0);
    const curTime = new Date(2023, 2, 1, 0, 10, 0);

    expect(getCorrectTimestampValue(inputTime, curTime)).toBe(10);
  });
  it('should return the value in hours when the time diff < one day', () => {
    const inputTime = new Date(2023, 2, 1, 0, 0, 0);
    const curTime = new Date(2023, 2, 1, 18, 0, 0);

    expect(getCorrectTimestampValue(inputTime, curTime)).toBe(18);
  });
  it('should return the value in days when the time diff < one week', () => {
    const inputTime = new Date(2023, 2, 1, 0, 0, 0);
    const curTime = new Date(2023, 2, 4, 0, 0, 0);

    expect(getCorrectTimestampValue(inputTime, curTime)).toBe(3);
  });
  it('should return the value in weeks when the time diff < one month', () => {
    const inputTime = new Date(2023, 2, 1, 0, 0, 0);
    const curTime = new Date(2023, 2, 15, 0, 0, 0);

    expect(getCorrectTimestampValue(inputTime, curTime)).toBe(2);
  });
  it('should return the value in months when the time diff < one year', () => {
    const inputTime = new Date(2023, 2, 0, 0, 0, 0);
    const curTime = new Date(2023, 9, 0, 0, 0, 0);

    expect(getCorrectTimestampValue(inputTime, curTime)).toBe(7);
  });
  it('should return the value in years when the time diff > a year', () => {
    const inputTime = new Date(2023, 2, 0, 0, 0, 0);
    const curTime = new Date(2025, 2, 0, 0, 0, 0);

    expect(getCorrectTimestampValue(inputTime, curTime)).toBe(2);
  });
});

describe('getUnit', () => {
  it('should return the correct value when the time diff < one minute', () => {
    const inputTime = new Date(2023, 2, 1, 0, 0, 39);
    const curTime = new Date(2023, 2, 1, 0, 0, 0);

    expect(getUnit(inputTime, curTime)).toBe('minute');
  });
  it('should return the correct value when the time diff < one hour', () => {
    const inputTime = new Date(2023, 2, 1, 0, 0, 0);
    const curTime = new Date(2023, 2, 1, 0, 1, 0);

    expect(getUnit(inputTime, curTime)).toBe('minute');
  });
  it('should return the correct value when the time diff < one day', () => {
    const inputTime = new Date(2023, 2, 1, 0, 0, 0);
    const curTime = new Date(2023, 2, 1, 12, 0, 0);

    expect(getUnit(inputTime, curTime)).toBe('hour');
  });
  it('should return the correct value when the time diff < one week', () => {
    const inputTime = new Date(2023, 2, 1, 0, 0, 0);
    const curTime = new Date(2023, 2, 4, 0, 0, 0);

    expect(getUnit(inputTime, curTime)).toBe('day');
  });
  it('should return the correct value when the time diff < one month', () => {
    const inputTime = new Date(2023, 2, 1, 0, 0, 0);
    const curTime = new Date(2023, 2, 20, 0, 0, 0);

    expect(getUnit(inputTime, curTime)).toBe('week');
  });
  it('should return the correct value when the time diff < one year', () => {
    const inputTime = new Date(2023, 2, 1, 0, 0, 0);
    const curTime = new Date(2023, 3, 1, 0, 0, 0);

    expect(getUnit(inputTime, curTime)).toBe('month');
  });
  it('should return the correct value when the time diff > a year', () => {
    const inputTime = new Date(2023, 1, 1, 0, 0, 0);
    const curTime = new Date(2024, 1, 1, 0, 0, 0);

    expect(getUnit(inputTime, curTime)).toBe('year');
  });
});

describe('relativeTimeFormatter', () => {
  it('should returns correct timestamp string', () => {
    const inputTime = new Date(2023, 1, 1, 0, 0, 0);
    const curTime = new Date(2023, 1, 24, 0, 0, 0);

    expect(relativeTimeFormatter(inputTime, curTime)).toBe('in 3 wk.');
  });
});
