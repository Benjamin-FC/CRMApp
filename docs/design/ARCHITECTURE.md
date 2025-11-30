# CRMWebSpa Architecture

## Overview
CRMWebSpa is a modern web application with a React (Vite) frontend and an ASP.NET Core backend. It is designed for modularity, scalability, and ease of deployment on IIS or local development environments.

## High-Level Architecture
- **Frontend:** React (TypeScript) with Vite for fast development and builds.
- **Backend:** ASP.NET Core 8.0 Web API.
- **Deployment:** IIS for production, Vite dev server for local development.
- **Communication:** RESTful API (JSON over HTTP).


## Module Diagram

Below is a Mermaid diagram showing the main modules and their relationships:

```mermaid
flowchart TD
  Frontend["Frontend (React/Vite)"] -- "API Calls" --> Backend["Backend (ASP.NET Core)"]
  Backend -- "Data Access" --> CRMService["CRMBackend Service"]
  Backend -- "Auth" --> AuthService["AuthService"]
  Backend -- "Controllers" --> Controllers["CustomerController, AuthController"]
  CRMService -- "HTTP" --> ExternalCRM["External CRM System"]
```


 

---

## Key Modules
- **Frontend:**
  - Components: Login, CustomerInfo, etc.
  - Services: API abstraction
- **Backend:**
  - Controllers: AuthController, CustomerController
  - Services: AuthService, CRMService
  - Models: CustomerInfo, LoginRequest, LoginResponse

---


## C4 Diagrams

### C4 Level 1: Context Diagram
```mermaid
flowchart LR
  user["User"]
  frontend["Frontend (React/Vite)"]
  backend["Backend (ASP.NET Core)"]
  crmbackend["CRM Backend (External System)"]
  user -- "Uses (5173)" --> frontend
  frontend -- "REST API Calls (5037)" --> backend
  backend -- "Data/API Calls" --> crmbackend
  classDef frontend fill:#e3f2fd,stroke:#2196f3,stroke-width:2px,rx:0,ry:0,font-size:20px,font-weight:bold;
  classDef backend fill:#f3e5f5,stroke:#8e24aa,stroke-width:2px,rx:0,ry:0,font-size:20px,font-weight:bold;
  classDef external fill:#fff3e0,stroke:#ff9800,stroke-width:2px,rx:0,ry:0,font-size:20px,font-weight:bold;
  class frontend frontend;
  class backend backend;
  class crmbackend external;
```

### C4 Level 2: Container Diagram
```mermaid
flowchart TD
  FEComp1["Login Component"]
  FEComp2["CustomerInfo Component"]
  FEApi["API Service"]
  AuthCtrl["AuthController"]
  CustCtrl["CustomerController"]
  AuthSvc["AuthService"]
  CRMSvc["CRMService"]
  Models["Models"]
  CRMDB["CRM Database (SQL Server)"]
  CRMExt["CRM Backend (Legacy API)"]
  FEComp1 -->|"Uses"| FEApi
  FEComp2 -->|"Uses"| FEApi
  FEApi -->|"REST API (5037)"| AuthCtrl
  FEApi -->|"REST API (5037)"| CustCtrl
  AuthCtrl -->|"Uses"| AuthSvc
  CustCtrl -->|"Uses"| CRMSvc
  AuthSvc -->|"Uses"| Models
  CustCtrl -->|"Uses"| Models
  CRMSvc -->|"Uses"| Models
  CRMSvc -->|"Data/API Calls"| CRMExt
  CRMSvc -->|"Data Access"| CRMDB
  %% Grouping for visual clarity (not subgraph)
  classDef frontend fill:#e3f2fd,stroke:#2196f3,stroke-width:2px,rx:0,ry:0,font-size:20px,font-weight:bold;
  classDef backend fill:#f3e5f5,stroke:#8e24aa,stroke-width:2px,rx:0,ry:0,font-size:20px,font-weight:bold;
  class FEComp1,FEComp2,FEApi frontend;
  class AuthCtrl,CustCtrl,AuthSvc,CRMSvc,Models backend;
```

### C4 Level 3: Component Diagram (Backend)
```mermaid
flowchart TD
  AuthController["AuthController (Web API Controller)"]
  CustomerController["CustomerController (Web API Controller)"]
  AuthService["AuthService (Service)"]
  CRMService["CRMService (Service)"]
  Models["Models (CustomerInfo, LoginRequest, LoginResponse)"]
  AuthController -->|"Uses"| AuthService
  CustomerController -->|"Uses"| CRMService
  AuthService -->|"Uses"| Models
  CustomerController -->|"Uses"| Models
  CRMService -->|"Uses"| Models
  %% Grouping for visual clarity (not subgraph)
  classDef backend fill:#f3e5f5,stroke:#8e24aa,stroke-width:2px,rx:0,ry:0,font-size:20px,font-weight:bold;
  class AuthController,CustomerController,AuthService,CRMService,Models backend;
```
