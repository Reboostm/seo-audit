export const NICHE_DEFAULTS: Record<string, { jobCost: number; callsLostMonthly: number }> = {
  plumber: { jobCost: 250, callsLostMonthly: 15 },
  pest_control: { jobCost: 180, callsLostMonthly: 8 },
  electrician: { jobCost: 300, callsLostMonthly: 12 },
  hvac: { jobCost: 400, callsLostMonthly: 10 },
  locksmith: { jobCost: 200, callsLostMonthly: 6 },
  roofer: { jobCost: 350, callsLostMonthly: 9 },
  carpet_cleaner: { jobCost: 150, callsLostMonthly: 10 },
  lawyer: { jobCost: 500, callsLostMonthly: 5 },
  contractor: { jobCost: 800, callsLostMonthly: 8 },
  realtor: { jobCost: 5000, callsLostMonthly: 3 },
  accountant: { jobCost: 300, callsLostMonthly: 4 },
};

export function calculateLostRevenue(
  rank: number,
  niche: string,
  customJobCost?: number
): { monthly: number; factor: number; description: string } {
  const defaults = NICHE_DEFAULTS[niche] || NICHE_DEFAULTS.plumber;
  const jobCost = customJobCost || defaults.jobCost;
  const callsLostMonthly = defaults.callsLostMonthly;

  let factor = 0;
  let description = '';

  if (rank === 1) {
    factor = 0;
    description = 'You rank #1! Dominating the market.';
  } else if (rank === 2 || rank === 3) {
    factor = 0.3;
    description = `You rank #${rank}. Losing ~30% of potential revenue.`;
  } else if (rank >= 4 && rank <= 5) {
    factor = 0.6;
    description = `You rank #${rank}. Losing ~60% of potential revenue.`;
  } else {
    factor = 0.95;
    description = 'Not ranking in top 5. Losing ~95% of potential revenue.';
  }

  const monthly = Math.round(callsLostMonthly * jobCost * factor);

  return { monthly, factor, description };
}

export function generateLostRevenueMessage(
  rank: number,
  niche: string,
  city: string,
  jobCost: number
): string {
  const { monthly } = calculateLostRevenue(rank, niche, jobCost);
  const rankText = rank === 99 ? 'not ranking' : `ranked #${rank}`;

  return `You're currently ${rankText} in Map Pack for '${niche} in ${city}'. Based on your typical job cost of $${jobCost}, you're losing approximately $${monthly.toLocaleString()}/month in revenue.`;
}
