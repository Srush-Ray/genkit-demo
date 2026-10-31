# 🧞 SoloTravelGenie

> A local, free-tier Firebase Genkit application in TypeScript with a **sleek glassmorphic web dashboard** and **Genkit Prompts**, designed to craft personalized, safety-conscious solo female travel plans departing from **Pune, Maharashtra**. Runs 100% locally on your machine with **no Firebase Blaze plan or cloud deployment required**.

---

## 🌟 Overview & Key Features

**SoloTravelGenie** combines the power of **Firebase Genkit**, **Google Gemini (Gemini 2.0 Flash)**, **Dotprompt**, and **TypeScript** with custom function calling tools:

1. **Glassmorphic Web Application (`localhost:3000`):**
   - Sleek dark cosmic design with glassmorphic cards, ambient glows, dynamic tabbed panels, and responsive layout.
   - Quick-inspiration pills for instant 1-click itinerary generation.
   - Animated multi-step tool execution feedback.
   - One-click **Copy JSON** and **Print/PDF Export** for travelers on the go.
2. **Genkit Prompts (`.prompt` & Code Prompts):**
   - [prompts/travelPlan.prompt](file:///Users/srushtiraybhoge/Srushti/Code/genkit/prompts/travelPlan.prompt): Dotprompt file with YAML frontmatter, input/output schemas, and tool bindings.
   - [prompts/safetyAudit.prompt](file:///Users/srushtiraybhoge/Srushti/Code/genkit/prompts/safetyAudit.prompt): Targeted solo safety evaluation prompt.
   - `travelPlanPrompt` defined via `ai.definePrompt` in [src/index.ts](file:///Users/srushtiraybhoge/Srushti/Code/genkit/src/index.ts) for programmatic execution.
3. **Origin-Specific Transit from Pune:** Recommends exact Pune departures (direct flights from Pune Airport PNQ, trains from Pune Junction PUNE with train numbers, Volvo sleeper buses, and highway road trips).
4. **Genkit Function Calling (Tools):**
   - ☀️ `fetchDestinationWeather`: Simulates or retrieves weather conditions, temperature ranges, seasonal context, and packing advice.
   - 📰 `fetchLocalNews`: Simulates or retrieves recent headlines, active municipal travel advisories, and festivals.
5. **Solo Female Traveler Safety Hub:** Comprehensive safety rating, safest neighborhoods to book stays, areas to exercise caution in after dark, respectful dress codes, practical transit precautions, and emergency helplines (`1091`, `112`, `1363`).
6. **Zero Cloud Lock-in / Free-Tier:** Runs locally with the interactive **Genkit Developer UI** (`localhost:4000`) and the **Web UI** (`localhost:3000`), supporting both live Gemini LLM reasoning and an offline simulated engine.

---

## 📂 Project Structure

```
genkit/
├── prompts/
│   ├── travelPlan.prompt    # Dotprompt template with YAML metadata & tool bindings
│   └── safetyAudit.prompt   # Dedicated safety audit prompt template
├── public/
│   ├── index.html           # Modern semantic glassmorphic HTML structure
│   ├── style.css            # Dark mode glassmorphism, responsive grid, print styles
│   └── app.js               # Frontend UI controller, tab switching & API integration
├── src/
│   ├── index.ts             # Genkit initialization, prompts, travelPlanFlow & tools
│   ├── server.ts            # Lightweight Express server (serves API & static UI)
│   ├── schemas.ts           # Strict Zod schemas for flow inputs, tools, and outputs
│   ├── tools.ts             # fetchDestinationWeather and fetchLocalNews Genkit tools
│   └── test-cli.ts          # Standalone terminal runner to test flows without the browser
├── .env.example             # Environment template for Gemini API key
├── package.json             # Scripts and dependencies (genkit, express, zod, tsx)
├── tsconfig.json            # Modern TypeScript ES2022/NodeNext configuration
└── README.md                # Project documentation and usage guide
```

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (v18+)
- **Language:** TypeScript
- **Web Server:** Express
- **Frontend:** Vanilla HTML5, CSS3 (Glassmorphism & animations), JavaScript
- **AI Framework:** Firebase Genkit (`genkit` v1.43+) & Genkit CLI (`genkit-cli`)
- **Prompts:** Genkit Dotprompt (`.prompt`) & `ai.definePrompt`
- **Model Plugin:** `@genkit-ai/google-genai` (`googleai/gemini-3.7-flash`)
- **Schema Validation:** Zod
- **Runner:** `tsx` (TypeScript Execution Engine)

---

## 🚀 Getting Started

### 1. Install Dependencies
Dependencies are already installed. If reinstalling from scratch:
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

## 🧠 Section 1: Run the Genkit Application

This runs the Genkit backend (flows, prompts, and tools) together with the official **Genkit Developer UI** for testing and trace inspection.

### 1. Google Cloud Setup (login, project & APIs)

Needed when using **Vertex AI** models (`vertexai/...`). If you only use `googleai/...` models with a `GEMINI_API_KEY`, you can skip this step.

```bash
# Log in to your Google account in the gcloud CLI
gcloud auth login

# Set the active Google Cloud project (use the Project ID, not the display name)
gcloud projects list
gcloud config set project YOUR_PROJECT_ID
gcloud config get-value project   # verify

# Create Application Default Credentials used by Genkit / Vertex AI
gcloud auth application-default login

# Enable the required APIs (billing must be enabled on the project)
gcloud services enable aiplatform.googleapis.com
gcloud services enable generativelanguage.googleapis.com

# Confirm the APIs are enabled
gcloud services list --enabled | grep -E "aiplatform|generativelanguage"
```

#### Where to find your `GCLOUD_PROJECT` ID

`GCLOUD_PROJECT` is your **Google Cloud Project ID**. You can find it in either of these places:

- **Google Cloud Console:** open [console.cloud.google.com](https://console.cloud.google.com), click the **project picker** at the top of the page, and copy the value in the **ID** column (e.g. `my-travel-app-123456`). The project **Dashboard** also shows it in the *Project info* card.
- **gcloud CLI:**
  ```bash
  gcloud projects list            # PROJECT_ID column lists all your projects
  gcloud config get-value project # shows the currently active project
  ```

To create a new project, use **New Project** in the project picker, or run:
```bash
gcloud projects create YOUR_PROJECT_ID
```

> **Note:** Use the **Project ID**, not the *Project name* (display name) or the *Project number*.

Then add the project ID to your `.env` file in the project root:
```env
GCLOUD_PROJECT=YOUR_PROJECT_ID
```

> **Note:** Qwiklabs / Skills Boost lab projects (e.g. `qwiklabs-gcp-...`) are temporary and are deleted when the lab ends. Use your own project for ongoing development.

### 2. Start Genkit with the Developer UI
```bash
npm run genkit:dev
```
*(`npm run genkit:start` is an alias for the same command)*

1. Open **[http://localhost:4000](http://localhost:4000)** in your browser.
2. Inspect the registered items:
   - **Flows:** `travelPlanFlow`
   - **Prompts:** `travelPlan`, `safetyAudit`, `hello` (from `prompts/`) and `travelPlanPrompt` (from code)
   - **Tools:** `fetchDestinationWeather`, `fetchLocalNews`
3. Run a flow or prompt with JSON input, for example:
   ```json
   { "destination": "Goa", "travelDates": "Nov 15 - Nov 20" }
   ```
4. Open the **Traces** tab to see every model call and tool call step by step.

> **Note:** `tsx --watch` restarts only when `.ts` files change. After editing a `.prompt` file, stop (`Ctrl+C`) and re-run `npm run genkit:dev`, then refresh the browser.

### 3. Run a Flow from the Terminal (optional)

**Standalone CLI script:**
```bash
# Default destination (Jaipur)
npm run test:cli

# Custom destination and travel window
npx tsx src/test-cli.ts "Goa" "Nov 15 - Nov 20"
npx tsx src/test-cli.ts "Pondicherry" "Next weekend"
```

**Genkit CLI:**
```bash
npx genkit flow:run travelPlanFlow '{"destination":"Goa","travelDates":"Nov 10 - Nov 15"}' -- tsx src/index.ts
```

---

## 🌐 Section 2: Run the UI Application (Web Dashboard)

This starts the Express server ([src/server.ts](src/server.ts)), which serves the glassmorphic web dashboard from `public/` and exposes the API that calls `travelPlanFlow`.

### 1. Start the Web Server
```bash
npm start
```
*(or `npm run serve`; use `npm run serve:watch` to auto-reload on code changes)*

The server listens on port **3000** by default. To use a different port:
```bash
PORT=8080 npm start
```

### 2. Use the Dashboard
1. Open **[http://localhost:3000](http://localhost:3000)** in your browser.
2. Select a quick-pick destination (e.g. **Goa**, **Jaipur**, **Udaipur**, **Pondicherry**) or type your own destination and dates.
3. Click **"Craft My Solo Travel Plan"**.
4. Explore the interactive tabs:
   - 🛡️ **Solo Woman Safety** (Helplines, safe neighborhoods, caution zones, attire)
   - 🚆 **Pune Transit** (Flights from PNQ, trains with numbers, buses, fares)
   - 🌤️ **Weather & News** (Live conditions, packing checklist, headlines)
   - 🍛 **Food & Stays** (Must-try regional dishes, vetted accommodations)

### 3. API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server status and mode (`live-gemini-flash` or `local-tool-engine`) |
| `GET` | `/api/sample-destinations` | Quick-pick destinations shown in the UI |
| `POST` | `/api/plan` | Generates a travel plan. Body: `{ "destination": "Goa", "travelDates": "Nov 15 - Nov 20" }` |

> **Tip:** You can run both sections at the same time in two terminals: the Genkit Developer UI on port `4000` and the web dashboard on port `3000`.

---
## 📦 Build & TypeScript Validation

To compile the TypeScript project into JavaScript in `dist/`:
```bash
npm run build
```
