import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomerDTO } from '../../models/customer-dto';

@Component({
  selector: 'app-customer-card',
  templateUrl: './customer-card.component.html',
  styleUrls: ['./customer-card.component.scss']
})
export class CustomerCardComponent {

  @Input()
  customer: CustomerDTO = {};
  @Input()
  customerIndex = 0;

  @Input() isAdmin: boolean = false;

  @Output()
  delete: EventEmitter<CustomerDTO> = new EventEmitter<CustomerDTO>();
  @Output()
  update: EventEmitter<CustomerDTO> = new EventEmitter<CustomerDTO>();
  @Output()
  viewAlerts: EventEmitter<CustomerDTO> = new EventEmitter<CustomerDTO>();


  get customerImage(): string {
    const gender = this.customer.gender === 'MALE' ? 'men' : 'women';
    return `https://randomuser.me/api/portraits/${gender}/${this.customerIndex}.jpg`;
  }

  onDelete() {
    if (this.isAdmin) {
      this.delete.emit(this.customer);
    }
  }
  onUpdate() {
    if (this.isAdmin) {
      this.update.emit(this.customer);
    }
  }

  onViewAlerts() {
    this.viewAlerts.emit(this.customer);
  }
}
