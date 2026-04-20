export interface PageSpeedData {
  score: number;
  metrics: {
    largestContentfulPaint: number;
    firstInputDelay: number;
    cumulativeLayoutShift: number;
  };
}

export async function getPageSpeed(url: string): Promise<PageSpeedData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  try {
    const psUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&category=PERFORMANCE`;

    const response = await fetch(psUrl);
    const data = await response.json();

    if (!data.lighthouseResult) return null;

    const scores = data.lighthouseResult.categories;
    const metrics = data.lighthouseResult.audits;

    return {
      score: Math.round(scores.performance.score * 100),
      metrics: {
        largestContentfulPaint: metrics['largest-contentful-paint']?.numericValue || 0,
        firstInputDelay: metrics['first-input-delay']?.numericValue || 0,
        cumulativeLayoutShift: metrics['cumulative-layout-shift']?.numericValue || 0,
      },
    };
  } catch (error) {
    console.error('PageSpeed error:', error);
    return null;
  }
}
