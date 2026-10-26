import { DESTINATIONS_DATA } from '../data/destinationsData';
import { storageService } from './storageService';

/**
 * Deterministic Rule-Based Recommendation Engine
 */
export function getRuleBasedRecommendations({
  startingCity = 'Bengaluru',
  durationDays = 3,
  budgetPerPerson = 15000,
  travellerType = 'friends',
  interests = []
}) {
  const scored = DESTINATIONS_DATA.map((dest) => {
    let score = 50; // base score
    const reasons = [];

    // 1. Starting City Connectivity
    const cityConn = dest.startingCityDistances?.[startingCity];
    if (cityConn) {
      if (cityConn.transitHours <= 7) {
        score += 25;
        reasons.push(`Fast direct transit from ${startingCity} (~${cityConn.transitHours} hrs via ${cityConn.transitMode})`);
      } else if (cityConn.transitHours <= 12) {
        score += 15;
        reasons.push(`Accessible from ${startingCity} via ${cityConn.transitMode}`);
      } else {
        score += 5;
        reasons.push(`Connected from ${startingCity} via ${cityConn.transitMode}`);
      }
    } else {
      score += 5;
      reasons.push(`Domestic air/rail connectivity from major Indian hubs`);
    }

    // 2. Budget Feasibility
    const estimatedDailyCost = dest.avgDailyBudget || 2000;
    const estimatedTripCostPerPerson = estimatedDailyCost * durationDays + (cityConn?.transitCost || 1200) * 2;
    const budgetRatio = budgetPerPerson / estimatedTripCostPerPerson;

    if (budgetRatio >= 1.2) {
      score += 20;
      reasons.push(`Comfortably within budget (~₹${Math.round(estimatedTripCostPerPerson).toLocaleString('en-IN')} total est. vs ₹${Number(budgetPerPerson).toLocaleString('en-IN')} budget)`);
    } else if (budgetRatio >= 0.9) {
      score += 15;
      reasons.push(`Fits your budget with standard budgeting`);
    } else {
      score -= 10;
      reasons.push(`May exceed tight budget — careful hostel/transport choices suggested`);
    }

    // 3. Duration Match
    if (durationDays >= dest.minDays && durationDays <= dest.maxDays) {
      score += 20;
      reasons.push(`Ideal duration match (${dest.minDays}–${dest.maxDays} days recommended; you chose ${durationDays} days)`);
    } else if (durationDays < dest.minDays) {
      score -= 5;
      reasons.push(`Can feel rushed for ${durationDays} days (best experienced in ${dest.minDays}+ days)`);
    } else {
      score += 10;
      reasons.push(`Plenty of time to explore local gems and day trips`);
    }

    // 4. Traveller Type Affinity
    if (dest.travellerAffinities?.includes(travellerType)) {
      score += 20;
      reasons.push(`Highly recommended for ${travellerType.replace(/_/g, ' ')}`);
    }

    // 5. Interest Overlap
    const matchingInterests = (dest.interests || []).filter((i) => interests.includes(i));
    if (matchingInterests.length > 0) {
      score += matchingInterests.length * 10;
      reasons.push(`Matches your interest in ${matchingInterests.join(', ')}`);
    }

    return {
      ...dest,
      recommendationScore: Math.min(99, Math.max(30, score)),
      reasons: reasons.slice(0, 4),
      estimatedTripCostPerPerson
    };
  });

  // Sort by score descending
  scored.sort((a, b) => b.recommendationScore - a.recommendationScore);
  return scored;
}

/**
 * Destination Recommender with optional LLM API
 */
export async function getDestinationRecommendations({
  startingCity,
  durationDays,
  budgetPerPerson,
  travellerType,
  interests
}) {
  const settings = storageService.getSettings();
  const baseRanked = getRuleBasedRecommendations({
    startingCity,
    durationDays,
    budgetPerPerson,
    travellerType,
    interests
  });

  // If Gemini API Key is configured, attempt intelligent AI commentary
  if (settings.geminiApiKey && settings.geminiApiKey.trim().length > 10) {
    try {
      const topCandidates = baseRanked.slice(0, 5).map((d) => ({
        name: d.name,
        state: d.state,
        score: d.recommendationScore,
        highlights: d.highlights
      }));

      const prompt = `You are an expert Indian travel curator. Given the following user travel parameters:
Starting City: ${startingCity}
Duration: ${durationDays} days
Budget per Person: INR ₹${budgetPerPerson}
Traveller Type: ${travellerType}
Interests: ${interests.join(', ')}

Here are our top Indian destination matches:
${JSON.stringify(topCandidates)}

Return a JSON array of objects with keys: "name", "aiInsight" (a crisp 1-sentence personalized reason why this traveler would love it). Keep it authentic, exciting, and realistic for India travel. Return only valid JSON.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${settings.model || 'gemini-1.5-flash'}:generateContent?key=${settings.geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            const insightMap = {};
            parsed.forEach((item) => {
              if (item.name && item.aiInsight) {
                insightMap[item.name.toLowerCase()] = item.aiInsight;
              }
            });

            return baseRanked.map((dest) => {
              const matchedKey = Object.keys(insightMap).find((k) =>
                dest.name.toLowerCase().includes(k) || k.includes(dest.name.toLowerCase())
              );
              return {
                ...dest,
                aiGenerated: true,
                aiComment: matchedKey ? insightMap[matchedKey] : null
              };
            });
          }
        }
      }
    } catch (err) {
      console.warn('LLM API call failed, falling back to rule-based engine:', err);
    }
  }

  // Fallback to deterministic rule-based output
  return baseRanked.map((dest) => ({
    ...dest,
    aiGenerated: false,
    aiComment: null
  }));
}
