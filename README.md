# funding-service-cfs-frontend
# Calculate Funding Service - Release Management Schema

## Overview

The Calculate Funding Service (CFS) Release Management Schema repository contains the database schema definitions, SQL projects, and deployment artefacts used by the Release Management component of the Calculate Funding Service platform.

This repository acts as the source of truth for all Release Management database objects and supports the controlled deployment of schema changes across environments.

The schema enables CFS services to manage funding publication releases, release metadata, publishing status information, and associated operational processes.

---

## Purpose

This repository is responsible for:

- Maintaining Release Management database schemas.
- Version controlling database object definitions.
- Supporting automated CI/CD deployments.
- Managing schema evolution and database releases.
- Providing a consistent and auditable approach to database changes.
- Supporting reporting and operational processes related to funding releases.

---

## Solution Context

The Release Management solution forms part of the Calculate Funding Service ecosystem.

It supports key business processes including:

- Funding release management.
- Publication tracking.
- Release status management.
- Funding publication workflows.
- Operational reporting.
- Data integrity and governance.

This repository contains the SQL schema required for these functions.

---

## Repository Structure

```text
.
│
├── CalculateFunding-ReleaseManagement/
│   ├── Tables/
│   ├── Views/
│   ├── Stored Procedures/
│   ├── Functions/
│   ├── Security/
│   └── Post Deployment/
│
├── DevOps/
│   ├── Build
│   └── Release
│
├── CalculateFunding-PublishedFundingSchema.sln
│
└── README.md
```

> Actual folder structure may evolve as the solution develops.

---

## Technology Stack

The solution is built using:

- SQL Server Database Project (SSDT)
- Azure SQL Database
- Azure DevOps Pipelines
- GitHub
- Visual Studio

---

## Prerequisites

Before contributing to this repository, ensure the following software and access permissions are available.

### Software Requirements

| Tool | Recommended Version |
|--------|--------|
| Git | Latest |
| Visual Studio | 2022 or later |
| SQL Server Data Tools (SSDT) | Latest |
| Azure Data Studio or SSMS | Latest |
| .NET SDK | As required by build pipeline |

### Access Requirements

Developers may require access to:

- GitHub Repository
- Azure DevOps Project
- Azure Subscription
- Azure SQL Database
- Release Management environments

Contact the repository maintainers if access is required.

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/DFE-Digital/CalculateFunding-ReleaseManagementSchema.git
```

### Open the Solution

Open:

```text
CalculateFunding-PublishedFundingSchema.sln
```

using Visual Studio.

---

## Building the Solution

Using Visual Studio:

1. Open the solution.
2. Restore dependencies if required.
3. Build the solution.

Or using command line:

```bash
msbuild CalculateFunding-PublishedFundingSchema.sln
```

Successful builds should generate a DACPAC package that can be deployed through the CI/CD pipeline.

---

## Pull Request Requirements

Before raising a Pull Request:

- Solution builds successfully.
- Schema changes are validated.
- Relevant work item is linked.
- Business justification is provided.
- Peer review has been completed.

---

## Testing Checklist

Prior to merge:

- [ ] Solution builds successfully
- [ ] Database project validates
- [ ] Deployment scripts reviewed
- [ ] No unintended schema changes
- [ ] Pull Request approved
- [ ] Pipeline validation completed

---

## Security

Do not commit:

- Secrets
- Passwords
- API Keys
- Connection Strings
- Certificates
- Environment-specific configuration

Use approved secret-management solutions such as:

- Azure Key Vault
- GitHub Secrets
- Azure DevOps Variable Groups



## Contributing

Contributions are welcomed from authorised contributors.

Process:

1. Create feature branch.
2. Implement changes.
3. Test locally.
4. Submit Pull Request.
5. Obtain approval.
6. Merge into target branch.


