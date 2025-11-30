# CRMWebSpa Technical Design

## Technology Stack
- **Frontend:** React, TypeScript, Vite
- **Backend:** ASP.NET Core 8.0
- **Testing:** xUnit (backend), Vitest (frontend)
- **Deployment:** IIS (production), Vite dev server (dev)
- **Logging:** Serilog

## Backend Structure
- **Controllers:**
  - `AuthController`: Handles authentication endpoints.
  - `CustomerController`: Handles customer data endpoints.
- **Services:**
  - `AuthService`: Business logic for authentication.
  - `CRMService`: Handles communication with external CRM backend.
- **Models:**
  - `CustomerInfo`, `LoginRequest`, `LoginResponse`
- **Configuration:**
  - `appsettings.json`, `appsettings.Development.json`

## Frontend Structure
- **Components:**
  - `Login.tsx`, `CustomerInfo.tsx`
- **Services:**
  - `api.ts`: Handles API calls, uses VITE_API_BASE_URL
- **State Management:**
  - React state/hooks

## API Design
- RESTful endpoints under `/api/`
- JWT Bearer authentication for protected endpoints

## Error Handling
- Backend returns standard HTTP error codes and JSON error messages
- Frontend displays user-friendly error messages

## Security
- HTTPS enforced in production
- JWT tokens for API authentication
- CORS configured for dev

## Build & Deployment
- Frontend: `npm run build` (output to backend wwwroot for production)
- Backend: `dotnet publish`
- Automated script: `build-and-deploy.ps1`, `start-all.ps1`

## Testing
- Backend: `dotnet test`
- Frontend: `npm run test` (Vitest)

---



