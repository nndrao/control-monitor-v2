/**
 * Control Instructions Utility
 *
 * Provides category-based control instructions for task details.
 * Instructions are deterministic based on task category.
 */

import type { ControlInstruction } from '@/types/task-details.types'

const instructionMap: Record<string, ControlInstruction> = {
  'Final PnL Sign-Off': {
    title: 'Final PnL Sign-Off Control',
    content: 'This control requires verification of daily profit and loss figures before market close. Ensure all trading positions are accurately reflected.',
    controlNote: 'All discrepancies must be resolved within 2 hours of identification.',
    sections: [
      {
        title: 'Required Validations',
        items: [
          'Verify all position valuations against market data',
          'Confirm hedge effectiveness calculations',
          'Review any manual adjustments with supporting documentation',
          'Validate currency conversion rates used'
        ]
      },
      {
        title: 'Escalation Criteria',
        items: [
          'Variance exceeding $50,000 requires immediate escalation',
          'Missing source data must be reported to IT within 30 minutes',
          'Unresolved items at T+1 require senior management approval'
        ]
      }
    ]
  },

  'Trade Surveillance Alert': {
    title: 'Trade Surveillance Review',
    content: 'This transaction monitoring alert originated in the OneTick Surveillance system, after initial review of the flagged activity, the monitoring team is not able to disposition the alert with the information available to them. It is deemed that as a supervisor you should review this activity to your satisfaction. Please review the task in Control Monitor and when ready to sign-off please select the Sign Off/Update button in the Task Manager, select a response to close, provide any additional commentary, upload files as needed and select Sign Off/Update.',
    controlNote: 'Some of the alerts (RFI) require you to supply additional details where as some (escalation) require you to analyze and close alert with the most appropriate reason code.',
    sections: [
      {
        title: 'Investigation Steps',
        items: [
          'Review trade timing relative to material announcements',
          'Analyze trading patterns for unusual activity',
          'Cross-reference with restricted list',
          'Document communication records if applicable'
        ]
      },
      {
        title: 'Documentation Requirements',
        items: [
          'Complete investigation summary within 5 business days',
          'Attach all supporting evidence',
          'Obtain compliance officer sign-off for closures'
        ]
      }
    ]
  },

  'Employee Licensing': {
    title: 'Licensing & Registration Control',
    content: 'Verify employee licensing status and ensure compliance with regulatory requirements.',
    controlNote: 'Unlicensed activity is a serious regulatory violation.',
    sections: [
      {
        title: 'Verification Steps',
        items: [
          'Confirm license validity dates',
          'Verify CE credit completion status',
          'Check for any regulatory actions or restrictions',
          'Update internal tracking systems'
        ]
      }
    ]
  },

  'Independent Price Verification': {
    title: 'IPV Control Procedure',
    content: 'Independently verify pricing of financial instruments against third-party sources.',
    controlNote: 'Price differences exceeding thresholds require immediate investigation.',
    sections: [
      {
        title: 'Verification Process',
        items: [
          'Obtain prices from approved independent sources',
          'Compare against front office valuations',
          'Document and investigate variances above threshold',
          'Escalate persistent discrepancies'
        ]
      },
      {
        title: 'Threshold Guidelines',
        items: [
          'Liquid instruments: 1% variance threshold',
          'Illiquid instruments: 5% variance threshold',
          'Complex derivatives: Case-by-case review required'
        ]
      }
    ]
  },

  'Reconciliation': {
    title: 'Account Reconciliation Control',
    content: 'Reconcile account balances between internal systems and external counterparties.',
    controlNote: 'All breaks must be investigated and resolved within the defined SLA.',
    sections: [
      {
        title: 'Reconciliation Steps',
        items: [
          'Match transactions between source systems',
          'Identify and categorize all breaks',
          'Investigate root cause of discrepancies',
          'Document resolution actions'
        ]
      },
      {
        title: 'Break Resolution',
        items: [
          'Timing differences: Document and monitor',
          'Amount differences: Investigate immediately',
          'Missing entries: Escalate to operations'
        ]
      }
    ]
  },

  'Regulatory Reporting': {
    title: 'Regulatory Filing Control',
    content: 'Ensure accurate and timely submission of regulatory reports.',
    controlNote: 'Late or inaccurate filings may result in regulatory penalties.',
    sections: [
      {
        title: 'Pre-Submission Checks',
        items: [
          'Validate data completeness and accuracy',
          'Cross-check figures against source systems',
          'Obtain required approvals',
          'Archive supporting documentation'
        ]
      }
    ]
  }
}

/**
 * Get control instructions based on task category
 * Returns default instructions if category not found
 */
export function getControlInstructions(category: string): ControlInstruction {
  return instructionMap[category] || {
    title: 'Control Procedure',
    content: 'Follow standard operating procedures for this control type. Review all relevant documentation and ensure compliance with established guidelines.',
    controlNote: 'Refer to the control documentation for specific requirements.',
    sections: [
      {
        title: 'General Steps',
        items: [
          'Review all relevant documentation',
          'Verify data accuracy',
          'Document findings and conclusions',
          'Obtain required approvals'
        ]
      }
    ]
  }
}

/**
 * Get all available control categories
 */
export function getControlCategories(): string[] {
  return Object.keys(instructionMap)
}
