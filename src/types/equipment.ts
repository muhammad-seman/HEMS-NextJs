// ============================================
// CORE EQUIPMENT MODELS
// ============================================

export interface Equipment {
  id: string
  name: string
  type: EquipmentType
  model: string
  manufacturer: string
  serialNumber: string
  purchaseDate: Date
  warrantyExpirationDate?: Date
  status: EquipmentStatus
  
  // Location & Assignment
  currentLocation: Location
  assignedSiteId?: string
  assignedOperatorId?: string
  
  // Operational Data
  operatingHours: number
  fuelCapacity: number
  currentFuelLevel: number
  engineHours: number
  mileage?: number
  
  // Maintenance Info
  lastMaintenanceDate?: Date
  nextMaintenanceDate?: Date
  maintenanceInterval: number // hours
  
  // Financial
  purchasePrice: number
  currentValue?: number
  
  // Technical Specifications
  specifications: EquipmentSpecifications
  
  // Documents & Compliance
  documents: string[] // Document IDs
  certifications: Certification[]
  
  // Tracking & Telematics
  telematicsDeviceId?: string
  isTrackingEnabled: boolean
  
  createdAt: Date
  updatedAt: Date
}

export interface EquipmentSpecifications {
  weight: number // kg
  maxCapacity: number // liters/kg depending on equipment
  enginePower: number // HP
  fuelType: FuelType
  dimensions: {
    length: number
    width: number
    height: number
  }
  operatingPressure?: number
  hydraulicCapacity?: number
  attachments: string[]
  maxOperatingTemp: number
  minOperatingTemp: number
}

export enum EquipmentType {
  // Mining Equipment
  EXCAVATOR = 'EXCAVATOR',
  BULLDOZER = 'BULLDOZER',
  WHEEL_LOADER = 'WHEEL_LOADER',
  DUMP_TRUCK = 'DUMP_TRUCK',
  HAUL_TRUCK = 'HAUL_TRUCK',
  
  // Construction Equipment  
  CRANE = 'CRANE',
  GRADER = 'GRADER',
  COMPACTOR = 'COMPACTOR',
  BACKHOE_LOADER = 'BACKHOE_LOADER',
  SKID_STEER = 'SKID_STEER',
  
  // Specialized Equipment
  DRILL_RIG = 'DRILL_RIG',
  CRUSHER = 'CRUSHER',
  CONVEYOR = 'CONVEYOR',
  GENERATOR = 'GENERATOR',
  COMPRESSOR = 'COMPRESSOR',
  PUMP = 'PUMP',
  
  OTHER = 'OTHER'
}

export enum EquipmentStatus {
  OPERATIONAL = 'OPERATIONAL',
  MAINTENANCE = 'MAINTENANCE',
  REPAIR = 'REPAIR',
  STANDBY = 'STANDBY',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
  RETIRED = 'RETIRED',
  IN_TRANSIT = 'IN_TRANSIT'
}

export enum FuelType {
  DIESEL = 'DIESEL',
  GASOLINE = 'GASOLINE',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
  NATURAL_GAS = 'NATURAL_GAS',
  HYDRAULIC = 'HYDRAULIC'
}

// ============================================
// LOCATION & TRACKING MODELS
// ============================================

export interface Location {
  latitude: number
  longitude: number
  address?: string
  siteId?: string
  zone?: string
  lastUpdated: Date
}

export interface TrackingData {
  id: string
  equipmentId: string
  location: Location
  speed: number // km/h
  heading: number // degrees
  fuelLevel: number // percentage
  engineHours: number
  operatingStatus: OperatingStatus
  alerts: Alert[]
  timestamp: Date
}

export enum OperatingStatus {
  IDLE = 'IDLE',
  WORKING = 'WORKING',
  MOVING = 'MOVING',
  OFF = 'OFF'
}

// ============================================
// MAINTENANCE MODELS  
// ============================================

export interface MaintenanceRecord {
  id: string
  equipmentId: string
  workOrderId?: string
  date: Date
  completedDate?: Date
  type: MaintenanceType
  priority: Priority
  status: MaintenanceStatus
  
  // Details
  title: string
  description: string
  instructions?: string
  
  // Resources
  assignedTechnicianId: string
  supervisorId?: string
  laborHours: number
  estimatedDuration: number // hours
  
  // Parts & Costs
  partsUsed: PartUsage[]
  totalPartsCost: number
  laborCost: number
  totalCost: number
  
  // Scheduling
  scheduledDate: Date
  nextScheduledDate?: Date
  maintenanceInterval?: number // hours
  
  // Documentation
  photos: string[]
  documents: string[]
  notes: string
  
  // Compliance
  safetyChecksCompleted: boolean
  complianceNotes?: string
  
  createdAt: Date
  updatedAt: Date
}

export enum MaintenanceType {
  PREVENTIVE = 'PREVENTIVE',
  CORRECTIVE = 'CORRECTIVE',
  INSPECTION = 'INSPECTION',
  REPAIR = 'REPAIR',
  OVERHAUL = 'OVERHAUL',
  CALIBRATION = 'CALIBRATION'
}

export enum MaintenanceStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD'
}

export interface PartUsage {
  partId: string
  partNumber: string
  partName: string
  quantityUsed: number
  unitCost: number
  totalCost: number
}

// ============================================
// INSPECTION & SAFETY MODELS
// ============================================

export interface Inspection {
  id: string
  equipmentId: string
  inspectorId: string
  type: InspectionType
  status: InspectionStatus
  priority: Priority
  
  // Scheduling
  scheduledDate: Date
  completedDate?: Date
  nextScheduledDate?: Date
  
  // Details
  title: string
  checklist: InspectionItem[]
  overallResult: InspectionResult
  notes: string
  
  // Documentation
  photos: string[]
  documents: string[]
  
  // Compliance
  regulatoryRequirement?: string
  complianceStatus: ComplianceStatus
  certificationRequired: boolean
  
  createdAt: Date
  updatedAt: Date
}

export interface InspectionItem {
  id: string
  category: string
  description: string
  result: InspectionResult
  notes?: string
  photos?: string[]
  critical: boolean
}

export enum InspectionType {
  SAFETY = 'SAFETY',
  OPERATIONAL = 'OPERATIONAL',
  REGULATORY = 'REGULATORY',
  QUALITY = 'QUALITY',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  ANNUAL = 'ANNUAL',
  PRE_OPERATION = 'PRE_OPERATION'
}

export enum InspectionStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum InspectionResult {
  PASS = 'PASS',
  FAIL = 'FAIL',
  WARNING = 'WARNING',
  NOT_APPLICABLE = 'NOT_APPLICABLE'
}

export enum ComplianceStatus {
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED'
}

// ============================================
// OPERATOR & PERSONNEL MODELS
// ============================================

export interface Operator {
  id: string
  employeeId: string
  name: string
  email: string
  phone: string
  
  // Credentials
  licenseNumber: string
  licenseExpirationDate: Date
  certifications: Certification[]
  
  // Experience
  experienceYears: number
  specializations: EquipmentType[]
  skillLevel: SkillLevel
  
  // Assignment
  assignedEquipment: string[]
  currentAssignmentId?: string
  status: OperatorStatus
  
  // Performance
  safetyRating: number // 1-5
  performanceRating: number // 1-5
  incidentCount: number
  
  // Schedule
  shift: Shift
  availableHours: number
  
  createdAt: Date
  updatedAt: Date
}

export interface Certification {
  id: string
  name: string
  issuedBy: string
  issuedDate: Date
  expirationDate: Date
  status: CertificationStatus
  documentId?: string
}

export enum CertificationStatus {
  VALID = 'VALID',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED'
}

export enum OperatorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  SUSPENDED = 'SUSPENDED'
}

export enum SkillLevel {
  TRAINEE = 'TRAINEE',
  JUNIOR = 'JUNIOR',
  INTERMEDIATE = 'INTERMEDIATE',
  SENIOR = 'SENIOR',
  EXPERT = 'EXPERT'
}

export enum Shift {
  DAY = 'DAY',
  NIGHT = 'NIGHT',
  SWING = 'SWING',
  ROTATING = 'ROTATING'
}

// ============================================
// INVENTORY MODELS
// ============================================

export interface InventoryItem {
  id: string
  partNumber: string
  name: string
  description: string
  category: InventoryCategory
  
  // Classification
  manufacturer: string
  compatibleEquipment: string[] // Equipment type IDs
  
  // Stock Info
  currentStock: number
  minStockLevel: number
  maxStockLevel: number
  reorderPoint: number
  
  // Pricing
  unitCost: number
  averageCost: number
  
  // Location
  warehouseLocation: string
  binLocation?: string
  
  // Status
  status: InventoryStatus
  
  createdAt: Date
  updatedAt: Date
}

export interface FuelLog {
  id: string
  equipmentId: string
  operatorId?: string
  date: Date
  fuelType: FuelType
  quantity: number // liters
  cost: number
  odometer?: number
  location: string
  supplierId?: string
  notes?: string
}

export enum InventoryCategory {
  ENGINE_PARTS = 'ENGINE_PARTS',
  HYDRAULIC_PARTS = 'HYDRAULIC_PARTS',
  ELECTRICAL_PARTS = 'ELECTRICAL_PARTS',
  FILTERS = 'FILTERS',
  FLUIDS = 'FLUIDS',
  FUEL = 'FUEL',
  TIRES = 'TIRES',
  ATTACHMENTS = 'ATTACHMENTS',
  SAFETY_EQUIPMENT = 'SAFETY_EQUIPMENT',
  CONSUMABLES = 'CONSUMABLES'
}

export enum InventoryStatus {
  AVAILABLE = 'AVAILABLE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  ON_ORDER = 'ON_ORDER',
  DISCONTINUED = 'DISCONTINUED',
  RESERVED = 'RESERVED'
}

// ============================================
// SITE & PROJECT MODELS
// ============================================

export interface Site {
  id: string
  name: string
  code: string
  type: SiteType
  
  // Location
  address: string
  coordinates: Location
  timezone: string
  
  // Details
  description?: string
  siteManager: string
  contactInfo: ContactInfo
  
  // Operational
  operatingHours: OperatingHours
  assignedEquipment: string[]
  activeProjects: string[]
  
  // Safety & Compliance
  safetyRating: number
  permitRequired: boolean
  environmentalRestrictions: string[]
  
  status: SiteStatus
  createdAt: Date
  updatedAt: Date
}

export interface ContactInfo {
  phone: string
  email: string
  emergencyContact: string
}

export interface OperatingHours {
  monday: TimeSlot
  tuesday: TimeSlot
  wednesday: TimeSlot
  thursday: TimeSlot
  friday: TimeSlot
  saturday: TimeSlot
  sunday: TimeSlot
}

export interface TimeSlot {
  start: string // HH:MM
  end: string // HH:MM
  active: boolean
}

export enum SiteType {
  MINING = 'MINING',
  CONSTRUCTION = 'CONSTRUCTION',
  QUARRY = 'QUARRY',
  WAREHOUSE = 'WAREHOUSE',
  MAINTENANCE_FACILITY = 'MAINTENANCE_FACILITY'
}

export enum SiteStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION',
  DECOMMISSIONED = 'DECOMMISSIONED'
}

// ============================================
// ALERT & NOTIFICATION MODELS
// ============================================

export interface Alert {
  id: string
  equipmentId?: string
  operatorId?: string
  siteId?: string
  type: AlertType
  severity: Severity
  
  // Details
  title: string
  message: string
  details?: Record<string, unknown>
  
  // Status
  status: AlertStatus
  acknowledgedBy?: string
  acknowledgedAt?: Date
  resolvedAt?: Date
  
  // Triggers
  triggerCondition: string
  triggerValue: unknown
  threshold?: number
  
  createdAt: Date
  updatedAt: Date
}

export enum AlertType {
  MAINTENANCE_DUE = 'MAINTENANCE_DUE',
  FUEL_LOW = 'FUEL_LOW',
  ENGINE_FAULT = 'ENGINE_FAULT',
  GEOFENCE_VIOLATION = 'GEOFENCE_VIOLATION',
  IDLE_TIME_EXCEEDED = 'IDLE_TIME_EXCEEDED',
  TEMPERATURE_HIGH = 'TEMPERATURE_HIGH',
  PRESSURE_ABNORMAL = 'PRESSURE_ABNORMAL',
  CERTIFICATION_EXPIRING = 'CERTIFICATION_EXPIRING',
  INSPECTION_DUE = 'INSPECTION_DUE',
  SAFETY_VIOLATION = 'SAFETY_VIOLATION'
}

export enum AlertStatus {
  ACTIVE = 'ACTIVE',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED'
}

// ============================================
// SHARED ENUMS
// ============================================

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum Severity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}