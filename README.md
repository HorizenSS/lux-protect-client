# **LuxProtect Alert System** 🛡️

A powerful real-time geolocation alert platform delivering instant notifications based on user proximity and location tracking.

## ✨ **Key Features**

### 🗺️ Interactive Map Experience
* Live alert visualization with custom markers
* Real-time location tracking
* Smart proximity filtering

### ⚡ Real-time Notifications
* Instant WebSocket alerts
~~* Status tracking and updates~~

### 👥 User Management
* Role-based access (Admin/User)
* Secure authentication

### 🎯 Alert Management
* Location-based alert creation
* Priority levels
* ~~Coverage radius control~~
* Status monitoring
* ~~Historical data analysis~~

## 🚀 Running the Project Locally
To run the project on your local environment, follow these steps:

### **_SETUP DATABASE_**
#### Run PostgreSQL in Docker:
#### **1. Install Docker (If Not Installed)**
#### **Windows & macOS:**
Download and install **Docker Desktop** from [Docker's official site](https://www.docker.com/get-started/).
#### **Linux:**
Install Docker using:

`sudo apt update && sudo apt install -y docker.io
`
Ensure Docker is running:

`sudo systemctl start docker`

`sudo systemctl enable docker`

#### **2. Pull & Run PostgreSQL**

`docker pull postgres`

`docker run --name lux_protect_db \
-e POSTGRES_DB=lux_protect \
-e POSTGRES_USER=ines \
-e POSTGRES_PASSWORD=ines \
-p 5432:5432 \
-d postgres`

#### **3. Verify & Access Container**
Check running containers

`docker ps`

Restart if stopped

`docker start lux_protect_db`

`docker exec -it lux_protect_db psql -U ines -d lux_protect`

#### **4. Check Database & User**
If missing:
```sql
CREATE DATABASE lux_protect;
CREATE USER ines WITH ENCRYPTED PASSWORD 'ines';
GRANT ALL PRIVILEGES ON DATABASE lux_protect TO ines;
```
#### **5. Connect Locally**
- **Host:** `localhost`
- **Port:** `5432`
- **Database:** `lux_protect`
- **Username:** `ines`
- **Password:** `ines`
  ✅ PostgreSQL is now running locally! 🚀

### **_SETUP BACKEND_**
#### Clone repository

`git clone https://github.com/yourusername/luxprotect-backend.git`

#### Navigate to the backend directory
#### Run Spring Boot application

`./mvnw spring-boot:run`

### **_SETUP FRONTEND_**
#### Clone repository

`git clone https://github.com/HorizenSS/lux-protect-client.git`

#### Navigate to the frontend directory.
#### Install dependencies

`npm install`

#### Run the Angular app

`ng serve`

# 🚀 Project Roadmap

Below is a breakdown of the main development tasks for the project. These tasks will help structure the project as it moves through development:

---
### 🛠 Backend Setup
✅ **[DONE]** Initialize **Spring Boot** and configure dependencies.  
✅ **[DONE]** Set up **database connections** for PostgreSQL using Docker.  
✅ **[DONE]** Create **User** and **Incident** models and configure **Spring Security**.  
✅ **[DONE]** Implement **JWT and role-based access control** for different user types.

---
### 🎨 Frontend Setup
✅ **[DONE]** Initialize **Angular project** and set up core and shared modules.  
✅ **[DONE]** Configure **routing** for major sections, such as **Map, Alert Reporting...**.  
✅ **[DONE]** Integrate **LeafletJS Map** for interactive map features.

---
### 🌟 Core Features
🔐 **User Authentication**: ✅ **[DONE]** Implement user registration, login, and authentication (**JWT-based**).  
🗺 **Map Display**: ✅ **[DONE]** Configure **LeafletJS** for displaying incident markers.  
📢 **Incident Reporting**: ✅ **[DONE]** Create forms for users to submit incidents and view details.  
📲 **Real-Time Notifications**: ✅ **[DONE]** Integrate **WebSocket** for real-time notifications.

---
### 🔍 Testing and Deployment
✅ **[DONE]** Set up **unit and integration tests** for frontend and backend.  
🚀 **[IN PROGRESS]** Deploy the backend and frontend to **AWS** (or other cloud services).  
⚙️ **[NOT STARTED]** Configure **CI/CD pipelines** for automatic deployment.

💡 Stay on track and iterate as needed for a smooth development process! 🚀

## Project Structure
* src/
* ├── app/
* │   ├── components/      # Reusable UI components
* │   ├── services/        # Business logic and API calls
* │   ├── models/          # TypeScript interfaces and types
* │   └── shared/          # Shared utilities and constants
* ├── assets/             # Static files
* └── environments/       # Environment configurations

## 🛠️ **Tech Stack**
* Frontend: Angular 15
* UI Components: PrimeNG
* Maps: Leaflet.js
* State Management: RxJS
* Real-time: WebSocket/STOMP

### 🔒 **Security Features**
* JWT Authentication
* Role-based Access Control
* WebSocket Security
* XSS Protection
* CSRF Guards

### 🌟 **Performance**
* Lazy Loading
* Optimized WebSocket
* Image Compression
* Smart Caching


## 📦 **Available Scripts**
### Development
`ng serve`

##### Production build
`ng build --prod`

##### Testing
`ng test`

##### Linting
`ng lint`

## 📚 **API Documentation**

##### Authentication

* POST /api/auth/login
* POST /api/auth/register
* GET /api/auth/profile

#### Alerts

* GET /api/alerts/nearby
* POST /api/alerts/create
* PUT /api/alerts/{id}/status

## 🤝 **Contributing**
* Fork repository
* Create feature branch
* Implement changes
* Add tests
* Submit pull request

## 📄 **License**
* MIT License - LICENSE.md

## 🔗 **Links**

Built with ❤️ by [[Ines Akez](https://www.linkedin.com/in/ines-akez-a69996110/)]
