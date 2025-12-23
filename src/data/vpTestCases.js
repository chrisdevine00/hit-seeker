// Video Poker Strategy Test Cases
// Comprehensive test suite based on Wizard of Odds optimal strategy charts

const strategyTestCases = {
  'jacks-or-better': [
    // ==========================================
    // PAT HANDS (Keep all 5)
    // ==========================================
    { hand: "As Ks Qs Js 10s", expectedHold: [0,1,2,3,4], name: "Royal Flush" },
    { hand: "9s 8s 7s 6s 5s", expectedHold: [0,1,2,3,4], name: "Straight Flush" },
    { hand: "5h 4h 3h 2h Ah", expectedHold: [0,1,2,3,4], name: "Straight Flush (wheel)" },
    { hand: "7s 7h 7d 7c 2s", expectedHold: [0,1,2,3,4], name: "Four of a Kind" },
    { hand: "As Ah Ad Ac Ks", expectedHold: [0,1,2,3,4], name: "Four Aces" },
    { hand: "Ks Kh Kd 5s 5h", expectedHold: [0,1,2,3,4], name: "Full House" },
    { hand: "As Ks 9s 5s 3s", expectedHold: [0,1,2,3,4], name: "Flush (no draw)" },
    { hand: "9h 8s 7d 6c 5h", expectedHold: [0,1,2,3,4], name: "Straight (9-high)" },
    { hand: "Ah Ks Qd Jc 10h", expectedHold: [0,1,2,3,4], name: "Straight (broadway)" },
    { hand: "5h 4s 3d 2c Ah", expectedHold: [0,1,2,3,4], name: "Straight (wheel)" },
    
    // ==========================================
    // FOUR TO ROYAL (breaks any pat hand except RF/SF)
    // Per WoO: 4 to Royal > Flush, Straight, Trips, Two Pair
    // ==========================================
    { hand: "As Ks Qs Js 3s", expectedHold: [0,1,2,3], name: "4 to Royal > made flush" },
    { hand: "As Ks Qs 10s 3s", expectedHold: [0,1,2,3], name: "4 to Royal (A-K-Q-10) > flush" },
    { hand: "Ks Qs Js 10s 3s", expectedHold: [0,1,2,3], name: "4 to Royal (K-Q-J-10) > flush" },
    
    // ==========================================
    // THREE OF A KIND
    // ==========================================
    { hand: "7s 7h 7d Kc 2s", expectedHold: [0,1,2], name: "Trips - hold 3, draw 2" },
    { hand: "As Ah Ad 7c 2s", expectedHold: [0,1,2], name: "Trip Aces" },
    { hand: "2s 2h 2d Kc 7s", expectedHold: [0,1,2], name: "Trip 2s" },
    
    // ==========================================
    // TWO PAIR
    // ==========================================
    { hand: "As Ah Kd Kc 2s", expectedHold: [0,1,2,3], name: "Two pair AA/KK" },
    { hand: "5s 5h 3d 3c As", expectedHold: [0,1,2,3], name: "Two pair low" },
    { hand: "Js Jh 10d 10c 2s", expectedHold: [0,1,2,3], name: "Two pair JJ/1010" },
    
    // ==========================================
    // HIGH PAIR (Jacks or Better) - Hold pair only
    // ==========================================
    { hand: "As Ah Kd Qc 5s", expectedHold: [0,1], name: "Pair of Aces" },
    { hand: "Ks Kh 9d 5c 2s", expectedHold: [0,1], name: "Pair of Kings" },
    { hand: "Qs Qh 7d 4c 2s", expectedHold: [0,1], name: "Pair of Queens" },
    { hand: "Js Jh 7d 4c 2s", expectedHold: [0,1], name: "Pair of Jacks" },
    { hand: "As Ah Kd Qc Jh", expectedHold: [0,1], name: "Pair of Aces + 3 high cards" },
    
    // ==========================================
    // FOUR TO STRAIGHT FLUSH
    // ==========================================
    { hand: "9s 8s 7s 6s 2h", expectedHold: [0,1,2,3], name: "4 to SF open-ended" },
    { hand: "Js 10s 9s 8s 2h", expectedHold: [0,1,2,3], name: "4 to SF J-high open" },
    { hand: "9s 8s 7s 5s 2h", expectedHold: [0,1,2,3], name: "4 to SF inside" },
    { hand: "6s 5s 4s 3s Ah", expectedHold: [0,1,2,3], name: "4 to SF low" },
    
    // ==========================================
    // LOW PAIR - Various scenarios
    // ==========================================
    { hand: "5s 5h Kd Qc 2s", expectedHold: [0,1], name: "Low pair (5s)" },
    { hand: "10s 10h Kd 7c 2s", expectedHold: [0,1], name: "Pair of 10s (not JoB)" },
    { hand: "3s 3h Ad Kc Qh", expectedHold: [0,1], name: "Low pair + 3 high cards" },
    { hand: "6s 6h 5d 4c 3h", expectedHold: [0,1], name: "Low pair + 3 to straight" },
    
    // ==========================================
    // LOW PAIR VS 4 TO FLUSH (9/6 JoB: pair wins)
    // ==========================================
    { hand: "5s 5h Ks 9s 2s", expectedHold: [0,1], name: "Low pair beats 4-flush (9/6)" },
    { hand: "3s 3h As Ks Qs", expectedHold: [0,1], name: "Low pair beats 4-flush w/ royals" },
    
    // ==========================================
    // FOUR TO FLUSH (no pair)
    // ==========================================
    { hand: "As Ks 9s 5s 2h", expectedHold: [0,1,2,3], name: "4 to Flush" },
    { hand: "Js 9s 7s 4s 2h", expectedHold: [0,1,2,3], name: "4 to Flush (J high)" },
    { hand: "9s 7s 5s 3s Ah", expectedHold: [0,1,2,3], name: "4 to Flush (9 high)" },
    
    // ==========================================
    // THREE TO ROYAL FLUSH
    // ==========================================
    { hand: "As Ks Qs 7h 2d", expectedHold: [0,1,2], name: "3 to Royal AKQ" },
    { hand: "Ks Qs Js 7h 2d", expectedHold: [0,1,2], name: "3 to Royal KQJ" },
    { hand: "As Ks 10s 7h 2d", expectedHold: [0,1,2], name: "3 to Royal AK10" },
    { hand: "Qs Js 10s 7h 2d", expectedHold: [0,1,2], name: "3 to Royal QJ10" },
    { hand: "As Qs 10s 7h 2d", expectedHold: [0,1,2], name: "3 to Royal AQ10" },
    
    // ==========================================
    // FOUR TO STRAIGHT (open-ended)
    // ==========================================
    { hand: "9h 8s 7d 6c 2s", expectedHold: [0,1,2,3], name: "4 to Straight open 9-high" },
    { hand: "Jh 10s 9d 8c 2s", expectedHold: [0,1,2,3], name: "4 to Straight open J-high" },
    { hand: "6h 5s 4d 3c As", expectedHold: [0,1,2,3], name: "4 to Straight open 6-high" },
    
    // ==========================================
    // HIGH CARDS ONLY
    // ==========================================
    { hand: "As 7d 5c 3h 2s", expectedHold: [0], name: "Ace only" },
    { hand: "Ks 7d 5c 3h 2s", expectedHold: [0], name: "King only" },
    { hand: "As Kd 7c 5h 2s", expectedHold: [0,1], name: "AK offsuit" },
    { hand: "As Qd 7c 5h 2s", expectedHold: [0,1], name: "AQ offsuit" },
    { hand: "Kd Qc 7s 5h 2d", expectedHold: [0,1], name: "KQ offsuit" },
    { hand: "Kd Jc 7s 5h 2d", expectedHold: [0,1], name: "KJ offsuit" },
    { hand: "Qd Jc 7s 5h 2d", expectedHold: [0,1], name: "QJ offsuit" },
    
    // ==========================================
    // SUITED HIGH CARDS (2 cards)
    // ==========================================
    { hand: "As Ks 7d 5c 2h", expectedHold: [0,1], name: "AK suited" },
    { hand: "Ks Qs 7d 5c 2h", expectedHold: [0,1], name: "KQ suited" },
    { hand: "Qs Js 7d 5c 2h", expectedHold: [0,1], name: "QJ suited" },
    { hand: "Js 10s 7d 5c 2h", expectedHold: [0,1], name: "JT suited" },
    { hand: "As Js 7d 5c 2h", expectedHold: [0,1], name: "AJ suited" },
    
    // ==========================================
    // INSIDE STRAIGHT DRAWS (4 to gutshot)
    // Usually not worth it except with high cards
    // ==========================================
    { hand: "As Ks Qd Jc 2h", expectedHold: [0,1,2,3], name: "4 to Broadway (AKQJ)" },
    { hand: "Kh Qd Jc 10s 2h", expectedHold: [0,1,2,3], name: "4 to Straight KQJT open" },
    
    // ==========================================
    // GARBAGE HANDS - Draw 5
    // ==========================================
    { hand: "9d 7c 5s 3h 2d", expectedHold: [], name: "No value - draw 5" },
    { hand: "10d 8c 5s 3h 2d", expectedHold: [], name: "10 high garbage" },
    { hand: "9d 7c 4s 3h 2d", expectedHold: [], name: "9 high garbage" },
    
    // ==========================================
    // EDGE CASES / TRICKY DECISIONS
    // ==========================================
    { hand: "Js 10s 9s Ah Kd", expectedHold: [0,1,2], name: "3 to SF > AK offsuit" },
    { hand: "Ah Kh Qh 10s 9s", expectedHold: [0,1,2], name: "3 to Royal > 2 suited non-royal" },
    { hand: "As Ah 10h 9h 8h", expectedHold: [0,1], name: "High pair > 3 to flush" },
    { hand: "5s 5h 4d 3c 2h", expectedHold: [0,1], name: "Low pair > 4 to straight" },
    { hand: "Js Jh Qs Ks As", expectedHold: [0,1], name: "High pair > 4 to flush with royals" },
  ],
  
  'deuces-wild': [
    // ==========================================
    // NATURAL HANDS (No Deuces) - Pat
    // ==========================================
    { hand: "As Ks Qs Js 10s", expectedHold: [0,1,2,3,4], name: "Natural Royal" },
    { hand: "9s 8s 7s 6s 5s", expectedHold: [0,1,2,3,4], name: "Straight Flush" },
    { hand: "7s 7h 7d 7c 3s", expectedHold: [0,1,2,3,4], name: "Four of a Kind (no wild)" },
    { hand: "As Ks 9s 6s 3s", expectedHold: [0,1,2,3,4], name: "Flush (no wild)" },
    { hand: "9h 8d 7c 6s 5h", expectedHold: [0,1,2,3,4], name: "Straight (no wild)" },
    
    // ==========================================
    // 4 DEUCES (Hold deuces, draw for wild royal)
    // ==========================================
    { hand: "2s 2h 2d 2c 7s", expectedHold: [0,1,2,3], name: "4 Deuces" },
    { hand: "2s 2h 2d 2c As", expectedHold: [0,1,2,3], name: "4 Deuces + Ace" },
    { hand: "2s 2h 2d 2c Ks", expectedHold: [0,1,2,3], name: "4 Deuces + King" },
    
    // ==========================================
    // 3 DEUCES (Hold deuces only, draw 2)
    // ==========================================
    { hand: "2s 2h 2d Kc 7s", expectedHold: [0,1,2], name: "3 Deuces + garbage" },
    { hand: "2s 2h 2d Ac Ah", expectedHold: [0,1,2], name: "3 Deuces + pair (still draw 2)" },
    { hand: "2s 2h 2d As Ks", expectedHold: [0,1,2], name: "3 Deuces + 2 royals" },
    { hand: "2s 2h 2d 7s 7h", expectedHold: [0,1,2], name: "3 Deuces + low pair" },
    
    // ==========================================
    // 2 DEUCES
    // ==========================================
    // 2 Deuces + trips = 5 of a kind - KEEP
    { hand: "2s 2h 7d 7c 7s", expectedHold: [0,1,2,3,4], name: "2 Deuces + trips = 5K keep" },
    { hand: "2s 2h As Ah Ad", expectedHold: [0,1,2,3,4], name: "2 Deuces + trip Aces = 5K" },
    
    // 2 Deuces + pair = quads - draw 1 for 5K (EV is close but drawing wins)
    { hand: "2s 2h As Ah 7d", expectedHold: [0,1,2,3], name: "2 Deuces + pair = quads, draw 1" },
    { hand: "2s 2h 5s 5h Kd", expectedHold: [0,1,2,3], name: "2 Deuces + low pair, draw 1" },
    
    // 2 Deuces + 4 to Royal
    { hand: "2s 2h Ks Qs Js", expectedHold: [0,1,2,3,4], name: "2 Deuces + 3 royals = wild royal" },
    { hand: "2s 2h As Ks Qs", expectedHold: [0,1,2,3,4], name: "2 Deuces + AKQ suited = wild royal" },
    
    // 2 Deuces alone
    { hand: "2s 2h Kd Qc 7s", expectedHold: [0,1], name: "2 Deuces + nothing" },
    { hand: "2s 2h Ad Kc Qs", expectedHold: [0,1], name: "2 Deuces + AKQ offsuit" },
    { hand: "2s 2h 9d 7c 4s", expectedHold: [0,1], name: "2 Deuces + low cards" },
    
    // ==========================================
    // 1 DEUCE
    // ==========================================
    // 1 Deuce + made hands
    { hand: "2s As Ks Qs Js", expectedHold: [0,1,2,3,4], name: "1 Deuce = wild royal" },
    { hand: "2s 9s 8s 7s 6s", expectedHold: [0,1,2,3,4], name: "1 Deuce = straight flush" },
    { hand: "2s 7d 7c 7s 7h", expectedHold: [0,1,2,3,4], name: "1 Deuce + quads = 5K" },
    { hand: "2s As Ks 9s 5s", expectedHold: [0,1,2,3,4], name: "1 Deuce = flush" },
    { hand: "2s 9h 8d 7c 6s", expectedHold: [0,1,2,3,4], name: "1 Deuce = straight" },
    
    // 1 Deuce + 4 to Royal
    { hand: "2s Ks Qs Js 10s", expectedHold: [0,1,2,3,4], name: "1 Deuce + KQJT suited = wild royal" },
    { hand: "2s As Ks Qs 7d", expectedHold: [0,1,2,3], name: "1 Deuce + 3 to Royal, draw 1" },
    
    // 1 Deuce + trips
    { hand: "2s 7d 7c 7s Kh", expectedHold: [0,1,2,3], name: "1 Deuce + trips = quads, draw 1" },
    { hand: "2s As Ah Ad Kc", expectedHold: [0,1,2,3], name: "1 Deuce + trip Aces" },
    
    // 1 Deuce + pair = trips (HOLD BOTH)
    { hand: "2s Ah Ad Kc 7s", expectedHold: [0,1,2], name: "1 Deuce + pair Aces" },
    { hand: "2s 5h 5d Kc 7s", expectedHold: [0,1,2], name: "1 Deuce + low pair" },
    { hand: "2s Kh Kd Qc 7s", expectedHold: [0,1,2], name: "1 Deuce + pair Kings" },
    { hand: "2s 9h 9d 8c 7s", expectedHold: [0,1,2], name: "1 Deuce + pair 9s" },
    
    // 1 Deuce + 4 to SF
    { hand: "2s 9s 8s 7s Kd", expectedHold: [0,1,2,3], name: "1 Deuce + 3 to SF" },
    { hand: "2s Js 10s 9s Kd", expectedHold: [0,1,2,3], name: "1 Deuce + JT9 suited" },
    
    // 1 Deuce + 4 to flush
    { hand: "2s Ks 9s 5s 7d", expectedHold: [0,1,2,3], name: "1 Deuce + 3 to flush" },
    
    // 1 Deuce + 4 to straight
    { hand: "2s 9h 8d 7c Ks", expectedHold: [0,1,2,3], name: "1 Deuce + 3 to straight open" },
    
    // 1 Deuce alone
    { hand: "2s Kd Qc 7h 4s", expectedHold: [0], name: "1 Deuce + nothing" },
    { hand: "2s Ad Kc 9h 4s", expectedHold: [0], name: "1 Deuce + AK offsuit = hold deuce only" },
    { hand: "2s 9d 7c 5h 3s", expectedHold: [0], name: "1 Deuce + low garbage" },
    
    // ==========================================
    // 0 DEUCES - Standard poker but no pair pays
    // ==========================================
    { hand: "As Ks Qs Js 10s", expectedHold: [0,1,2,3,4], name: "0 Deuces - natural royal" },
    { hand: "As Ks 9s 5s 3s", expectedHold: [0,1,2,3,4], name: "0 Deuces - flush" },
    { hand: "Ah Kd Qc Js 10h", expectedHold: [0,1,2,3,4], name: "0 Deuces - straight" },
    { hand: "As Ah Ad 7c 5s", expectedHold: [0,1,2], name: "0 Deuces - trips" },
    { hand: "As Ah Kd Kc 5s", expectedHold: [0,1,2,3], name: "0 Deuces - two pair" },
    
    // 0 Deuces - 4 to Royal
    { hand: "As Ks Qs Js 7d", expectedHold: [0,1,2,3], name: "0 Deuces - 4 to Royal" },
    { hand: "Ks Qs Js 10s 7d", expectedHold: [0,1,2,3], name: "0 Deuces - 4 to Royal KQJT" },
    
    // 0 Deuces - pair (still worth holding for trips in DW)
    { hand: "As Ah Kd 9c 5s", expectedHold: [0,1], name: "0 Deuces - pair Aces" },
    { hand: "5s 5h Kd 9c 3s", expectedHold: [0,1], name: "0 Deuces - low pair" },
    
    // 0 Deuces - 4 to flush
    { hand: "As Ks 9s 5s 7d", expectedHold: [0,1,2,3], name: "0 Deuces - 4 to flush" },
    
    // 0 Deuces - 4 to straight
    { hand: "9h 8d 7c 6s Ks", expectedHold: [0,1,2,3], name: "0 Deuces - 4 to straight" },
    
    // 0 Deuces - 3 to Royal
    { hand: "As Ks Qs 7d 4c", expectedHold: [0,1,2], name: "0 Deuces - 3 to Royal" },
  ],
  
  'double-bonus': [
    // Same as JoB for most, but quad bonuses affect marginal decisions
    { hand: "As Ah Ad Ac 7s", expectedHold: [0,1,2,3,4], name: "Quad Aces = 160x" },
    { hand: "3s 3h 3d 3c 7s", expectedHold: [0,1,2,3,4], name: "Quad 3s = 80x" },
    { hand: "7s 7h 7d 7c As", expectedHold: [0,1,2,3,4], name: "Quad 7s = 50x" },
    
    // Trips
    { hand: "As Ah Ad Kc 7s", expectedHold: [0,1,2], name: "Trip Aces" },
    { hand: "3s 3h 3d Kc 7s", expectedHold: [0,1,2], name: "Trip 3s" },
    
    // High pair
    { hand: "As Ah Kd Qc Js", expectedHold: [0,1], name: "Pair of Aces" },
    
    // Low pair beats 4-flush on 9/7 DB
    { hand: "5s 5h Ks 9s 3s", expectedHold: [0,1], name: "Low pair > 4-flush (9/7)" },
    
    // Standard draws
    { hand: "As Ks Qs Js 3s", expectedHold: [0,1,2,3], name: "4 to Royal > flush" },
    { hand: "As Ks Qs 7h 3d", expectedHold: [0,1,2], name: "3 to Royal" },
  ],
  
  'double-double-bonus': [
    // Kicker matters for Aces + 2-4
    { hand: "As Ah Ad Ac 3s", expectedHold: [0,1,2,3,4], name: "Quad Aces + 2-4 = 400x" },
    { hand: "As Ah Ad Ac 2s", expectedHold: [0,1,2,3,4], name: "Quad Aces + 2 = 400x" },
    { hand: "As Ah Ad Ac Ks", expectedHold: [0,1,2,3,4], name: "Quad Aces + high = 160x" },
    
    // Quad 2-4 with A-4 kicker
    { hand: "3s 3h 3d 3c As", expectedHold: [0,1,2,3,4], name: "Quad 3s + A = 160x" },
    { hand: "3s 3h 3d 3c 4s", expectedHold: [0,1,2,3,4], name: "Quad 3s + 4 = 160x" },
    { hand: "3s 3h 3d 3c Ks", expectedHold: [0,1,2,3,4], name: "Quad 3s + K = 80x" },
    
    // Other quads
    { hand: "7s 7h 7d 7c As", expectedHold: [0,1,2,3,4], name: "Quad 7s = 50x" },
  ],
  
  'bonus-poker': [
    { hand: "As Ah Ad Ac 7s", expectedHold: [0,1,2,3,4], name: "Quad Aces = 80x" },
    { hand: "3s 3h 3d 3c 7s", expectedHold: [0,1,2,3,4], name: "Quad 3s = 40x" },
    { hand: "7s 7h 7d 7c As", expectedHold: [0,1,2,3,4], name: "Quad 7s = 25x" },
    
    // Standard JoB strategy otherwise
    { hand: "As Ah Kd Qc 5s", expectedHold: [0,1], name: "Pair of Aces" },
    { hand: "5s 5h Kd Qc 2s", expectedHold: [0,1], name: "Low pair" },
    { hand: "As Ks Qs Js 3s", expectedHold: [0,1,2,3], name: "4 to Royal > flush" },
  ],
  
  'joker-poker': [
    // Would need Joker card support - placeholder
  ],
};

// Run a single test case
const runStrategyTest = (testCase, gameType) => {
  const cards = parseHand(testCase.hand);
  const recommendation = getStrategyRecommendation(cards, null, gameType);
  
  // Sort both arrays for comparison
  const actualHold = [...(recommendation?.hold || [])].sort((a,b) => a-b);
  const expectedHold = [...testCase.expectedHold].sort((a,b) => a-b);
  
  const passed = JSON.stringify(actualHold) === JSON.stringify(expectedHold);
  
  return {
    ...testCase,
    gameType,
    cards,
    actualHold: recommendation?.hold || [],
    actualName: recommendation?.name || 'Unknown',
    actualReason: recommendation?.reason || '',
    passed
  };
};

// Run all tests for a game type
const runGameTests = (gameType) => {
  const tests = strategyTestCases[gameType] || [];
  return tests.map(test => runStrategyTest(test, gameType));
};

// Run all tests
const runAllStrategyTests = () => {
  const results = {};
  let totalPassed = 0;
  let totalTests = 0;
  
  Object.keys(strategyTestCases).forEach(gameType => {
    const gameResults = runGameTests(gameType);
    results[gameType] = gameResults;
    totalPassed += gameResults.filter(r => r.passed).length;
    totalTests += gameResults.length;
  });
  
  return { results, totalPassed, totalTests };
};


export { strategyTestCases, runStrategyTest, runGameTests, runAllStrategyTests };
