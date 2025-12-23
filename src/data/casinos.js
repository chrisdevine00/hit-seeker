// Vegas Casinos Database for Hit Seeker
// Organized by ownership/location

const vegasCasinos = [
  // ============================================
  // CAESARS ENTERTAINMENT (Strip)
  // ============================================
  { id: 'caesars-palace', name: 'Caesars Palace', owner: 'Caesars', area: 'Center Strip', size: 'XL', slots: '1,300+', lat: 36.1162, lng: -115.1745, apNotes: 'Large floor, high competition. Multiple tower areas.' },
  { id: 'paris', name: 'Paris Las Vegas', owner: 'Caesars', area: 'Center Strip', size: 'Large', slots: '1,000+', lat: 36.1125, lng: -115.1707, apNotes: 'Good variety. Connected to Ballys/Horseshoe.' },
  { id: 'horseshoe', name: 'Horseshoe', owner: 'Caesars', area: 'Center Strip', size: 'Large', slots: '1,100+', lat: 36.1119, lng: -115.1726, apNotes: 'Formerly Ballys. WSOP home. Big floor.' },
  { id: 'flamingo', name: 'Flamingo', owner: 'Caesars', area: 'Center Strip', size: 'Medium', slots: '1,000+', lat: 36.1161, lng: -115.1694, apNotes: 'Classic property. Decent variety.' },
  { id: 'linq', name: 'The LINQ', owner: 'Caesars', area: 'Center Strip', size: 'Small', slots: '750+', lat: 36.1175, lng: -115.1690, apNotes: 'Smaller floor = faster to scout. Newer machines.' },
  { id: 'harrahs', name: "Harrah's", owner: 'Caesars', area: 'Center Strip', size: 'Medium', slots: '1,100+', lat: 36.1191, lng: -115.1693, apNotes: 'Older property. Less crowded.' },
  { id: 'cromwell', name: 'The Cromwell', owner: 'Caesars', area: 'Center Strip', size: 'Small', slots: '400+', lat: 36.1150, lng: -115.1710, apNotes: 'Boutique casino. Very small = fast scout.' },
  { id: 'planet-hollywood', name: 'Planet Hollywood', owner: 'Caesars', area: 'Center Strip', size: 'Large', slots: '1,300+', lat: 36.1098, lng: -115.1711, apNotes: 'Large floor. Miracle Mile shops attached.' },
  
  // ============================================
  // MGM RESORTS (Strip)
  // ============================================
  { id: 'bellagio', name: 'Bellagio', owner: 'MGM', area: 'Center Strip', size: 'XL', slots: '2,300+', lat: 36.1129, lng: -115.1765, apNotes: 'Upscale. Higher denoms. Large floor spread out.' },
  { id: 'aria', name: 'ARIA', owner: 'MGM', area: 'Center Strip', size: 'XL', slots: '1,900+', lat: 36.1072, lng: -115.1767, apNotes: 'Modern property. Good high-limit area.' },
  { id: 'vdara', name: 'Vdara', owner: 'MGM', area: 'Center Strip', size: 'None', slots: '0', lat: 36.1080, lng: -115.1780, apNotes: 'No casino - hotel only.' },
  { id: 'cosmopolitan', name: 'The Cosmopolitan', owner: 'MGM', area: 'Center Strip', size: 'Large', slots: '1,300+', lat: 36.1098, lng: -115.1743, apNotes: 'Trendy crowd. Multiple floors.' },
  { id: 'mgm-grand', name: 'MGM Grand', owner: 'MGM', area: 'South Strip', size: 'XL', slots: '2,500+', lat: 36.1023, lng: -115.1696, apNotes: 'Massive floor. Multiple areas. Can take hours to scout.' },
  { id: 'signature-mgm', name: 'The Signature at MGM', owner: 'MGM', area: 'South Strip', size: 'None', slots: '0', lat: 36.1010, lng: -115.1650, apNotes: 'No casino - condo hotel.' },
  { id: 'new-york-new-york', name: 'New York-New York', owner: 'MGM', area: 'South Strip', size: 'Large', slots: '1,500+', lat: 36.1022, lng: -115.1745, apNotes: 'Connected to Park MGM. Winding layout.' },
  { id: 'park-mgm', name: 'Park MGM', owner: 'MGM', area: 'South Strip', size: 'Medium', slots: '900+', lat: 36.1018, lng: -115.1760, apNotes: 'Formerly Monte Carlo. Smaller, modern.' },
  { id: 'excalibur', name: 'Excalibur', owner: 'MGM', area: 'South Strip', size: 'Large', slots: '1,200+', lat: 36.0988, lng: -115.1753, apNotes: 'Budget friendly. Good variety.' },
  { id: 'luxor', name: 'Luxor', owner: 'MGM', area: 'South Strip', size: 'Large', slots: '1,200+', lat: 36.0955, lng: -115.1761, apNotes: 'Pyramid layout. Inclinator access.' },
  { id: 'mandalay-bay', name: 'Mandalay Bay', owner: 'MGM', area: 'South Strip', size: 'XL', slots: '1,700+', lat: 36.0906, lng: -115.1763, apNotes: 'Far south. Less foot traffic = less competition.' },
  { id: 'delano', name: 'Delano', owner: 'MGM', area: 'South Strip', size: 'None', slots: '0', lat: 36.0890, lng: -115.1770, apNotes: 'No casino - boutique hotel at Mandalay.' },
  { id: 'mirage', name: 'The Mirage', owner: 'MGM', area: 'Center Strip', size: 'Large', slots: '1,200+', lat: 36.1212, lng: -115.1742, apNotes: 'Being converted to Hard Rock 2025. Check status.' },
  { id: 'treasure-island', name: 'Treasure Island (TI)', owner: 'Independent', area: 'North Strip', size: 'Medium', slots: '900+', lat: 36.1247, lng: -115.1712, apNotes: 'Independent. Less corporate.' },
  
  // ============================================
  // WYNN RESORTS (North Strip)
  // ============================================
  { id: 'wynn', name: 'Wynn Las Vegas', owner: 'Wynn', area: 'North Strip', size: 'XL', slots: '1,900+', lat: 36.1263, lng: -115.1620, apNotes: 'Upscale. Higher denoms. Excellent VP pay tables.' },
  { id: 'encore', name: 'Encore', owner: 'Wynn', area: 'North Strip', size: 'Large', slots: '900+', lat: 36.1290, lng: -115.1630, apNotes: 'Connected to Wynn. Similar upscale vibe.' },
  
  // ============================================
  // VENETIAN/PALAZZO (North Strip)
  // ============================================
  { id: 'venetian', name: 'The Venetian', owner: 'Apollo', area: 'North Strip', size: 'XL', slots: '2,100+', lat: 36.1215, lng: -115.1692, apNotes: 'Massive. Multiple areas. Good VP selection.' },
  { id: 'palazzo', name: 'The Palazzo', owner: 'Apollo', area: 'North Strip', size: 'Large', slots: '1,200+', lat: 36.1250, lng: -115.1680, apNotes: 'Connected to Venetian. Slightly quieter.' },
  
  // ============================================
  // RESORTS WORLD (North Strip)
  // ============================================
  { id: 'resorts-world', name: 'Resorts World', owner: 'Genting', area: 'North Strip', size: 'XL', slots: '3,000+', lat: 36.1370, lng: -115.1680, apNotes: 'Newest megaresort (2021). Modern machines. Multiple brands.' },
  
  // ============================================
  // SAHARA/CIRCUS (North Strip)
  // ============================================
  { id: 'sahara', name: 'SAHARA Las Vegas', owner: 'Meruelo', area: 'North Strip', size: 'Medium', slots: '600+', lat: 36.1413, lng: -115.1567, apNotes: 'Renovated 2019. Less crowded.' },
  { id: 'circus-circus', name: 'Circus Circus', owner: 'Ruffin', area: 'North Strip', size: 'Large', slots: '1,100+', lat: 36.1364, lng: -115.1628, apNotes: 'Older property. Budget crowd. Sprawling layout.' },
  
  // ============================================
  // DOWNTOWN (Fremont Street)
  // ============================================
  { id: 'golden-nugget', name: 'Golden Nugget', owner: 'Landry\'s', area: 'Downtown', size: 'Large', slots: '1,200+', lat: 36.1707, lng: -115.1446, apNotes: 'Best downtown property. Good variety.' },
  { id: 'circa', name: 'Circa', owner: 'Stevens', area: 'Downtown', size: 'Medium', slots: '800+', lat: 36.1720, lng: -115.1430, apNotes: 'Newest downtown (2020). Adults only. Modern machines.' },
  { id: 'fremont', name: 'Fremont', owner: 'Boyd', area: 'Downtown', size: 'Medium', slots: '800+', lat: 36.1700, lng: -115.1420, apNotes: 'Classic downtown. Hawaiian theme.' },
  { id: 'four-queens', name: 'Four Queens', owner: 'TLC', area: 'Downtown', size: 'Small', slots: '600+', lat: 36.1698, lng: -115.1432, apNotes: 'Smaller. Less crowded.' },
  { id: 'binions', name: "Binion's", owner: 'TLC', area: 'Downtown', size: 'Small', slots: '400+', lat: 36.1702, lng: -115.1438, apNotes: 'Historic. Original WSOP home.' },
  { id: 'golden-gate', name: 'Golden Gate', owner: 'Stevens', area: 'Downtown', size: 'Small', slots: '300+', lat: 36.1706, lng: -115.1446, apNotes: 'Oldest casino in Vegas. Tiny but historic.' },
  { id: 'downtown-grand', name: 'Downtown Grand', owner: 'Fifth Street', area: 'Downtown', size: 'Medium', slots: '600+', lat: 36.1720, lng: -115.1410, apNotes: 'Off Fremont St. Quieter.' },
  { id: 'california', name: 'California', owner: 'Boyd', area: 'Downtown', size: 'Medium', slots: '700+', lat: 36.1695, lng: -115.1418, apNotes: 'Hawaiian theme. Loyal locals crowd.' },
  { id: 'main-street-station', name: 'Main Street Station', owner: 'Boyd', area: 'Downtown', size: 'Medium', slots: '600+', lat: 36.1710, lng: -115.1405, apNotes: 'Victorian theme. Good VP.' },
  { id: 'plaza', name: 'Plaza', owner: 'Tamares', area: 'Downtown', size: 'Medium', slots: '700+', lat: 36.1710, lng: -115.1480, apNotes: 'West end of Fremont. Pool deck.' },
  { id: 'el-cortez', name: 'El Cortez', owner: 'Family', area: 'Downtown', size: 'Medium', slots: '600+', lat: 36.1690, lng: -115.1365, apNotes: 'Off Fremont. Old Vegas vibe. Good low-limit.' },
  
  // ============================================
  // LOCALS CASINOS (Off Strip - Boyd)
  // ============================================
  { id: 'orleans', name: 'Orleans', owner: 'Boyd', area: 'West', size: 'Large', slots: '2,200+', lat: 36.1023, lng: -115.2032, apNotes: 'Huge locals casino. Good variety. Bowling alley.' },
  { id: 'gold-coast', name: 'Gold Coast', owner: 'Boyd', area: 'West', size: 'Medium', slots: '1,200+', lat: 36.1170, lng: -115.1930, apNotes: 'Across from Palms. Locals spot.' },
  { id: 'palms', name: 'Palms', owner: 'San Manuel', area: 'West', size: 'Large', slots: '1,300+', lat: 36.1145, lng: -115.1950, apNotes: 'Renovated. Tribal owned now.' },
  { id: 'suncoast', name: 'Suncoast', owner: 'Boyd', area: 'Summerlin', size: 'Large', slots: '1,800+', lat: 36.1920, lng: -115.2880, apNotes: 'Far west. Locals. Good VP.' },
  { id: 'red-rock', name: 'Red Rock Casino', owner: 'Station', area: 'Summerlin', size: 'XL', slots: '2,500+', lat: 36.1710, lng: -115.2960, apNotes: 'Upscale locals. Beautiful property.' },
  { id: 'sams-town', name: 'Sam\'s Town', owner: 'Boyd', area: 'Boulder', size: 'Large', slots: '1,800+', lat: 36.1108, lng: -115.0525, apNotes: 'East side. Western theme.' },
  
  // ============================================
  // LOCALS CASINOS (Off Strip - Station)
  // ============================================
  { id: 'green-valley-ranch', name: 'Green Valley Ranch', owner: 'Station', area: 'Henderson', size: 'Large', slots: '2,200+', lat: 36.0270, lng: -115.0810, apNotes: 'Upscale Henderson locals.' },
  { id: 'palace-station', name: 'Palace Station', owner: 'Station', area: 'West', size: 'Large', slots: '2,000+', lat: 36.1320, lng: -115.1980, apNotes: 'Near Strip. Recently renovated.' },
  { id: 'boulder-station', name: 'Boulder Station', owner: 'Station', area: 'Boulder', size: 'Large', slots: '2,200+', lat: 36.1520, lng: -115.0640, apNotes: 'East side locals.' },
  { id: 'sunset-station', name: 'Sunset Station', owner: 'Station', area: 'Henderson', size: 'Large', slots: '2,400+', lat: 36.0540, lng: -115.0370, apNotes: 'Southeast. Big locals casino.' },
  { id: 'texas-station', name: 'Texas Station', owner: 'Station', area: 'North LV', size: 'Large', slots: '2,000+', lat: 36.2150, lng: -115.1820, apNotes: 'North Las Vegas.' },
  { id: 'santa-fe-station', name: 'Santa Fe Station', owner: 'Station', area: 'Rancho', size: 'Medium', slots: '1,600+', lat: 36.2280, lng: -115.2650, apNotes: 'Northwest. Bowling alley.' },
  { id: 'fiesta-henderson', name: 'Fiesta Henderson', owner: 'Station', area: 'Henderson', size: 'Medium', slots: '1,100+', lat: 36.0320, lng: -115.0250, apNotes: 'Henderson locals. Mexican theme.' },
  { id: 'fiesta-rancho', name: 'Fiesta Rancho', owner: 'Station', area: 'North LV', size: 'Medium', slots: '1,100+', lat: 36.2180, lng: -115.1510, apNotes: 'North LV. Ice skating rink.' },
  
  // ============================================
  // OTHER STRIP PROPERTIES
  // ============================================
  { id: 'strat', name: 'The STRAT', owner: 'Golden', area: 'North Strip', size: 'Large', slots: '900+', lat: 36.1473, lng: -115.1558, apNotes: 'Tower observation deck. Far north.' },
  { id: 'fontainebleau', name: 'Fontainebleau', owner: 'Fontainebleau', area: 'North Strip', size: 'XL', slots: '1,500+', lat: 36.1380, lng: -115.1650, apNotes: 'Opened Dec 2023. Brand new. High-end.' },
  { id: 'tropicana', name: 'Tropicana', owner: 'Bally\'s Corp', area: 'South Strip', size: 'Large', slots: '800+', lat: 36.0995, lng: -115.1720, apNotes: 'CLOSING 2024 for A\'s stadium. Check status.' },
  { id: 'hooters', name: 'OYO (Hooters)', owner: 'OYO', area: 'South Strip', size: 'Small', slots: '300+', lat: 36.0980, lng: -115.1700, apNotes: 'Budget property. Small.' },
  
  // ============================================
  // AIRPORT/SOUTH
  // ============================================
  { id: 'south-point', name: 'South Point', owner: 'Gaughan', area: 'South LV', size: 'XL', slots: '2,400+', lat: 36.0140, lng: -115.1720, apNotes: 'Far south. Huge locals. Equestrian center.' },
  { id: 'silverton', name: 'Silverton', owner: 'Silverton', area: 'South LV', size: 'Large', slots: '1,600+', lat: 36.0620, lng: -115.2000, apNotes: 'Bass Pro shop attached. Aquarium.' },
  { id: 'm-resort', name: 'M Resort', owner: 'Penn', area: 'Henderson', size: 'Large', slots: '1,400+', lat: 36.0100, lng: -115.0820, apNotes: 'Upscale south Henderson.' },
  
  // ============================================
  // HENDERSON
  // ============================================
  { id: 'jokers-wild', name: 'Jokers Wild', owner: 'Affinity', area: 'Henderson', size: 'Small', slots: '400+', lat: 36.0310, lng: -115.0420, apNotes: 'Small locals spot.' },
  { id: 'club-fortune', name: 'Club Fortune', owner: 'Fortune', area: 'Henderson', size: 'Small', slots: '300+', lat: 36.0290, lng: -115.0530, apNotes: 'Tiny Henderson casino.' },
  { id: 'eldorado-henderson', name: 'Eldorado Casino', owner: 'Boyd', area: 'Henderson', size: 'Small', slots: '300+', lat: 36.0300, lng: -115.0500, apNotes: 'Small Henderson locals.' },
];

// Legacy reference (keep for backward compatibility)
const caesarsProperties = vegasCasinos.filter(c => c.owner === 'Caesars');

export { vegasCasinos, caesarsProperties };
