// Distance calculation (Haversine formula in kilometers)
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 5;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Estimate transit minutes in Indian hill/city traffic conditions
export function estimateTransitMinutes(km) {
  if (km <= 2) return 15;
  if (km <= 5) return 20;
  if (km <= 10) return 30;
  if (km <= 20) return 45;
  if (km <= 40) return 75;
  return Math.round(km * 2.2);
}

// Slot templates based on travel pace
const SLOT_DEFINITIONS = {
  relaxed: [
    { slotName: 'Morning Explorer', start: '10:00 AM', end: '12:30 PM', timeBucket: 'morning' },
    { slotName: 'Late Afternoon & Sunset', start: '04:00 PM', end: '06:30 PM', timeBucket: 'evening' }
  ],
  balanced: [
    { slotName: 'Morning Discovery', start: '09:00 AM', end: '11:30 AM', timeBucket: 'morning' },
    { slotName: 'Afternoon Heritage & Leisure', start: '02:00 PM', end: '04:30 PM', timeBucket: 'afternoon' },
    { slotName: 'Evening Cultural Vibe', start: '05:30 PM', end: '07:30 PM', timeBucket: 'evening' }
  ],
  packed: [
    { slotName: 'Early Morning Expedition', start: '08:00 AM', end: '10:30 AM', timeBucket: 'morning' },
    { slotName: 'Midday Highlights', start: '11:15 AM', end: '01:30 PM', timeBucket: 'morning' },
    { slotName: 'Afternoon Immersion', start: '02:45 PM', end: '04:45 PM', timeBucket: 'afternoon' },
    { slotName: 'Golden Hour Sunset', start: '05:30 PM', end: '07:30 PM', timeBucket: 'evening' },
    { slotName: 'Night Bazaar & Culinary Stroll', start: '08:15 PM', end: '09:45 PM', timeBucket: 'evening' }
  ]
};

/**
 * Generate itinerary for a single stop
 */
function generateDaysForStop({
  destination,
  daysCount,
  startDayOffset = 0,
  baseDate,
  pace = 'balanced',
  userInterests = [],
  isFirstStop = true,
  previousStop = null
}) {
  const safePace = SLOT_DEFINITIONS[pace] ? pace : 'balanced';
  const slotsConfig = SLOT_DEFINITIONS[safePace];
  const maxActivitiesPerDay = slotsConfig.length;

  const allAttractions = [...(destination.attractions || [])];

  const scoredAttractions = allAttractions.map((attraction) => {
    let score = 1;
    if (userInterests.includes(attraction.category)) {
      score += 3;
    }
    return { ...attraction, matchScore: score };
  });

  scoredAttractions.sort((a, b) => b.matchScore - a.matchScore);

  const totalActivitiesNeeded = daysCount * maxActivitiesPerDay;
  const pool = [];

  let poolIndex = 0;
  while (pool.length < totalActivitiesNeeded) {
    const item = scoredAttractions[poolIndex % scoredAttractions.length];
    pool.push({
      ...item,
      instanceId: `${item.id}-s${destination.id}-${pool.length}`
    });
    poolIndex++;
  }

  const days = [];
  const startMoment = new Date(baseDate || Date.now());
  const remainingPool = [...pool.slice(0, totalActivitiesNeeded)];

  for (let localDay = 1; localDay <= daysCount; localDay++) {
    const globalDayNum = startDayOffset + localDay;
    const currentDate = new Date(startMoment);
    currentDate.setDate(currentDate.getDate() + (globalDayNum - 1));

    const dayActivities = [];

    // If this is Day 1 of a subsequent stop, add an intercity transit card first
    if (!isFirstStop && localDay === 1 && previousStop) {
      const dist = calculateDistanceKm(
        previousStop.coordinates?.lat,
        previousStop.coordinates?.lng,
        destination.coordinates?.lat,
        destination.coordinates?.lng
      );
      const estHours = Math.max(1, Math.round((dist / 40) * 10) / 10);
      const transitCostEst = Math.round(dist * 3.5);

      dayActivities.push({
        id: `intercity-transit-${globalDayNum}`,
        name: `Journey from ${previousStop.name} to ${destination.name}`,
        description: `Scenic intercity transit through picturesque regional routes. Relax, enjoy local dhabas/cafes along the highway, and check into your stay in ${destination.name}.`,
        category: 'adventure',
        cost: transitCostEst,
        durationMinutes: Math.round(estHours * 60),
        timeSlot: '08:30 AM – 01:00 PM',
        slotLabel: 'Intercity Journey',
        travelTime: `~${dist} km highway route (~${estHours} hrs via train/cab/bus)`,
        transitMinutes: Math.round(estHours * 60),
        coordinates: destination.coordinates,
        tips: `Pre-book KSRTC/train tickets or verified cab for luggage comfort.`,
        completed: false,
        isIntercityTransit: true
      });
    }

    // Now fill remaining sightseeing slots
    const availableSlots = maxActivitiesPerDay - dayActivities.length;
    if (availableSlots > 0 && remainingPool.length > 0) {
      const seed = remainingPool.shift();
      dayActivities.push(seed);

      const needed = availableSlots - 1;
      for (let k = 0; k < needed && remainingPool.length > 0; k++) {
        const lastActivity = dayActivities[dayActivities.length - 1];
        let bestIdx = 0;
        let minDistance = Infinity;

        remainingPool.forEach((candidate, idx) => {
          const dist = calculateDistanceKm(
            lastActivity.coordinates?.lat,
            lastActivity.coordinates?.lng,
            candidate.coordinates?.lat,
            candidate.coordinates?.lng
          );
          if (dist < minDistance) {
            minDistance = dist;
            bestIdx = idx;
          }
        });

        const [picked] = remainingPool.splice(bestIdx, 1);
        dayActivities.push(picked);
      }
    }

    const formattedActivities = dayActivities.map((act, idx) => {
      if (act.isIntercityTransit) return act;

      const slot = slotsConfig[idx] || {
        slotName: `Activity ${idx + 1}`,
        start: `${10 + idx * 3}:00 AM`,
        end: `${12 + idx * 3}:00 PM`,
        timeBucket: 'morning'
      };

      let transitInfo = 'Starting point of the day';
      let transitMin = 0;

      if (idx > 0) {
        const prev = dayActivities[idx - 1];
        const dist = calculateDistanceKm(
          prev.coordinates?.lat,
          prev.coordinates?.lng,
          act.coordinates?.lat,
          act.coordinates?.lng
        );
        transitMin = estimateTransitMinutes(dist);
        transitInfo = `~${dist} km from ${prev.name} (${transitMin} min by auto/cab)`;
      }

      return {
        id: act.instanceId || `${act.id}-${globalDayNum}-${idx}`,
        originalId: act.id,
        name: act.name,
        description: act.description,
        category: act.category,
        cost: act.cost || 0,
        durationMinutes: act.durationMinutes || 90,
        timeSlot: `${slot.start} – ${slot.end}`,
        slotLabel: slot.slotName,
        travelTime: transitInfo,
        transitMinutes: transitMin,
        coordinates: act.coordinates,
        tips: act.tips || 'Check local guidelines and weather before departure.',
        completed: false
      };
    });

    const dayTitles = [
      `Arrival & Highlights in ${destination.name}`,
      `Iconic Landscapes & Panoramic Horizons`,
      `Cultural Heartbeat, Bazaars & Sunsets`,
      `Hidden Gems & Local Flavours`,
      `Relaxed Trails & Souvenirs`
    ];

    days.push({
      dayNumber: globalDayNum,
      destinationId: destination.id,
      destinationName: destination.name,
      destinationState: destination.state,
      destinationCoordinates: destination.coordinates,
      dateString: currentDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      }),
      title: `${destination.name}: ${dayTitles[(localDay - 1) % dayTitles.length]}`,
      notes: `Carry light luggage for easy transitions, stay hydrated, and keep cash handy for local autos.`,
      activities: formattedActivities
    });
  }

  return days;
}

/**
 * Generate Unified Multi-Destination Itinerary
 * Works with both single-destination and multi-destination trips!
 */
export function generateItinerary({
  destination = null,
  stops = [],
  startDate,
  durationDays = 3,
  pace = 'balanced',
  userInterests = []
}) {
  // Normalize stops
  let normalizedStops = [];
  if (stops && stops.length > 0) {
    normalizedStops = stops;
  } else if (destination) {
    normalizedStops = [{ destination, daysCount: durationDays || 3 }];
  } else {
    return [];
  }

  const allDays = [];
  let currentDayOffset = 0;
  const baseDate = startDate || new Date().toISOString().split('T')[0];

  normalizedStops.forEach((stop, index) => {
    const dest = stop.destination;
    const daysCount = Math.max(1, Number(stop.daysCount) || 1);
    const prevStop = index > 0 ? normalizedStops[index - 1].destination : null;

    const stopDays = generateDaysForStop({
      destination: dest,
      daysCount,
      startDayOffset: currentDayOffset,
      baseDate,
      pace,
      userInterests,
      isFirstStop: index === 0,
      previousStop: prevStop
    });

    allDays.push(...stopDays);
    currentDayOffset += daysCount;
  });

  return allDays;
}

/**
 * Calculate Comprehensive Multi-Stop Trip Budget
 */
export function calculateTripBudget({
  destination = null,
  stops = [],
  itineraryDays = [],
  travellers = 2,
  budgetPerPerson = 15000,
  startingCity = 'Bengaluru',
  durationDays = 3,
  pace = 'balanced'
}) {
  const numTravellers = Math.max(1, Number(travellers) || 1);
  const totalDays = itineraryDays.length > 0 ? itineraryDays.length : Math.max(1, Number(durationDays) || 1);
  const nights = Math.max(1, totalDays - 1);

  // Normalize stops
  let normalizedStops = [];
  if (stops && stops.length > 0) {
    normalizedStops = stops;
  } else if (destination) {
    normalizedStops = [{ destination, daysCount: totalDays }];
  } else {
    normalizedStops = [];
  }

  // 1. Activity / Entry Fees
  let activityFeesPerPerson = 0;
  itineraryDays.forEach((day) => {
    (day.activities || []).forEach((act) => {
      activityFeesPerPerson += Number(act.cost) || 0;
    });
  });
  const totalActivityCost = activityFeesPerPerson * numTravellers;

  // 2. Intercity Transit:
  // a) From startingCity to First Stop
  const firstDest = normalizedStops[0]?.destination;
  const firstDestInfo = firstDest?.startingCityDistances?.[startingCity];
  const leg1Cost = firstDestInfo?.transitCost || 850;

  // b) Inter-stop transits
  let interStopTransitTotal = 0;
  for (let i = 0; i < normalizedStops.length - 1; i++) {
    const fromDest = normalizedStops[i].destination;
    const toDest = normalizedStops[i + 1].destination;
    const dist = calculateDistanceKm(
      fromDest.coordinates?.lat,
      fromDest.coordinates?.lng,
      toDest.coordinates?.lat,
      toDest.coordinates?.lng
    );
    // reasonable train/bus intercity fare in India (~₹2.5/km)
    interStopTransitTotal += Math.max(300, Math.round(dist * 2.5));
  }

  // c) Last Stop back to startingCity
  const lastDest = normalizedStops[normalizedStops.length - 1]?.destination;
  const lastDestInfo = lastDest?.startingCityDistances?.[startingCity];
  const returnCost = lastDestInfo?.transitCost || 850;

  const totalIntercityTransit = (leg1Cost + interStopTransitTotal + returnCost) * numTravellers;

  // 3. Local In-City Transit
  const localTransitPerDay = pace === 'packed' ? 800 : pace === 'relaxed' ? 450 : 600;
  const totalLocalTransit = localTransitPerDay * totalDays;
  const totalTransportCost = totalIntercityTransit + totalLocalTransit;

  // 4. Accommodation Costs
  const roomsNeeded = Math.ceil(numTravellers / 2);
  let totalAccommodationCost = 0;

  normalizedStops.forEach((stop) => {
    const daysInStop = Math.max(1, Number(stop.daysCount) || 1);
    const nightsInStop = Math.max(1, daysInStop);
    const nightlyRate = stop.destination?.baseCosts?.stay || 1400;
    totalAccommodationCost += nightlyRate * roomsNeeded * nightsInStop;
  });

  // 5. Food Costs
  let totalDailyFoodPerPerson = 0;
  normalizedStops.forEach((stop) => {
    const daysInStop = Math.max(1, Number(stop.daysCount) || 1);
    const dailyFood = stop.destination?.baseCosts?.food || 600;
    totalDailyFoodPerPerson += dailyFood * daysInStop;
  });
  const totalFoodCost = totalDailyFoodPerPerson * numTravellers;

  // 6. Miscellaneous & Contingency Buffer (8%)
  const subtotal = totalActivityCost + totalTransportCost + totalAccommodationCost + totalFoodCost;
  const miscellaneousCost = Math.round(subtotal * 0.08);

  const totalEstimatedCost = subtotal + miscellaneousCost;
  const costPerPerson = Math.round(totalEstimatedCost / numTravellers);

  const totalAllocatedBudget = Number(budgetPerPerson) * numTravellers;
  const remainingBudget = totalAllocatedBudget - totalEstimatedCost;
  const isOverBudget = remainingBudget < 0;

  const costSavingTips = [];
  if (isOverBudget || remainingBudget < totalAllocatedBudget * 0.15) {
    costSavingTips.push('Book Sleeper or 3AC train coaches between regional circuit cities (e.g. Varkala/Munnar/Kochi) on IRCTC in advance.');
    costSavingTips.push('Opt for local state RTC buses (like KSRTC Fast Passenger or Volvo) for inter-city hops to save 50% compared to private cabs.');
    costSavingTips.push('Choose verified backpacker hostels or traditional homestays across your stops.');
    costSavingTips.push('Enjoy traditional thali meals at local vegetarian and seafood messes rather than upscale tourist-enclave cafes.');
  } else {
    costSavingTips.push('Your budget is comfortably healthy for this regional itinerary!');
    costSavingTips.push('Consider allocating surplus towards scenic sunset boat cruises or ayurvedic wellness massages.');
  }

  const stopNames = normalizedStops.map((s) => s.destination?.name).join(' ➔ ');

  return {
    numTravellers,
    numDays: totalDays,
    nights,
    circuitRoute: stopNames,
    categories: {
      transport: {
        name: 'Transport (Intercity & Circuit)',
        amount: totalTransportCost,
        details: `Round-trip from ${startingCity} + hops across ${normalizedStops.length} destination stop(s)`
      },
      accommodation: {
        name: 'Accommodation & Stays',
        amount: totalAccommodationCost,
        details: `${roomsNeeded} room(s) across ${normalizedStops.length} destination stop(s)`
      },
      food: {
        name: 'Food & Dining',
        amount: totalFoodCost,
        details: `Daily regional dining across ${totalDays} days`
      },
      activities: {
        name: 'Attractions & Entry Fees',
        amount: totalActivityCost,
        details: `${itineraryDays.reduce((acc, d) => acc + (d.activities?.length || 0), 0)} planned sights`
      },
      miscellaneous: {
        name: 'Buffer & Contingency',
        amount: miscellaneousCost,
        details: '8% reserve for local shopping, emergencies, water & tips'
      }
    },
    totalEstimatedCost,
    costPerPerson,
    totalAllocatedBudget,
    remainingBudget,
    isOverBudget,
    overBudgetBy: isOverBudget ? Math.abs(remainingBudget) : 0,
    costSavingTips
  };
}
