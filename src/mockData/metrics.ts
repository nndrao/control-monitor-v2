import type { RawMetricScoringItem } from "../types/metrics";

// =============================================================================
// SEEDED RANDOM NUMBER GENERATOR
// =============================================================================

class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  choice<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }

  boolean(probability: number = 0.5): boolean {
    return this.next() < probability;
  }
}

// =============================================================================
// DATA POOLS
// =============================================================================

const EMPLOYEE_NAMES = [
  "Michael Chen",
  "James Thompson",
  "Lisa Anderson",
  "Emily Watson",
  "David Rodriguez",
  "Robert Kim",
  "Jennifer Martinez",
  "Christopher Lee",
  "Sarah Johnson",
  "Amanda Wilson",
  "Cam Skadsheim",
  "El Manning",
  "Brian Burns",
  "Keith Roberts",
  "Nehann Hilfts",
  "Oqval Runkteen",
  "Jexxon Dark",
  "Merle Wandropen",
  "Adam Smith",
  "Lyon-Miller David",
];

const METRIC_THEMES = [
  "Conflicts of Interest",
  "Trading Violations",
  "Information Security",
  "Licensing & Registration",
  "Employee Conduct",
  "Supervisory Review",
];

const METRIC_CATEGORIES = [
  "Personal Account Dealing",
  "Market Manipulation",
  "Data Breach",
  "FINRA Exams",
  "Employee Misconduct",
  "Periodic Sign-Off",
];

const METRIC_NAMES = [
  "PAD Violation",
  "FINRA Exam Not Passed",
  "Late T+3 Chem Prt. Sign-Off",
  "FINRA Exam Window Expired",
  "Guardian Prt. Sign-Off",
  "Guardian Central and Annual Review",
  "Unapproved Communication Application Usage",
  "G.E.E.Policy Violation",
  "Employee Misconduct",
  "Scheduled FINRA exam not passed",
  "Off-Hours Trading",
  "Optional Prt.",
  "Pre-Trade Approval Required",
  "Quarterly Attestation",
  "Annual Compliance Training",
];

const REGIONS = ["North America", "EMEA", "APAC", "LATAM"];

const COUNTRIES = ["United States", "United Kingdom", "Singapore", "Brazil"];

const LEGAL_ENTITIES = [
  "Goldman Sachs & Co.",
  "Goldman Sachs International",
  "Goldman Sachs (Asia)",
  "Goldman Sachs do Brasil",
];

const LOB_LEVELS = [
  "Investment Banking",
  "Global Markets",
  "Asset Management",
  "Consumer & Wealth Management",
];

const SUB_LOB_1 = ["Equities", "Fixed Income", "Commodities", "Currencies"];

const SUB_LOB_2 = ["Trading", "Sales", "Research", "Operations"];

const DIVISIONS = ["Americas", "EMEA", "Asia Pacific", "Technology"];

const DISTRICTS = ["NYC", "London", "Hong Kong", "San Francisco", "Tokyo"];

const SUPERVISORS = [
  "P. System Administrator",
  "John Davis",
  "Sarah Martinez",
  "Michael Brown",
];

// =============================================================================
// MOCK DATA GENERATOR
// =============================================================================

/**
 * Generate mock metric scoring data
 * @param count Number of records to generate (default: 200)
 * @param seed Optional seed for deterministic generation
 */
export function generateMockMetricScoringData(
  count: number = 200,
  seed?: number
): RawMetricScoringItem[] {
  const random = new SeededRandom(seed || Date.now());
  const data: RawMetricScoringItem[] = [];

  // Get current year for date generation
  const currentYear = new Date().getFullYear();

  for (let i = 0; i < count; i++) {
    // Generate a random occurrence date in the current year
    const month = random.nextInt(1, 12);
    const day = random.nextInt(1, 28);
    const occurrenceDate = `${currentYear}-${month
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

    // Determine scoring (1 = Breach, 2 = Potential Breach)
    // 60% breaches, 40% potential breaches
    const scoring = random.boolean(0.6) ? 1 : 2;

    // Reviewed status (70% reviewed, 30% open)
    const reviewedStatus = random.boolean(0.7) ? "Reviewed" : "Open";

    const item: RawMetricScoringItem = {
      ID: i + 1,
      "Metric Theme": random.choice(METRIC_THEMES),
      "Metric Category": random.choice(METRIC_CATEGORIES),
      Employee: random.choice(EMPLOYEE_NAMES),
      Metric: random.choice(METRIC_NAMES),
      "Ingestion Date": occurrenceDate,
      "Occurrence Date": occurrenceDate,
      "Reviewed Status": reviewedStatus,
      Scoring: scoring,
      "Metric Details": `Violation detected on ${occurrenceDate}`,
      "Metric Description": `${random.choice(
        METRIC_NAMES
      )} - Requires immediate attention`,
      "Operating Segment": random.choice(LOB_LEVELS),
      LOB: random.choice(LOB_LEVELS),
      "Sub LOB 1": random.choice(SUB_LOB_1),
      "Sub LOB 2": random.choice(SUB_LOB_2),
      "Division 1": random.choice(DIVISIONS),
      "District 1": random.choice(DISTRICTS),
      "Legal Entity": random.choice(LEGAL_ENTITIES),
      Region: random.choice(REGIONS),
      Country: random.choice(COUNTRIES),
      "Current Functional Supervisor": random.choice(SUPERVISORS),
      "Employee Status": "Active",
      "Reviewed By": reviewedStatus === "Reviewed" ? random.choice(SUPERVISORS) : "",
      "Reviewed Date": reviewedStatus === "Reviewed" ? occurrenceDate : "",
      "Review Comment":
        reviewedStatus === "Reviewed" ? "Reviewed and acknowledged" : "",
    };

    data.push(item);
  }

  return data;
}

/**
 * Create task-specific metrics data with deterministic seed
 * Use this when you need the same data for a specific task ID
 * @param taskId Task ID to use as seed
 * @param count Number of records to generate
 */
export function createTaskSpecificMetricsData(
  taskId: string,
  count: number = 200
): RawMetricScoringItem[] {
  // Convert task ID to numeric seed
  const seed = taskId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return generateMockMetricScoringData(count, seed);
}

/**
 * Get data pools for external use (e.g., testing, seeding)
 */
export function getDataPools() {
  return {
    EMPLOYEE_NAMES,
    METRIC_THEMES,
    METRIC_CATEGORIES,
    METRIC_NAMES,
    REGIONS,
    COUNTRIES,
    LEGAL_ENTITIES,
    LOB_LEVELS,
    SUB_LOB_1,
    SUB_LOB_2,
    DIVISIONS,
    DISTRICTS,
    SUPERVISORS,
  };
}
