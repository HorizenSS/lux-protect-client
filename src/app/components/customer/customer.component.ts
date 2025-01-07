import { Component, OnInit } from '@angular/core';
import { CustomerDTO } from '../../models/customer-dto';
import { CustomerService } from '../../services/customer/customer.service';
import { CustomerRegistrationRequest } from '../../models/customer-registration-request';
import { ConfirmationService, MessageService } from 'primeng/api';
import {UserStateService} from "../../services/userState/user-state.service";
import {AlertService} from "../../services/alerts/alert.service";
import {AlertResponseDto} from "../../models/alert.model";

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit {
  display = false;
  operation: 'create' | 'update' = 'create';
  customers: Array<CustomerDTO> = [];
  customer: CustomerRegistrationRequest = {};
  alerts: AlertResponseDto[] = [];
  isAlertDialogVisible= false;

  constructor(
    private customerService: CustomerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private userStateService: UserStateService,
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    this.findAllCustomers();
  }

  private findAllCustomers() {
    this.customerService.getCustomers().subscribe({
      next: (data: CustomerDTO[]) => {
        this.customers = data;
        console.log(data);
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
      },
    });
  }

  save(customer: CustomerRegistrationRequest) {
    if (customer) {
      if (this.operation === 'create') {
        this.customerService.registerCustomer(customer).subscribe({
          next: () => {
            this.findAllCustomers();
            this.display = false;
            this.customer = {};
            this.messageService.add({
              severity: 'success',
              summary: 'Customer saved',
              detail: `Customer ${customer.name} was successfully saved`,
            });
          },
          error: (err) => {
            console.error('Error saving customer:', err);
          },
        });
      } else if (this.operation === 'update') {
        if (customer.id !== undefined) {
          this.customerService.updateCustomer(customer.id, customer).subscribe({
            next: () => {
              this.findAllCustomers();
              this.display = false;
              this.customer = {};
              this.messageService.add({
                severity: 'success',
                summary: 'Customer updated',
                detail: `Customer ${customer.name} was successfully updated`,
              });
            },
            error: (err) => {
              console.error('Error updating customer:', err);
            },
          });
        } else {
          console.error('Cannot update customer: ID is undefined.');
        }
      }
    }
  }

  deleteCustomer(customer: CustomerDTO) {
    this.confirmationService.confirm({
      header: 'Delete customer',
      message: `Are you sure you want to delete ${customer.name}? You can't undo this action afterward.`,
      accept: () => {
        if (customer.id !== undefined) {
          this.customerService.deleteCustomer(customer.id).subscribe({
            next: () => {
              this.findAllCustomers();
              this.messageService.add({
                severity: 'success',
                summary: 'Customer deleted',
                detail: `Customer ${customer.name} was successfully deleted`,
              });
            },
            error: (err) => {
              console.error('Error deleting customer:', err);
            },
          });
        } else {
          console.error('Cannot delete customer: ID is undefined.');
        }
      },
    });
  }

  updateCustomer(customerDTO: CustomerDTO) {
    this.display = true;
    this.customer = { ...customerDTO }; // Ensure a fresh copy
    this.operation = 'update';
  }

  createCustomer() {
    this.display = true;
    this.customer = {};
    this.operation = 'create';
  }

  cancel() {
    this.display = false;
    this.customer = {};
    this.operation = 'create';
  }

  isAdmin() {
    return this.userStateService.isAdmin();
  }

  openAlertPopup(customer: CustomerDTO) {
    if (customer.id !== undefined) {
      this.alertService.getAlertsByUserId(customer.id).subscribe({
        next: (alerts: any[]) => {
          this.alerts = alerts;
          this.isAlertDialogVisible = true;
        },
        error: (err) => console.error(err),
      });
    } else {
      console.error('Cannot get alerts: Customer ID is undefined.');
    }
  }
}
