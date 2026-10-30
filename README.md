# 🧞 SoloTravelGenie

> A local, free-tier Firebase Genkit application in TypeScript designed to craft personalized, safety-conscious solo female travel plans departing from **Pune, Maharashtra**. Runs 100% locally on your machine with **no Firebase Blaze plan or cloud deployment required**.

---

## 🌟 Overview & Key Features

**SoloTravelGenie** combines the power of **Firebase Genkit**, **Google Gemini (Gemini 2.0 Flash)**, and **TypeScript** with custom function calling tools:

1. **Origin-Specific Transit from Pune:** Recommends exact Pune departures (direct flights from Pune Airport PNQ, trains from Pune Junction PUNE, Volvo sleeper buses, and scenic highway road trips).
2. **Genkit Function Calling (Tools):**
   - ☀️ `fetchDestinationWeather`: Obtains accurate weather conditions, temperature ranges, seasonal context, and packing advice for the target destination.
   - 📰 `fetchLocalNews`: Obtains recent local headlines, active municipal travel advisories, and seasonal festivals.
3. **Solo Female Traveler Safety Guide:** Comprehensive safety rating, safest neighborhoods to book stays, areas to exercise caution in after dark, respectful dress codes, practical transit precautions, and emergency helplines.
4. **Authentic Gastronomy & Vetted Stays:** Must-try local delicacies with exact eateries, plus budget-friendly to mid-range stays highlighting safety features (female-only dorms, 24/7 reception, keycards).
5. **Zero Cloud Lock-in / Free-Tier:** Runs locally with the interactive **Genkit Developer UI** (`http://localhost:4000`) and supports both live Gemini LLM reasoning and an offline simulated engine.

---

## 📂 Project Structure

```
genkit/
├── index.ts               # Root entry point re-exporting core flow and tools
├── src/
│   ├── index.ts           # Genkit initialization, travelPlanFlow definition, and tool binding
│   ├── schemas.ts         # Strict Zod schemas for flow inputs, tools, and outputs
│   ├── tools.ts           # fetchDestinationWeather and fetchLocalNews Genkit tools
│   └── test-cli.ts        # Standalone terminal runner to test flows without the browser
├── .env.example           # Environment template for Gemini API key
├── package.json           # Scripts and dependencies (genkit, @genkit-ai/googleai, zod, tsx)
├── tsconfig.json          # Modern TypeScript ES2022/NodeNext configuration
└── README.md              # Project documentation and usage guide
```

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (v18+)
- **Language:** TypeScript
- **Framework:** Firebase Genkit (`genkit` v1.43+) & Genkit CLI (`genkit-cli`)
- **Model Plugin:** `@genkit-ai/googleai` (`gemini-2.0-flash`)
- **Schema Validation:** Zod
- **Runner:** `tsx` (TypeScript Execution Engine)

---

## 🚀 Getting Started

### 1. Install Dependencies
Dependencies are already installed in this directory. If reinstalling from scratch:
```bash
npm install
```

### 2. Configure Environment Variables (Optional for Live Gemini)
SoloTravelGenie works out of the box with an offline tool-orchestration engine. To enable live Gemini 2.0 Flash reasoning:

1. Obtain a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```
3. Set your API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

---

## 🖥️ Interactive Testing with Genkit Developer UI

To launch the local Genkit Developer UI:

```bash
npm run genkit:dev
```
*(Or via npx: `npx genkit start -- tsx --watch src/index.ts`)*

### In the Developer UI:
1. Open your browser and navigate to: **[http://localhost:4000](http://localhost:4000)**
2. In the left navigation, select **Flows** -> **`travelPlanFlow`**.
3. In the **Input JSON** panel, provide your travel parameters:
   ```json
   {
     "destination": "Goa",
     "travelDates": "Nov 15 - Nov 20, 2026"
   }
   ```
4. Click **Run**.
5. You can view the full structured output and inspect the **Trace Viewer** to see the model invoking the tools (`fetchDestinationWeather` and `fetchLocalNews`).

---

## ⌨️ Command Line Testing

### 1. Run Flow with Genkit CLI
You can test the flow directly from your terminal using the Genkit CLI:
```bash
npx genkit flow:run travelPlanFlow '{"destination":"Jaipur","travelDates":"Dec 1 - Dec 5"}' -- tsx src/index.ts
```

### 2. Standalone Pretty CLI Runner
Use the built-in CLI runner script:
```bash
# Default destination (Jaipur)
npm run test:cli

# Or specify custom destination and dates:
npx tsx src/test-cli.ts "Goa" "Nov 10 - Nov 15"
npx tsx src/test-cli.ts "Pondicherry" "Next weekend"
npx tsx src/test-cli.ts "Udaipur" "3 days in January"
```

---

## 📋 Schema Reference

### Flow Input: `travelPlanFlow`
```typescript
{
  destination: string;  // e.g., "Goa", "Jaipur", "Manali", "Udaipur"
  travelDates: string;  // e.g., "Nov 15 - Nov 20", "4 days in December"
}
```

### Flow Output: `TravelPlanOutput`
```typescript
{
  destination: string;
  travelDates: string;
  tripSummary: string;
  modeOfTravelFromPune: Array<{
    mode: string;                 // Flight, Train, Road/Bus
    details: string;              // Specific route departing from Pune (e.g. PNQ flight, Pune Jn train)
    estimatedDuration: string;    // e.g. "1 hr 15 mins direct flight"
    approximateCost: string;      // e.g. "₹2,800 - ₹4,800"
    recommendationNote: string;   // Local departure tip
  }>;
  localFood: Array<{
    dishName: string;             // Authentic dish name
    description: string;          // Dietary profile and preparation
    recommendedEateries: string[];// Exact recommended cafes/eateries
  }>;
  weatherForecast: {
    overview: string;
    temperatureRange: string;
    expectedConditions: string;
    clothingAndPackingTips: string[];
  };
  latestNews: {
    summary: string;
    headlines: string[];
    travelAdvisories: string;
  };
  recommendedStays: Array<{
    name: string;
    type: string;                 // Hostel, Boutique Hotel, Homestay
    tier: string;                 // Budget-Friendly, Mid-Range
    area: string;
    approxCostPerNight: string;
    safetyHighlights: string;     // Female-only dorms, 24/7 front desk, keycards
  }>;
  soloWomanTravelSafety: {
    overallSafetyAssessment: string;
    safeNeighborhoods: string[];
    precautionsAndAreasToAvoid: string[];
    culturalNuancesAndAttire: string;
    practicalTips: string[];
    emergencyHelplines: {
      womenHelpline: string;      // 1091 / 112
      police: string;             // 100 / 112
      touristHelpline: string;    // 1363
    };
  };
}
```

---

## 📦 Build & TypeScript Validation

To compile the TypeScript project into JavaScript in `dist/`:
```bash
npm run build
```
