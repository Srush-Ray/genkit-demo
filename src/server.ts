import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import { travelPlanFlow } from './index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware
app.use(express.json());

// Serve static assets from public/ folder (at project root)
const publicDir = path.resolve(__dirname, '../public');
app.use(express.static(publicDir));

/**
 * Health check & status endpoint
 */
app.get('/api/health', (req: Request, res: Response) => {
  const hasApiKey = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY);
  res.json({
    status: 'ok',
    appName: 'SoloTravelGenie',
    mode: hasApiKey ? 'live-gemini-flash' : 'local-tool-engine',
    apiKeyConfigured: hasApiKey,
    originCity: 'Pune, Maharashtra',
  });
});

/**
 * Sample popular destinations for quick one-click inspiration
 */
app.get('/api/sample-destinations', (req: Request, res: Response) => {
  res.json([
    {
      name: 'Goa',
      travelDates: 'Nov 15 - Nov 20',
      tagline: 'Sun-kissed beaches, coastal shacks & Portuguese heritage',
      badge: 'Popular Coastal',
      transitHint: '1h direct flight / overnight Goa Express',
    },
    {
      name: 'Jaipur',
      travelDates: 'Dec 1 - Dec 5',
      tagline: 'Royal palaces, pink sandstone bazaars & desert winter glow',
      badge: 'Heritage & Culture',
      transitHint: '1h 45m direct flight / Superfast train',
    },
    {
      name: 'Udaipur',
      travelDates: 'Dec 10 - Dec 14',
      tagline: 'Shimmering lake palaces, sunset havelis & peaceful art cafes',
      badge: 'Romantic Heritage',
      transitHint: 'Direct flight / connected sleeper',
    },
    {
      name: 'Pondicherry',
      travelDates: 'Jan 12 - Jan 16',
      tagline: 'Breezy French colonial lanes, beach promenade & Auroville',
      badge: 'Coastal & Wellness',
      transitHint: 'Fly to Chennai + scenic coastal cab',
    },
    {
      name: 'Manali',
      travelDates: 'Dec 22 - Dec 28',
      tagline: 'Snow-capped peaks, apple orchards & cozy wood-fired cafes',
      badge: 'Himalayan Escape',
      transitHint: 'Flight to Chandigarh + scenic hill highway',
    },
    {
      name: 'Gokarna',
      travelDates: 'Nov 25 - Nov 29',
      tagline: 'Untamed cliff trails, Om Beach & serene sunset yoga',
      badge: 'Bohemian Nature',
      transitHint: 'Direct KSRTC AC Sleeper from Swargate',
    },
  ]);
});

/**
 * Primary flow execution endpoint
 */
app.post('/api/plan', async (req: Request, res: Response) => {
  try {
    const { destination, travelDates } = req.body;

    if (!destination || typeof destination !== 'string') {
      return res.status(400).json({ error: 'destination is required and must be a string' });
    }

    const dates = travelDates && typeof travelDates === 'string' ? travelDates : 'Upcoming 4-day trip';

    console.log(`[API /api/plan] Generating solo plan for "${destination}" (${dates}) from Pune...`);
    const plan = await travelPlanFlow({ destination, travelDates: dates });

    return res.json({ success: true, plan });
  } catch (err: any) {
    console.error('[API /api/plan Error]:', err);
    return res.status(500).json({
      error: 'Failed to generate travel plan',
      details: err?.message || String(err),
    });
  }
});

// Fallback to index.html for single-page routing
app.use((req: Request, res: Response) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Start Express Server
app.listen(PORT, () => {
  console.log('='.repeat(70));
  console.log(`🧞 SoloTravelGenie Web Application is live!`);
  console.log(`📍 Web UI:      http://localhost:${PORT}`);
  console.log(`📍 Origin City: Pune, Maharashtra`);
  console.log(`📍 Mode:        ${process.env.GEMINI_API_KEY ? 'Live Gemini 2.0 Flash' : 'Simulated Tool Engine'}`);
  console.log('='.repeat(70));
});
