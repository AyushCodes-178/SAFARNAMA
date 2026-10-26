export const INDIAN_STARTING_CITIES = [
  'Bengaluru',
  'Mumbai',
  'Delhi',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Kochi',
  'Jaipur',
  'Chandigarh',
  'Goa',
  'Lucknow'
];

export const INTEREST_CATEGORIES = [
  { id: 'nature', label: 'Nature & Hills', icon: 'Trees' },
  { id: 'adventure', label: 'Adventure & Trekking', icon: 'Compass' },
  { id: 'beaches', label: 'Beaches & Coastal', icon: 'Waves' },
  { id: 'heritage', label: 'Heritage & Monuments', icon: 'Landmark' },
  { id: 'food', label: 'Food & Culinary Walk', icon: 'UtensilsCrossed' },
  { id: 'culture', label: 'Culture & Arts', icon: 'Palette' },
  { id: 'shopping', label: 'Local Bazaars & Crafts', icon: 'ShoppingBag' },
  { id: 'religious tourism', label: 'Spiritual & Pilgrimage', icon: 'Flame' }
];

export const TRAVELLER_TYPES = [
  { id: 'solo travellers', label: 'Solo Traveller', description: 'Freedom, exploration & self-discovery' },
  { id: 'couples', label: 'Couples / Romantic', description: 'Scenic vistas, quiet stays & sunsets' },
  { id: 'friends', label: 'Friends Group', description: 'Adventures, road-trips & fun vibes' },
  { id: 'students', label: 'Students / Budget', description: 'Affordable, shared stays & youth hubs' },
  { id: 'families', label: 'Family Vacation', description: 'Comfortable transit, kids-friendly & relaxed' },
  { id: 'backpackers', label: 'Backpackers', description: 'Hostels, off-beat trails & public transit' },
  { id: 'international tourists', label: 'International Tourists', description: 'Iconic heritage, culture & hospitality' },
  { id: 'business travellers', label: 'Business & Leisure (Bleisure)', description: 'Quick weekend escape near tech hubs' }
];

export const TRAVEL_PACES = [
  { id: 'relaxed', label: 'Relaxed', maxActivitiesPerDay: 2, description: '2 activities/day. Slow mornings, ample cafe time.' },
  { id: 'balanced', label: 'Balanced', maxActivitiesPerDay: 3, description: '3 activities/day. Great mix of sightseeing and downtime.' },
  { id: 'packed', label: 'Packed', maxActivitiesPerDay: 5, description: '4-5 activities/day. Early starts, visit as much as possible.' }
];

export const DESTINATIONS_DATA = [
  {
    id: 'coorg',
    name: 'Coorg (Kodagu)',
    state: 'Karnataka',
    tagline: 'The Coffee Capital & Scotland of India',
    description: 'Verdant coffee plantations, misty valleys, Tibetan culture at Bylakuppe, and gushing waterfalls nestled in the Western Ghats.',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80',
    coordinates: { lat: 12.4244, lng: 75.7382 },
    minDays: 2,
    maxDays: 5,
    avgDailyBudget: 2200,
    budgetTier: 'moderate',
    baseCosts: { stay: 1400, food: 600, transit: 400, misc: 200 },
    startingCityDistances: {
      'Bengaluru': { distanceKm: 250, transitMode: 'Bus / Cab', transitHours: 5.5, transitCost: 900 },
      'Chennai': { distanceKm: 580, transitMode: 'Train + Cab', transitHours: 10, transitCost: 1800 },
      'Hyderabad': { distanceKm: 820, transitMode: 'Flight to BLR + Bus', transitHours: 8, transitCost: 3500 },
      'Mumbai': { distanceKm: 980, transitMode: 'Train to Mysuru + Cab', transitHours: 16, transitCost: 2800 },
      'Kochi': { distanceKm: 340, transitMode: 'Train + Bus', transitHours: 7, transitCost: 1200 }
    },
    travellerAffinities: ['couples', 'families', 'solo travellers', 'friends', 'nature lovers'],
    interests: ['nature', 'adventure', 'food', 'culture'],
    highlights: ['Abbey Falls', 'Namdroling Monastery (Golden Temple)', 'Raja\'s Seat', 'Coffee Plantation Walk', 'Talakaveri'],
    attractions: [
      {
        id: 'coorg-1',
        name: 'Namdroling Tibetan Monastery (Golden Temple)',
        description: 'Spectacular Tibetan monastery in Bylakuppe with 40-foot gilded Buddha statues and prayer flags.',
        category: 'culture',
        cost: 0,
        durationMinutes: 90,
        preferredTime: 'morning',
        coordinates: { lat: 12.4304, lng: 75.9664 },
        tips: 'Remove footwear before entering the shrine. Tibetan momos outside are delicious.'
      },
      {
        id: 'coorg-2',
        name: 'Abbey Falls',
        description: 'Tumbling waterfall set amidst dense spice and coffee estates with an overhanging hanging bridge.',
        category: 'nature',
        cost: 30,
        durationMinutes: 75,
        preferredTime: 'morning',
        coordinates: { lat: 12.4542, lng: 75.7196 },
        tips: 'Short downhill walk from parking; wear comfortable sneakers.'
      },
      {
        id: 'coorg-3',
        name: 'Raja\'s Seat Sunset Point',
        description: 'Historic scenic garden viewpoint where Kodagu kings sat to watch fiery Western Ghat sunsets.',
        category: 'nature',
        cost: 20,
        durationMinutes: 90,
        preferredTime: 'evening',
        coordinates: { lat: 12.4217, lng: 75.7369 },
        tips: 'Arrive by 5:15 PM for best sunset photography seats.'
      },
      {
        id: 'coorg-4',
        name: 'Madikeri Fort & Palace Museum',
        description: '17th-century stone fortress with British clock tower and museum displaying historic artifacts.',
        category: 'heritage',
        cost: 25,
        durationMinutes: 60,
        preferredTime: 'afternoon',
        coordinates: { lat: 12.4262, lng: 75.7381 },
        tips: 'Closed on Mondays. Offers good historical insights of the Kodava dynasty.'
      },
      {
        id: 'coorg-5',
        name: 'Coffee & Spice Plantation Guided Walk',
        description: 'Walk through Arabica & Robusta coffee bushes, pepper vines, and vanilla orchids with fresh coffee tasting.',
        category: 'food',
        cost: 250,
        durationMinutes: 120,
        preferredTime: 'morning',
        coordinates: { lat: 12.4410, lng: 75.7600 },
        tips: 'Buy authentic estate-roasted Kodagu coffee powder directly from growers.'
      },
      {
        id: 'coorg-6',
        name: 'Dubare Elephant Camp',
        description: 'Eco-tourism hub on the banks of Cauvery river where you can observe gentle elephants bathing.',
        category: 'nature',
        cost: 100,
        durationMinutes: 120,
        preferredTime: 'morning',
        coordinates: { lat: 12.3687, lng: 75.9038 },
        tips: 'Best visited early morning before 10:30 AM for river crossing.'
      },
      {
        id: 'coorg-7',
        name: 'Talakaveri & Brahmagiri Hills',
        description: 'The sacred birthplace of River Cauvery perched high in the Brahmagiri mountain range.',
        category: 'religious tourism',
        cost: 0,
        durationMinutes: 120,
        preferredTime: 'afternoon',
        coordinates: { lat: 12.3847, lng: 75.4925 },
        tips: 'Climb 365 steps to Brahmagiri peak for panoramic views of Coorg and Kerala hills.'
      }
    ]
  },
  {
    id: 'hampi',
    name: 'Hampi',
    state: 'Karnataka',
    tagline: 'UNESCO Bouldered Wonder of the Vijayanagara Empire',
    description: 'Surreal surreal landscape of granite boulders, ancient temples, stone chariots, and riverside sunsets across the Tungabhadra.',
    image: 'https://images.unsplash.com/photo-1600100397608-f010f443b772?auto=format&fit=crop&w=1000&q=80',
    coordinates: { lat: 15.3350, lng: 76.4600 },
    minDays: 2,
    maxDays: 4,
    avgDailyBudget: 1600,
    budgetTier: 'budget',
    baseCosts: { stay: 900, food: 450, transit: 250, misc: 150 },
    startingCityDistances: {
      'Bengaluru': { distanceKm: 340, transitMode: 'Overnight Hampi Express / Bus', transitHours: 7, transitCost: 750 },
      'Hyderabad': { distanceKm: 375, transitMode: 'Train / Bus', transitHours: 8, transitCost: 800 },
      'Goa': { distanceKm: 315, transitMode: 'Train / Bus', transitHours: 7, transitCost: 650 },
      'Mumbai': { distanceKm: 700, transitMode: 'Train via Hospet', transitHours: 14, transitCost: 1400 },
      'Chennai': { distanceKm: 680, transitMode: 'Train via Guntakal', transitHours: 12, transitCost: 1200 }
    },
    travellerAffinities: ['backpackers', 'solo travellers', 'students', 'couples', 'international tourists'],
    interests: ['heritage', 'nature', 'adventure', 'culture', 'food'],
    highlights: ['Virupaksha Temple', 'Vijaya Vittala Stone Chariot', 'Matanga Hill Sunrise', 'Lotus Mahal & Elephant Stables', 'Sanapur Lake Coracle Ride'],
    attractions: [
      {
        id: 'hampi-1',
        name: 'Virupaksha Temple & Hampi Bazaar',
        description: '7th-century operational Shiva temple with towering gopuram and Lakshmi the sacred temple elephant.',
        category: 'heritage',
        cost: 25,
        durationMinutes: 90,
        preferredTime: 'morning',
        coordinates: { lat: 15.3353, lng: 76.4600 },
        tips: 'Visit early morning around 7:30 AM to catch the temple elephant bath.'
      },
      {
        id: 'hampi-2',
        name: 'Vijaya Vittala Temple & Stone Chariot',
        description: 'Iconic UNESCO monument with the monolithic stone chariot and 56 musical pillars that chime tones.',
        category: 'heritage',
        cost: 40,
        durationMinutes: 120,
        preferredTime: 'afternoon',
        coordinates: { lat: 15.3394, lng: 76.4795 },
        tips: 'Electric buggy available from the ticket counter. Single ASI ticket works here and at Zenana Enclosure.'
      },
      {
        id: 'hampi-3',
        name: 'Matanga Hill Sunrise Hike',
        description: 'The highest point in Hampi offering an awe-inspiring 360-degree panorama of boulder fields at dawn.',
        category: 'adventure',
        cost: 0,
        durationMinutes: 90,
        preferredTime: 'morning',
        coordinates: { lat: 15.3320, lng: 76.4680 },
        tips: 'Start hiking at 5:30 AM with a flashlight and sturdy shoes.'
      },
      {
        id: 'hampi-4',
        name: 'Lotus Mahal & Royal Elephant Stables',
        description: 'Indo-Islamic royal leisure pavilion and 11 domed chambers that once housed Vijayanagara royal elephants.',
        category: 'heritage',
        cost: 40,
        durationMinutes: 75,
        preferredTime: 'afternoon',
        coordinates: { lat: 15.3204, lng: 76.4703 },
        tips: 'Part of the ASI ticket. Beautiful manicured lawns for peaceful rest.'
      },
      {
        id: 'hampi-5',
        name: 'Sanapur Lake Coracle Ride & Bouldering',
        description: 'Scenic reservoir on the Hippie Island side. Enjoy round bamboo coracle boat rides and cliff jumping.',
        category: 'adventure',
        cost: 200,
        durationMinutes: 90,
        preferredTime: 'evening',
        coordinates: { lat: 15.3621, lng: 76.4475 },
        tips: 'Negotiate coracle boat ride fee politely. Watch the sunset from the reservoir rocks.'
      },
      {
        id: 'hampi-6',
        name: 'Hemakuta Hill Sunset & Sunset Monoliths',
        description: 'Cluster of pre-Vijayanagara Jain and Shiva shrines situated right above the Virupaksha complex.',
        category: 'culture',
        cost: 0,
        durationMinutes: 60,
        preferredTime: 'evening',
        coordinates: { lat: 15.3338, lng: 76.4590 },
        tips: 'Catch local musicians playing flutes on the rocks during twilight.'
      }
    ]
  },
  {
    id: 'ooty',
    name: 'Ooty (Udhagamandalam)',
    state: 'Tamil Nadu',
    tagline: 'Queen of the Nilgiri Hill Stations',
    description: 'Emerald tea plantations, eucalyptus scented air, colonial architecture, botanical gardens, and the heritage toy train.',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1000&q=80',
    coordinates: { lat: 11.4102, lng: 76.6950 },
    minDays: 2,
    maxDays: 4,
    avgDailyBudget: 2100,
    budgetTier: 'moderate',
    baseCosts: { stay: 1300, food: 550, transit: 350, misc: 200 },
    startingCityDistances: {
      'Bengaluru': { distanceKm: 270, transitMode: 'KSRTC Volvo Bus / Cab via Bandipur', transitHours: 6, transitCost: 850 },
      'Chennai': { distanceKm: 540, transitMode: 'Nilgiri Express Train via Mettupalayam', transitHours: 10, transitCost: 1100 },
      'Kochi': { distanceKm: 275, transitMode: 'Train / Bus via Coimbatore', transitHours: 7, transitCost: 800 },
      'Hyderabad': { distanceKm: 850, transitMode: 'Flight to Coimbatore + Cab', transitHours: 5, transitCost: 3800 }
    },
    travellerAffinities: ['families', 'couples', 'students', 'friends'],
    interests: ['nature', 'heritage', 'food', 'shopping'],
    highlights: ['Nilgiri Mountain Toy Train', 'Doddabetta Peak', 'Government Botanical Garden', 'Pykara Lake & Waterfalls', 'Ooty Homemade Chocolates'],
    attractions: [
      {
        id: 'ooty-1',
        name: 'Nilgiri Mountain Railway (UNESCO Toy Train)',
        description: 'Charming vintage steam train winding through tunnels, viaducts, and sheer Nilgiri tea hills.',
        category: 'heritage',
        cost: 150,
        durationMinutes: 120,
        preferredTime: 'morning',
        coordinates: { lat: 11.4064, lng: 76.7032 },
        tips: 'Book well in advance on IRCTC. The Ooty to Coonoor stretch offers heavenly vistas.'
      },
      {
        id: 'ooty-2',
        name: 'Government Botanical Garden',
        description: 'Colonial-era 55-acre botanical reserve featuring 1000+ species of exotic flowers, ferns, and a 20-million-year-old fossil tree trunk.',
        category: 'nature',
        cost: 40,
        durationMinutes: 90,
        preferredTime: 'morning',
        coordinates: { lat: 11.4172, lng: 76.7111 },
        tips: 'Early morning visits avoid crowd. Perfect for relaxed strolls.'
      },
      {
        id: 'ooty-3',
        name: 'Doddabetta Peak & Telescope House',
        description: 'Highest mountain peak in the Nilgiri Hills (2,637 m) offering panoramic vistas over the cloud-cloaked valley.',
        category: 'nature',
        cost: 20,
        durationMinutes: 75,
        preferredTime: 'afternoon',
        coordinates: { lat: 11.4010, lng: 76.7360 },
        tips: 'Clear mornings have best visibility before afternoon fog rolls in.'
      },
      {
        id: 'ooty-4',
        name: 'Pykara Lake & Speedboat Ride',
        description: 'Serene mountain lake surrounded by pine forests with speedboating and nearby cascading falls.',
        category: 'adventure',
        cost: 180,
        durationMinutes: 90,
        preferredTime: 'afternoon',
        coordinates: { lat: 11.5173, lng: 76.5982 },
        tips: 'Around 20 km from Ooty town on the Mysore highway; combines well with Pine Forest walk.'
      },
      {
        id: 'ooty-5',
        name: 'Commercial Road Homemade Chocolate & Tea Tasting',
        description: 'Explore local shops for Nilgiri Orthodox teas, spices, eucalyptus essential oils, and famous homemade truffles.',
        category: 'shopping',
        cost: 100,
        durationMinutes: 60,
        preferredTime: 'evening',
        coordinates: { lat: 11.4115, lng: 76.7020 },
        tips: 'Try King Star Confectionery for authentic heritage fudge and chocolate.'
      }
    ]
  },
  {
    id: 'goa',
    name: 'Goa (North & South)',
    state: 'Goa',
    tagline: 'Sun, Sand, Seafood & Portuguese Heritage',
    description: 'Golden sandy beaches, vibrant shacks, UNESCO cathedrals in Old Goa, backwater kayaking, and Latin Quarter architecture.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
    coordinates: { lat: 15.2993, lng: 74.1240 },
    minDays: 3,
    maxDays: 7,
    avgDailyBudget: 2400,
    budgetTier: 'moderate',
    baseCosts: { stay: 1500, food: 700, transit: 400, misc: 250 },
    startingCityDistances: {
      'Bengaluru': { distanceKm: 560, transitMode: 'Overnight KSRTC Sleeper Bus / Train / Flight', transitHours: 10, transitCost: 1200 },
      'Mumbai': { distanceKm: 580, transitMode: 'Vande Bharat Express / Flight / Bus', transitHours: 8, transitCost: 1500 },
      'Pune': { distanceKm: 450, transitMode: 'Overnight Sleeper Bus', transitHours: 8.5, transitCost: 950 },
      'Hyderabad': { distanceKm: 660, transitMode: 'Flight / Train via Londa', transitHours: 12, transitCost: 1800 },
      'Delhi': { distanceKm: 1850, transitMode: 'Flight to Goa Dabolim/MOPA', transitHours: 2.5, transitCost: 4500 }
    },
    travellerAffinities: ['friends', 'couples', 'solo travellers', 'backpackers', 'students', 'international tourists'],
    interests: ['beaches', 'adventure', 'food', 'heritage', 'culture'],
    highlights: ['Palolem & Agonda Beaches', 'Basilica of Bom Jesus', 'Fontainhas Latin Quarter', 'Aguada Fort & Lighthouse', 'Dudhsagar Waterfalls'],
    attractions: [
      {
        id: 'goa-1',
        name: 'Basilica of Bom Jesus (Old Goa)',
        description: '16th-century UNESCO World Heritage church housing the sacred relics of St. Francis Xavier.',
        category: 'heritage',
        cost: 0,
        durationMinutes: 75,
        preferredTime: 'morning',
        coordinates: { lat: 15.5009, lng: 73.9116 },
        tips: 'Dress modestly (knees and shoulders covered). Visit the Se Cathedral right across the road.'
      },
      {
        id: 'goa-2',
        name: 'Fontainhas Latin Quarter Walking Tour',
        description: 'Vibrant Portuguese heritage precinct with cobalt blue, terracotta and ochre houses, wrought iron balconies, and bakeries.',
        category: 'culture',
        cost: 0,
        durationMinutes: 90,
        preferredTime: 'morning',
        coordinates: { lat: 15.4989, lng: 73.8278 },
        tips: 'Sample fresh warm Bebinca and pastéis de nata at Confeitaria 31 de Janeiro.'
      },
      {
        id: 'goa-3',
        name: 'Aguada Fort & Lighthouse',
        description: '17th-century Portuguese fortress perched on Sinquerim beach with vast Arabian Sea horizons.',
        category: 'heritage',
        cost: 50,
        durationMinutes: 75,
        preferredTime: 'afternoon',
        coordinates: { lat: 15.4925, lng: 73.7737 },
        tips: 'Carry water and sunhat. Sunset from the lower ramparts is breathtaking.'
      },
      {
        id: 'goa-4',
        name: 'Palolem Beach & Silent Bay Kayaking',
        description: 'Picturesque crescent-shaped beach lined with coconut palms, gentle swimming waters, and kayak rentals.',
        category: 'beaches',
        cost: 250,
        durationMinutes: 150,
        preferredTime: 'afternoon',
        coordinates: { lat: 15.0100, lng: 74.0232 },
        tips: 'Rent a kayak around 4:30 PM to paddle to Butterfly Island for sunset.'
      },
      {
        id: 'goa-5',
        name: 'Anjuna Flea Market & Beach Shacks',
        description: 'Legendary beachside bazaar with boho clothing, handmade silver jewellery, Tibetan artefacts, and live music.',
        category: 'shopping',
        cost: 0,
        durationMinutes: 90,
        preferredTime: 'evening',
        coordinates: { lat: 15.5804, lng: 73.7423 },
        tips: 'Traditional big flea market is on Wednesdays; lively sunset shacks operate daily.'
      }
    ]
  },
  {
    id: 'jaipur',
    name: 'Jaipur (The Pink City)',
    state: 'Rajasthan',
    tagline: 'Royalty, Forts, Havelis & Desert Grandeur',
    description: 'Majestic hill forts, pink sandstone palaces, astronomical marvels, bustling gemstone bazaars, and rich Rajasthani flavours.',
    image: 'https://images.unsplash.com/photo-1603262110263-fb010d6e75dc?auto=format&fit=crop&w=1000&q=80',
    coordinates: { lat: 26.9124, lng: 75.7873 },
    minDays: 2,
    maxDays: 4,
    avgDailyBudget: 2300,
    budgetTier: 'moderate',
    baseCosts: { stay: 1400, food: 600, transit: 350, misc: 200 },
    startingCityDistances: {
      'Delhi': { distanceKm: 280, transitMode: 'Vande Bharat / Double Decker Train', transitHours: 3.5, transitCost: 750 },
      'Mumbai': { distanceKm: 1150, transitMode: 'Flight / Garib Rath Express', transitHours: 2, transitCost: 3200 },
      'Bengaluru': { distanceKm: 1950, transitMode: 'Direct Flight', transitHours: 2.5, transitCost: 4500 },
      'Ahmedabad': { distanceKm: 650, transitMode: 'Overnight Train / Bus', transitHours: 10, transitCost: 1100 }
    },
    travellerAffinities: ['families', 'couples', 'solo travellers', 'international tourists', 'students'],
    interests: ['heritage', 'culture', 'food', 'shopping'],
    highlights: ['Amber Fort & Palace', 'Hawa Mahal', 'City Palace', 'Jantar Mantar', 'Nahargarh Fort Sunset'],
    attractions: [
      {
        id: 'jaipur-1',
        name: 'Amber Fort (Amer Palace)',
        description: 'Imposing hilltop fort built of red sandstone and marble, featuring the exquisite Sheesh Mahal (Mirror Palace).',
        category: 'heritage',
        cost: 100,
        durationMinutes: 150,
        preferredTime: 'morning',
        coordinates: { lat: 26.9855, lng: 75.8513 },
        tips: 'Buy composite ticket covering Amer, Albert Hall, Hawa Mahal, and Jantar Mantar to save money.'
      },
      {
        id: 'jaipur-2',
        name: 'Hawa Mahal (Palace of Winds)',
        description: 'Iconic 5-story facade with 953 honeycombed jharokha windows built for royal women to observe street processions.',
        category: 'heritage',
        cost: 50,
        durationMinutes: 60,
        preferredTime: 'morning',
        coordinates: { lat: 26.9239, lng: 75.8267 },
        tips: 'Best exterior photos from the rooftop cafes opposite Hawa Mahal (Tattoo Cafe or Wind View Cafe).'
      },
      {
        id: 'jaipur-3',
        name: 'Jantar Mantar Observatory',
        description: 'UNESCO World Heritage site housing nineteen architectural astronomical instruments, including the world\'s largest stone sundial.',
        category: 'heritage',
        cost: 50,
        durationMinutes: 75,
        preferredTime: 'afternoon',
        coordinates: { lat: 26.9248, lng: 75.8246 },
        tips: 'Hire an authorized guide for 30 minutes to understand how the shadow geometry accurately tells time.'
      },
      {
        id: 'jaipur-4',
        name: 'Nahargarh Fort & Padao Sunset',
        description: 'Fort perched on the Aravalli hills overlooking the entire sprawling pink city illuminated at twilight.',
        category: 'adventure',
        cost: 50,
        durationMinutes: 120,
        preferredTime: 'evening',
        coordinates: { lat: 26.9373, lng: 75.8155 },
        tips: 'Reach by 5:00 PM to catch golden hour over the Jaipur skyline.'
      },
      {
        id: 'jaipur-5',
        name: 'Johari Bazaar & Bapu Bazaar Walk',
        description: 'Vibrant old walled city bazaars renowned for Bandhani textiles, blue pottery, lac bangles, and spicy Pyaaz Kachoris.',
        category: 'shopping',
        cost: 0,
        durationMinutes: 90,
        preferredTime: 'evening',
        coordinates: { lat: 26.9196, lng: 75.8252 },
        tips: 'Stop at Rawat Mishthan Bhandar for authentic hot onion kachori and sweet lassi.'
      }
    ]
  },
  {
    id: 'munnar',
    name: 'Munnar',
    state: 'Kerala',
    tagline: 'God\'s Own Hill Station of Rolling Tea Gardens',
    description: 'Endless rolling emerald tea plantations, cool mountain breeze, endangered Nilgiri Tahr at Eravikulam, and spice scented valleys.',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1000&q=80',
    coordinates: { lat: 10.0889, lng: 77.0595 },
    minDays: 2,
    maxDays: 4,
    avgDailyBudget: 2100,
    budgetTier: 'moderate',
    baseCosts: { stay: 1300, food: 550, transit: 350, misc: 180 },
    startingCityDistances: {
      'Bengaluru': { distanceKm: 480, transitMode: 'KSRTC Sleeper Bus / Train to Aluva + Cab', transitHours: 9.5, transitCost: 1100 },
      'Kochi': { distanceKm: 130, transitMode: 'KSRTC Bus / Cab via Neriamangalam', transitHours: 3.5, transitCost: 350 },
      'Chennai': { distanceKm: 580, transitMode: 'Train to Theni / Madurai + Cab', transitHours: 11, transitCost: 1400 },
      'Hyderabad': { distanceKm: 1000, transitMode: 'Flight to Kochi + Cab', transitHours: 5, transitCost: 4000 }
    },
    travellerAffinities: ['couples', 'families', 'solo travellers', 'nature lovers', 'friends'],
    interests: ['nature', 'adventure', 'food', 'culture'],
    highlights: ['Eravikulam National Park (Rajamalai)', 'Mattupetty Dam & Speedboat', 'Tea Museum Munnar', 'Top Station Viewpoint', 'Kundala Lake'],
    attractions: [
      {
        id: 'munnar-1',
        name: 'Eravikulam National Park (Rajamalai)',
        description: 'Sanctuary of the endangered Nilgiri Tahr mountain goat with sweeping vistas of Anamudi peak.',
        category: 'nature',
        cost: 200,
        durationMinutes: 150,
        preferredTime: 'morning',
        coordinates: { lat: 10.2000, lng: 77.0500 },
        tips: 'Book tickets online on Kerala Forest Dept portal to avoid long morning queues.'
      },
      {
        id: 'munnar-2',
        name: 'Tata KDHP Tea Museum & Factory',
        description: 'Historic orthodox tea processing factory showcasing tea plucking heritage and automated tea tasting demos.',
        category: 'culture',
        cost: 150,
        durationMinutes: 90,
        preferredTime: 'afternoon',
        coordinates: { lat: 10.0915, lng: 77.0602 },
        tips: 'Sample freshly blended black and white teas; great gift shopping.'
      },
      {
        id: 'munnar-3',
        name: 'Mattupetty Dam & Shola Lake Boating',
        description: 'Scenic masonry dam surrounded by tea estates and Shola forests with speedboating options.',
        category: 'nature',
        cost: 120,
        durationMinutes: 75,
        preferredTime: 'afternoon',
        coordinates: { lat: 10.1064, lng: 77.1235 },
        tips: 'Watch out for wild elephant herds drinking water across the far banks.'
      },
      {
        id: 'munnar-4',
        name: 'Top Station Viewpoint',
        description: 'Highest viewpoint on Munnar-Kodaikanal border offering dramatic cloud bed views over the Western Ghats.',
        category: 'nature',
        cost: 25,
        durationMinutes: 90,
        preferredTime: 'morning',
        coordinates: { lat: 10.1246, lng: 77.2443 },
        tips: 'About 32 km from Munnar town; start early before fog obscures the valley floor.'
      }
    ]
  },
  {
    id: 'varanasi',
    name: 'Varanasi (Kashi)',
    state: 'Uttar Pradesh',
    tagline: 'The Eternal Spiritual Capital on the Sacred Ganga',
    description: 'Timeless riverfront ghats, mystical evening Ganga Aarti, ancient Shiva temples, narrow silk-weaving alleys, and morning sunrise boat rides.',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=80',
    coordinates: { lat: 25.3176, lng: 82.9739 },
    minDays: 2,
    maxDays: 4,
    avgDailyBudget: 1700,
    budgetTier: 'budget',
    baseCosts: { stay: 1000, food: 450, transit: 250, misc: 150 },
    startingCityDistances: {
      'Delhi': { distanceKm: 800, transitMode: 'Vande Bharat Express / Flight', transitHours: 8, transitCost: 1750 },
      'Kolkata': { distanceKm: 680, transitMode: 'Overnight Rajdhani / Doon Express', transitHours: 10, transitCost: 1400 },
      'Bengaluru': { distanceKm: 1800, transitMode: 'Direct Flight', transitHours: 2.5, transitCost: 4800 },
      'Mumbai': { distanceKm: 1500, transitMode: 'Flight / Train via Prayagraj', transitHours: 2.5, transitCost: 4500 }
    },
    travellerAffinities: ['solo travellers', 'backpackers', 'couples', 'families', 'international tourists'],
    interests: ['religious tourism', 'culture', 'heritage', 'food', 'shopping'],
    highlights: ['Ganga Aarti at Dashashwamedh Ghat', 'Sunrise Rowboat Ride on Ganga', 'Kashi Vishwanath Corridor', 'Sarnath Buddhist Stupa', 'Banarasi Silk Weavers Lane'],
    attractions: [
      {
        id: 'varanasi-1',
        name: 'Dashashwamedh Ghat Evening Ganga Aarti',
        description: 'Mesmerizing synchronized worship ritual with brass lamps, conch shells, incense, and thousands of floating diyas.',
        category: 'religious tourism',
        cost: 0,
        durationMinutes: 90,
        preferredTime: 'evening',
        coordinates: { lat: 25.3076, lng: 83.0104 },
        tips: 'Rent a seat on a wooden boat facing the ghat by 6:00 PM for unobstructed views.'
      },
      {
        id: 'varanasi-2',
        name: 'Sunrise Boat Ride from Assi Ghat to Manikarnika',
        description: 'Serene rowboat cruise watching priests, pilgrims bathing in dawn mist, and historic centuries-old riverfront palaces.',
        category: 'culture',
        cost: 200,
        durationMinutes: 90,
        preferredTime: 'morning',
        coordinates: { lat: 25.2890, lng: 83.0062 },
        tips: 'Begin at 5:45 AM. Manual rowboats are peaceful and quieter than motor boats.'
      },
      {
        id: 'varanasi-3',
        name: 'Kashi Vishwanath Temple & New Corridor',
        description: 'One of the twelve sacred Jyotirlingas of Lord Shiva, connected to the holy river via a grand sandstone promenade.',
        category: 'religious tourism',
        cost: 0,
        durationMinutes: 90,
        preferredTime: 'morning',
        coordinates: { lat: 25.3109, lng: 83.0107 },
        tips: 'Lockers are available outside; electronic devices and leather items are not permitted inside.'
      },
      {
        id: 'varanasi-4',
        name: 'Sarnath Dhamek Stupa & Archaeological Museum',
        description: 'Sacred grove where Lord Buddha delivered his first sermon after enlightenment; houses the original Ashoka Lion Capital.',
        category: 'heritage',
        cost: 40,
        durationMinutes: 120,
        preferredTime: 'afternoon',
        coordinates: { lat: 25.3811, lng: 83.0227 },
        tips: '10 km north of Varanasi center; easily reached by electric auto-rickshaw.'
      },
      {
        id: 'varanasi-5',
        name: 'Thatheri Bazaar Food & Silk Weaving Alleys',
        description: 'Explore maze-like galis to watch master weavers spin Banarasi sarees and taste legendary Tamatar Chaat and Malaiyo.',
        category: 'food',
        cost: 150,
        durationMinutes: 75,
        preferredTime: 'evening',
        coordinates: { lat: 25.3120, lng: 83.0075 },
        tips: 'Taste winter delicacy Malaiyo or Kashi Chaat Bhandar’s hot tomato chaat.'
      }
    ]
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh',
    state: 'Uttarakhand',
    tagline: 'Yoga Capital of the World & Himalayan Adventure Gateway',
    description: 'Emerald Ganga rapids, suspension bridges, Beatles ashram murals, vibrant cafes, and white-water river rafting at the Himalayan foothills.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
    coordinates: { lat: 30.0869, lng: 78.2676 },
    minDays: 2,
    maxDays: 4,
    avgDailyBudget: 1800,
    budgetTier: 'budget',
    baseCosts: { stay: 1100, food: 500, transit: 250, misc: 150 },
    startingCityDistances: {
      'Delhi': { distanceKm: 240, transitMode: 'Vande Bharat / Shatabdi to Haridwar + Cab', transitHours: 4.5, transitCost: 800 },
      'Bengaluru': { distanceKm: 2350, transitMode: 'Flight to Dehradun (DED) + Cab', transitHours: 3.5, transitCost: 4800 },
      'Mumbai': { distanceKm: 1650, transitMode: 'Flight to Dehradun + Cab', transitHours: 3, transitCost: 4500 }
    },
    travellerAffinities: ['students', 'solo travellers', 'backpackers', 'friends', 'couples'],
    interests: ['adventure', 'religious tourism', 'nature', 'culture', 'food'],
    highlights: ['Ganga White Water Rafting (Shivpuri)', 'Triveni Ghat Evening Aarti', 'Beatles Ashram (Chaurasi Kutia)', 'Neer Garh Waterfalls', 'Tapovan Riverside Cafes'],
    attractions: [
      {
        id: 'rishikesh-1',
        name: 'Ganga White Water Rafting (16km Shivpuri to Laxman Jhula)',
        description: 'Thrilling grade III & IV rapids including Roller Coaster, Golf Course, and cliff jump into glacier waters.',
        category: 'adventure',
        cost: 650,
        durationMinutes: 180,
        preferredTime: 'morning',
        coordinates: { lat: 30.1340, lng: 78.3880 },
        tips: 'Book only with certified Uttarakhand Tourism licensed rafting operators with lifejackets.'
      },
      {
        id: 'rishikesh-2',
        name: 'The Beatles Ashram (Chaurasi Kutia)',
        description: 'Historic ashram where the Fab Four studied Transcendental Meditation in 1968, adorned with graffiti and meditation caves.',
        category: 'culture',
        cost: 150,
        durationMinutes: 90,
        preferredTime: 'morning',
        coordinates: { lat: 30.1228, lng: 78.3182 },
        tips: 'Located inside Rajaji Tiger Reserve boundary. Great serene forest ambience.'
      },
      {
        id: 'rishikesh-3',
        name: 'Triveni Ghat Maha Aarti',
        description: 'Soulful sacred convergence of Ganga, Yamuna and Saraswati with rhythmic chanting, lamps and Vedic hymns.',
        category: 'religious tourism',
        cost: 0,
        durationMinutes: 75,
        preferredTime: 'evening',
        coordinates: { lat: 30.1039, lng: 78.2934 },
        tips: 'Arrive 30 minutes before sunset to sit near the river steps.'
      },
      {
        id: 'rishikesh-4',
        name: 'Neer Garh Waterfall Hike',
        description: 'Two-tier natural limestone waterfall tumbling into turquoise wading pools shaded by dense hill forest.',
        category: 'nature',
        cost: 30,
        durationMinutes: 120,
        preferredTime: 'afternoon',
        coordinates: { lat: 30.1415, lng: 78.3370 },
        tips: 'Requires an easy 1 km hike uphill. Carry swimming clothes and towel.'
      }
    ]
  },
  {
    id: 'wayanad',
    name: 'Wayanad',
    state: 'Kerala',
    tagline: 'Mist, Monoliths & Wild Trails of Western Ghats',
    description: 'Dense bamboo forests, pre-historic rock carvings at Edakkal Caves, treehouses, tea hills, and peaceful Chembra peak trails.',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80',
    coordinates: { lat: 11.6854, lng: 76.1320 },
    minDays: 2,
    maxDays: 4,
    avgDailyBudget: 1950,
    budgetTier: 'moderate',
    baseCosts: { stay: 1200, food: 500, transit: 350, misc: 180 },
    startingCityDistances: {
      'Bengaluru': { distanceKm: 280, transitMode: 'KSRTC Bus via Bandipur / Mysore', transitHours: 6.5, transitCost: 800 },
      'Kochi': { distanceKm: 260, transitMode: 'Train to Kozhikode + Bus', transitHours: 6, transitCost: 650 },
      'Chennai': { distanceKm: 620, transitMode: 'Train to Kozhikode + Bus', transitHours: 11, transitCost: 1300 },
      'Hyderabad': { distanceKm: 850, transitMode: 'Flight to Kozhikode + Cab', transitHours: 4.5, transitCost: 3800 }
    },
    travellerAffinities: ['couples', 'friends', 'nature lovers', 'students', 'solo travellers'],
    interests: ['nature', 'adventure', 'heritage'],
    highlights: ['Edakkal Caves Neolithic Art', 'Banasura Sagar Earth Dam', 'Soochipara Waterfalls', 'Chembra Heart-Shaped Lake', 'Wayanad Tea Estates'],
    attractions: [
      {
        id: 'wayanad-1',
        name: 'Edakkal Caves Neolithic Petroglyphs',
        description: 'Two natural rock shelters with 6000-year-old stone age carvings, accessible by a steep mountain climb.',
        category: 'heritage',
        cost: 50,
        durationMinutes: 120,
        preferredTime: 'morning',
        coordinates: { lat: 11.6277, lng: 76.2346 },
        tips: 'Closed on Mondays. Reach early by 9:00 AM to beat the mid-day heat.'
      },
      {
        id: 'wayanad-2',
        name: 'Banasura Sagar Earth Dam',
        description: 'Largest earth dam in India and second largest in Asia, with scenic islands floating on reservoir waters.',
        category: 'nature',
        cost: 40,
        durationMinutes: 90,
        preferredTime: 'afternoon',
        coordinates: { lat: 11.6698, lng: 75.9570 },
        tips: 'Speedboat rides and zip-lining over the water are popular here.'
      },
      {
        id: 'wayanad-3',
        name: 'Soochipara (Sentinel Rock) Waterfalls',
        description: 'Three-tiered waterfall cascading down 200 meters into a natural pool surrounded by deciduous woods.',
        category: 'adventure',
        cost: 80,
        durationMinutes: 120,
        preferredTime: 'morning',
        coordinates: { lat: 11.5126, lng: 76.1611 },
        tips: 'Plastic-free zone. 2 km walk through rubber and tea plantations.'
      }
    ]
  },
  {
    id: 'pondicherry',
    name: 'Pondicherry (Puducherry)',
    state: 'Puducherry',
    tagline: 'The French Riviera of the East',
    description: 'Charming French colonial villas, mustard-yellow bougainvillea alleys, seaside promenade, experimental township of Auroville, and croissant cafes.',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
    coordinates: { lat: 11.9416, lng: 79.8083 },
    minDays: 2,
    maxDays: 4,
    avgDailyBudget: 2100,
    budgetTier: 'moderate',
    baseCosts: { stay: 1300, food: 600, transit: 300, misc: 200 },
    startingCityDistances: {
      'Bengaluru': { distanceKm: 310, transitMode: 'KSRTC / Private Bus via Tiruvannamalai', transitHours: 6.5, transitCost: 750 },
      'Chennai': { distanceKm: 150, transitMode: 'ECR Scenic Bus / Cab / Train', transitHours: 3.5, transitCost: 350 },
      'Hyderabad': { distanceKm: 780, transitMode: 'Train / Flight to Chennai + Cab', transitHours: 11, transitCost: 1900 },
      'Kochi': { distanceKm: 540, transitMode: 'Overnight Bus / Train', transitHours: 10, transitCost: 1100 }
    },
    travellerAffinities: ['couples', 'solo travellers', 'friends', 'students', 'backpackers'],
    interests: ['beaches', 'culture', 'food', 'heritage', 'shopping'],
    highlights: ['White Town French Quarter Walk', 'Promenade Beach Rock Walk', 'Auroville Matrimandir', 'Sri Aurobindo Ashram', 'Paradise Beach Ferry'],
    attractions: [
      {
        id: 'pondy-1',
        name: 'White Town Heritage French Quarter Cycling',
        description: 'Explore mustard-yellow colonial houses, arched doorways, French street names, and boutique art galleries.',
        category: 'culture',
        cost: 100,
        durationMinutes: 90,
        preferredTime: 'morning',
        coordinates: { lat: 11.9344, lng: 79.8340 },
        tips: 'Rent a vintage bicycle for ₹100/day. Have breakfast at Cafe des Arts or Coromandel Cafe.'
      },
      {
        id: 'pondy-2',
        name: 'Auroville & Matrimandir Viewing Point',
        description: 'Universal township dedicated to human unity; features the iconic golden geodesic dome meditation sanctum.',
        category: 'culture',
        cost: 0,
        durationMinutes: 150,
        preferredTime: 'morning',
        coordinates: { lat: 12.0069, lng: 79.8106 },
        tips: 'Free passes to the outer viewing point available at Visitors Centre. Inner meditation chamber requires advance booking.'
      },
      {
        id: 'pondy-3',
        name: 'Promenade Beach & Gandhi Memorial',
        description: '1.5-km scenic vehicular-free coastal esplanade overlooking the Bay of Bengal, dotted with historic monuments.',
        category: 'beaches',
        cost: 0,
        durationMinutes: 75,
        preferredTime: 'evening',
        coordinates: { lat: 11.9338, lng: 79.8358 },
        tips: 'The promenade is completely closed to motor vehicles between 6:00 PM and 7:30 AM.'
      },
      {
        id: 'pondy-4',
        name: 'Paradise Beach (Chunnambar Boat Ferry)',
        description: 'Pristine isolated golden sand beach accessible via a scenic backwater boat ride through mangrove creeks.',
        category: 'beaches',
        cost: 300,
        durationMinutes: 120,
        preferredTime: 'afternoon',
        coordinates: { lat: 11.8741, lng: 79.8174 },
        tips: 'Ferry ticket counter at Chunnambar Boat House. Great for gentle swimming and volleyball.'
      }
    ]
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    state: 'Rajasthan',
    tagline: 'City of Lakes, Palaces & Mewari Chivalry',
    description: 'Gleaming white palaces shimmering over Lake Pichola, intricate marble carvings, sunset boat rides, and romantic rooftop dining.',
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1000&q=80',
    coordinates: { lat: 24.5854, lng: 73.7125 },
    minDays: 2,
    maxDays: 4,
    avgDailyBudget: 2400,
    budgetTier: 'moderate',
    baseCosts: { stay: 1500, food: 650, transit: 350, misc: 200 },
    startingCityDistances: {
      'Ahmedabad': { distanceKm: 260, transitMode: 'Express Highway Bus / Train', transitHours: 4.5, transitCost: 450 },
      'Mumbai': { distanceKm: 760, transitMode: 'Train / Direct Flight', transitHours: 1.5, transitCost: 3500 },
      'Delhi': { distanceKm: 660, transitMode: 'Vande Bharat / Overnight Train / Flight', transitHours: 1.5, transitCost: 3200 },
      'Bengaluru': { distanceKm: 1650, transitMode: 'Flight via Mumbai/Direct', transitHours: 3.5, transitCost: 4800 }
    },
    travellerAffinities: ['couples', 'families', 'international tourists', 'solo travellers'],
    interests: ['heritage', 'culture', 'food', 'shopping'],
    highlights: ['City Palace Complex', 'Lake Pichola Sunset Boat Ride', 'Jag Mandir Island', 'Saheliyon ki Bari', 'Bagore Ki Haveli Folk Dance'],
    attractions: [
      {
        id: 'udaipur-1',
        name: 'City Palace Complex & Museum',
        description: 'Sprawling palace complex built over 400 years by Mewar rulers, overlooking Lake Pichola with mirror-inlaid halls.',
        category: 'heritage',
        cost: 300,
        durationMinutes: 150,
        preferredTime: 'morning',
        coordinates: { lat: 24.5764, lng: 73.6835 },
        tips: 'Book museum tickets online or early morning. Wear comfortable footwear for palace ramps.'
      },
      {
        id: 'udaipur-2',
        name: 'Lake Pichola Sunset Boat Cruise to Jag Mandir',
        description: 'Magical boat ride passing the floating Lake Palace (Taj) and docking at the 17th-century island palace Jag Mandir.',
        category: 'culture',
        cost: 500,
        durationMinutes: 90,
        preferredTime: 'evening',
        coordinates: { lat: 24.5678, lng: 73.6782 },
        tips: 'Take the sunset slot boat from Rameshwar Ghat for dazzling reflections of City Palace lights.'
      },
      {
        id: 'udaipur-3',
        name: 'Bagore Ki Haveli Evening Dharohar Folk Dance',
        description: 'Vibrant cultural performance with Chari fire dance, puppets, and record-breaking Bhavai pot dance on brass pots.',
        category: 'culture',
        cost: 100,
        durationMinutes: 75,
        preferredTime: 'evening',
        coordinates: { lat: 24.5802, lng: 73.6800 },
        tips: 'Show starts at 7:00 PM; ticket counter opens at 6:15 PM and queues form fast.'
      },
      {
        id: 'udaipur-4',
        name: 'Saheliyon-ki-Bari (Courtyard of Maidens)',
        description: 'Historic royal garden with marble fountains, elephant sculptures, and lotus pools designed for royal princesses.',
        category: 'nature',
        cost: 20,
        durationMinutes: 60,
        preferredTime: 'afternoon',
        coordinates: { lat: 24.6041, lng: 73.6865 },
        tips: 'The fountains operate using natural water pressure from Fateh Sagar Lake without electric pumps.'
      }
    ]
  },
  {
    id: 'manali',
    name: 'Manali & Solang Valley',
    state: 'Himachal Pradesh',
    tagline: 'Snow Peaks, Apple Orchards & High Mountain Passes',
    description: 'Pristine Himalayan vistas, cedar forests of Dhungri, snow adventures in Solang, hot springs, and lively Old Manali cafes.',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',
    coordinates: { lat: 32.2396, lng: 77.1887 },
    minDays: 3,
    maxDays: 6,
    avgDailyBudget: 2200,
    budgetTier: 'moderate',
    baseCosts: { stay: 1300, food: 600, transit: 350, misc: 200 },
    startingCityDistances: {
      'Delhi': { distanceKm: 530, transitMode: 'HRTC / Private Volvo Overnight Bus', transitHours: 12, transitCost: 1200 },
      'Chandigarh': { distanceKm: 310, transitMode: 'Bus / Cab via Kiratpur four-lane', transitHours: 7, transitCost: 800 },
      'Bengaluru': { distanceKm: 2700, transitMode: 'Flight to Chandigarh/Kullu + Cab', transitHours: 6, transitCost: 5500 }
    },
    travellerAffinities: ['friends', 'couples', 'adventure lovers', 'backpackers', 'families'],
    interests: ['adventure', 'nature', 'food', 'culture'],
    highlights: ['Solang Valley Snow Sports', 'Atal Tunnel & Sissu (Lahaul)', 'Hidimba Devi Temple', 'Jogini Waterfalls Trek', 'Old Manali Cafe Crawl'],
    attractions: [
      {
        id: 'manali-1',
        name: 'Hidimba Devi Temple & Cedar Forest',
        description: '16th-century four-tier wooden pagoda temple nestled among towering centuries-old deodar trees.',
        category: 'heritage',
        cost: 0,
        durationMinutes: 75,
        preferredTime: 'morning',
        coordinates: { lat: 32.2483, lng: 77.1809 },
        tips: 'Try warm local Siddu (steamed walnut bread) from village women outside the grove.'
      },
      {
        id: 'manali-2',
        name: 'Solang Valley Adventure Arena',
        description: 'Glacial valley famous for paragliding, zorbing, ATV quad bikes, and winter snow skiing.',
        category: 'adventure',
        cost: 500,
        durationMinutes: 180,
        preferredTime: 'morning',
        coordinates: { lat: 32.3166, lng: 77.1578 },
        tips: 'Ropeway cable car offers bird’s eye views of glaciers; negotiate activity combos in advance.'
      },
      {
        id: 'manali-3',
        name: 'Jogini Waterfall Day Trek from Vashisht',
        description: 'Scenic 3-km forest trail past pine woods and apple orchards leading to cascading mountain falls.',
        category: 'adventure',
        cost: 0,
        durationMinutes: 150,
        preferredTime: 'afternoon',
        coordinates: { lat: 32.2680, lng: 77.1950 },
        tips: 'After the trek, dip your tired feet into the natural hot sulfur baths in Vashisht village.'
      },
      {
        id: 'manali-4',
        name: 'Old Manali Bohemian Lane & Trout Tasting',
        description: 'Laid-back village vibe with handmade hemp gear, bakeries, live acoustic sets, and fresh Himalayan river trout.',
        category: 'food',
        cost: 350,
        durationMinutes: 90,
        preferredTime: 'evening',
        coordinates: { lat: 32.2530, lng: 77.1810 },
        tips: 'Cafe 1947 or Dylan’s Toasted and Roasted Coffee House are local institutions.'
      }
    ]
  },
  {
    id: 'varkala',
    name: 'Varkala',
    state: 'Kerala',
    tagline: 'Red Sandstone Cliffs, Arabian Sunsets & Bohemian Vibes',
    description: 'Dramatic red laterite cliffs towering over the Arabian Sea, golden sands, yoga retreats, ancient temples, and beachfront shacks.',
    image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1000&q=80',
    coordinates: { lat: 8.7379, lng: 76.7163 },
    minDays: 2,
    maxDays: 4,
    avgDailyBudget: 1900,
    budgetTier: 'moderate',
    baseCosts: { stay: 1200, food: 500, transit: 300, misc: 150 },
    startingCityDistances: {
      'Bengaluru': { distanceKm: 680, transitMode: 'Overnight KSRTC Bus / Train', transitHours: 12, transitCost: 1400 },
      'Kochi': { distanceKm: 160, transitMode: 'Jan Shatabdi Express / Bus', transitHours: 3.5, transitCost: 350 },
      'Munnar': { distanceKm: 220, transitMode: 'Cab / Bus via Kottayam', transitHours: 5.5, transitCost: 950 },
      'Thiruvananthapuram': { distanceKm: 45, transitMode: 'Local Train / Cab', transitHours: 1, transitCost: 150 },
      'Chennai': { distanceKm: 720, transitMode: 'Overnight Express Train', transitHours: 13, transitCost: 1450 }
    },
    travellerAffinities: ['solo travellers', 'couples', 'backpackers', 'friends'],
    interests: ['beaches', 'adventure', 'food', 'culture'],
    highlights: ['Varkala North Cliff Walk', 'Janardanaswamy 2000-Year Temple', 'Kappil Beach & Edava Lake', 'Odayam Beach Surfing'],
    attractions: [
      {
        id: 'varkala-1',
        name: 'Varkala North Cliff Promenade & Sunset Cafes',
        description: 'Vibrant pathway along red sandstone cliffs with panoramic Arabian Sea views, Tibetan craft shops, and seafood shacks.',
        category: 'beaches',
        cost: 0,
        durationMinutes: 120,
        preferredTime: 'evening',
        coordinates: { lat: 8.7380, lng: 76.7032 },
        tips: 'Grab a cliff-edge table at Cafe del Mar or Darjeeling Cafe before 5:30 PM for sunset.'
      },
      {
        id: 'varkala-2',
        name: 'Janardanaswamy 2000-Year-Old Temple & Papanasam Beach',
        description: 'Historic Vishnu temple perched near Papanasam beach, sacred for ritual dips believed to cleanse all sins.',
        category: 'religious tourism',
        cost: 0,
        durationMinutes: 75,
        preferredTime: 'morning',
        coordinates: { lat: 8.7319, lng: 76.7088 },
        tips: 'Non-Hindus can admire the ancient temple courtyard from outside; dress modestly (dhoti/shawl).'
      },
      {
        id: 'varkala-3',
        name: 'Kappil Beach & Edava Pozhi Estuary',
        description: 'Where the tranquil backwater lake meets the roaring Arabian Sea separated by a scenic coastal road.',
        category: 'nature',
        cost: 50,
        durationMinutes: 90,
        preferredTime: 'afternoon',
        coordinates: { lat: 8.7844, lng: 76.6783 },
        tips: 'Rent a scooter to drive the 7 km coastal stretch from Varkala Cliff.'
      },
      {
        id: 'varkala-4',
        name: 'Odayam Beach & Morning Surfing Lessons',
        description: 'Quiet golden strand north of the cliff with gentle swell ideal for beginner surfing and morning yoga.',
        category: 'adventure',
        cost: 500,
        durationMinutes: 120,
        preferredTime: 'morning',
        coordinates: { lat: 8.7485, lng: 76.6980 },
        tips: 'Surf schools offer boards and instructors at reasonable morning rates.'
      }
    ]
  },
  {
    id: 'trivandrum',
    name: 'Thiruvananthapuram',
    state: 'Kerala',
    tagline: 'Royal Travancore Splendour & Kovalam Sunsets',
    description: 'Capital city of Kerala famed for the sacred Sree Padmanabhaswamy Temple, royal palaces, Napier Museum, and nearby Kovalam beaches.',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80',
    coordinates: { lat: 8.5241, lng: 76.9366 },
    minDays: 1,
    maxDays: 3,
    avgDailyBudget: 2100,
    budgetTier: 'moderate',
    baseCosts: { stay: 1300, food: 550, transit: 350, misc: 200 },
    startingCityDistances: {
      'Bengaluru': { distanceKm: 720, transitMode: 'Direct Flight / Vande Bharat Express', transitHours: 1.5, transitCost: 2800 },
      'Kochi': { distanceKm: 200, transitMode: 'Vande Bharat / Jan Shatabdi', transitHours: 3, transitCost: 450 },
      'Varkala': { distanceKm: 45, transitMode: 'Train / Cab', transitHours: 1, transitCost: 150 },
      'Munnar': { distanceKm: 260, transitMode: 'Cab / Bus via Kottayam', transitHours: 6.5, transitCost: 1100 },
      'Chennai': { distanceKm: 760, transitMode: 'Ananthapuri Express / Flight', transitHours: 1.5, transitCost: 2600 }
    },
    travellerAffinities: ['families', 'couples', 'culture enthusiasts', 'solo travellers'],
    interests: ['culture', 'heritage', 'beaches', 'religious tourism'],
    highlights: ['Sree Padmanabhaswamy Temple', 'Kovalam Lighthouse Beach', 'Napier Museum', 'Kuthiramalika Palace'],
    attractions: [
      {
        id: 'tvm-1',
        name: 'Sree Padmanabhaswamy Temple',
        description: 'World-renowned architectural marvel blending Kerala and Dravidian temple styles with historic gold treasure vaults.',
        category: 'religious tourism',
        cost: 0,
        durationMinutes: 90,
        preferredTime: 'morning',
        coordinates: { lat: 8.4830, lng: 76.9436 },
        tips: 'Strict traditional dress code: Men must wear Mundu/Dhoti (bare chest); Women must wear Sarees or long skirts. Rental mundus available at gate.'
      },
      {
        id: 'tvm-2',
        name: 'Kovalam Lighthouse Beach & Sunset',
        description: 'Iconic striped lighthouse perched on palm-fringed cliff offering breathtaking views of Kovalam coastline.',
        category: 'beaches',
        cost: 20,
        durationMinutes: 120,
        preferredTime: 'evening',
        coordinates: { lat: 8.3988, lng: 76.9785 },
        tips: 'Climb the 142 steps inside the lighthouse for panoramic Arabian Sea vistas before 5:00 PM.'
      },
      {
        id: 'tvm-3',
        name: 'Napier Museum & Kanakakkunnu Palace Grounds',
        description: '19th-century Indo-Saracenic museum housing bronze idols, ancient ornaments, and ivory carvings in a lush botanical park.',
        category: 'heritage',
        cost: 40,
        durationMinutes: 90,
        preferredTime: 'afternoon',
        coordinates: { lat: 8.5085, lng: 76.9555 },
        tips: 'Natural air circulation keeps the museum cool without air conditioners. Closed Mondays.'
      }
    ]
  },
  {
    id: 'alleppey',
    name: 'Alleppey (Alappuzha)',
    state: 'Kerala',
    tagline: 'Venice of the East & Backwater Houseboats',
    description: 'Picturesque labyrinth of palm-fringed canals, backwater lagoons, traditional houseboats, coir villages, and quiet sandy shores.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
    coordinates: { lat: 9.4981, lng: 76.3388 },
    minDays: 1,
    maxDays: 3,
    avgDailyBudget: 2400,
    budgetTier: 'moderate',
    baseCosts: { stay: 1500, food: 600, transit: 350, misc: 200 },
    startingCityDistances: {
      'Kochi': { distanceKm: 55, transitMode: 'Train / Cab via NH66', transitHours: 1.5, transitCost: 200 },
      'Bengaluru': { distanceKm: 580, transitMode: 'Overnight Train / Bus', transitHours: 10, transitCost: 1200 },
      'Munnar': { distanceKm: 170, transitMode: 'Scenic Cab / Bus via Kothamangalam', transitHours: 4.5, transitCost: 800 },
      'Varkala': { distanceKm: 110, transitMode: 'Train / Cab', transitHours: 2.5, transitCost: 350 }
    },
    travellerAffinities: ['couples', 'families', 'friends', 'nature lovers'],
    interests: ['nature', 'culture', 'food', 'beaches'],
    highlights: ['Vembanad Lake Shikara Cruise', 'Alleppey Beach & Old Pier', 'Marari Beach Walk'],
    attractions: [
      {
        id: 'alp-1',
        name: 'Vembanad Lake Shikara & Canal Cruise',
        description: 'Tranquil wooden boat cruise through narrow village canals, floating lotus beds, and lush paddy fields.',
        category: 'nature',
        cost: 400,
        durationMinutes: 150,
        preferredTime: 'morning',
        coordinates: { lat: 9.5010, lng: 76.3500 },
        tips: 'Shikara boats can access narrow picturesque canals that large houseboats cannot enter.'
      },
      {
        id: 'alp-2',
        name: 'Marari Beach & Coconut Palm Groves',
        description: 'Idyllic, uncrowded fishing beach with soft white sands and traditional wooden fishing catamarans.',
        category: 'beaches',
        cost: 0,
        durationMinutes: 120,
        preferredTime: 'evening',
        coordinates: { lat: 9.6000, lng: 76.2970 },
        tips: '14 km north of Alleppey town; ideal for tranquil sunset strolls away from tourist crowds.'
      }
    ]
  },
  {
    id: 'kochi',
    name: 'Kochi (Fort Kochi)',
    state: 'Kerala',
    tagline: 'Queen of the Arabian Sea & Spice Port',
    description: 'Vibrant port city blending Portuguese, Dutch, British and Jewish heritage with iconic cantilevered Chinese fishing nets and art cafes.',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80',
    coordinates: { lat: 9.9656, lng: 76.2421 },
    minDays: 1,
    maxDays: 3,
    avgDailyBudget: 2100,
    budgetTier: 'moderate',
    baseCosts: { stay: 1300, food: 600, transit: 300, misc: 200 },
    startingCityDistances: {
      'Bengaluru': { distanceKm: 540, transitMode: 'Vande Bharat / Flight / Bus', transitHours: 8, transitCost: 1100 },
      'Munnar': { distanceKm: 130, transitMode: 'Bus / Cab', transitHours: 3.5, transitCost: 350 },
      'Alleppey': { distanceKm: 55, transitMode: 'Train / Cab', transitHours: 1.5, transitCost: 200 }
    },
    travellerAffinities: ['solo travellers', 'culture enthusiasts', 'couples', 'backpackers'],
    interests: ['heritage', 'culture', 'food', 'shopping'],
    highlights: ['Chinese Fishing Nets', 'Jew Town & Paradesi Synagogue', 'Mattancherry Dutch Palace'],
    attractions: [
      {
        id: 'koc-1',
        name: 'Fort Kochi Beach & Chinese Fishing Nets',
        description: '14th-century giant cantilevered fishing contraptions introduced by traders from the court of Kublai Khan.',
        category: 'heritage',
        cost: 0,
        durationMinutes: 75,
        preferredTime: 'evening',
        coordinates: { lat: 9.9675, lng: 76.2405 },
        tips: 'Fishermen gladly demonstrate net lifting at sunset; small polite tip appreciated.'
      },
      {
        id: 'koc-2',
        name: 'Jew Town, Antique Markets & Paradesi Synagogue',
        description: 'Narrow historic quarter with aroma of ginger and cardamom, curio shops, and the oldest active synagogue in the Commonwealth.',
        category: 'culture',
        cost: 20,
        durationMinutes: 90,
        preferredTime: 'morning',
        coordinates: { lat: 9.9575, lng: 76.2595 },
        tips: 'Synagogue closed on Saturdays and Jewish holidays. Floor paved with hand-painted Chinese willow porcelain tiles.'
      }
    ]
  }
];

export const REGIONAL_CIRCUITS = [
  {
    id: 'kerala-classic',
    name: 'God\'s Own Kerala Circuit',
    region: 'Kerala',
    tagline: 'Misty tea hills, coastal red cliffs & royal heritage',
    description: 'The definitive Kerala journey: start amidst the cool tea estates of Munnar, journey down to the bohemian cliffs of Varkala, and conclude in the royal cultural capital of Thiruvananthapuram.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
    totalDays: 5,
    stops: [
      { destinationId: 'munnar', daysCount: 2 },
      { destinationId: 'varkala', daysCount: 2 },
      { destinationId: 'trivandrum', daysCount: 1 }
    ],
    highlights: ['Munnar Tea Hills', 'Varkala Cliff Sunsets', 'Padmanabhaswamy Temple', 'Kovalam Beach'],
    avgBudget: 14500
  },
  {
    id: 'kerala-hills-backwaters',
    name: 'Kerala Tea Hills & Backwaters',
    region: 'Kerala',
    tagline: 'Rolling green tea trails, houseboats & spice quarters',
    description: 'Experience Munnar\'s cloud-kissed peaks followed by Alleppey\'s tranquil backwaters and Fort Kochi\'s colonial arts.',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1000&q=80',
    totalDays: 4,
    stops: [
      { destinationId: 'munnar', daysCount: 2 },
      { destinationId: 'alleppey', daysCount: 1 },
      { destinationId: 'kochi', daysCount: 1 }
    ],
    highlights: ['Eravikulam Tahr', 'Shikara Lake Cruise', 'Fort Kochi Fishing Nets'],
    avgBudget: 12500
  },
  {
    id: 'karnataka-hills-ruins',
    name: 'Karnataka Coffee & Ancient Ruins',
    region: 'Karnataka',
    tagline: 'Coffee hills, Abbey Falls & UNESCO boulder wonderland',
    description: 'Unwind in the misty coffee estates of Coorg before embarking on an epic journey to the UNESCO Vijayanagara ruins of Hampi.',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80',
    totalDays: 5,
    stops: [
      { destinationId: 'coorg', daysCount: 3 },
      { destinationId: 'hampi', daysCount: 2 }
    ],
    highlights: ['Abbey Falls', 'Golden Temple', 'Virupaksha Temple', 'Stone Chariot'],
    avgBudget: 13500
  },
  {
    id: 'rajasthan-royal-lakes',
    name: 'Rajasthan Royalty & Lakes',
    region: 'Rajasthan',
    tagline: 'Amber Fort, Pink City bazaars & Lake Pichola romance',
    description: 'Immerse yourself in Jaipur’s grand forts and bazaars followed by the shimmering white palaces and romantic lake cruises of Udaipur.',
    image: 'https://images.unsplash.com/photo-1603262110263-fb010d6e75dc?auto=format&fit=crop&w=1000&q=80',
    totalDays: 5,
    stops: [
      { destinationId: 'jaipur', daysCount: 3 },
      { destinationId: 'udaipur', daysCount: 2 }
    ],
    highlights: ['Amber Fort', 'Hawa Mahal', 'Udaipur City Palace', 'Lake Pichola Sunset Boat Cruise'],
    avgBudget: 16500
  },
  {
    id: 'south-nilgiri-hills',
    name: 'Nilgiri Hills & Wayanad Wilds',
    region: 'Tamil Nadu & Kerala',
    tagline: 'Colonial toy train, tea valleys & prehistoric caves',
    description: 'Ride the UNESCO steam toy train in Ooty and hike through the misty bamboo forests and Neolithic caves of Wayanad.',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1000&q=80',
    totalDays: 4,
    stops: [
      { destinationId: 'ooty', daysCount: 2 },
      { destinationId: 'wayanad', daysCount: 2 }
    ],
    highlights: ['Nilgiri Toy Train', 'Doddabetta Peak', 'Edakkal Caves', 'Banasura Sagar Dam'],
    avgBudget: 11800
  }
];

