// =============================================================================
// RAW DATA TYPES (Input from backend/API/CSV)
// =============================================================================

export interface RawMetricScoringItem {
  ID: number;
  "Metric Theme": string;
  "Metric Category": string;
  Employee: string;
  Metric: string;
  "Ingestion Date": string | null;
  "Occurrence Date": string;
  "Reviewed Status": string;
  Scoring: number; // 1 = Breach, 2 = Potential Breach
  "Metric Details": string;
  "Metric Description": string;
  "Operating Segment": string;
  LOB: string;
  "Sub LOB 1": string;
  "Sub LOB 2": string;
  "Division 1": string;
  "District 1": string;
  "Legal Entity": string;
  Region: string;
  Country: string;
  "Current Functional Supervisor": string;
  "Employee Status": string;
  "Reviewed By": string;
  "Reviewed Date": string;
  "Review Comment": string;
}

// =============================================================================
// NESTED MONTHLY SCORING DATA (38 fields total)
// =============================================================================

export interface MetricsDataObject {
  // Simple month fields (12 fields)
  month01: { score: number };
  month02: { score: number };
  month03: { score: number };
  month04: { score: number };
  month05: { score: number };
  month06: { score: number };
  month07: { score: number };
  month08: { score: number };
  month09: { score: number };
  month10: { score: number };
  month11: { score: number };
  month12: { score: number };

  // Breach-specific fields (12 fields)
  month01Breach: { score: number; date: string };
  month02Breach: { score: number; date: string };
  month03Breach: { score: number; date: string };
  month04Breach: { score: number; date: string };
  month05Breach: { score: number; date: string };
  month06Breach: { score: number; date: string };
  month07Breach: { score: number; date: string };
  month08Breach: { score: number; date: string };
  month09Breach: { score: number; date: string };
  month10Breach: { score: number; date: string };
  month11Breach: { score: number; date: string };
  month12Breach: { score: number; date: string };

  // Potential Breach fields (12 fields)
  month01PotentialBreach: { score: number; date: string };
  month02PotentialBreach: { score: number; date: string };
  month03PotentialBreach: { score: number; date: string };
  month04PotentialBreach: { score: number; date: string };
  month05PotentialBreach: { score: number; date: string };
  month06PotentialBreach: { score: number; date: string };
  month07PotentialBreach: { score: number; date: string };
  month08PotentialBreach: { score: number; date: string };
  month09PotentialBreach: { score: number; date: string };
  month10PotentialBreach: { score: number; date: string };
  month11PotentialBreach: { score: number; date: string };
  month12PotentialBreach: { score: number; date: string };

  // Total scores (2 fields)
  totalBreachScore: { value: number };
  totalPotentialBreachScore: { value: number };
}

// =============================================================================
// TRANSFORMED DATA (Output for AG Grid)
// =============================================================================

export interface TransformedMetricData {
  id: number;
  employeeName: string;
  employeeId: string;
  metricName: string;
  metricTheme: string;
  metricCategory: string;
  metricDescription: string;
  region: string;
  company: string;
  hierarchySource: string; // Reportee Type
  violationType: "Breach" | "Potential Breach";
  breach: 0 | 1;
  metricsData: MetricsDataObject;
  occurrenceDate: string;
  date: string;
  reviewStatus: string;
  scoring: number;
  employeeStatus: string;

  // Organizational levels
  vorgUnitNameLevel08: string; // LOB
  vorgUnitNameLevel07: string; // Sub LOB 1
  vorgUnitNameLevel06: string; // Sub LOB 2
  vorgUnitNameLevel05: string; // Division 1
  vorgUnitNameLevel02: string; // District 1

  // AG Grid specific fields
  V_ORG_UNIT_NAME_LEVEL06: string;
  V_ORG_UNIT_NAME_LEVEL07: string;
  V_ORG_UNIT_NAME_LEVEL08: string;
  V_ORG_UNIT_NAME_LEVEL09: string;

  CSCS_supervisorName: string;
  AU_name: string;
  business: string;
}

// =============================================================================
// OFFENDER ANALYSIS TYPES
// =============================================================================

export interface OffenderGroup {
  metric: string;
  employees: {
    name: string;
    count: number;
  }[];
  total: number;
}

export interface EmployeeOffender {
  employee: string;
  countOfMetric: number;
}

// =============================================================================
// SUMMARY STATS
// =============================================================================

export interface MetricsSummaryStats {
  totalRows: number;
  totalRecords: number;
  totalMonths: number;
  currentMonth: string;
  totalBreaches: number;
  totalPotentialBreaches: number;
}
