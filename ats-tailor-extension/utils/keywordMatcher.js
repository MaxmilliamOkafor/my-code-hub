// ============= SIMPLIFY-STYLE KEYWORD MATCHER (95-100% Match Targeting) =============
// Advanced keyword extraction + ATS scoring based on Simplify/ResumeUp.AI methodology

// Keyword categories with weights for scoring
const KEYWORD_CATEGORIES = {
  technical: { weight: 4, priority: 'high', color: '#10b981' },
  skills: { weight: 3.5, priority: 'high', color: '#22c55e' },
  certifications: { weight: 3, priority: 'high', color: '#3b82f6' },
  tools: { weight: 3, priority: 'high', color: '#8b5cf6' },
  action_verbs: { weight: 2, priority: 'medium', color: '#f59e0b' },
  soft_skills: { weight: 1.5, priority: 'low', color: '#6b7280' },
  industry: { weight: 1, priority: 'low', color: '#9ca3af' },
};

// Stop words to filter out (expanded list)
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does',
  'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can',
  'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'what', 'which', 'who', 'whom', 'whose', 'where', 'when', 'why', 'how',
  'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  'just', 'also', 'now', 'here', 'there', 'then', 'once', 'if', 'about', 'your', 'our',
  'their', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'up', 'down',
  'out', 'off', 'over', 'under', 'again', 'further', 'once', 'any', 'etc', 'via',
  'able', 'being', 'such', 'however', 'therefore', 'thus', 'hence', 'including',
  'required', 'requirements', 'experience', 'work', 'working', 'job', 'role', 'position',
  'company', 'team', 'looking', 'seeking', 'candidate', 'candidates', 'opportunity',
  'responsibilities', 'qualifications', 'years', 'year', 'plus', 'strong', 'good',
  'excellent', 'proven', 'ability', 'skills', 'skill', 'knowledge', 'understanding',
]);

// 260 Power Action Verbs from Resume Best Practices
const ACTION_VERBS = {
  organizational: ['approved', 'accelerated', 'added', 'arranged', 'broadened', 'cataloged', 'centralised', 'changed', 'classified', 'collected', 'compiled', 'completed', 'controlled', 'defined', 'dispatched', 'executed', 'expanded', 'gained', 'gathered', 'generated', 'implemented', 'inspected', 'launched', 'monitored', 'operated', 'organised', 'prepared', 'processed', 'purchased', 'recorded', 'reduced', 'reinforced', 'retrieved', 'screened', 'selected', 'simplified', 'sold', 'specified', 'steered', 'structured', 'systematised', 'tabulated', 'unified', 'updated', 'utilised', 'validated', 'verified'],
  leadership: ['accomplished', 'achieved', 'administered', 'analysed', 'assigned', 'attained', 'chaired', 'consolidated', 'contracted', 'coordinated', 'delegated', 'developed', 'directed', 'earned', 'evaluated', 'executed', 'handled', 'headed', 'impacted', 'improved', 'increased', 'led', 'mastered', 'orchestrated', 'organized', 'oversaw', 'planned', 'predicted', 'prioritised', 'produced', 'proved', 'recommended', 'regulated', 'reorganised', 'reviewed', 'scheduled', 'spearheaded', 'strengthened', 'supervised', 'surpassed'],
  helping: ['assessed', 'assisted', 'clarified', 'coached', 'counselled', 'demonstrated', 'diagnosed', 'educated', 'enhanced', 'expedited', 'facilitated', 'familiarised', 'guided', 'motivated', 'participated', 'proposed', 'provided', 'referred', 'rehabilitated', 'represented', 'served', 'supported'],
  creative: ['acted', 'composed', 'conceived', 'conceptualised', 'created', 'customised', 'designed', 'developed', 'directed', 'established', 'fashioned', 'founded', 'illustrated', 'initiated', 'instituted', 'integrated', 'introduced', 'invented', 'originated', 'performed', 'planned', 'published', 'redesigned', 'revised'],
  communication: ['addressed', 'arbitrated', 'arranged', 'authored', 'collaborated', 'convinced', 'corresponded', 'delivered', 'developed', 'directed', 'documented', 'drafted', 'edited', 'energised', 'enlisted', 'formulated', 'influenced', 'interpreted', 'lectured', 'liaised', 'mediated', 'moderated', 'negotiated', 'persuaded', 'presented', 'promoted', 'publicised', 'reconciled', 'recruited', 'reported', 'rewrote', 'spoke', 'suggested', 'synthesised', 'translated', 'verbalised', 'wrote'],
  teaching: ['adapted', 'advised', 'clarified', 'coached', 'communicated', 'coordinated', 'demystified', 'developed', 'enabled', 'encouraged', 'evaluated', 'explained', 'facilitated', 'guided', 'informed', 'instructed', 'persuaded', 'stimulated', 'studied', 'taught', 'trained'],
  quantitative: ['administered', 'allocated', 'analysed', 'appraised', 'audited', 'balanced', 'budgeted', 'calculated', 'computed', 'developed', 'forecasted', 'managed', 'marketed', 'maximised', 'minimised', 'planned', 'projected', 'researched'],
  technical: ['assembled', 'built', 'calculated', 'computed', 'designed', 'devised', 'engineered', 'fabricated', 'installed', 'maintained', 'operated', 'optimised', 'overhauled', 'programmed', 'remodelled', 'repaired', 'solved', 'standardised', 'streamlined', 'upgraded'],
  research: ['clarified', 'collected', 'concluded', 'conducted', 'constructed', 'critiqued', 'derived', 'determined', 'diagnosed', 'discovered', 'evaluated', 'examined', 'extracted', 'formed', 'identified', 'inspected', 'interpreted', 'interviewed', 'investigated', 'modelled', 'organised', 'resolved', 'reviewed', 'summarised', 'surveyed', 'systematised'],
};

// Flatten all action verbs
const ALL_ACTION_VERBS = Object.values(ACTION_VERBS).flat();

// Technical keyword patterns (comprehensive)
const TECHNICAL_PATTERNS = [
  // Programming Languages
  /\b(python|javascript|typescript|java|c\+\+|c#|ruby|go|golang|rust|scala|kotlin|swift|php|r|perl|matlab|julia|dart|elixir|clojure|haskell|f#|vba|bash|powershell|shell)\b/gi,
  // Frontend Frameworks
  /\b(react|react\.js|reactjs|angular|angularjs|vue|vue\.js|vuejs|svelte|next\.js|nextjs|nuxt|gatsby|remix|astro|solid\.js|qwik)\b/gi,
  // Backend Frameworks
  /\b(node\.js|nodejs|express|express\.js|django|flask|fastapi|spring|spring boot|\.net|asp\.net|rails|ruby on rails|laravel|symfony|nest\.js|nestjs|koa|fastify)\b/gi,
  // Cloud & DevOps
  /\b(aws|amazon web services|azure|gcp|google cloud|docker|kubernetes|k8s|terraform|ansible|jenkins|ci\/cd|github actions|gitlab ci|circleci|travis ci|argocd|helm|pulumi)\b/gi,
  // Databases
  /\b(sql|mysql|postgresql|postgres|mongodb|redis|elasticsearch|dynamodb|cassandra|oracle|sql server|sqlite|mariadb|couchdb|neo4j|snowflake|bigquery|redshift)\b/gi,
  // Data & ML
  /\b(machine learning|ml|artificial intelligence|ai|deep learning|nlp|natural language processing|computer vision|tensorflow|pytorch|keras|scikit-learn|pandas|numpy|spark|hadoop|databricks|mlflow|kubeflow)\b/gi,
  // Tools & Platforms
  /\b(git|github|gitlab|bitbucket|jira|confluence|slack|figma|sketch|adobe xd|postman|swagger|grafana|prometheus|datadog|splunk|new relic|kibana|tableau|power bi|looker)\b/gi,
  // Web Technologies
  /\b(html|html5|css|css3|sass|scss|less|tailwind|tailwindcss|bootstrap|material ui|chakra ui|styled-components|webpack|vite|rollup|parcel|babel|npm|yarn|pnpm)\b/gi,
  // APIs & Protocols
  /\b(rest|restful|graphql|grpc|websocket|soap|api|apis|microservices|serverless|oauth|jwt|saml|openid)\b/gi,
  // Mobile
  /\b(ios|android|react native|flutter|xamarin|ionic|cordova|swift ui|jetpack compose|kotlin multiplatform)\b/gi,
  // Testing
  /\b(jest|mocha|chai|cypress|selenium|playwright|puppeteer|testing library|junit|pytest|rspec|testng|cucumber)\b/gi,
];

// Skill patterns
const SKILL_PATTERNS = [
  /\b(project management|product management|program management|team leadership|people management)\b/gi,
  /\b(data analysis|data analytics|business analysis|business intelligence|data visualization)\b/gi,
  /\b(agile|scrum|kanban|waterfall|lean|six sigma|safe|prince2)\b/gi,
  /\b(problem solving|critical thinking|analytical thinking|strategic thinking|decision making)\b/gi,
  /\b(communication skills?|presentation skills?|stakeholder management|client relations)\b/gi,
  /\b(user experience|ux|ui|ux\/ui|ui\/ux|design thinking|user research|a\/b testing|usability testing)\b/gi,
  /\b(cross[- ]?functional|self[- ]?starter|self[- ]?motivated|fast[- ]?paced|detail[- ]?oriented|results[- ]?driven)\b/gi,
  /\b(technical writing|documentation|requirements gathering|process improvement|change management)\b/gi,
  /\b(budget management|cost reduction|revenue growth|profit optimization|financial analysis)\b/gi,
  /\b(vendor management|contract negotiation|supply chain|procurement|inventory management)\b/gi,
];

// Certification patterns
const CERTIFICATION_PATTERNS = [
  /\b(pmp|prince2|cpa|cfa|cisa|cissp|cism|crisc|ccna|ccnp|ccie)\b/gi,
  /\b(aws certified|azure certified|google cloud certified|gcp certified)\b/gi,
  /\b(certified scrum master|csm|safe agilist|pmi-acp|comptia|itil)\b/gi,
  /\b(ceh|oscp|security\+|network\+|a\+|cloud\+)\b/gi,
  /\b(six sigma (green|black|yellow) belt|lean certified)\b/gi,
];

// Soft skills patterns
const SOFT_SKILL_PATTERNS = [
  /\b(leadership|teamwork|collaboration|communication|adaptability|flexibility)\b/gi,
  /\b(creativity|innovation|initiative|accountability|work ethic|integrity)\b/gi,
  /\b(time management|organization|prioritization|multitasking|attention to detail)\b/gi,
  /\b(empathy|emotional intelligence|conflict resolution|mentoring|coaching)\b/gi,
  /\b(resilience|resourcefulness|self-awareness|continuous learning|growth mindset)\b/gi,
];

/**
 * Extract precision keywords from job description (targeting ~45 keywords)
 */
function extractPrecisionKeywords(jobText, targetCount = 45) {
  if (!jobText || typeof jobText !== 'string') return [];
  
  const text = jobText.toLowerCase();
  const keywords = new Map();
  
  // Helper to add keyword
  const addKeyword = (term, category, weight, priority) => {
    const normalized = term.toLowerCase().trim();
    if (normalized.length < 2 || STOP_WORDS.has(normalized)) return;
    
    const existing = keywords.get(normalized);
    if (existing) {
      existing.count++;
      existing.score = existing.count * existing.weight;
    } else {
      keywords.set(normalized, {
        term: term.trim(),
        category,
        weight,
        priority,
        count: 1,
        score: weight,
      });
    }
  };
  
  // Extract technical terms (highest weight)
  TECHNICAL_PATTERNS.forEach(pattern => {
    const matches = jobText.match(pattern) || [];
    matches.forEach(match => addKeyword(match, 'technical', 4, 'high'));
  });
  
  // Extract skills
  SKILL_PATTERNS.forEach(pattern => {
    const matches = jobText.match(pattern) || [];
    matches.forEach(match => addKeyword(match, 'skills', 3.5, 'high'));
  });
  
  // Extract certifications
  CERTIFICATION_PATTERNS.forEach(pattern => {
    const matches = jobText.match(pattern) || [];
    matches.forEach(match => addKeyword(match, 'certifications', 3, 'high'));
  });
  
  // Extract soft skills
  SOFT_SKILL_PATTERNS.forEach(pattern => {
    const matches = jobText.match(pattern) || [];
    matches.forEach(match => addKeyword(match, 'soft_skills', 1.5, 'low'));
  });
  
  // Extract action verbs from requirements sections
  ALL_ACTION_VERBS.forEach(verb => {
    const regex = new RegExp(`\\b${verb}(ed|ing|s)?\\b`, 'gi');
    const matches = text.match(regex) || [];
    if (matches.length > 0) {
      addKeyword(verb, 'action_verbs', 2, 'medium');
    }
  });
  
  // TF-IDF inspired scoring + frequency boost
  const scored = Array.from(keywords.values()).map(kw => ({
    ...kw,
    score: kw.count * kw.weight * (1 + Math.log(kw.count)),
  }));
  
  // Sort by score (highest first)
  scored.sort((a, b) => b.score - a.score);
  
  // Return top keywords up to target count
  return scored.slice(0, targetCount);
}

/**
 * Calculate Simplify-style ATS Match Score (0-100)
 */
function calculateATSMatchScore(cvText, jobKeywords) {
  if (!cvText || !jobKeywords || jobKeywords.length === 0) {
    return { 
      score: 0, 
      breakdown: {}, 
      found: [], 
      missing: [],
      stats: { high: { found: 0, total: 0 }, medium: { found: 0, total: 0 }, low: { found: 0, total: 0 } }
    };
  }
  
  const cvLower = cvText.toLowerCase();
  const found = [];
  const missing = [];
  
  // Categorize keywords by priority
  const highPriority = jobKeywords.filter(k => k.priority === 'high');
  const mediumPriority = jobKeywords.filter(k => k.priority === 'medium');
  const lowPriority = jobKeywords.filter(k => k.priority === 'low');
  
  // Check each keyword in CV
  jobKeywords.forEach(keyword => {
    const term = keyword.term.toLowerCase();
    const regex = new RegExp(`\\b${escapeRegex(term)}\\b`, 'i');
    
    // Check for exact match or variations
    if (regex.test(cvLower) || cvLower.includes(term)) {
      found.push(keyword);
    } else {
      missing.push(keyword);
    }
  });
  
  // Calculate stats by priority
  const highFound = found.filter(k => k.priority === 'high').length;
  const highTotal = highPriority.length || 1;
  const medFound = found.filter(k => k.priority === 'medium').length;
  const medTotal = mediumPriority.length || 1;
  const lowFound = found.filter(k => k.priority === 'low').length;
  const lowTotal = lowPriority.length || 1;
  
  // Simplify-style scoring breakdown
  const keywordCoverageScore = Math.min(50, Math.round((found.length / jobKeywords.length) * 50));
  const missingPenalty = Math.min(20, Math.round((missing.filter(k => k.priority === 'high').length / highTotal) * 20));
  const experienceScore = 20; // Base score
  const technicalScore = Math.min(15, Math.round((found.filter(k => k.category === 'technical').length / Math.max(1, jobKeywords.filter(k => k.category === 'technical').length)) * 15));
  const formatScore = 15; // Base score for proper formatting
  
  const totalScore = Math.min(100, Math.max(0, 
    keywordCoverageScore + experienceScore + technicalScore + formatScore - missingPenalty
  ));
  
  return {
    score: totalScore,
    breakdown: {
      keywordCoverage: { points: 50, current: keywordCoverageScore },
      missingKeywords: { points: -20, current: -missingPenalty },
      experienceMatch: { points: 20, current: experienceScore },
      technicalAlignment: { points: 15, current: technicalScore },
      formatLocation: { points: 15, current: formatScore },
    },
    found,
    missing,
    stats: {
      high: { found: highFound, total: highPriority.length },
      medium: { found: medFound, total: mediumPriority.length },
      low: { found: lowFound, total: lowPriority.length },
    }
  };
}

/**
 * Get match status label based on score
 */
function getMatchStatus(score) {
  if (score >= 95) return { label: 'PERFECT', color: '#10b981', badge: '🎯', rating: 'Excellent' };
  if (score >= 85) return { label: 'EXCELLENT', color: '#22c55e', badge: '✅', rating: 'Excellent' };
  if (score >= 73) return { label: 'GOOD', color: '#84cc16', badge: '📊', rating: 'Good' };
  if (score >= 50) return { label: 'NEEDS WORK', color: '#f59e0b', badge: '⚠️', rating: 'Fair' };
  if (score >= 33) return { label: 'LOW MATCH', color: '#f97316', badge: '📉', rating: 'Poor' };
  return { label: 'VERY LOW', color: '#ef4444', badge: '❌', rating: 'Very Poor' };
}

/**
 * Generate keyword suggestions for CV enhancement
 */
function generateKeywordSuggestions(existingCV, jobKeywords) {
  const cvLower = (existingCV?.summary || '' + JSON.stringify(existingCV?.experience || [])).toLowerCase();
  
  const suggestions = {
    summary: [],     // 8 keywords for summary
    experience: [],  // 20 keywords for experience bullets
    skills: [],      // 15 keywords for skills section
    profile: [],     // 2 keywords for profile header
    missing: [],     // All missing keywords
  };
  
  // Find missing keywords
  jobKeywords.forEach(kw => {
    const term = kw.term.toLowerCase();
    if (!cvLower.includes(term)) {
      suggestions.missing.push(kw);
    }
  });
  
  // Distribute missing keywords
  const technical = suggestions.missing.filter(k => k.category === 'technical');
  const skills = suggestions.missing.filter(k => k.category === 'skills' || k.category === 'soft_skills');
  const actions = suggestions.missing.filter(k => k.category === 'action_verbs');
  
  suggestions.summary = [...technical.slice(0, 4), ...skills.slice(0, 4)].map(k => k.term);
  suggestions.experience = [...technical.slice(0, 10), ...actions.slice(0, 10)].map(k => k.term);
  suggestions.skills = [...technical.slice(0, 8), ...skills.slice(0, 7)].map(k => k.term);
  suggestions.profile = [...technical.slice(0, 2)].map(k => k.term);
  
  return suggestions;
}

/**
 * Natural keyword templates for CV bullet enhancement
 */
const KEYWORD_BULLET_TEMPLATES = [
  "Developed and deployed {k1} solutions utilizing {k2} and {k3}, achieving measurable improvements in {metric} by {percent}% across enterprise systems",
  "Led cross-functional initiatives implementing {k1} frameworks with {k2}, resulting in {metric} optimization and {percent}% efficiency gains",
  "Architected scalable {k1} infrastructure leveraging {k2} and {k3} technologies to enable {k4} capabilities for global operations",
  "Spearheaded {k1} transformation initiatives using {k2} methodologies, driving {metric} improvements of {percent}% while reducing operational overhead",
  "Collaborated with stakeholders to implement {k1} solutions utilizing {k2} and {k3}, enhancing {k4} processes and delivering business value",
  "Optimized {k1} workflows through {k2} automation and {k3} integration, reducing {metric} by {percent}% and improving team productivity",
  "Designed and executed {k1} strategies using {k2}, achieving {metric} targets and exceeding performance benchmarks by {percent}%",
  "Managed end-to-end {k1} implementations with {k2} and {k3}, successfully delivering projects on-time and under-budget",
  "Engineered high-performance {k1} systems integrating {k2} and {k3} components, supporting {metric} scale operations",
  "Delivered comprehensive {k1} training programs utilizing {k2} best practices, improving team proficiency and {k3} adoption rates by {percent}%",
];

/**
 * Generate top 5 fixes for missing keywords
 */
function generateTop5Fixes(missing, existingBullets = []) {
  const fixes = [];
  const highPriority = missing.filter(k => k.priority === 'high').slice(0, 5);
  
  highPriority.forEach((keyword, index) => {
    const template = KEYWORD_BULLET_TEMPLATES[index % KEYWORD_BULLET_TEMPLATES.length];
    const bullet = template
      .replace('{k1}', keyword.term)
      .replace('{k2}', missing[index + 1]?.term || 'best practices')
      .replace('{k3}', missing[index + 2]?.term || 'optimization')
      .replace('{k4}', missing[index + 3]?.term || 'operational')
      .replace('{metric}', 'performance')
      .replace('{percent}', String(15 + Math.floor(Math.random() * 20)));
    
    fixes.push({
      keyword: keyword.term,
      category: keyword.category,
      priority: keyword.priority,
      suggestedBullet: bullet,
      placement: 'Experience Section',
    });
  });
  
  return fixes;
}

// Escape regex special characters
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.ATSKeywordMatcher = {
    extractPrecisionKeywords,
    calculateATSMatchScore,
    getMatchStatus,
    generateKeywordSuggestions,
    generateTop5Fixes,
    KEYWORD_BULLET_TEMPLATES,
    KEYWORD_CATEGORIES,
    ACTION_VERBS,
    ALL_ACTION_VERBS,
  };
}

console.log('ATS Tailor: Advanced Keyword Matcher module loaded (95-100% targeting)');
