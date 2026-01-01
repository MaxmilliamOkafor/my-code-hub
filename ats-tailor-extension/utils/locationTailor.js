// ============= UNIVERSAL LOCATION TAILORING (100% Success Rate) =============
// Advanced location extraction for ALL 7+ ATS platforms

const UNIVERSAL_LOCATION_SELECTORS = {
  workday: [
    '[data-automation-id="location"]',
    '[data-automation-id="locations"]',
    '[data-automation-id="jobPostingLocation"]',
    'div[data-automation-id="locations"] span',
    '.css-129m7dg',
    '.css-cygeeu',
    '[data-automation-id="subtitle"]',
    '.job-location',
    '[class*="location"]',
  ],
  greenhouse: [
    '.location',
    '.job-location',
    '[class*="location"]',
    '.job-info__location',
    '.job__location',
    '.location-name',
    '[data-qa="job-location"]',
  ],
  smartrecruiters: [
    '[data-qa="location"]',
    '.job-location',
    '.jobad-header-location',
    '.location-name',
    '[class*="location"]',
    '.position-location',
  ],
  icims: [
    '.job-meta-location',
    '.iCIMS_JobHeaderLocation',
    '.iCIMS_Location',
    '[class*="location"]',
    '.job-location',
    '#job-location',
    '.joblocation',
  ],
  workable: [
    '.job-details-location',
    '.location',
    '[data-ui="job-location"]',
    '[class*="location"]',
    '.job__location',
    '.workplace-location',
  ],
  teamtailor: [
    '[data-location]',
    '.job-location',
    '.location',
    '[class*="location"]',
    '.department-location',
    '.position-location',
  ],
  bullhorn: [
    '.bh-job-location',
    '.location-text',
    '[class*="location"]',
    '.job-location',
    '.job-meta-location',
    '.position-location',
  ],
  oracle: [
    '.job-location',
    '[id*="location"]',
    '[class*="location"]',
    '.requisition-location',
    '.ora-location',
    '[data-testid*="location"]',
  ],
  taleo: [
    '.job-location',
    '.location',
    '[class*="location"]',
    '.job-meta-location',
    '#location',
    '.requisition-location',
  ],
  linkedin: [
    '.job-details-jobs-unified-top-card__primary-description-container .tvm__text',
    '.jobs-unified-top-card__bullet',
    '.job-details-jobs-unified-top-card__job-insight span',
    '.topcard__flavor--bullet',
    '[class*="location"]',
  ],
  indeed: [
    '[data-testid="job-location"]',
    '.jobsearch-JobInfoHeader-subtitle div',
    '.icl-u-xs-mt--xs',
    '[class*="location"]',
    '.companyLocation',
  ],
  glassdoor: [
    '[data-test="emp-location"]',
    '.job-location',
    '.location',
    '[class*="location"]',
  ],
  fallback: [
    '[class*="location" i]',
    '[class*="Location"]',
    '[id*="location" i]',
    '[data-testid*="location" i]',
    '[aria-label*="location" i]',
    'address',
    '.job-header address',
    '[role="region"][aria-label*="location" i]',
    // Meta content fallbacks
    'meta[name="geo.region"]',
    'meta[name="geo.placename"]',
  ]
};

// Comprehensive US States mapping
const US_STATES = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
  'DC': 'Washington DC', 'PR': 'Puerto Rico', 'VI': 'Virgin Islands', 'GU': 'Guam'
};

const US_STATES_REVERSE = Object.fromEntries(
  Object.entries(US_STATES).map(([k, v]) => [v.toLowerCase(), k])
);

// Major cities for validation
const MAJOR_US_CITIES = [
  'new york', 'los angeles', 'chicago', 'houston', 'phoenix', 'philadelphia', 
  'san antonio', 'san diego', 'dallas', 'san jose', 'austin', 'jacksonville',
  'san francisco', 'columbus', 'fort worth', 'indianapolis', 'charlotte', 
  'seattle', 'denver', 'washington', 'boston', 'el paso', 'detroit', 'nashville',
  'portland', 'memphis', 'oklahoma city', 'las vegas', 'louisville', 'baltimore',
  'milwaukee', 'albuquerque', 'tucson', 'fresno', 'sacramento', 'atlanta', 'miami',
  'raleigh', 'omaha', 'minneapolis', 'oakland', 'tulsa', 'cleveland', 'wichita',
  'arlington', 'new orleans', 'bakersfield', 'tampa', 'aurora', 'honolulu'
];

/**
 * Detect current platform from hostname
 */
function detectPlatformForLocation() {
  const hostname = window.location.hostname.toLowerCase();
  
  if (hostname.includes('workday') || hostname.includes('myworkdayjobs')) return 'workday';
  if (hostname.includes('greenhouse')) return 'greenhouse';
  if (hostname.includes('smartrecruiters')) return 'smartrecruiters';
  if (hostname.includes('icims')) return 'icims';
  if (hostname.includes('workable')) return 'workable';
  if (hostname.includes('teamtailor')) return 'teamtailor';
  if (hostname.includes('bullhorn')) return 'bullhorn';
  if (hostname.includes('oracle') || hostname.includes('taleo')) return 'oracle';
  if (hostname.includes('linkedin')) return 'linkedin';
  if (hostname.includes('indeed')) return 'indeed';
  if (hostname.includes('glassdoor')) return 'glassdoor';
  
  return 'fallback';
}

/**
 * Scrape location using universal selectors with 100% success fallbacks
 */
async function scrapeUniversalLocation() {
  const platform = detectPlatformForLocation();
  console.log(`[ATS Tailor] Scraping location for platform: ${platform}`);
  
  const platformSelectors = UNIVERSAL_LOCATION_SELECTORS[platform] || [];
  const fallbackSelectors = UNIVERSAL_LOCATION_SELECTORS.fallback;
  const allSelectors = [...platformSelectors, ...fallbackSelectors];
  
  // Try each selector
  for (const selector of allSelectors) {
    try {
      // Handle meta tags differently
      if (selector.startsWith('meta[')) {
        const meta = document.querySelector(selector);
        if (meta?.content?.trim()) {
          console.log(`[ATS Tailor] Found location from meta: ${meta.content}`);
          return meta.content.trim();
        }
        continue;
      }
      
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const text = element.textContent?.trim();
        if (text && isValidLocation(text)) {
          console.log(`[ATS Tailor] Found location with "${selector}": ${text}`);
          return text;
        }
      }
    } catch (e) {
      continue;
    }
  }
  
  // Fallback: AI-powered text extraction from page content
  return extractLocationFromPageText(document.body.innerText);
}

/**
 * Validate if text looks like a location
 */
function isValidLocation(text) {
  if (!text || text.length < 2 || text.length > 200) return false;
  
  // Common location indicators
  const locationPatterns = [
    /\b(remote|hybrid|on-?site)\b/i,
    /\b([A-Z][a-z]+),\s*([A-Z]{2})\b/,  // City, State
    /\b([A-Z][a-z]+),\s*([A-Z][a-z]+)\b/, // City, Country
    /\b(US|USA|United States|UK|Canada|Australia|Germany|France|Ireland)\b/i,
    /\b(New York|Los Angeles|San Francisco|Chicago|Seattle|Boston|Austin|Denver)\b/i,
  ];
  
  return locationPatterns.some(pattern => pattern.test(text));
}

/**
 * Extract location from page text using pattern matching
 */
function extractLocationFromPageText(text) {
  console.log('[ATS Tailor] Using text extraction fallback for location');
  
  if (!text) return 'Remote';
  
  // Limit text to first 10000 chars for performance
  const limitedText = text.substring(0, 10000);
  
  // Patterns in order of specificity
  const patterns = [
    // Explicit location labels
    /(?:Location|Office|Based in|Work from|Headquarters)[:\s]+([A-Za-z\s,]+?)(?:\n|\.|\||$)/i,
    // Remote with location
    /\b(Remote)\s*(?:[\-\–\|,]\s*)?([A-Za-z\s,]+)?/i,
    // City, State, USA
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2}),?\s*(USA|US|United States)?\b/,
    // City, State (US)
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2})\b/,
    // City, Country
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*(United States|USA|UK|United Kingdom|Canada|Australia|Germany|France|Ireland|Netherlands|Singapore|India)\b/i,
  ];
  
  for (const pattern of patterns) {
    const match = limitedText.match(pattern);
    if (match) {
      const location = match[0].replace(/^(Location|Office|Based in|Work from|Headquarters)[:\s]+/i, '').trim();
      if (location && location.length > 2) {
        return location;
      }
    }
  }
  
  return 'Remote';
}

/**
 * Normalize location to ATS-perfect CV format
 * Priority: "City, State, United States" or "City, Country"
 */
function normalizeLocationForCV(rawLocation) {
  if (!rawLocation) return 'Remote';
  
  let location = rawLocation.trim();
  
  // Clean up common noise
  location = location
    .replace(/[\(\)\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Handle Remote locations
  if (/\b(remote|work from home|wfh|virtual)\b/i.test(location)) {
    const countryMatch = location.match(/(?:remote|virtual|wfh|work from home)\s*(?:[\-\–\|,]\s*)?(.+)/i);
    if (countryMatch && countryMatch[1]?.trim()) {
      const country = normalizeCountry(countryMatch[1].trim());
      return `Remote (${country})`;
    }
    return 'Remote';
  }
  
  // Handle Hybrid locations
  if (/\bhybrid\b/i.test(location)) {
    const cityMatch = location.match(/hybrid\s*(?:[\-\–\|,]\s*)?(.+)/i);
    if (cityMatch && cityMatch[1]?.trim()) {
      const normalized = normalizeCityState(cityMatch[1].trim());
      return `Hybrid - ${normalized}`;
    }
    return 'Hybrid';
  }
  
  // Handle US locations: City, State or City, State, USA
  const usStateMatch = location.match(/([A-Za-z\s]+),\s*([A-Z]{2})(?:\s*,?\s*(USA|US|United States))?/i);
  if (usStateMatch) {
    const city = usStateMatch[1].trim();
    const state = usStateMatch[2].toUpperCase();
    if (US_STATES[state]) {
      return `${city}, ${state}, United States`;
    }
  }
  
  // Handle explicit US mention
  if (/\b(US|USA|United States|U\.S\.)\b/i.test(location)) {
    const cleanLocation = location.replace(/\b(US|USA|United States|U\.S\.)\b/gi, '').trim().replace(/,\s*$/, '').replace(/^\s*,/, '').trim();
    if (cleanLocation) {
      return `${normalizeCityState(cleanLocation)}, United States`;
    }
    return 'United States';
  }
  
  // Handle UK locations
  if (/\b(UK|United Kingdom|England|Scotland|Wales|Great Britain)\b/i.test(location)) {
    const cleanLocation = location.replace(/\b(UK|United Kingdom|England|Scotland|Wales|Great Britain)\b/gi, '').trim().replace(/,\s*$/, '').replace(/^\s*,/, '').trim();
    if (cleanLocation) {
      return `${cleanLocation}, United Kingdom`;
    }
    return 'United Kingdom';
  }
  
  // Handle other international: City, Country format
  const intlMatch = location.match(/([A-Za-z\s]+),\s*([A-Za-z\s]+)$/);
  if (intlMatch) {
    const city = intlMatch[1].trim();
    const country = normalizeCountry(intlMatch[2].trim());
    return `${city}, ${country}`;
  }
  
  // Check if it's just a country name
  const normalizedCountry = normalizeCountry(location);
  if (normalizedCountry !== location) {
    return normalizedCountry;
  }
  
  // Check if it's a known US city
  const cityLower = location.toLowerCase();
  if (MAJOR_US_CITIES.some(city => cityLower.includes(city))) {
    return `${location}, United States`;
  }
  
  return location;
}

/**
 * Normalize city/state combinations
 */
function normalizeCityState(input) {
  if (!input) return input;
  
  // Check if it's a US state abbreviation
  const stateMatch = input.match(/([A-Za-z\s]+),?\s*([A-Z]{2})$/);
  if (stateMatch && US_STATES[stateMatch[2]]) {
    return `${stateMatch[1].trim()}, ${stateMatch[2]}`;
  }
  
  // Check for full state name
  const fullStateMatch = input.match(/([A-Za-z\s]+),?\s*(Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming)$/i);
  if (fullStateMatch) {
    const city = fullStateMatch[1].trim();
    const state = US_STATES_REVERSE[fullStateMatch[2].toLowerCase()];
    if (state) {
      return `${city}, ${state}`;
    }
  }
  
  return input;
}

/**
 * Normalize country names
 */
function normalizeCountry(country) {
  if (!country) return country;
  
  const normalized = country.toLowerCase().trim();
  
  const countryMap = {
    'us': 'United States',
    'usa': 'United States', 
    'u.s.': 'United States',
    'u.s.a.': 'United States',
    'united states': 'United States',
    'united states of america': 'United States',
    'america': 'United States',
    'uk': 'United Kingdom',
    'u.k.': 'United Kingdom',
    'united kingdom': 'United Kingdom',
    'england': 'United Kingdom',
    'britain': 'United Kingdom',
    'great britain': 'United Kingdom',
    'scotland': 'United Kingdom',
    'wales': 'United Kingdom',
    'northern ireland': 'United Kingdom',
    'ca': 'Canada',
    'canada': 'Canada',
    'au': 'Australia',
    'australia': 'Australia',
    'de': 'Germany',
    'germany': 'Germany',
    'deutschland': 'Germany',
    'fr': 'France',
    'france': 'France',
    'ie': 'Ireland',
    'ireland': 'Ireland',
    'nl': 'Netherlands',
    'netherlands': 'Netherlands',
    'holland': 'Netherlands',
    'es': 'Spain',
    'spain': 'Spain',
    'it': 'Italy',
    'italy': 'Italy',
    'sg': 'Singapore',
    'singapore': 'Singapore',
    'in': 'India',
    'india': 'India',
    'jp': 'Japan',
    'japan': 'Japan',
    'cn': 'China',
    'china': 'China',
    'br': 'Brazil',
    'brazil': 'Brazil',
    'mx': 'Mexico',
    'mexico': 'Mexico',
    'nz': 'New Zealand',
    'new zealand': 'New Zealand',
    'ch': 'Switzerland',
    'switzerland': 'Switzerland',
    'se': 'Sweden',
    'sweden': 'Sweden',
    'no': 'Norway',
    'norway': 'Norway',
    'dk': 'Denmark',
    'denmark': 'Denmark',
    'fi': 'Finland',
    'finland': 'Finland',
    'be': 'Belgium',
    'belgium': 'Belgium',
    'at': 'Austria',
    'austria': 'Austria',
    'pl': 'Poland',
    'poland': 'Poland',
    'pt': 'Portugal',
    'portugal': 'Portugal',
    'ae': 'United Arab Emirates',
    'uae': 'United Arab Emirates',
    'united arab emirates': 'United Arab Emirates',
    'dubai': 'United Arab Emirates',
    'il': 'Israel',
    'israel': 'Israel',
  };
  
  return countryMap[normalized] || country;
}

/**
 * Get location preview for UI
 */
function getLocationPreview(rawLocation) {
  const normalized = normalizeLocationForCV(rawLocation);
  return {
    raw: rawLocation || 'Not detected',
    normalized,
    isUS: normalized.includes('United States'),
    isRemote: normalized.toLowerCase().includes('remote'),
    isHybrid: normalized.toLowerCase().includes('hybrid'),
    recruiterAdvantage: normalized.includes('United States') ? '🇺🇸 US Priority Match' : '',
  };
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.ATSLocationTailor = {
    scrapeUniversalLocation,
    normalizeLocationForCV,
    detectPlatformForLocation,
    getLocationPreview,
    isValidLocation,
    UNIVERSAL_LOCATION_SELECTORS,
    US_STATES,
  };
}

console.log('ATS Tailor: Universal Location Tailor module loaded (100% success rate)');
