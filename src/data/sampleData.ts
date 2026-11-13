export const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const hourlyArrivals: { hour: number; label: string; arrivals: number; predicted: number }[] = [
  { hour: 0, label: '12am', arrivals: 4, predicted: 4.2 },
  { hour: 1, label: '1am', arrivals: 3, predicted: 3.1 },
  { hour: 2, label: '2am', arrivals: 2, predicted: 2.4 },
  { hour: 3, label: '3am', arrivals: 2, predicted: 2.1 },
  { hour: 4, label: '4am', arrivals: 3, predicted: 2.8 },
  { hour: 5, label: '5am', arrivals: 5, predicted: 4.9 },
  { hour: 6, label: '6am', arrivals: 9, predicted: 8.7 },
  { hour: 7, label: '7am', arrivals: 14, predicted: 13.5 },
  { hour: 8, label: '8am', arrivals: 18, predicted: 17.8 },
  { hour: 9, label: '9am', arrivals: 22, predicted: 21.4 },
  { hour: 10, label: '10am', arrivals: 25, predicted: 24.6 },
  { hour: 11, label: '11am', arrivals: 27, predicted: 26.9 },
  { hour: 12, label: '12pm', arrivals: 24, predicted: 23.8 },
  { hour: 13, label: '1pm', arrivals: 21, predicted: 20.5 },
  { hour: 14, label: '2pm', arrivals: 19, predicted: 18.9 },
  { hour: 15, label: '3pm', arrivals: 23, predicted: 22.7 },
  { hour: 16, label: '4pm', arrivals: 26, predicted: 25.3 },
  { hour: 17, label: '5pm', arrivals: 28, predicted: 27.6 },
  { hour: 18, label: '6pm', arrivals: 24, predicted: 23.4 },
  { hour: 19, label: '7pm', arrivals: 20, predicted: 19.8 },
  { hour: 20, label: '8pm', arrivals: 16, predicted: 15.9 },
  { hour: 21, label: '9pm', arrivals: 12, predicted: 11.7 },
  { hour: 22, label: '10pm', arrivals: 8, predicted: 7.8 },
  { hour: 23, label: '11pm', arrivals: 6, predicted: 5.9 },
];

export const dailyArrivals: { day: string; arrivals: number; predicted: number }[] = [
  { day: 'Mon', arrivals: 312, predicted: 308 },
  { day: 'Tue', arrivals: 287, predicted: 291 },
  { day: 'Wed', arrivals: 305, predicted: 299 },
  { day: 'Thu', arrivals: 298, predicted: 302 },
  { day: 'Fri', arrivals: 341, predicted: 337 },
  { day: 'Sat', arrivals: 378, predicted: 372 },
  { day: 'Sun', arrivals: 356, predicted: 361 },
];

export const weeklyHeatmap: Record<string, number[]> = {
  Mon: [3, 2, 2, 1, 2, 4, 8, 13, 17, 20, 23, 25, 22, 19, 17, 21, 24, 26, 22, 18, 14, 11, 7, 5],
  Tue: [3, 2, 1, 1, 2, 4, 7, 12, 16, 19, 22, 24, 21, 18, 16, 20, 23, 25, 21, 17, 13, 10, 7, 4],
  Wed: [4, 2, 2, 2, 3, 5, 9, 14, 18, 22, 25, 27, 24, 21, 19, 23, 26, 28, 24, 20, 16, 12, 8, 6],
  Thu: [3, 2, 2, 1, 2, 4, 8, 13, 17, 21, 24, 26, 23, 20, 18, 22, 25, 27, 23, 19, 15, 11, 7, 5],
  Fri: [5, 3, 2, 2, 3, 5, 10, 15, 20, 24, 27, 29, 26, 23, 21, 25, 28, 30, 26, 22, 18, 14, 9, 7],
  Sat: [6, 4, 3, 3, 4, 6, 11, 17, 22, 27, 30, 32, 29, 26, 24, 28, 31, 33, 29, 25, 20, 16, 11, 8],
  Sun: [5, 3, 3, 2, 3, 5, 10, 16, 21, 25, 28, 30, 27, 24, 22, 26, 29, 31, 27, 23, 18, 14, 10, 7],
};

export const patientRecords = Array.from({ length: 200 }, (_, i) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const day = days[Math.floor(Math.random() * 7)];
  const hour = Math.floor(Math.random() * 24);
  const base = hourlyArrivals[hour].arrivals;
  const arrivals = Math.max(1, Math.round(base + (Math.random() - 0.5) * 4));
  return { id: i + 1, day, hour, label: hourlyArrivals[hour].label, arrivals };
});

export const modelMetrics = {
  mae: 1.24,
  rmse: 1.67,
  r2: 0.943,
  mape: 5.8,
};

export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
