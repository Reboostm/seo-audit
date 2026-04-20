export interface GMBData {
  name: string;
  rating: number;
  reviewCount: number;
  photoCount: number;
  address: string;
  phone?: string;
}

export async function searchGMBListing(
  businessName: string,
  city: string
): Promise<GMBData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  try {
    const query = `${businessName} ${city}`;
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) return null;

    const place = data.results[0];
    const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,rating,user_ratings_total,photos,formatted_address,formatted_phone_number&key=${apiKey}`;

    const detailResponse = await fetch(detailUrl);
    const detailData = await detailResponse.json();

    if (!detailData.result) return null;

    const result = detailData.result;
    return {
      name: result.name,
      rating: result.rating || 0,
      reviewCount: result.user_ratings_total || 0,
      photoCount: result.photos?.length || 0,
      address: result.formatted_address || '',
      phone: result.formatted_phone_number,
    };
  } catch (error) {
    console.error('GMB search error:', error);
    return null;
  }
}

export function calculateGMBScore(data: GMBData): number {
  let score = 50;
  if (data.photoCount >= 30) score += 20;
  else if (data.photoCount >= 15) score += 15;
  else if (data.photoCount > 0) score += 10;

  if (data.reviewCount >= 50) score += 20;
  else if (data.reviewCount >= 20) score += 15;
  else if (data.reviewCount > 0) score += 10;

  if (data.rating >= 4.5) score += 10;
  else if (data.rating >= 4) score += 8;

  return Math.min(score, 100);
}
