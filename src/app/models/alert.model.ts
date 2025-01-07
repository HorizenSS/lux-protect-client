import {CustomerDTO} from "./customer-dto";

export enum AlertType {
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS ACTIVITY',
  CRIME = 'CRIME',
  HAZARD = 'HAZARD',
  EMERGENCY = 'EMERGENCY',
  OTHER = 'OTHER',
  WEATHER = 'WEATHER',
  TRAFFIC = 'TRAFFIC',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  PUBLIC_SAFETY = 'PUBLIC SAFETY',
  HEALTH = 'HEALTH',
  TRANSPORTATION = 'TRANSPORTATION',
  FIRE = 'FIRE',
  NATURAL_DISASTER = 'NATURAL DISASTER'
}

export enum AlertStatus {
  ACTIVE = 'ACTIVE',
  RESOLVED = 'RESOLVED',
  FALSE_ALARM = 'FALSE_ALARM'
}

export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface AlertDto {
  title: string;
  description: string;
  type: AlertType;
  latitude: number;
  longitude: number;
  severity: Severity;
}

export interface AlertResponseDto {
  id: number;
  title: string;
  description: string;
  type: AlertType;
  severity: Severity;
  status: AlertStatus;
  latitude: number;
  longitude: number;
  user: CustomerDTO;
  createdAt: string;
  updatedAt: string;
}
