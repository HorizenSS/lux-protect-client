import {CustomerDTO} from "./customer-dto";
import {AlertSeverity, AlertStatus, AlertType} from "./alert.enums";

export interface AlertResponseDto {
  id?: number;
  title: string;
  description: string;
  type: AlertType;
  status: AlertStatus;
  severity: AlertSeverity;
  latitude: number;
  longitude: number;
  user?: CustomerDTO;
  createdAt: string;
  updatedAt: string;
}
