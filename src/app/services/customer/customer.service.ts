import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerDTO } from '../../models/customer-dto';
import { environment } from '../../../environments/environment';
import { CustomerRegistrationRequest } from '../../models/customer-registration-request';
import { CustomerUpdateRequest } from '../../models/customer-update-request';
import { ApiResponse } from '../../models/api-response';
import { map } from 'rxjs/operators';
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly baseUrl = `${environment.api.baseUrl}/${environment.api.customerUrl}`;

  constructor(
    private http: HttpClient
  ) {}

  getCustomers(): Observable<CustomerDTO[]> {
    return this.http
      .get<ApiResponse<CustomerDTO[]>>(`${this.baseUrl}`)
      .pipe(map(response => response.data));
  }

  getCustomer(customerId: number): Observable<CustomerDTO> {
    return this.http
      .get<ApiResponse<CustomerDTO>>(`${this.baseUrl}/${customerId}`)
      .pipe(map(response => response.data));
  }

  registerCustomer(request: CustomerRegistrationRequest): Observable<void> {
    return this.http
      .post<ApiResponse<void>>(`${this.baseUrl}`, request)
      .pipe(map(response => response.data));
  }

  deleteCustomer(customerId: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/${customerId}`)
      .pipe(map(response => response.data));
  }

  updateCustomer(customerId: number, updateRequest: CustomerUpdateRequest): Observable<void> {
    return this.http
      .put<ApiResponse<void>>(`${this.baseUrl}/${customerId}`, updateRequest)
      .pipe(map(response => response.data));
  }

  uploadCustomerProfileImage(customerId: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<ApiResponse<void>>(`${this.baseUrl}/${customerId}/profile-image`, formData)
      .pipe(map(response => response.data));
  }

  getCustomerProfileImage(customerId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${customerId}/profile-image`, {
      responseType: 'blob',
    });
  }
}
