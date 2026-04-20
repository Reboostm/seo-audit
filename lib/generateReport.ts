import { searchGMBListing, calculateGMBScore } from './googleplaces';
import { getMapPackRanking } from './serpapi';
import { getPageSpeed } from './pagespeed';
import { calculateLostRevenue, NICHE_DEFAULTS } from './lostRevenue';
import { generateHTMLReport, ReportData } from './pdfGenerator';

export interface ReportInput {
  businessName: string;
  niche: string;
  city: string;
  state: string;
  email: string;
  customJobCost?: number;
  website?: string;
}

export async function generateReport(input: ReportInput) {
  const { businessName, niche, city, state, email, customJobCost, website } = input;

  try {
    // Parallel API calls
    const [gmbData, mapPackData, speedData] = await Promise.all([
      searchGMBListing(businessName, city),
      getMapPackRanking(businessName, niche, city, state),
      website ? getPageSpeed(website) : Promise.resolve(null),
    ]);

    // Calculate scores
    const gmbScore = gmbData ? calculateGMBScore(gmbData) : 0;
    const mapPackRank = mapPackData?.rank || 99;

    // Calculate lost revenue
    const defaults = NICHE_DEFAULTS[niche] || NICHE_DEFAULTS.plumber;
    const jobCost = customJobCost || defaults.jobCost;
    const { monthly: lostRevenueMonthly } = calculateLostRevenue(mapPackRank, niche, customJobCost);

    // Generate action items
    const actionItems = [];
    if (!gmbData || gmbData.photoCount < 20) {
      actionItems.push({ title: 'Add more photos to GMB (aim for 30+)', status: 'missing' });
    }
    if (!gmbData || gmbData.reviewCount < 10) {
      actionItems.push({ title: 'Build review generation strategy', status: 'missing' });
    }
    if (mapPackRank > 3) {
      actionItems.push({ title: 'Optimize GMB profile completeness', status: 'missing' });
    }
    if (mapPackRank > 1) {
      actionItems.push({ title: 'Post to GMB 2-3 times per week', status: 'missing' });
    }
    if (speedData && speedData.score < 70) {
      actionItems.push({ title: 'Improve website loading speed', status: 'missing' });
    }
    if (gmbData && gmbData.rating >= 4) {
      actionItems.push({ title: '✅ Good GMB rating - maintain and improve', status: 'complete' });
    }

    const reportData: ReportData = {
      businessName,
      niche,
      city,
      state,
      mapPackRank,
      gmbScore,
      gmbReviewCount: gmbData?.reviewCount || 0,
      gmbRating: gmbData?.rating || 0,
      gmbPhotoCount: gmbData?.photoCount || 0,
      websiteSpeed: speedData?.score || 0,
      competitors: mapPackData?.competitors || [],
      lostRevenueMonthly,
      actionItems,
    };

    const htmlReport = generateHTMLReport(reportData);

    return {
      success: true,
      reportData,
      htmlReport,
      emailSubject: `Your Free SEO Audit Report: ${businessName} in ${city}, ${state}`,
      emailBody: htmlReport,
    };
  } catch (error) {
    console.error('Report generation error:', error);
    return {
      success: false,
      error: String(error),
    };
  }
}
