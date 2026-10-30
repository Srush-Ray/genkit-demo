import { Genkit, z } from 'genkit';

export const WeatherToolInputSchema = z.object({
  destination: z.string().describe('The destination city or region name'),
});

export const WeatherToolOutputSchema = z.object({
  destination: z.string(),
  currentConditions: z.string(),
  temperatureRange: z.string(),
  expectedPrecipitation: z.string(),
  humidity: z.string(),
  seasonalContext: z.string(),
  packingAdvice: z.array(z.string()),
});

export const NewsToolInputSchema = z.object({
  destination: z.string().describe('The destination city or region name'),
});

export const NewsToolOutputSchema = z.object({
  destination: z.string(),
  headlines: z.array(z.string()),
  localEventsAndFestivals: z.array(z.string()),
  travelAdvisory: z.string(),
  touristInfrastructureUpdate: z.string(),
});

// Curated database for popular Indian & international destinations
const DESTINATION_WEATHER_DB: Record<string, Partial<z.infer<typeof WeatherToolOutputSchema>>> = {
  goa: {
    currentConditions: 'Pleasant, sunny coastal breeze with clear blue skies',
    temperatureRange: '23°C to 31°C',
    expectedPrecipitation: 'Low (clear skies, non-monsoon dry season)',
    humidity: '65% (moderate coastal humidity)',
    seasonalContext: 'Peak tourist season with active beach shacks, calm seas for watersports, and vibrant night markets.',
    packingAdvice: ['Light breathable cotton wear', 'UV sunglasses & high-SPF sunscreen', 'Flip-flops & beach tote', 'Light evening scarf or shrug'],
  },
  jaipur: {
    currentConditions: 'Crisp, sunny days with cool, pleasant evenings and desert breeze',
    temperatureRange: '14°C to 27°C',
    expectedPrecipitation: 'Virtually nil (dry desert winter)',
    humidity: '35% (dry and comfortable)',
    seasonalContext: 'Best season for walking heritage bazaars, rooftop Rajasthani dinners, and exploring Amer Fort without scorching heat.',
    packingAdvice: ['Layered clothing (t-shirts for daytime, cozy jacket or shawl for evening)', 'Comfortable walking shoes with good grip for fort cobbles', 'Moisturizer & lip balm', 'Modest scarves for visiting temples/mosques'],
  },
  udaipur: {
    currentConditions: 'Gentle lake breeze, clear sunny skies, and chilled starry nights',
    temperatureRange: '13°C to 26°C',
    expectedPrecipitation: 'None (dry winter)',
    humidity: '40% (clear lake atmosphere)',
    seasonalContext: 'Ideal weather for boat rides on Lake Pichola and romantic rooftop sunset dinners overlooking palaces.',
    packingAdvice: ['Warm layers for evening lake boat rides', 'Stylish cotton daywear for palace sightseeing', 'Comfortable sneakers for Old City alleys'],
  },
  manali: {
    currentConditions: 'Chilly Himalayan mountain air, partly cloudy with crisp sunshine and occasional snow flurries at high passes',
    temperatureRange: '2°C to 12°C (sub-zero at night)',
    expectedPrecipitation: 'Occasional light snow or frost',
    humidity: '55% (crisp alpine air)',
    seasonalContext: 'Winter wonderland transition; Solang valley snow sports active; cozy cafes with wood-fired heaters.',
    packingAdvice: ['Heavy fleece jackets & thermal inners', 'Waterproof trekking boots with grip', 'Woolen gloves, beanie, and thermal socks', 'High-SPF lip balm and cold cream'],
  },
  pondicherry: {
    currentConditions: 'Balmy maritime weather, warm sunny mornings and pleasant breezy evenings along Promenade Beach',
    temperatureRange: '22°C to 30°C',
    expectedPrecipitation: 'Occasional brief coastal drizzle',
    humidity: '72% (tropical coastal)',
    seasonalContext: 'Splendid time for cycling the French Quarter (White Town) and relaxing at Auroville and Serenity Beach.',
    packingAdvice: ['Breezy linen shirts & dresses', 'Comfortable sandals or slip-on canvas shoes', 'Compact umbrella or rain poncho', 'Refillable water flask'],
  },
  gokarna: {
    currentConditions: 'Sunny, warm beaches with refreshing afternoon sea winds',
    temperatureRange: '21°C to 31°C',
    expectedPrecipitation: 'Clear and dry',
    humidity: '68%',
    seasonalContext: 'Peaceful coastal vibe with calm Arabian Sea waters suitable for swimming at Kudle and Om beaches.',
    packingAdvice: ['Quick-dry beachwear and cotton shirts', 'Trekking sandals for beach-to-beach cliffs', 'Eco-friendly sunscreen', 'Mosquito repellent'],
  },
  varanasi: {
    currentConditions: 'Misty mornings over the Ganges giving way to golden sunshine and brisk cool evenings',
    temperatureRange: '12°C to 25°C',
    expectedPrecipitation: 'Nil',
    humidity: '50%',
    seasonalContext: 'Peak cultural season with Dev Deepawali aura, sublime sunrise boat rides, and evening Ganga Aarti.',
    packingAdvice: ['Warm stole or lightweight down jacket for dawn boat rides', 'Modest clothing covering shoulders and knees', 'Slip-on shoes for temple ghats (easy to remove)', 'Hand sanitizer and wet wipes'],
  },
  munnar: {
    currentConditions: 'Cool misty tea hills, refreshing crisp mountain breeze, and clear skies in the afternoon',
    temperatureRange: '11°C to 20°C',
    expectedPrecipitation: 'Light passing mist / occasional shower',
    humidity: '65%',
    seasonalContext: 'Lush emerald green tea gardens and serene viewpoints without heavy monsoons.',
    packingAdvice: ['Lightweight woolens or cardigans', 'Comfortable trail walking shoes', 'Windcheater or umbrella'],
  },
};

const DESTINATION_NEWS_DB: Record<string, Partial<z.infer<typeof NewsToolOutputSchema>>> = {
  goa: {
    headlines: [
      'Goa Tourism implements single-window app for verified watersports & prepaid taxi bookings',
      'North and South Goa coastal cafes host seasonal indie music & arts flea markets',
      'Goa Police enhances "Pink Force" all-women safety patrols along prominent beaches',
    ],
    localEventsAndFestivals: [
      'Saturday Night Market at Arpora in full swing',
      'Goa Open Arts Festival & cultural beach sessions',
    ],
    travelAdvisory: 'Opt for GoaMiles app or prepaid counters at airports/stations to avoid arbitrary cab tariffs. Beach swimming is permitted between designated safety flag zones watched by Drishti lifeguards.',
    touristInfrastructureUpdate: 'Mopa (Manohar International Airport) and Dabolim Airport both running full domestic schedules; electric AC feeder buses running to Panaji & Margao.',
  },
  jaipur: {
    headlines: [
      'Jaipur Heritage Walk launches smart audio guides and solar rickshaw loops around the Pink City',
      'Preparations underway for winter cultural festivals and classical evening concerts at Albert Hall',
      'Rajasthan Tourism deploys dedicated tourist assistance kiosks at Amer Fort and Hawa Mahal',
    ],
    localEventsAndFestivals: [
      'Evening light & sound shows at Amer Fort & Amber Palace courtyard',
      'Heritage crafts showcase at Shilpgram and Jawahar Kala Kendra',
    ],
    travelAdvisory: 'Bazaars around Johari Bazaar and Bapu Bazaar are bustling; negotiate gently with auto drivers or use Ola/Uber for transparent fares.',
    touristInfrastructureUpdate: 'Jaipur Metro connects Railway Station directly to Chandpole (Pink City entrance). Digital UPI payments are accepted across almost all monument entry gates.',
  },
  udaipur: {
    headlines: [
      'Udaipur Lake conservation initiative keeps Lake Pichola and Fateh Sagar pristine with battery-powered solar ferries',
      'City Palace expands illuminated evening courtyard exhibitions and cultural folk dances at Bagore Ki Haveli',
      'Enhanced pedestrian zones established around Old City heritage ghāts for safer evening strolls',
    ],
    localEventsAndFestivals: [
      'Daily Dharohar Folk Dance at Bagore Ki Haveli (7 PM - highly recommended for solo travelers)',
      'Sunset classical flute & sitar performances at Ambrai Ghat',
    ],
    travelAdvisory: 'Narrow streets in Old City are best explored on foot or via electric tuk-tuks. Keep hotel location pinned on offline maps.',
    touristInfrastructureUpdate: 'Udaipur Airport (UDR) has upgraded shuttle connections to Chetak Circle and Lake Palace road.',
  },
  manali: {
    headlines: [
      'Atal Tunnel (Rohtang) operating with smooth regulated traffic toward Sissu and Lahaul Valley',
      'Old Manali cafes and bakeries celebrate winter seasonal opening with live acoustic evenings',
      'Himachal Tourism launches 24/7 dedicated Tourist Police helpline for winter mountain travelers',
    ],
    localEventsAndFestivals: [
      'Solang Valley winter sports and zip-lining active',
      'Naggar Castle arts and wood-carving workshops',
    ],
    travelAdvisory: 'Carry valid photo ID for Rohtang/Atal Tunnel tourist permits if planning a day trip. Rent snow gear only from authorized government-rate shops in Kothi/Palchan.',
    touristInfrastructureUpdate: 'Chandigarh-Manali four-lane highway significantly reduces road transit time from plain areas.',
  },
  pondicherry: {
    headlines: [
      'White Town (French Quarter) enforces pedestrian-only vehicle restrictions on weekends for serene walking and cycling',
      'Auroville introduces convenient online visitor passes and guided Matrimandir meditation slots',
      'Pondicherry Beach Promenade sees vibrant evening food pop-ups and eco-friendly artisanal stalls',
    ],
    localEventsAndFestivals: [
      'Sunday antique and handcrafted paper fair near Goubert Avenue',
      'French cultural center (Alliance Française) cinema and literature evenings',
    ],
    travelAdvisory: 'Renting a bicycle or gearless scooter is the best way to get around; wear helmets and carry driving licenses.',
    touristInfrastructureUpdate: 'Direct electric shuttle buses connect Chennai Airport and central Pondicherry.',
  },
  gokarna: {
    headlines: [
      'Gokarna eco-tourism board cleans trail paths between Kudle, Om, Half Moon, and Paradise beaches',
      'Sunset yoga and wellness retreats report calm season along Main Beach',
      'Karnataka Coastal Police intensifies evening surveillance at secluded rocky coves',
    ],
    localEventsAndFestivals: [
      'Full moon beach bonfires (regulated and permitted at selected eco-cafes)',
      'Evening temple festivities at ancient Mahabaleshwar Temple',
    ],
    travelAdvisory: 'Cliff treks between beaches should be undertaken in daylight only; carry a flashlight and avoid isolated cliff tracks after sunset.',
    touristInfrastructureUpdate: 'Frequent KSRTC Rajahamsa and Airavat express buses now connect Gokarna directly to Pune/Hubli.',
  },
};

/**
 * Creates and registers the Genkit Tools on the provided Genkit instance
 */
export function createSoloTravelTools(ai: Genkit) {
  /**
   * Tool 1: fetchDestinationWeather
   */
  const fetchDestinationWeather = ai.defineTool(
    {
      name: 'fetchDestinationWeather',
      description:
        'Fetches or simulates accurate weather conditions, temperature ranges, seasonal context, and packing advice for a travel destination.',
      inputSchema: WeatherToolInputSchema,
      outputSchema: WeatherToolOutputSchema,
    },
    async ({ destination }) => {
      const normalized = destination.toLowerCase().trim();
      const matchKey = Object.keys(DESTINATION_WEATHER_DB).find((key) =>
        normalized.includes(key) || key.includes(normalized)
      );

      const matched = matchKey ? DESTINATION_WEATHER_DB[matchKey] : null;

      if (matched) {
        return {
          destination,
          currentConditions: matched.currentConditions || 'Pleasant and moderate',
          temperatureRange: matched.temperatureRange || '18°C - 28°C',
          expectedPrecipitation: matched.expectedPrecipitation || 'Low probability of rain',
          humidity: matched.humidity || '50%',
          seasonalContext: matched.seasonalContext || 'Favorable travel season with comfortable conditions.',
          packingAdvice: matched.packingAdvice || [
            'Lightweight, breathable clothes',
            'Comfortable walking shoes',
            'Light jacket or layer for evenings',
            'Sun protection essentials',
          ],
        };
      }

      // Procedural fallback for any other destination
      return {
        destination,
        currentConditions: 'Mild and pleasant with intermittent sunshine',
        temperatureRange: '17°C - 26°C',
        expectedPrecipitation: 'Low to moderate chance of brief localized showers',
        humidity: '55%',
        seasonalContext: `Comfortable travel season in ${destination} suitable for outdoor sightseeing, historical walking tours, and local exploration.`,
        packingAdvice: [
          'Versatile layering clothes (light daytime wear and an evening jacket)',
          'Sturdy walking shoes for city exploration',
          'Compact umbrella or water-resistant windbreaker',
          'Sunglasses, sunscreen, and a reusable water bottle',
        ],
      };
    }
  );

  /**
   * Tool 2: fetchLocalNews
   */
  const fetchLocalNews = ai.defineTool(
    {
      name: 'fetchLocalNews',
      description:
        'Fetches recent news headlines, active travel advisories, local festivals, and tourist infrastructure updates for the specified destination.',
      inputSchema: NewsToolInputSchema,
      outputSchema: NewsToolOutputSchema,
    },
    async ({ destination }) => {
      const normalized = destination.toLowerCase().trim();
      const matchKey = Object.keys(DESTINATION_NEWS_DB).find((key) =>
        normalized.includes(key) || key.includes(normalized)
      );

      const matched = matchKey ? DESTINATION_NEWS_DB[matchKey] : null;

      if (matched) {
        return {
          destination,
          headlines: matched.headlines || [
            `Tourism surge in ${destination} prompts upgraded visitor facilities`,
            `Local cultural and food festivals attract travelers this season`,
            `Enhanced municipal safety measures and dedicated tourist helpdesks active`,
          ],
          localEventsAndFestivals: matched.localEventsAndFestivals || [
            'Local weekend handicrafts fair and artisan pop-ups',
            'Evening heritage light and sound presentations',
          ],
          travelAdvisory:
            matched.travelAdvisory ||
            'Use registered app-based taxis (Uber/Ola/official tourist taxis) and verify meter/fares beforehand. Keep emergency numbers handy.',
          touristInfrastructureUpdate:
            matched.touristInfrastructureUpdate ||
            'Major public transport lines, train connectivity, and tourist information centers are operating normally.',
        };
      }

      // Procedural fallback for any other destination
      return {
        destination,
        headlines: [
          `Local tourism board welcomes visitors with upgraded visitor centers and smart guide passes`,
          `Seasonal food & crafts bazaar launched in downtown ${destination}`,
          `City police and emergency services ensure well-lit tourist corridors and patrols`,
        ],
        localEventsAndFestivals: [
          'Weekly cultural music & street food performances in central squares',
          'Heritage walking trails led by certified local historians',
        ],
        travelAdvisory:
          'Maintain standard vigilance in crowded areas, use verified transport services, and secure valuables when exploring busy market hubs.',
        touristInfrastructureUpdate:
          'Public transport, high-speed regional connections, and digital mobile payments (UPI/Cards) are widely supported across the destination.',
      };
    }
  );

  return { fetchDestinationWeather, fetchLocalNews };
}
