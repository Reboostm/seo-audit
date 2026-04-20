import { NextRequest, NextResponse } from 'next/server';
import { getConfig, updateConfig, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { NICHE_DEFAULTS } from '@/lib/lostRevenue';

const DEFAULT_API_CONFIG = {
  googlePlaces: { enabled: true, quota: 1000, used: 0 },
  serpapi: { enabled: true, quota: 500, used: 0 },
  pageSpeed: { enabled: true },
  ghl: { enabled: true },
};

export async function GET(request: NextRequest) {
  try {
    let config = await getConfig();

    if (!config) {
      config = {
        nicheDefaults: NICHE_DEFAULTS as any,
        apiToggles: DEFAULT_API_CONFIG,
        lastUpdated: new Date(),
      };

      await setDoc(doc(db, 'config', 'defaults'), config);
    }

    return NextResponse.json(config, { status: 200 });
  } catch (error) {
    console.error('Config fetch error:', error);
    return NextResponse.json(
      {
        nicheDefaults: NICHE_DEFAULTS as any,
        apiToggles: DEFAULT_API_CONFIG,
      },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const updatedConfig = {
      nicheDefaults: body.nicheDefaults || (NICHE_DEFAULTS as any),
      apiToggles: body.apiToggles || DEFAULT_API_CONFIG,
      lastUpdated: new Date(),
    };

    await updateConfig(updatedConfig);

    return NextResponse.json(
      { success: true, config: updatedConfig },
      { status: 200 }
    );
  } catch (error) {
    console.error('Config update error:', error);
    return NextResponse.json(
      { error: 'Failed to update config' },
      { status: 500 }
    );
  }
}
