import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlertDto, AlertResponseDto, AlertStatus } from '../../models/alert.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private apiUrl = `${environment.api.baseUrl}/api/v1/alerts`;

  constructor(private http: HttpClient) {}

  createAlert(alert: AlertDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, alert);
  }

  getAlertById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getAllAlerts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  updateAlert(id: number, alert: AlertDto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, alert);
  }

  deleteAlert(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getNearbyAlerts(latitude: number, longitude: number, radius: number = 5): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/nearby`, {
      params: { latitude: latitude.toString(), longitude: longitude.toString(), radius: radius.toString() }
    });
  }

  getUserAlerts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-alerts`);
  }

  getAlertsByUserId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${id}`);
  }

  updateAlertStatus(id: number, status: AlertStatus): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/status`, { status });
  }
}
