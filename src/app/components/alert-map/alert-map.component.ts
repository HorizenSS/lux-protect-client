import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { AlertService } from '../../services/alerts/alert.service';
import { MessageService } from 'primeng/api';
import * as L from 'leaflet';
import {AlertDto, AlertResponseDto, AlertType, Severity} from '../../models/alert.model';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";
import {DivIcon, latLng, marker} from "leaflet";
import { GeoCodingService } from "../../services/geocoding/geo-coding.service";
import {UserStateService} from "../../services/userState/user-state.service";
import {WebSocketService} from "../../services/webSocket/web-socket.service";
import {Subscription, tap} from "rxjs";


const DEFAULT_COORDS = { lat: 49.8153, lng: 6.1296 };

@Component({
  selector: 'app-alert-map',
  templateUrl: './alert-map.component.html',
  styleUrls: ['./alert-map.component.scss']
})
export class AlertMapComponent implements OnInit ,OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  map!: L.Map;
  alerts: AlertResponseDto[] = [];
  markers: L.Marker[] = [];
  searchAddress: string = '';
  selectedPosition: L.LatLng = L.latLng(DEFAULT_COORDS.lat, DEFAULT_COORDS.lng);
  isCreatingAlert: boolean = false;
  isEditing = false;
  editingAlertId: number | null = null;
  newAlertMarker?: L.Marker;
  showAlertDialog: boolean = false;
  alertForm!: FormGroup;
  display = false;
  alert: AlertDto = {
    title: '',
    description: '',
    type: AlertType.OTHER,
    severity: Severity.LOW,
    latitude: 0,
    longitude: 0
  }
  selectedAlert: AlertResponseDto | null = null;
  severityOptions = Object.keys(Severity).map(key => ({
    label: key,
    value: key
  }));
  private locationWatchId: number | null = null;
  legendItems: Array<{ label: string; icon: string; color: string }> = [];
  searchResults: { display_name: string, lat: string, lon: string }[] = [];


  constructor(
    private webSocketService: WebSocketService,
    private alertService: AlertService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private dom: DomSanitizer,
    private geoCodingService: GeoCodingService,
    private userStateService: UserStateService
  ) {}

  private subscriptions = new Subscription();

  ngOnInit() {
    this.initializeForm();
    this.initializeLegendItems();

    const alertSubscription = this.webSocketService.subscribeToNearbyAlerts().pipe(
      tap(alert => console.log('Received nearby alert:', alert))
    ).subscribe({
      next: (alert) => {
        this.messageService.add({
          key: 'nearbyAlert',
          severity: 'info',
          summary: 'New Nearby Alert',
          detail: alert.title,
          data: alert,  // Pass the full alert object
          life: 10000,
          styleClass: 'nearby-alert-toast'
        });
        this.loadAlerts();
      },
      error: (error) => console.log('WebSocket error:', error)
    });


    this.subscriptions.add(alertSubscription);
    this.getUserLocation();
  }
  // Add this method to your component
  onNearbyAlertClick(alert: AlertResponseDto) {
    this.selectedAlert = alert;
    this.display = true;
    this.map.setView([alert.latitude, alert.longitude], 15);
  }

  ngAfterViewInit() {
    this.initializeMap();
    this.loadAlerts();
  }
  alertTypeDropdownItems = Object.values(AlertType).map(type => ({
    label: type,
    value: type
  }));
  // Update the alertTypeOptions initialization
  alertTypeOptions = this.generateAlertTypeOptions();

  private generateAlertTypeOptions() {
    return Object.entries(AlertType).map(([key, value]) => ({
      label: this.formatAlertTypeLabel(key),
      value: value,
      icon: this.getIconClass(value),
      color: this.getIconColor(value)
    }));
  }

  private formatAlertTypeLabel(key: string): string {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }


  private initializeForm() {
    this.alertForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      type: ['', Validators.required],
      severity: [null, Validators.required]
    });
  }

  filteredAlertTypes: { label: string; value: string }[] = [];

  filterAlertTypes(event: any) {
    const query = event.query.toLowerCase();
    this.filteredAlertTypes = this.alertTypeDropdownItems.filter(type =>
      type.label.toLowerCase().includes(query)
    );
  }

  private initializeLegendItems() {
    this.legendItems = this.alertTypeOptions.map((type) => {
      const alertTypeValue = AlertType[type.value as keyof typeof AlertType];

      return {
        label: type.label,
        icon: this.getIconClass(alertTypeValue),
        color: this.getIconColor(alertTypeValue)
      };
    });
  }


  private initializeMap() {
    if (this.mapContainer?.nativeElement) {
      this.map = L.map(this.mapContainer.nativeElement).setView([DEFAULT_COORDS.lat, DEFAULT_COORDS.lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      this.map.on('click', (e: L.LeafletMouseEvent) => {
        if (this.isCreatingAlert) {
          this.updateNewAlertPosition(e.latlng);
        }
      });
    }
  }

  protected getAlertIcon(type: AlertType, severity: Severity): DivIcon {
    const iconClass = this.getIconClass(type);
    const iconColor = this.getIconColor(type);
    const size = this.getSeveritySize(severity);

    return L.divIcon({
      html: `<i class="${iconClass}" style="${this.constructCssStyle(iconColor, size)}"></i>`,
      className: 'custom-div-icon',
      iconSize: [size, size] as [number, number],
      iconAnchor: [size / 2, size / 2] as [number, number]
    });
  }

  private constructCssStyle(color: string, size: number): string {
    return `color: ${color}; font-size: ${size}px;`;
  }

  protected getIconClass(type: AlertType): string {
    const iconMap: Record<AlertType, string> = {
      [AlertType.SUSPICIOUS_ACTIVITY]: 'fa-exclamation-triangle',
      [AlertType.CRIME]: 'fa-skull-crossbones',
      [AlertType.HAZARD]: 'fa-radiation',
      [AlertType.EMERGENCY]: 'fa-ambulance',
      [AlertType.WEATHER]: 'fa-cloud-showers-heavy',
      [AlertType.TRAFFIC]: 'fa-car-crash',
      [AlertType.ENVIRONMENTAL]: 'fa-leaf',
      [AlertType.PUBLIC_SAFETY]: 'fa-shield-alt',
      [AlertType.HEALTH]: 'fa-heartbeat',
      [AlertType.TRANSPORTATION]: 'fa-bus',
      [AlertType.FIRE]: 'fa-fire-alt',
      [AlertType.NATURAL_DISASTER]: 'fa-volcano',
      [AlertType.OTHER]: 'fa-question-circle',
    };

    return `fas ${iconMap[type] || 'fa-exclamation-circle'}`;
  }

  protected getIconColor(type: AlertType): string {
    const colorMap: Record<AlertType, string> = {
      [AlertType.SUSPICIOUS_ACTIVITY]: '#FFA500',
      [AlertType.CRIME]: '#FF0000',
      [AlertType.HAZARD]: '#FF4500',
      [AlertType.EMERGENCY]: '#FF0000',
      [AlertType.WEATHER]: '#4169E1',
      [AlertType.TRAFFIC]: '#FFD700',
      [AlertType.ENVIRONMENTAL]: '#228B22',
      [AlertType.PUBLIC_SAFETY]: '#4682B4',
      [AlertType.HEALTH]: '#FF69B4',
      [AlertType.TRANSPORTATION]: '#8B4513',
      [AlertType.FIRE]: '#FF4500',
      [AlertType.NATURAL_DISASTER]: '#800080',
      [AlertType.OTHER]: 'rgba(21,19,21,0.89)',
    };

    return colorMap[type] || '#000000';
  }

  private getSeveritySize(severity: Severity): number {
    switch (severity) {
      case Severity.HIGH: return 40;
      case Severity.MEDIUM: return 32;
      case Severity.LOW: return 24;
      default: return 32;
    }
  }

  loadAlerts() {
    this.alertService.getAllAlerts().subscribe({
      next: (response) => {
        this.alerts = response.data;
        this.updateMarkers();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load alerts'
        });
      }
    });
  }


  private updateMarkers() {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    this.alerts.forEach(alert => {
      const marker = L.marker([alert.latitude, alert.longitude], {
        icon: this.getAlertIcon(alert.type, alert.severity)
      });

      // Add tooltip
      marker.bindTooltip(alert.title, {
        permanent: false,
        direction: 'top',
        offset: L.point(0, -30),
        className: 'marker-tooltip'
      });

      // Enhanced click handler with logging
      marker.on('click', () => {
        console.log('Marker clicked:', alert);
        this.showAlertDetails(alert);
      });

      marker.addTo(this.map);
      this.markers.push(marker);
    });
  }

  showAlertDetails(alert: AlertResponseDto) {
    console.log('Showing details for:', alert);
    this.selectedAlert = alert;
    this.display = true;
    this.isCreatingAlert = false;
  }


  deleteAlert(alert: AlertResponseDto) {
    this.alertService.deleteAlert(alert.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Alert Deleted',
          detail: 'Alert successfully removed',
          life: 3000
        });
        this.display = false;
        this.loadAlerts();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Delete Failed',
          detail: 'Unable to delete alert',
          life: 5000
        });
      }
    });
  }


  private createPopupContent(alert: AlertResponseDto): string {
    return this.dom.bypassSecurityTrustHtml(`
      <div class="alert-popup">
        <h3>${alert.title}</h3>
        <p>${alert.description}</p>
        <p>Type: ${alert.type}</p>
        <p>Severity: ${alert.severity}</p>
        <p>Status: ${alert.status}</p>
        <p>Created: ${new Date(alert.createdAt).toLocaleString()}</p>
      </div>
    `) as string;
  }

  searchLocation() {
    if (!this.searchAddress?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Search',
        detail: 'Please enter a valid address.'
      });
      return;
    }

    this.geoCodingService.searchLocation(this.searchAddress).subscribe({
      next: (results) => {
        this.searchResults = results;
        if (results.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'Search',
            detail: 'No results found for the entered address.'
          });
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Search Failed',
          detail: 'Unable to fetch location results. Please try again later.'
        });
      }
    });
  }

// Add a method to select a location from the results
  selectLocation(result: { display_name: string, lat: string, lon: string }) {
    const latLng = L.latLng(Number(result.lat), Number(result.lon));
    this.map.setView(latLng, 15);
    L.marker(latLng).addTo(this.map).bindTooltip(result.display_name).openTooltip();
    this.searchAddress = result.display_name;
    this.searchResults = [];
  }

  getUserLocation(){
    if ('geolocation' in navigator) {
      this.locationWatchId = navigator.geolocation.watchPosition(
        (position) => {
          const latLng = L.latLng(position.coords.latitude, position.coords.longitude);
          this.webSocketService.updateLocation(latLng);
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Location Error',
            detail: 'Unable to track your location'
          });
        },
        {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 27000
        }
      );
    }
  }

  useCurrentLocation() {
    if ('geolocation' in navigator) {
      this.locationWatchId = navigator.geolocation.watchPosition(
        (position) => {
          const latLng = L.latLng(position.coords.latitude, position.coords.longitude);
          this.map.setView(latLng, 15);
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Location Error',
            detail: 'Unable to track your location'
          });
        },
        {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 27000
        }
      );
    }
  }

  loadNearbyAlerts(position: L.LatLng) {
    this.alertService.getNearbyAlerts(position.lat, position.lng).subscribe({
      next: (response) => {
        this.alerts = response.data;
        this.updateMarkers();
      }
    });
  }

  canEdit(alert: AlertResponseDto): boolean {
    const currentUserId = this.userStateService.getCurrentUserId();
    return alert.user.id === currentUserId;
  }

  startEditing(alert: AlertResponseDto) {
    this.isEditing = true;
    this.editingAlertId = alert.id;
    this.display = true;

    this.alertForm.patchValue({
      title: alert.title,
      description: alert.description,
      type: alert.type,
      severity: alert.severity
    });
  }


  startCreateAlert() {
    this.isEditing = false;
    this.editingAlertId = null;
    this.isCreatingAlert = true;
    this.showAlertDialog = true;
    this.alertForm.reset();
    this.display = true;
  }

  cancelCreateAlert() {
    this.display=false
    this.isCreatingAlert = false;
    this.showAlertDialog = false;
    if (this.newAlertMarker) {
      this.newAlertMarker.remove();
      this.newAlertMarker = undefined;
    }
  }

  private updateNewAlertPosition(latlng: L.LatLng) {
    this.selectedPosition = latlng;
    if (this.newAlertMarker) {
      this.map.removeLayer(this.newAlertMarker);
    }
    this.newAlertMarker = L.marker(latlng).addTo(this.map);
  }

  submitAlert() {
    if (this.alertForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Form',
        detail: 'Please correct all required fields before submitting.'
      });
      return;
    }

    const alertData: AlertDto = {
      ...this.alertForm.value,
      latitude: this.selectedPosition.lat,
      longitude: this.selectedPosition.lng
    };

    const request$ = this.isEditing && this.editingAlertId
      ? this.alertService.updateAlert(this.editingAlertId, alertData)
      : this.alertService.createAlert(alertData);

    request$.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: `Alert ${this.isEditing ? 'Updated' : 'Created'}`,
          detail: `Alert successfully ${this.isEditing ? 'updated' : 'created'}`,
          life: 3000
        });


        // Remove marker
        if (this.newAlertMarker) {
          this.newAlertMarker.remove();
          this.newAlertMarker = undefined;
        }

        // Refresh alerts
        this.resetForm();
        this.loadAlerts();
      },
      error: (error) => {
        // Error handling
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to ${this.isEditing ? 'update' : 'create'} alert`,
            life: 5000
        });
        console.error('Alert creation error:', error);
      }
    });
  }

  protected resetForm() {
    this.isEditing = false;
    this.editingAlertId = null;
    this.display = false;
    this.isCreatingAlert = false;
    this.alertForm.reset();
  }

  // Form getters
  get title() { return this.alertForm.get('title'); }
  get description() { return this.alertForm.get('description'); }
  get type() { return this.alertForm.get('type'); }
  get severity() { return this.alertForm.get('severity'); }

  toggleSidebar() {
    this.display = !this.display;
  }

  onSidebarHide() {
    this.display = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.locationWatchId) {
      navigator.geolocation.clearWatch(this.locationWatchId);
    }
  }

}
