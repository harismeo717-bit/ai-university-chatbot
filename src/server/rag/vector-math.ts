/**
 * UniAssist AI — Vector Math & Hybrid Retrieval Scoring
 * Cosine similarity, BM25 / TF-IDF keyword scoring, domain synonym boosting, and hybrid fusion.
 */

// University domain term associations for query expansion
const DOMAIN_SYNONYMS: Record<string, string[]> = {
  bscs: ['computer science', 'bs computer science', 'cs', 'undergraduate computing'],
  fee: ['tuition', 'credit hour', 'charges', 'installment', 'costs', 'refund', 'payment', 'structure'],
  fees: ['tuition', 'credit hour', 'charges', 'installment', 'costs', 'refund', 'payment', 'structure'],
  scholarship: ['financial aid', 'merit', 'waiver', 'hec', 'peef', 'assistance', 'grants'],
  scholarships: ['financial aid', 'merit', 'waiver', 'hec', 'peef', 'assistance', 'grants'],
  admission: ['apply', 'eligibility', 'requirements', 'deadline', 'entry test', 'merit', 'hssc', 'qualification'],
  admissions: ['apply', 'eligibility', 'requirements', 'deadline', 'entry test', 'merit', 'hssc', 'qualification'],
  exam: ['examinations', 'grading', 'cgpa', 'attendance', '75%', 'finals', 'midterms', 'probation'],
  exams: ['examinations', 'grading', 'cgpa', 'attendance', '75%', 'finals', 'midterms', 'probation'],
  hod: ['head of department', 'chairperson', 'sarah chen', 'alan thorne', 'lead', 'dean'],
  hostel: ['accommodation', 'curfew', '10:00 pm', 'mess', 'rooms', 'provost', 'residence'],
  library: ['books', 'ieee', 'acm', 'borrowing', 'digital', 'hours', 'lending'],
  transport: ['bus', 'shuttle', 'routes', 'pass', 'rfid', 'commute'],
  transportation: ['bus', 'shuttle', 'routes', 'pass', 'rfid', 'commute'],
};

// Common English stopwords to ignore in keyword frequency
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any',
  'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below',
  'between', 'both', 'but', 'by', 'can', 'could', 'did', 'do', 'does', 'doing',
  'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
  'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most',
  'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or',
  'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should',
  'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves',
  'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under',
  'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while',
  'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves',
  'tell', 'me', 'please', 'show', 'give', 'know', 'want', 'information', 'details',
]);

/**
 * Tokenize string into cleaned, lowercased alphanumeric tokens
 */
export function tokenize(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

/**
 * Calculate Cosine Similarity between two numerical vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;
  return Math.max(0, Math.min(1, dotProduct / denominator));
}

/**
 * Deterministic pseudo-embedding for fallback when offline or no API key.
 * Uses high-dimensional feature hashing with n-grams and domain weights.
 */
export function generateFeatureVector(text: string, dimensions = 128): number[] {
  const tokens = tokenize(text);
  const vector = new Array(dimensions).fill(0);

  for (const token of tokens) {
    let hash = 5381;
    for (let i = 0; i < token.length; i++) {
      hash = (hash * 33) ^ token.charCodeAt(i);
    }
    const idx = Math.abs(hash) % dimensions;
    vector[idx] += 1;

    // Check for domain synonyms and boost corresponding buckets
    if (DOMAIN_SYNONYMS[token]) {
      for (const syn of DOMAIN_SYNONYMS[token]) {
        let synHash = 5381;
        for (let j = 0; j < syn.length; j++) {
          synHash = (synHash * 33) ^ syn.charCodeAt(j);
        }
        const synIdx = Math.abs(synHash) % dimensions;
        vector[synIdx] += 1.5;
      }
    }
  }

  // Normalize to unit vector
  let norm = 0;
  for (const val of vector) {
    norm += val * val;
  }
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < vector.length; i++) {
      vector[i] /= norm;
    }
  }

  return vector;
}

/**
 * Keyword match score using BM25-style term frequencies and domain boosts
 */
export function calculateKeywordScore(queryTokens: string[], docContent: string): number {
  if (queryTokens.length === 0 || !docContent) return 0;
  const docTokens = tokenize(docContent);
  if (docTokens.length === 0) return 0;

  const docFrequency: Record<string, number> = {};
  for (const t of docTokens) {
    docFrequency[t] = (docFrequency[t] || 0) + 1;
  }

  let matchedWeight = 0;
  let totalWeight = 0;

  for (const qToken of queryTokens) {
    const isDomainTerm = Boolean(DOMAIN_SYNONYMS[qToken]);
    const termWeight = isDomainTerm ? 2.5 : 1.0;
    totalWeight += termWeight;

    // Exact match
    if (docFrequency[qToken]) {
      const tf = docFrequency[qToken];
      const tfNorm = (tf * 2.2) / (tf + 1.2);
      matchedWeight += termWeight * tfNorm;
      continue;
    }

    // Synonym match
    if (isDomainTerm) {
      const syns = DOMAIN_SYNONYMS[qToken];
      let synMatched = false;
      for (const syn of syns) {
        if (docContent.toLowerCase().includes(syn)) {
          matchedWeight += termWeight * 0.75;
          synMatched = true;
          break;
        }
      }
      if (synMatched) continue;
    }

    // Partial substring match
    for (const dToken of Object.keys(docFrequency)) {
      if (dToken.includes(qToken) || qToken.includes(dToken)) {
        matchedWeight += termWeight * 0.4;
        break;
      }
    }
  }

  if (totalWeight === 0) return 0;
  return Math.min(1.0, matchedWeight / totalWeight);
}

/**
 * Hybrid retrieval score: blends semantic vector similarity with BM25 keyword matching
 */
export function computeHybridScore(
  query: string,
  docContent: string,
  queryVector: number[],
  docVector: number[],
  alpha = 0.55
): number {
  const queryTokens = tokenize(query);
  const keywordScore = calculateKeywordScore(queryTokens, docContent);
  const vectorScore = cosineSimilarity(queryVector, docVector);

  const combined = alpha * vectorScore + (1 - alpha) * keywordScore;
  return Math.min(1.0, Math.max(0.0, combined));
}
