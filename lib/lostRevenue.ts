export const NICHE_DEFAULTS: Record<string, { jobCost: number; callsLostMonthly: number }> = {
  // Home Services
  plumber: { jobCost: 250, callsLostMonthly: 15 },
  electrician: { jobCost: 300, callsLostMonthly: 12 },
  hvac: { jobCost: 400, callsLostMonthly: 10 },
  roofer: { jobCost: 500, callsLostMonthly: 8 },
  painter: { jobCost: 200, callsLostMonthly: 10 },
  handyman: { jobCost: 150, callsLostMonthly: 12 },
  contractor: { jobCost: 800, callsLostMonthly: 8 },
  landscaper: { jobCost: 350, callsLostMonthly: 12 },
  tree_service: { jobCost: 400, callsLostMonthly: 8 },
  pool_service: { jobCost: 150, callsLostMonthly: 10 },
  chimney_sweep: { jobCost: 250, callsLostMonthly: 6 },

  // Cleaning Services
  pest_control: { jobCost: 180, callsLostMonthly: 8 },
  house_cleaning: { jobCost: 200, callsLostMonthly: 12 },
  carpet_cleaner: { jobCost: 150, callsLostMonthly: 10 },
  window_cleaning: { jobCost: 180, callsLostMonthly: 8 },
  pressure_washing: { jobCost: 200, callsLostMonthly: 10 },

  // Auto Services
  auto_mechanic: { jobCost: 350, callsLostMonthly: 14 },
  auto_detailing: { jobCost: 120, callsLostMonthly: 15 },
  car_wash: { jobCost: 25, callsLostMonthly: 40 },
  tire_shop: { jobCost: 200, callsLostMonthly: 12 },

  // Security & Services
  locksmith: { jobCost: 200, callsLostMonthly: 6 },
  security_system: { jobCost: 500, callsLostMonthly: 4 },

  // Professional Services
  lawyer: { jobCost: 500, callsLostMonthly: 5 },
  accountant: { jobCost: 300, callsLostMonthly: 4 },
  dentist: { jobCost: 250, callsLostMonthly: 8 },
  chiropractor: { jobCost: 150, callsLostMonthly: 10 },
  physical_therapist: { jobCost: 120, callsLostMonthly: 8 },
  veterinarian: { jobCost: 200, callsLostMonthly: 12 },

  // Beauty & Wellness
  hair_salon: { jobCost: 80, callsLostMonthly: 20 },
  nail_salon: { jobCost: 60, callsLostMonthly: 25 },
  spa: { jobCost: 150, callsLostMonthly: 10 },
  massage_therapy: { jobCost: 100, callsLostMonthly: 12 },
  personal_trainer: { jobCost: 80, callsLostMonthly: 10 },
  yoga_studio: { jobCost: 120, callsLostMonthly: 8 },

  // Real Estate & Property
  realtor: { jobCost: 5000, callsLostMonthly: 3 },
  property_manager: { jobCost: 800, callsLostMonthly: 5 },
  home_inspector: { jobCost: 400, callsLostMonthly: 4 },

  // Pet Services
  pet_grooming: { jobCost: 80, callsLostMonthly: 15 },
  pet_training: { jobCost: 200, callsLostMonthly: 6 },
  dog_daycare: { jobCost: 40, callsLostMonthly: 20 },

  // Business Services
  web_design: { jobCost: 1500, callsLostMonthly: 3 },
  digital_marketing: { jobCost: 800, callsLostMonthly: 4 },
  tax_preparation: { jobCost: 300, callsLostMonthly: 5 },
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
