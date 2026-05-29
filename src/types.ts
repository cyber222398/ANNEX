export type SectionType =
  | 'introduction'
  | 'geology'
  | 'extraction_method'
  | 'equipment'
  | 'transmission'
  | 'architecture'
  | 'safety'
  | 'environmental'
  | 'finances'
  | 'conclusion';

export interface MineLevel {
  level: string;
  depth: number;
  percentage: number;
  title: string;
  description: string;
  primaryFunctions: string[];
  imageUrl: string;
}

export interface EquipmentDetail {
  id: string;
  name: string;
  icon: string;
  role: string;
  specs: { label: string; value: string }[];
  extendedDetails: string;
}

export interface NodeDetail {
  title: string;
  content: string;
  specs: { label: string; value: string }[];
}

export interface CalculationInputs {
  skipMass: number;      // tons
  payloadMass: number;   // tons
  windingSpeed: number;  // m/s
  shaftDepth: number;    // meters
  acceleration: number;  // m/s^2
  efficiency: number;    // %
}
