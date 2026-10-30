import { z } from 'genkit';

/**
 * Input Schema for travelPlanFlow
 */
export const TravelPlanInputSchema = z.object({
  destination: z
    .string()
    .describe('The destination city or region (e.g., Jaipur, Goa, Pondicherry, Manali, Gokarna)'),
  travelDates: z
    .string()
    .describe('The travel dates or duration (e.g., "Nov 15 - Nov 20", "4 days in December", "This weekend")'),
});

export type TravelPlanInput = z.infer<typeof TravelPlanInputSchema>;

/**
 * Transport option departing specifically from Pune, Maharashtra
 */
export const TransportOptionSchema = z.object({
  mode: z.string().describe('Mode of transport (Flight, Train, Road/Bus, or Self-Drive)'),
  details: z.string().describe('Specific route details from Pune (e.g. PNQ flight routes, Pune Jn train names/numbers, Expressways)'),
  estimatedDuration: z.string().describe('Estimated travel duration from Pune (e.g., "1 hr 15 mins direct flight", "12 hours overnight train")'),
  approximateCost: z.string().describe('Estimated price or fare range in INR per person'),
  recommendationNote: z.string().describe('Key tip or best time to depart from Pune'),
});

/**
 * Local authentic gastronomy and recommendations
 */
export const LocalFoodItemSchema = z.object({
  dishName: z.string().describe('Name of the authentic must-try dish or beverage'),
  description: z.string().describe('Description of the dish, taste profile, and whether vegetarian or non-vegetarian'),
  recommendedEateries: z.array(z.string()).describe('Top authentic eateries, street food lanes, or historic cafes to try it at'),
});

/**
 * Curated accommodation recommendations
 */
export const RecommendedStaySchema = z.object({
  name: z.string().describe('Name of the accommodation property'),
  type: z.string().describe('Type of stay (Boutique Hotel, Heritage Homestay, Reputed Hostel, Resort)'),
  tier: z.string().describe('Budget category (Budget-Friendly or Mid-Range)'),
  area: z.string().describe('Neighborhood or area in the destination city'),
  approxCostPerNight: z.string().describe('Estimated cost per night in INR'),
  safetyHighlights: z.string().describe('Safety features relevant for solo female travelers (e.g. 24/7 front desk, female-only dorms, secure lock systems, well-lit street)'),
});

/**
 * Detailed safety guide tailored for solo female travelers
 */
export const SoloWomanTravelSafetySchema = z.object({
  overallSafetyAssessment: z.string().describe('General safety rating and assessment of the destination for solo female travelers'),
  safeNeighborhoods: z.array(z.string()).describe('Safest, well-connected, and vibrant neighborhoods for accommodation and solo walking'),
  precautionsAndAreasToAvoid: z.array(z.string()).describe('Specific precautions, unlit/isolated spots to avoid, and nighttime advice'),
  culturalNuancesAndAttire: z.string().describe('Local cultural norms, temple/religious site dress codes, and respectful attire tips'),
  practicalTips: z.array(z.string()).describe('Practical advice on local transport (prepaid booths, Uber/Ola, rickshaw meters), communication, and navigating vendors'),
  emergencyHelplines: z.object({
    womenHelpline: z.string().describe('Women helpline number (e.g., 1091 / 112 in India)'),
    police: z.string().describe('Local police emergency contact number'),
    touristHelpline: z.string().describe('Tourist assistance helpline or local tourist police contact'),
  }),
});

/**
 * Weather overview for the travel days
 */
export const WeatherForecastSchema = z.object({
  overview: z.string().describe('Comprehensive weather summary for the travel period'),
  temperatureRange: z.string().describe('Expected high and low temperature in Celsius'),
  expectedConditions: z.string().describe('Weather conditions (e.g., Sunny & dry, Cool breeze in evenings, Humid tropical)'),
  clothingAndPackingTips: z.array(z.string()).describe('Recommended clothes, footwear, and accessories to pack based on the weather'),
});

/**
 * Latest news and local updates regarding the destination
 */
export const LatestNewsSchema = z.object({
  summary: z.string().describe('Summary of current happenings, local festivals, or seasonal atmosphere'),
  headlines: z.array(z.string()).describe('Recent headlines, seasonal events, or tourism announcements'),
  travelAdvisories: z.string().describe('Active travel advisories, civic updates, or seasonal alerts'),
});

/**
 * Strict Output Schema for travelPlanFlow
 */
export const TravelPlanOutputSchema = z.object({
  destination: z.string().describe('The destination name'),
  travelDates: z.string().describe('The travel dates or duration requested'),
  tripSummary: z.string().describe('Personalized welcome summary for the solo female traveler departing from Pune'),
  modeOfTravelFromPune: z.array(TransportOptionSchema).describe('Specific transport options departing from Pune, Maharashtra'),
  localFood: z.array(LocalFoodItemSchema).describe('Must-try local dishes and recommended eateries'),
  weatherForecast: WeatherForecastSchema.describe('Weather overview for those specific travel days'),
  latestNews: LatestNewsSchema.describe('Recent headlines or important updates regarding the destination'),
  recommendedStays: z.array(RecommendedStaySchema).describe('A curated list of good accommodations (budget-friendly to mid-range)'),
  soloWomanTravelSafety: SoloWomanTravelSafetySchema.describe('Specific, practical safety tips, safe areas, cultural nuances, and precautions for a solo female traveler'),
});

export type TravelPlanOutput = z.infer<typeof TravelPlanOutputSchema>;
