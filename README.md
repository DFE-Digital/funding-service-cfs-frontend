# funding-service-cfs-frontend

The web application for the Calculate Funding Service (CFS), providing users with a user-friendly interface to manage funding specifications, calculations, datasets, providers, approvals, and releases.

---

## Overview

Calculate Funding Frontend is the primary user interface for the Calculate Funding Service platform. It enables policy teams, analysts, and administrators to interact with funding data and services through a secure web application.

Key capabilities include:

- Funding specification management
- Dataset management
- Provider management
- Calculation configuration and execution
- Funding approvals and releases
- User administration and permissions
- Monitoring and operational support functions

---

## Architecture

This application acts as the presentation layer within the Calculate Funding platform and communicates with backend services via REST APIs.

```text
Users
  │
  ▼
Calculate Funding Frontend
  │
  ├── Specification API
  ├── Dataset API
  ├── Calculation API
  ├── Provider API
  ├── Publishing API
  └── Other supporting services
```

---

## Technology Stack

- ASP.NET Core
- C#
- Razor Views / MVC
- Azure Active Directory Authentication
- REST APIs
- Application Insights
- Docker
- GitHub Actions

---

## Repository Structure

```text
CalculateFunding-Frontend/
│
├── CalculateFunding.Web/
├── CalculateFunding.Web.Models/
├── CalculateFunding.Web.Services/
├── CalculateFunding.Web.ApiClients/
├── CalculateFunding.Web.Infrastructure/
├── CalculateFunding.Web.UnitTests/
└── docs/
```

---

## Getting Started

### Prerequisites

- .NET SDK (see global.json)
- Visual Studio 2022 or VS Code
- Access to Calculate Funding development environment
- Azure AD account with required permissions

### Clone Repository

```bash
git clone https://github.com/DFE-Digital/funding-service-cfs-frontend.git
cd funding-service-cfs-frontend
```

### Restore Packages

```bash
dotnet restore
```

### Build

```bash
dotnet build
```

### Run Application

```bash
dotnet run
```

---

## Configuration

Configuration is provided through:

- appsettings.json
- appsettings.Development.json
- Environment Variables
- Azure App Configuration
- Azure Key Vault

Do not commit secrets or credentials to source control.

---

## Authentication & Authorisation

The application uses Azure Active Directory (Azure AD) for authentication and role-based access control.

Access to specific features is governed through application roles and permissions managed within the Calculate Funding platform.


## Support

For support or access requests, contact the Funding & Grants Services team.

---

## Licence

Unless stated otherwise, the code in this repository is owned and maintained by the Department for Education (DfE).
