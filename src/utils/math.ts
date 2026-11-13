// Poisson PMF: P(X = k) = (λ^k * e^-λ) / k!
export function poissonPMF(lambda: number, k: number): number {
  if (lambda <= 0 || k < 0) return 0;
  let logP = -lambda + k * Math.log(lambda);
  for (let i = 1; i <= k; i++) logP -= Math.log(i);
  return Math.exp(logP);
}

// Cumulative Poisson: P(X <= k)
export function poissonCDF(lambda: number, k: number): number {
  let sum = 0;
  for (let i = 0; i <= k; i++) sum += poissonPMF(lambda, i);
  return Math.min(sum, 1);
}

// P(X >= k)
export function poissonExceedance(lambda: number, k: number): number {
  return 1 - poissonCDF(lambda, k - 1);
}

// M/M/c Erlang-C formula for P(wait > 0)
function erlangC(lambda: number, mu: number, c: number): number {
  const rho = lambda / (c * mu);
  if (rho >= 1) return 1;
  const a = lambda / mu;
  let sum = 0;
  let factorial = 1;
  for (let n = 0; n < c; n++) {
    if (n > 0) factorial *= n;
    sum += Math.pow(a, n) / factorial;
  }
  let cFactorial = factorial * c;
  const lastTerm = Math.pow(a, c) / (cFactorial * (1 - rho));
  return lastTerm / (sum + lastTerm);
}

// Expected waiting time in queue (hours)
export function expectedWaitTime(lambda: number, mu: number, c: number): number {
  const rho = lambda / (c * mu);
  if (rho >= 1 || c <= 0) return Infinity;
  const ec = erlangC(lambda, mu, c);
  return ec / (c * mu - lambda);
}

// Minimum staff to meet target wait time (minutes)
export function recommendStaff(lambda: number, mu: number, targetWaitMin: number): number {
  const targetWaitHr = targetWaitMin / 60;
  for (let c = 1; c <= 50; c++) {
    const rho = lambda / (c * mu);
    if (rho < 1) {
      const wq = expectedWaitTime(lambda, mu, c);
      if (wq <= targetWaitHr) return c;
    }
  }
  return 50;
}

export function downloadCSV(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(r => headers.map(h => String(r[h] ?? '')).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
