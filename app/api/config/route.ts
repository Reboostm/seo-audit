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

    // Handle API key test requests
    if (body.testApi && body.key) {
      return testApiConnection(body.testApi, body.key);
    }

    const updatedConfig = {
      nicheDefaults: body.nicheDefaults || (NICHE_DEFAULTS as any),
      apiToggles: body.apiToggles || DEFAULT_API_CONFIG,
      apiKeys: body.apiKeys || {},
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

async function testApiConnection(apiName: string, apiKey: string): Promise<NextResponse> {
  try {
    switch (apiName) {
      case 'googlePlaces': {
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=test&key=${apiKey}`;
        const res = await fetch(url);
        return res.ok
          ? NextResponse.json({ success: true, message: 'Google Places API connected' }, { status: 200 })
          : NextResponse.json({ success: false, message: 'Invalid API key' }, { status: 400 });
      }

      case 'serpapi': {
        const url = `https://serpapi.com/search?q=test&api_key=${apiKey}`;
        const res = await fetch(url);
        return res.ok
          ? NextResponse.json({ success: true, message: 'SerpAPI connected' }, { status: 200 })
          : NextResponse.json({ success: false, message: 'Invalid API key' }, { status: 400 });
      }

      case 'pageSpeed': {
        const url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://google.com&key=${apiKey}`;
        const res = await fetch(url);
        return res.ok
          ? NextResponse.json({ success: true, message: 'PageSpeed Insights connected' }, { status: 200 })
          : NextResponse.json({ success: false, message: 'Invalid API key' }, { status: 400 });
      }

      case 'ghl': {
        const res = await fetch('https://api.gohighlevel.com/v1/contacts/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });
        return res.ok
          ? NextResponse.json({ success: true, message: 'GoHighLevel API connected' }, { status: 200 })
          : NextResponse.json({ success: false, message: 'Invalid API key' }, { status: 400 });
      }

      default:
        return NextResponse.json({ success: false, message: 'Unknown API' }, { status: 400 });
    }
  } catch (error) {
    console.error(`Error testing ${apiName}:`, error);
    return NextResponse.json({ success: false, message: 'Connection test failed' }, { status: 500 });
  }
}
