import { genkit } from 'genkit';
import { googleAI, gemini20Flash } from '@genkit-ai/googleai';
import * as dotenv from 'dotenv';
import {
  TravelPlanInputSchema,
  TravelPlanOutputSchema,
  type TravelPlanInput,
  type TravelPlanOutput,
} from './schemas.js';
import { createSoloTravelTools } from './tools.js';

// Load environment variables from .env
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

/**
 * Initialize Genkit with Google AI plugin and default model (Gemini 2.0 Flash)
 * when API key is provided, or initialize local runtime gracefully.
 */
export const ai = genkit({
  plugins: apiKey ? [googleAI({ apiKey })] : [],
  ...(apiKey ? { model: gemini20Flash } : {}),
});

/**
 * Register the local/simulated Genkit Tools
 */
export const { fetchDestinationWeather, fetchLocalNews } = createSoloTravelTools(ai);

/**
 * Helper to build a high-quality deterministic fallback plan
 * when Gemini API key is not yet set or during offline testing.
 */
async function generateLocalFallbackPlan(
  destination: string,
  travelDates: string
): Promise<TravelPlanOutput> {
  // Execute tools to get real tool output data
  const weather = await fetchDestinationWeather({ destination });
  const news = await fetchLocalNews({ destination });

  const destLower = destination.toLowerCase();

  // Curated Pune transit options tailored to destination
  let transitOptions = [
    {
      mode: 'Flight',
      details: `Direct or 1-stop flight from Pune Airport (PNQ) to nearest airport for ${destination} (IndiGo, Air India Express, or Akasa Air).`,
      estimatedDuration: '1 hr 15 mins to 2 hrs 30 mins',
      approximateCost: '₹3,500 - ₹7,000 one-way',
      recommendationNote: 'Book 3-4 weeks in advance; morning departures from PNQ avoid runway delays.',
    },
    {
      mode: 'Train',
      details: `Express/Superfast train from Pune Junction (PUNE) or Shivaji Nagar directly towards ${destination}.`,
      estimatedDuration: '7 to 14 hours (overnight sleeper or 3AC recommended)',
      approximateCost: '₹800 - ₹2,200',
      recommendationNote: 'Opt for 3AC or 2AC coaches; IRCTC Tatkal is available 1 day prior at 10 AM.',
    },
    {
      mode: 'Road/Bus',
      details: `Multi-axle Volvo AC Sleeper bus departing from Swargate, Wakad, or Pune Railway Station to ${destination}.`,
      estimatedDuration: '8 to 12 hours',
      approximateCost: '₹1,200 - ₹2,500',
      recommendationNote: 'Choose well-reviewed operators like KSRTC, Paulo, or Zingbus with GPS tracking and live status.',
    },
  ];

  if (destLower.includes('goa')) {
    transitOptions = [
      {
        mode: 'Train',
        details: 'Goa Express (Train #12780) departing Pune Jn (PUNE) daily at 16:35, arriving Madgaon (MAO) next morning at 05:40; or Vande Bharat Express from CSMT/Pune.',
        estimatedDuration: '13 hours (overnight scenic ghats)',
        approximateCost: '₹1,150 (3AC) - ₹1,650 (2AC)',
        recommendationNote: 'Scenic journey through Braganza Ghats passing Dudhsagar Waterfalls. Perfect for a safe, relaxed overnight journey.',
      },
      {
        mode: 'Flight',
        details: 'Direct flights from Pune Airport (PNQ) to Goa Dabolim (GOI) or Mopa Manohar International Airport (GOX) via IndiGo / Fly91.',
        estimatedDuration: '1 hour direct flight',
        approximateCost: '₹2,800 - ₹4,800',
        recommendationNote: 'Mopa (GOX) is closer to North Goa (Ashwem, Anjuna, Arambol); Dabolim (GOI) is closer to South Goa (Benaulim, Palolem).',
      },
      {
        mode: 'Road/Bus',
        details: 'AC Volvo Sleeper from Swargate/Wakad via NH48 (Pune-Satara-Kolhapur-Nippani-Amboli Ghat-Mapusa).',
        estimatedDuration: '9 to 10 hours',
        approximateCost: '₹1,000 - ₹1,800',
        recommendationNote: 'Overnight departure at 9:00 PM gets you into Goa by 7:00 AM fresh for check-in.',
      },
    ];
  } else if (destLower.includes('jaipur')) {
    transitOptions = [
      {
        mode: 'Flight',
        details: 'Direct flight from Pune Airport (PNQ) to Jaipur International Airport (JAI) via IndiGo or SpiceJet.',
        estimatedDuration: '1 hr 45 mins direct',
        approximateCost: '₹4,500 - ₹7,500',
        recommendationNote: 'Fastest and most convenient connection; daytime flights arrive close to Old City hotels.',
      },
      {
        mode: 'Train',
        details: 'Pune - Jaipur Superfast Express (Train #12939) or Maru Sagar Express departing from Pune Jn.',
        estimatedDuration: '20 to 22 hours',
        approximateCost: '₹1,500 (3AC) - ₹2,200 (2AC)',
        recommendationNote: 'Comfortable 2AC berths recommended for solo travelers; pantry car meals available onboard.',
      },
      {
        mode: 'Connecting Flight via Mumbai',
        details: 'Take early morning Pune-Mumbai Shivneri bus/cab, then fly non-stop Mumbai (BOM) to Jaipur (JAI).',
        estimatedDuration: '5 hours total transit',
        approximateCost: '₹3,500 - ₹6,000',
        recommendationNote: 'Cost-effective alternative when direct Pune flights are expensive.',
      },
    ];
  }

  // Curated Food
  let foodItems = [
    {
      dishName: `Authentic ${destination} Specialties & Street Food`,
      description: 'Regional delicacies cooked with fresh local spices and traditional culinary techniques.',
      recommendedEateries: ['Iconic heritage restaurant in Old Town', 'Local market street food stalls with high footfall', 'Artisan cafes and bakeries'],
    },
    {
      dishName: 'Traditional Thali / Regional Platter',
      description: 'A balanced assortment of regional curries, breads, lentils, chutneys, and desserts.',
      recommendedEateries: ['Renowned local dining hall', 'Heritage haveli courtyard cafe'],
    },
    {
      dishName: 'Locally Brewed Teas / Beverages & Sweets',
      description: 'Handcrafted hot beverages, spice-infused teas, and famous local confections.',
      recommendedEateries: ['Historic tea stall near city clock tower', 'Specialty dessert shop'],
    },
  ];

  if (destLower.includes('goa')) {
    foodItems = [
      {
        dishName: 'Goan Fish Curry Thali & Prawn Balchão',
        description: 'Tangy, coconut-kokum infused curry served with red rice, fried surmai or rawa kingfish, and sol kadhi (Non-veg, pescatarian).',
        recommendedEateries: ['Vinayak Family Restaurant (Assagao)', 'Ritz Classic (Panaji)', 'Fat Fish (Calangute)'],
      },
      {
        dishName: 'Bebinca & Poee with Mushroom Xacuti',
        description: 'Warm Goan crusty poee bread served with deeply roasted coconut xacuti gravy; followed by traditional 7-layer Bebinca pudding.',
        recommendedEateries: ['Confeitaria 31 de Janeiro (Fontainhas)', 'Viva Panjim (Latin Quarter)', 'Mum’s Kitchen (Panaji)'],
      },
      {
        dishName: 'Artisanal Cafe Cuisine & Fresh Smoothie Bowls',
        description: 'Organic smoothie bowls, sourdough toasts, kombucha, and freshly roasted specialty coffee in lush garden settings.',
        recommendedEateries: ['Artjuna (Anjuna)', 'Baba Au Rhum (Anjuna)', 'Carpe Diem (Majorda)'],
      },
    ];
  } else if (destLower.includes('jaipur')) {
    foodItems = [
      {
        dishName: 'Dal Baati Churma with Gatte ki Sabzi',
        description: 'Crispy whole wheat baatis dipped in pure desi ghee, served with Panchmel spicy dal and sweet crushed churma (Vegetarian).',
        recommendedEateries: ['Laxmi Mishthan Bhandar - LMB (Johari Bazaar)', 'Chokhi Dhani', 'Thali and More (C-Scheme)'],
      },
      {
        dishName: 'Pyaaz Kachori & Mirchi Vada',
        description: 'Flaky, deep-fried pastry packed with spicy caramelised onion and aromatic spices, accompanied by sweet tamarind and spicy mint chutneys.',
        recommendedEateries: ['Rawat Mishthan Bhandar (Near Railway Station)', 'Samrat Restaurant (Tripolia Bazaar)'],
      },
      {
        dishName: 'Kulhad Lassi & Ghewar',
        description: 'Thick, creamy sweet curd lassi served in an earthen clay kulhad with a layer of malai; accompanied by honeycombed seasonal paneer ghewar.',
        recommendedEateries: ['Lassiwala (MI Road, since 1944)', 'Kanha (Tonk Road)'],
      },
    ];
  }

  // Curated Stays
  const stays = [
    {
      name: `Zostel / The Hosteller ${destination}`,
      type: 'Reputed Hostel',
      tier: 'Budget-Friendly',
      area: 'Central / Vibrant Neighborhood',
      approxCostPerNight: '₹900 - ₹1,800 (Female-only Dorm) / ₹3,000 (Private Room)',
      safetyHighlights: '24/7 manned front desk, biometric or RFID keycard access, dedicated female-only dormitories with secure lockers, and friendly solo-traveler community vibe.',
    },
    {
      name: `Heritage Boutique Haveli / Homestay in ${destination}`,
      type: 'Boutique Hotel',
      tier: 'Mid-Range',
      area: 'Heritage Quarter / Safe Residential Zone',
      approxCostPerNight: '₹3,500 - ₹5,500',
      safetyHighlights: 'Gated premises, verified staff, in-house dining so you do not need to walk out late at night, and personalized local host assistance.',
    },
  ];

  // Curated Solo Safety
  const safety = {
    overallSafetyAssessment: `High to Moderate. ${destination} is widely frequented by solo domestic and international travelers, with vibrant public areas, good phone connectivity, and active police assistance.`,
    safeNeighborhoods: [
      destLower.includes('goa') ? 'Fontainhas (Panaji), Anjuna, Mandrem, and Benaulim' :
      destLower.includes('jaipur') ? 'C-Scheme, Civil Lines, Malviya Nagar, and Bani Park' :
      'Downtown Tourist District, Central Mall Road, and Heritage Precinct',
      'Well-lit pedestrian zones with regular evening cafe footfall',
    ],
    precautionsAndAreasToAvoid: [
      'Avoid unlit, deserted beach stretches or secluded alleys after 10:00 PM.',
      'Do not accept unsealed drinks from strangers at bars or beach shacks.',
      'Keep offline Google Maps saved on your phone and share live WhatsApp location with a trusted friend/family in Pune.',
      'Always use official prepaid transport booths or app-based rides (Uber/Ola/GoaMiles) rather than hailing unmarked vehicles.',
    ],
    culturalNuancesAndAttire: 'Wear modest, breathable clothing covering shoulders and knees when visiting religious shrines, temples, or traditional markets. Lightweight cotton scarves or dupattas are great versatile cover-ups.',
    practicalTips: [
      'Keep your power bank charged; mobile network coverage is good across main hubs.',
      'Use UPI (Google Pay / PhonePe) for small vendor purchases, but carry ₹1,500 in physical cash for local auto-rickshaws and tips.',
      'If taking late night transport, call a friend or simulate a call stating your cab registration number.',
    ],
    emergencyHelplines: {
      womenHelpline: '1091 / 112 (National Emergency Support System)',
      police: '100 / 112',
      touristHelpline: '1363 (Toll-Free 24x7 Multi-Lingual Tourist Helpline India)',
    },
  };

  return {
    destination,
    travelDates,
    tripSummary: `Welcome to your curated SoloTravelGenie plan for ${destination} (${travelDates}) departing from Pune! Tailored specifically for independent female travelers, combining optimal Pune transit, verified stays, authentic cuisine, and practical safety protocols. Note: Running in deterministic tool-orchestration engine (set GEMINI_API_KEY in .env for live Gemini 2.0 Flash generation).`,
    modeOfTravelFromPune: transitOptions,
    localFood: foodItems,
    weatherForecast: {
      overview: weather.seasonalContext,
      temperatureRange: weather.temperatureRange,
      expectedConditions: weather.currentConditions,
      clothingAndPackingTips: weather.packingAdvice,
    },
    latestNews: {
      summary: news.travelAdvisory,
      headlines: news.headlines,
      travelAdvisories: news.travelAdvisory,
    },
    recommendedStays: stays,
    soloWomanTravelSafety: safety,
  };
}

/**
 * Genkit Flow: travelPlanFlow
 *
 * Orchestrates tools fetchDestinationWeather and fetchLocalNews,
 * integrates transit options from Pune, Maharashtra,
 * recommends local gastronomy and vetted stays,
 * and compiles comprehensive solo female travel safety advice.
 */
export const travelPlanFlow = ai.defineFlow(
  {
    name: 'travelPlanFlow',
    inputSchema: TravelPlanInputSchema,
    outputSchema: TravelPlanOutputSchema,
  },
  async ({ destination, travelDates }: TravelPlanInput): Promise<TravelPlanOutput> => {
    const hasApiKey = Boolean(
      process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY
    );

    // If an API key is provided, use Gemini 2.0 Flash model with tool orchestration
    if (hasApiKey) {
      try {
        const systemPrompt = `You are "SoloTravelGenie", a premier solo female travel specialist and itinerary architect.
You specialize in designing safe, culturally respectful, deeply rewarding solo journeys departing specifically from Pune, Maharashtra, India.

CRITICAL OPERATIONAL RULES:
1. ORCHESTRATE TOOLS: You MUST invoke the provided tools:
   - 'fetchDestinationWeather' with destination="${destination}" to ground weather, temperature, and packing advice.
   - 'fetchLocalNews' with destination="${destination}" to ground recent headlines, local events, and active travel advisories.
2. PUNE TRANSIT: Provide practical, concrete transport options departing from Pune (e.g. Pune Airport PNQ flights, Pune Jn PUNE trains with train names/numbers, or highway routes like Mumbai-Pune Expressway / NH48 / Volvo buses).
3. SOLO FEMALE SAFETY: Provide extensive, empowering, and realistic safety guidance for a woman traveling solo. Mention recommended safe neighborhoods, areas to avoid after dark, local cultural/dress expectations, and emergency numbers (112, 1091).
4. LOCAL GASTRONOMY: Detail must-try regional dishes (both vegetarian and non-vegetarian options) with specific recommended eateries/cafes.
5. RECOMMENDED STAYS: Curate budget-friendly to mid-range stays (such as reputed hostels like Zostel with female dorms or boutique hotels) featuring strong security (24/7 reception, keycards).
6. OUTPUT CONFORMANCE: Return strict structured JSON conforming precisely to the output schema.`;

        const userPrompt = `Create a comprehensive solo female travel plan from Pune, Maharashtra to ${destination} for the travel window: ${travelDates}.`;

        const response = await ai.generate({
          system: systemPrompt,
          prompt: userPrompt,
          tools: [fetchDestinationWeather, fetchLocalNews],
          output: {
            schema: TravelPlanOutputSchema,
          },
        });

        if (response.output) {
          return response.output;
        }
      } catch (err) {
        console.warn(
          'Warning: Gemini generation encountered an error, falling back to local simulated tool engine:',
          err
        );
      }
    } else {
      console.log(
        'ℹ️ GEMINI_API_KEY not found in environment. Utilizing local SoloTravelGenie tool orchestration engine.'
      );
    }

    // Deterministic fallback using the registered Genkit tools
    return await generateLocalFallbackPlan(destination, travelDates);
  }
);

// Export all flows, tools, and types
export default ai;
