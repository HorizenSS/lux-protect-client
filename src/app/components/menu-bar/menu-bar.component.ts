import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent {

  menu: Array<MenuItem> = [
    { label: 'Alerts', icon: 'pi pi-bell', routerLink: ['/alerts'] },
    { label: 'Users', icon: 'pi pi-users', routerLink: ['/customers'] },
    { label: 'Reports', icon: 'pi pi-chart-bar', routerLink: ['/reports'] },
    { label: 'Settings', icon: 'pi pi-cog', routerLink: ['/settings'] },
    { label: 'Help', icon: 'pi pi-info-circle', routerLink: ['/help'] }
  ];
}
