export interface CompetitorData {
  name: string;
  rank: number;
  rating: number;
  reviewCount: number;
}

export async function getMapPackRanking(
  businessName: string,
  niche: string,
  city: string,
  state: string
): Promise<{ rank: number; competitors: CompetitorData[] } | null> {
  const apiKey = process.env.SERPAPI_API_KEY;
  if (!apiKey) return null;

  try {
    const query = `${niche} near ${city} ${state}`;
    const url = `https://serpapi.com/search?q=${encodeURIComponent(query)}&type=place&api_key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.place_results || data.place_results.length === 0) {
      return { rank: 99, competitors: [] };
    }

    const competitors: CompetitorData[] = data.place_results.slice(0, 3).map(
      (place: any, index: number) => ({
        name: place.title || place.name || 'Unknown',
        rank: index + 1,
        rating: place.rating || 0,
        reviewCount: place.review_count || 0,
      })
    );

    let userRank = 99;
    const userIndex = competitors.findIndex(
      (c) => c.name.toLowerCase().includes(businessName.toLowerCase())
    );
    if (userIndex !== -1) {
      userRank = competitors[userIndex].rank;
    }

    return { rank: userRank, competitors };
  } catch (error) {
    console.error('SerpAPI error:', error);
    return null;
  }
}
