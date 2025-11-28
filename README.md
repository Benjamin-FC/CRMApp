# CRM WebSpa Application

A modern full-stack web application for managing customer information with OAuth authentication.

## Architecture

### Backend (C# ASP.NET Core)
- **Location**: `./CRMWebSpa.Server`
- **Framework**: .NET 8.0 Web API
- **Features**:
  - OAuth token authentication
  - RESTful API endpoints
  - CORS enabled for React frontend
  - Integration with external CRM backend
  - Swagger documentation

### Frontend (React + Vite)
- **Location**: `./client`
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Features**:
  - Modern dark-mode UI with glassmorphism
  - Protected routes with OAuth
  - Login page
  - Customer information search and display
  - Responsive design

## Prerequisites

- Node.js 18+ and npm
- .NET 8.0 SDK
- Access to CRM backend at `http://localhost/CRMbackend`
- Token endpoint at `http://tokenendpoint`

## Installation

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd CRMWebSpa.Server
   ```

2. Restore dependencies:
   ```bash
   dotnet restore
   ```

3. Update `appsettings.json` if needed to configure:
   - CRM backend URL
   - Token endpoint URL

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Start the Backend

```bash
cd CRMWebSpa.Server
dotnet run
```

The backend will start at:
- HTTP: `http://localhost:5037`
- Swagger UI: `http://localhost:5037/swagger`

### Start the Frontend

In a separate terminal:

```bash
cd client
npm run dev
```

The frontend will start at `http://localhost:5173`

## Usage

1. **Login Page**:
   - Navigate to `http://localhost:5173`
   - Enter any username and password (currently accepts all inputs)
   - Token will be retrieved from the token endpoint
   - On successful login, you'll be redirected to the customer page

2. **Customer Information Page**:
   - Enter a customer ID to search
   - Customer information will be fetched from the CRM backend
   - All fields are displayed in a beautiful card layout
   - Click "Logout" to return to the login page

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login and get OAuth token
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

### Customer Data
- `GET /api/customer/{customerId}` - Get customer information
  - Requires: `Authorization: Bearer {token}` header

## Configuration

### Backend (`appsettings.json`)
```json
{
  "CRMBackend": {
    "BaseUrl": "http://localhost/CRMbackend",
    "TokenEndpoint": "http://tokenendpoint"
  }
}
```

### Frontend (`src/services/api.ts`)
```typescript
const API_BASE_URL = 'http://localhost:5037/api';
```

## Features

### Security
- OAuth token-based authentication
- Protected API endpoints
- Protected frontend routes
- Token stored in localStorage
- Automatic token injection in API requests

### UI/UX
- Premium dark-mode design
- Glassmorphism effects
- Smooth animations and transitions
- Responsive layout
- Loading states
- Error handling with user-friendly messages
- Form validation

### Fallback Behavior
- If token endpoint is unavailable, mock tokens are generated
- If CRM backend is unavailable, mock customer data is returned
- This allows the application to run in demo mode

## Development

### Backend Development
- Hot reload enabled with `dotnet watch run`
- Swagger UI available for API testing
- Development environment configured in `launchSettings.json`

### Frontend Development
- Vite provides instant HMR (Hot Module Replacement)
- TypeScript for type safety
- ESLint for code quality

## Project Structure

```
CRMUI/
├── CRMWebSpa.Server/          # Backend
│   ├── Controllers/           # API Controllers
│   ├── Models/               # DTOs and Models
│   ├── Services/             # Business logic
│   ├── Program.cs            # App configuration
│   └── appsettings.json      # Configuration
│
├── client/                    # Frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Login.tsx
│   │   │   └── CustomerInfo.tsx
│   │   ├── services/         # API services
│   │   │   └── api.ts
│   │   ├── App.tsx           # Main app with routing
│   │   ├── main.tsx          # Entry point
│   │   └── index.css         # Global styles
│   └── package.json
│
└── README.md
```

## Technologies Used

### Backend
- ASP.NET Core 8.0
- C# 12
- Swagger/OpenAPI
- HttpClient for external API calls

### Frontend
- React 18
- TypeScript
- Vite
- React Router DOM
- Axios
- CSS3 with custom properties

## License

This is a demo application for CRM integration.
