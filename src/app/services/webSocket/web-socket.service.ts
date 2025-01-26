import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { environment } from 'src/environments/environment';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertResponseDto } from '../../models/alert.model';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private rxStomp: RxStomp;
  private currentLocation$ = new BehaviorSubject<L.LatLng | null>(null);
  private userId: number | null = null;
  private username: string | null = null;

  constructor() {
    this.rxStomp = new RxStomp();
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;

    const userData = JSON.parse(userStr);
    const token = userData.token;
    this.userId = userData.customerDTO.id;
    this.username = userData.customerDTO.email;

    this.rxStomp.configure({
      brokerURL: 'ws://localhost:8080/ws-alerts',
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (msg: string) => console.log(`[WebSocket] ${msg}`),
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      reconnectDelay: 5000
    });

    this.rxStomp.activate();
  }

  updateLocation(location: L.LatLng) {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    const userData = JSON.parse(userStr);
    this.userId = userData.customerDTO.id;
    this.currentLocation$.next(location);
    this.rxStomp.publish({
      destination: `/app/location/${this.username}`,
      body: JSON.stringify({
        latitude: location.lat,
        longitude: location.lng
      })
    });
  }

  subscribeToNearbyAlerts(): Observable<AlertResponseDto> {
    console.log('Subscribing to nearby alerts');
    return this.rxStomp.watch(`/topic/nearby-alerts/${this.username}`).pipe(
      tap(message => console.log('Received alert:', message.body)),
      map(message => JSON.parse(message.body))
    );
  }

  disconnect() {
    this.rxStomp.deactivate();
  }
}
