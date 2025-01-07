# **LuxProtect Alert System** 🛡️

A powerful real-time geolocation alert platform delivering instant notifications based on user proximity and location tracking.

## ✨ **Key Features**

### 🗺️ Interactive Map Experience

* Live alert visualization with custom markers
* Real-time location tracking
* Smart proximity filtering
~~* Interactive radius selection~~
~~* Custom geofencing zones~~

### ⚡ Real-time Notifications

* Instant WebSocket alerts
~~* Priority-based notification system~~
* Status tracking and updates
~~* Rich notification history~~

### 👥 User Management

Role-based access (Admin/User)
Secure authentication
~~Profile customization~~
~~Location history tracking~~

### 🎯 Alert Management

Location-based alert creation
Priority levels
~~Coverage radius control~~
Status monitoring
~~Historical data analysis~~

## 🚀 Quick Start
# Clone repository
git clone https://github.com/HorizenSS/lux-protect-client.git

# Install dependencies
npm install

# Start development
ng serve

## 🛠️ **Tech Stack**

Frontend: Angular 15
UI Components: PrimeNG
Maps: Leaflet.js
State Management: RxJS
Real-time: WebSocket/STOMP

## 📱 **Core Features Demo**

Authentication
`// Secure JWT authentication
@Injectable()
export class AuthService {
login(credentials: AuthRequest): Observable<AuthResponse> {
return this.http.post<AuthResponse>('/api/auth/login', credentials);
}
}`

Location Tracking
`// Real-time location updates
@Injectable()
export class LocationService {
trackLocation(): Observable<Position> {
return new Observable(observer => {
navigator.geolocation.watchPosition(
pos => observer.next(pos),
err => observer.error(err),
{ enableHighAccuracy: true }
);
});
}
}`

🔧 Configuration
`// environment.ts
export const environment = {
production: false,
apiUrl: 'http://localhost:8080',
wsUrl: 'ws://localhost:8080/ws-alerts',
mapboxToken: 'your_token'
};`

## 📦 **Available Scripts**
# Development
ng serve

# Production build
ng build --prod

# Testing
ng test

# Linting
ng lint

🔒 **Security Features**
* JWT Authentication
* Role-based Access Control
* WebSocket Security
* XSS Protection
* CSRF Guards

🌟 **Performance**
* Lazy Loading
* Virtual Scrolling
* Optimized WebSocket
* Image Compression
* Smart Caching

📚 **API Documentation**
Authentication
POST /api/auth/login
POST /api/auth/register
GET /api/auth/profile

Alerts
GET /api/alerts/nearby
POST /api/alerts/create
PUT /api/alerts/{id}/status

🤝 **Contributing**
Fork repository
Create feature branch
Implement changes
Add tests
Submit pull request

📄 **License**
MIT License - LICENSE.md

🔗 **Links**
Documentation
API Reference
Deployment Guide
Built with ❤️ by [Ines Akez]
