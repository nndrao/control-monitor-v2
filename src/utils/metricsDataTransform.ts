import type {
  RawMetricScoringItem,
  TransformedMetricData,
  MetricsDataObject,
  OffenderGroup,
  EmployeeOffender,
  MetricsSummaryStats,
} from '@/types/metrics'

// =============================================================================
// INITIALIZE EMPTY METRICS DATA OBJECT
// =============================================================================

/**
 * Initialize a MetricsDataObject with all 38 fields set to zero
 */
function initializeMetricsDataObject(): MetricsDataObject {
  const obj: Record<string, unknown> = {}

  // Simple month fields (12)
  for (let i = 1; i <= 12; i++) {
    const monthKey = `month${i.toString().padStart(2, '0')}`
    obj[monthKey] = { score: 0 }
  }

  // Breach-specific fields (12)
  for (let i = 1; i <= 12; i++) {
    const monthKey = `month${i.toString().padStart(2, '0')}Breach`
    obj[monthKey] = { score: 0, date: '' }
  }

  // Potential Breach fields (12)
  for (let i = 1; i <= 12; i++) {
    const monthKey = `month${i.toString().padStart(2, '0')}PotentialBreach`
    obj[monthKey] = { score: 0, date: '' }
  }

  // Total scores (2)
  obj.totalBreachScore = { value: 0 }
  obj.totalPotentialBreachScore = { value: 0 }

  return obj as unknown as MetricsDataObject
}

// =============================================================================
// HIERARCHY SOURCE HELPER
// =============================================================================

const HIERARCHY_SOURCES = [
  'Functional Supervisor',
  'HR Manager',
  'HR Manager / Functional Supervisor',
  'Secondary Supervisor',
]

function getHierarchySource(index: number): string {
  return HIERARCHY_SOURCES[index % HIERARCHY_SOURCES.length]
}

// =============================================================================
// MAIN TRANSFORMATION FUNCTION
// =============================================================================

/**
 * Transform raw metric scoring data into AG Grid-compatible format
 */
export function transformMetricScoringData(
  rawData: RawMetricScoringItem[]
): TransformedMetricData[] {
  return rawData.map((item, index) => {
    const occurrenceDate = new Date(item['Occurrence Date'])
    const month = occurrenceDate.getMonth() + 1 // 1-12
    const violationType = item.Scoring === 1 ? 'Breach' : 'Potential Breach'

    // Initialize nested metricsData object with all 38 fields
    const metricsData: MetricsDataObject = initializeMetricsDataObject()

    // Populate the specific month field based on occurrence date
    const monthField =
      `month${month.toString().padStart(2, '0')}` as keyof MetricsDataObject
    const violationTypeField = violationType.replace(/\s+/g, '')
    const specificField =
      `${monthField}${violationTypeField}` as keyof MetricsDataObject

    // Set the score for the specific month
    if (metricsData[monthField]) {
      ;(metricsData[monthField] as { score: number }).score = 1
    }

    if (metricsData[specificField]) {
      ;(metricsData[specificField] as { score: number; date: string }).score = 1
      ;(metricsData[specificField] as { score: number; date: string }).date =
        item['Occurrence Date']
    }

    // Update totals
    if (violationType === 'Breach') {
      metricsData.totalBreachScore.value = 1
    } else {
      metricsData.totalPotentialBreachScore.value = 1
    }

    const transformed: TransformedMetricData = {
      id: item.ID,
      employeeName: item.Employee,
      employeeId: `EMP${item.ID.toString().padStart(6, '0')}`,
      metricName: item.Metric,
      metricTheme: item['Metric Theme'],
      metricCategory: item['Metric Category'],
      metricDescription: item['Metric Description'],
      region: item.Region,
      company: item['Legal Entity'],
      hierarchySource: getHierarchySource(index),
      violationType: violationType as 'Breach' | 'Potential Breach',
      breach: item.Scoring === 1 ? 1 : 0,
      metricsData: metricsData,
      occurrenceDate: item['Occurrence Date'],
      date: item['Occurrence Date'],
      reviewStatus: item['Reviewed Status'],
      scoring: item.Scoring,
      employeeStatus: item['Employee Status'],

      // Organizational levels
      vorgUnitNameLevel08: item.LOB,
      vorgUnitNameLevel07: item['Sub LOB 1'],
      vorgUnitNameLevel06: item['Sub LOB 2'],
      vorgUnitNameLevel05: item['Division 1'],
      vorgUnitNameLevel02: item['District 1'],

      // AG Grid specific fields (duplicates for compatibility)
      V_ORG_UNIT_NAME_LEVEL06: item['Sub LOB 2'],
      V_ORG_UNIT_NAME_LEVEL07: item['Sub LOB 1'],
      V_ORG_UNIT_NAME_LEVEL08: item.LOB,
      V_ORG_UNIT_NAME_LEVEL09: item['Operating Segment'],

      CSCS_supervisorName: item['Current Functional Supervisor'],
      AU_name: item['District 1'],
      business: item['Sub LOB 2'],
    }

    return transformed
  })
}

// =============================================================================
// OFFENDER ANALYSIS FUNCTIONS
// =============================================================================

/**
 * Group violations by metric name for Offender Analysis
 */
export function groupOffendersByMetric(
  data: TransformedMetricData[]
): OffenderGroup[] {
  const metricMap = new Map<string, Map<string, number>>()

  data.forEach((item) => {
    if (!metricMap.has(item.metricName)) {
      metricMap.set(item.metricName, new Map())
    }

    const employeeMap = metricMap.get(item.metricName)!
    const currentCount = employeeMap.get(item.employeeName) || 0
    employeeMap.set(item.employeeName, currentCount + 1)
  })

  const groups: OffenderGroup[] = []
  metricMap.forEach((employeeMap, metric) => {
    const employees = Array.from(employeeMap.entries()).map(([name, count]) => ({
      name,
      count,
    }))

    const total = employees.reduce((sum, emp) => sum + emp.count, 0)

    groups.push({
      metric,
      employees,
      total,
    })
  })

  groups.sort((a, b) => b.total - a.total)

  return groups
}

/**
 * Group violations by employee for Offender Analysis
 */
export function groupOffendersByEmployee(
  data: TransformedMetricData[]
): EmployeeOffender[] {
  const employeeMap = new Map<string, Set<string>>()

  data.forEach((item) => {
    if (!employeeMap.has(item.employeeName)) {
      employeeMap.set(item.employeeName, new Set())
    }
    employeeMap.get(item.employeeName)!.add(item.metricName)
  })

  const offenders: EmployeeOffender[] = Array.from(employeeMap.entries()).map(
    ([employee, metrics]) => ({
      employee,
      countOfMetric: metrics.size,
    })
  )

  offenders.sort((a, b) => b.countOfMetric - a.countOfMetric)

  return offenders
}

// =============================================================================
// SUMMARY STATISTICS
// =============================================================================

/**
 * Calculate summary statistics from transformed data
 */
export function calculateSummaryStats(
  data: TransformedMetricData[]
): MetricsSummaryStats {
  const uniqueEmployees = new Set(data.map((d) => d.employeeName))
  const months = new Set(
    data.map((d) => {
      const date = new Date(d.occurrenceDate)
      return `${date.getFullYear()}-${date.getMonth() + 1}`
    })
  )

  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit',
  })

  const totalBreaches = data.filter((d) => d.violationType === 'Breach').length
  const totalPotentialBreaches = data.filter(
    (d) => d.violationType === 'Potential Breach'
  ).length

  return {
    totalRows: uniqueEmployees.size,
    totalRecords: data.length,
    totalMonths: months.size,
    currentMonth,
    totalBreaches,
    totalPotentialBreaches,
  }
}
