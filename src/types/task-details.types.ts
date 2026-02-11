/**
 * Type definitions for Task Details Panel
 */

export interface TaskNote {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  approved?: boolean;
}

export interface TaskFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  url?: string;
}

export interface AdditionalInfoRow {
  id: string;
  taskId: string;
  sourceAlertId: string;
  trader: string;
  traderEnt: string;
}

export interface InstructionSection {
  title: string;
  items: string[];
}

export interface ControlInstruction {
  title: string;
  content: string;
  controlNote: string;
  sections: InstructionSection[];
}

export interface TaskDetails {
  id: string;
  title: string;
  description: string;
  category: string;
  controlName: string;
  controlType: string;
  notes: TaskNote[];
  files: TaskFile[];
  additionalInfo: AdditionalInfoRow[];
  controlInstructions: ControlInstruction;
}
