export interface Equipment {
  id: string
  name: string
  type: EquipmentType
  model: string
  manufacturer: string
  serialNumber: string
  purchaseDate: Date
  status: EquipmentStatus
  location: string
  operatingHours: number
  lastMaintenanceDate?: Date
  nextMaintenanceDate?: Date
  specifications: Record<string, string | number | boolean>
}

export enum EquipmentType {
  EXCAVATOR = 'EXCAVATOR',
  BULLDOZER = 'BULLDOZER',
  CRANE = 'CRANE',
  LOADER = 'LOADER',
  DUMP_TRUCK = 'DUMP_TRUCK',
  GRADER = 'GRADER',
  COMPACTOR = 'COMPACTOR',
  OTHER = 'OTHER'
}

export enum EquipmentStatus {
  OPERATIONAL = 'OPERATIONAL',
  MAINTENANCE = 'MAINTENANCE',
  REPAIR = 'REPAIR',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
  RETIRED = 'RETIRED'
}

export interface MaintenanceRecord {
  id: string
  equipmentId: string
  date: Date
  type: MaintenanceType
  description: string
  cost: number
  performedBy: string
  nextScheduledDate?: Date
  parts: string[]
  laborHours: number
}

export enum MaintenanceType {
  PREVENTIVE = 'PREVENTIVE',
  CORRECTIVE = 'CORRECTIVE',
  INSPECTION = 'INSPECTION',
  REPAIR = 'REPAIR'
}

export interface Operator {
  id: string
  name: string
  email: string
  licenseNumber: string
  certifications: string[]
  experienceYears: number
  assignedEquipment: string[]
  status: OperatorStatus
}

export enum OperatorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE'
}