/**
 * SoloTravelGenie - Frontend Application Logic
 */

let currentPlanData = null;

document.addEventListener('DOMContentLoaded', () => {
  initEngineStatus();
  initQuickPicks();
  initTabNavigation();
  initFormHandler();
  initActionButtons();
});

/**
 * 1. Health check & status badge
 */
async function initEngineStatus() {
  const badgeText = document.getElementById('engineStatusText');
  const badgeDot = document.querySelector('.status-dot');

  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    if (data.status === 'ok') {
      badgeDot.classList.add('active');
      if (data.apiKeyConfigured) {
        badgeText.textContent = 'Gemini 2.0 Flash (Live)';
      } else {
        badgeText.textContent = 'Genkit Engine (Local)';
      }
    }
  } catch (err) {
    badgeText.textContent = 'Offline / Standalone';
  }
}

/**
 * 2. Populate sample destinations
 */
async function initQuickPicks() {
  const container = document.getElementById('quickPicksList');
  const destInput = document.getElementById('destinationInput');
  const datesInput = document.getElementById('datesInput');

  try {
    const res = await fetch('/api/sample-destinations');
    const samples = await res.json();

    container.innerHTML = '';
    samples.forEach((sample) => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'pick-pill';
      pill.innerHTML = `<strong>${sample.name}</strong> • ${sample.travelDates}`;
      pill.title = `${sample.tagline} (${sample.transitHint})`;

      pill.addEventListener('click', () => {
        destInput.value = sample.name;
        datesInput.value = sample.travelDates;
        // highlight inputs briefly
        destInput.focus();
      });

      container.appendChild(pill);
    });
  } catch (e) {
    // Fallback static pills
    const defaults = [
      { name: 'Goa', dates: 'Nov 15 - Nov 20' },
      { name: 'Jaipur', dates: 'Dec 1 - Dec 5' },
      { name: 'Udaipur', dates: 'Dec 10 - Dec 14' },
      { name: 'Pondicherry', dates: 'Jan 12 - Jan 16' },
    ];
    container.innerHTML = '';
    defaults.forEach((d) => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'pick-pill';
      pill.textContent = `${d.name} (${d.dates})`;
      pill.addEventListener('click', () => {
        destInput.value = d.name;
        datesInput.value = d.dates;
      });
      container.appendChild(pill);
    });
  }
}

/**
 * 3. Tab switching behavior
 */
function initTabNavigation() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabButtons.forEach((b) => b.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

/**
 * 4. Form submission & progress animation
 */
function initFormHandler() {
  const form = document.getElementById('plannerForm');
  const destInput = document.getElementById('destinationInput');
  const datesInput = document.getElementById('datesInput');
  const submitBtn = document.getElementById('submitBtn');

  const loadingSection = document.getElementById('loadingSection');
  const resultsSection = document.getElementById('resultsSection');
  const errorBanner = document.getElementById('errorBanner');
  const errorMessage = document.getElementById('errorMessage');

  let stepInterval = null;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const destination = destInput.value.trim();
    const travelDates = datesInput.value.trim();

    if (!destination) return;

    // UI state: loading
    submitBtn.disabled = true;
    errorBanner.classList.add('hidden');
    resultsSection.classList.add('hidden');
    loadingSection.classList.remove('hidden');
    loadingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Multi-step progress simulation
    const steps = ['step1', 'step2', 'step3', 'step4'];
    let currentStep = 0;
    steps.forEach((s) => document.getElementById(s).classList.remove('step-active'));
    document.getElementById(steps[0]).classList.add('step-active');

    stepInterval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        document.getElementById(steps[currentStep]).classList.add('step-active');
      }
    }, 700);

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, travelDates }),
      });

      clearInterval(stepInterval);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate travel plan');
      }

      currentPlanData = data.plan;
      renderTravelPlan(data.plan);

      loadingSection.classList.add('hidden');
      resultsSection.classList.remove('hidden');
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      clearInterval(stepInterval);
      loadingSection.classList.add('hidden');
      errorMessage.textContent = err.message || 'An error occurred while generating the plan.';
      errorBanner.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
    }
  });

  document.getElementById('dismissError').addEventListener('click', () => {
    errorBanner.classList.add('hidden');
  });
}

/**
 * 5. Render received travel plan
 */
function renderTravelPlan(plan) {
  // Summary Banner
  document.getElementById('resultDestination').textContent = `Solo Expedition to ${plan.destination}`;
  document.getElementById('resultTravelDates').textContent = `🗓️ ${plan.travelDates}`;
  document.getElementById('resultTripSummary').textContent = plan.tripSummary;

  // Tab 1: Safety Hub
  const safety = plan.soloWomanTravelSafety;
  document.getElementById('safetyAssessment').textContent = safety.overallSafetyAssessment;
  document.getElementById('hlWomen').textContent = safety.emergencyHelplines?.womenHelpline || '1091 / 112';
  document.getElementById('hlPolice').textContent = safety.emergencyHelplines?.police || '100 / 112';
  document.getElementById('hlTourist').textContent = safety.emergencyHelplines?.touristHelpline || '1363 (24x7)';

  // Safe neighborhoods
  const safeList = document.getElementById('safeNeighborhoodsList');
  safeList.innerHTML = '';
  (safety.safeNeighborhoods || []).forEach((area) => {
    const li = document.createElement('li');
    li.textContent = `✓ ${area}`;
    safeList.appendChild(li);
  });

  // Precautions & caution zones
  const cautionList = document.getElementById('precautionsList');
  cautionList.innerHTML = '';
  (safety.precautionsAndAreasToAvoid || []).forEach((caution) => {
    const li = document.createElement('li');
    li.textContent = caution;
    cautionList.appendChild(li);
  });

  // Cultural attire & practical tips
  document.getElementById('culturalAttireText').textContent = safety.culturalNuancesAndAttire;

  const tipsList = document.getElementById('practicalTipsList');
  tipsList.innerHTML = '';
  (safety.practicalTips || []).forEach((tip) => {
    const li = document.createElement('li');
    li.textContent = tip;
    tipsList.appendChild(li);
  });

  // Tab 2: Pune Transit
  const transitContainer = document.getElementById('transitCardsContainer');
  transitContainer.innerHTML = '';
  (plan.modeOfTravelFromPune || []).forEach((t) => {
    const card = document.createElement('div');
    card.className = 'glass-card transit-card';

    const icon = t.mode.toLowerCase().includes('flight')
      ? '✈️'
      : t.mode.toLowerCase().includes('train')
      ? '🚆'
      : '🚌';

    card.innerHTML = `
      <div>
        <div class="transit-card-top">
          <div class="transit-mode">${icon} ${t.mode}</div>
          <div class="transit-duration">${t.estimatedDuration}</div>
        </div>
        <p class="transit-details">${t.details}</p>
      </div>
      <div>
        <div class="transit-cost">Est. Cost: ${t.approximateCost}</div>
        <div class="transit-tip">💡 <strong>Pune Tip:</strong> ${t.recommendationNote}</div>
      </div>
    `;
    transitContainer.appendChild(card);
  });

  // Tab 3: Weather & News
  const weather = plan.weatherForecast;
  document.getElementById('weatherConditions').textContent = weather.expectedConditions;
  document.getElementById('weatherTemp').textContent = weather.temperatureRange;
  document.getElementById('weatherOverview').textContent = weather.overview;

  const packingList = document.getElementById('packingList');
  packingList.innerHTML = '';
  (weather.clothingAndPackingTips || []).forEach((tip) => {
    const li = document.createElement('li');
    li.textContent = tip;
    packingList.appendChild(li);
  });

  const news = plan.latestNews;
  document.getElementById('newsAdvisory').textContent = news.travelAdvisories || news.summary;

  const headlinesList = document.getElementById('newsHeadlinesList');
  headlinesList.innerHTML = '';
  (news.headlines || []).forEach((hl) => {
    const li = document.createElement('li');
    li.textContent = hl;
    headlinesList.appendChild(li);
  });

  // Tab 4: Food & Stays
  const foodContainer = document.getElementById('foodItemsContainer');
  foodContainer.innerHTML = '';
  (plan.localFood || []).forEach((f) => {
    const item = document.createElement('div');
    item.className = 'food-card-item';
    item.innerHTML = `
      <div class="food-name">🍽️ ${f.dishName}</div>
      <div class="food-desc">${f.description}</div>
      <div class="food-eateries">📍 <strong>Recommended Spots:</strong> ${(f.recommendedEateries || []).join(', ')}</div>
    `;
    foodContainer.appendChild(item);
  });

  const staysContainer = document.getElementById('staysContainer');
  staysContainer.innerHTML = '';
  (plan.recommendedStays || []).forEach((s) => {
    const item = document.createElement('div');
    item.className = 'stay-card-item';
    item.innerHTML = `
      <div class="stay-top">
        <div class="stay-name">🏡 ${s.name}</div>
        <div class="stay-price">${s.approxCostPerNight}</div>
      </div>
      <div class="stay-meta">📍 Area: <strong>${s.area}</strong> • ${s.type} (${s.tier})</div>
      <div class="stay-safety">🛡️ <strong>Safety Features:</strong> ${s.safetyHighlights}</div>
    `;
    staysContainer.appendChild(item);
  });
}

/**
 * 6. Action buttons (Copy JSON & Print)
 */
function initActionButtons() {
  const copyBtn = document.getElementById('copyJsonBtn');
  const printBtn = document.getElementById('printBtn');

  copyBtn.addEventListener('click', async () => {
    if (!currentPlanData) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(currentPlanData, null, 2));
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<span class="icon">✅</span> Copied!';
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
      }, 2000);
    } catch (err) {
      alert('Unable to copy to clipboard.');
    }
  });

  printBtn.addEventListener('click', () => {
    window.print();
  });
}
