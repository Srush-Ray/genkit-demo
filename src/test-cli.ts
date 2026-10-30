import { travelPlanFlow } from './index.js';

async function main() {
  const destination = process.argv[2] || 'Jaipur';
  const travelDates = process.argv[3] || 'Dec 1 - Dec 5, 2026';

  console.log('='.repeat(70));
  console.log(`🧞 SoloTravelGenie: Generating Plan for "${destination}" (${travelDates})`);
  console.log(`📍 Origin: Pune, Maharashtra`);
  console.log('='.repeat(70));

  try {
    const result = await travelPlanFlow({ destination, travelDates });
    console.log('\n🌟 TRIP SUMMARY:');
    console.log(result.tripSummary);

    console.log('\n🚆 MODE OF TRAVEL FROM PUNE:');
    result.modeOfTravelFromPune.forEach((opt, idx) => {
      console.log(`  [${idx + 1}] ${opt.mode} (${opt.estimatedDuration}) ~ ${opt.approximateCost}`);
      console.log(`      Details: ${opt.details}`);
      console.log(`      Tip: ${opt.recommendationNote}`);
    });

    console.log('\n🍛 MUST-TRY LOCAL FOOD:');
    result.localFood.forEach((item, idx) => {
      console.log(`  [${idx + 1}] ${item.dishName}`);
      console.log(`      ${item.description}`);
      console.log(`      Recommended Eateries: ${item.recommendedEateries.join(', ')}`);
    });

    console.log('\n☀️ WEATHER FORECAST:');
    console.log(`  Expected Conditions: ${result.weatherForecast.expectedConditions}`);
    console.log(`  Temperature Range: ${result.weatherForecast.temperatureRange}`);
    console.log(`  Overview: ${result.weatherForecast.overview}`);
    console.log(`  Packing Advice: ${result.weatherForecast.clothingAndPackingTips.join(' | ')}`);

    console.log('\n📰 LATEST NEWS & ALERTS:');
    console.log(`  Advisory: ${result.latestNews.travelAdvisories}`);
    result.latestNews.headlines.forEach((hl) => console.log(`  • ${hl}`));

    console.log('\n🏨 RECOMMENDED STAYS:');
    result.recommendedStays.forEach((stay, idx) => {
      console.log(`  [${idx + 1}] ${stay.name} (${stay.type} - ${stay.tier}) ~ ${stay.approxCostPerNight}`);
      console.log(`      Area: ${stay.area}`);
      console.log(`      Safety: ${stay.safetyHighlights}`);
    });

    console.log('\n🛡️ SOLO WOMAN TRAVEL SAFETY:');
    console.log(`  Safety Assessment: ${result.soloWomanTravelSafety.overallSafetyAssessment}`);
    console.log(`  Safe Neighborhoods: ${result.soloWomanTravelSafety.safeNeighborhoods.join(', ')}`);
    console.log(`  Cultural Attire: ${result.soloWomanTravelSafety.culturalNuancesAndAttire}`);
    console.log(`  Precautions:`);
    result.soloWomanTravelSafety.precautionsAndAreasToAvoid.forEach((p) => console.log(`    ⚠️ ${p}`));
    console.log(`  Emergency Helplines:`);
    console.log(`    Women Helpline: ${result.soloWomanTravelSafety.emergencyHelplines.womenHelpline}`);
    console.log(`    Police: ${result.soloWomanTravelSafety.emergencyHelplines.police}`);
    console.log(`    Tourist Helpline: ${result.soloWomanTravelSafety.emergencyHelplines.touristHelpline}`);

    console.log('\n' + '='.repeat(70));
    console.log('✅ Flow execution completed successfully!');
    console.log('='.repeat(70));
  } catch (error) {
    console.error('❌ Error executing travelPlanFlow:', error);
  }
}

main();
