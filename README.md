# HelloHome — Premium Apartment Rentals Platform

## Project Overview

HelloHome is a premium apartment rental web platform based in Jakarta.  
The application provides fully furnished apartment listings with modern amenities, strategic locations, and a clean, responsive user interface.

This project is also designed to demonstrate the implementation of **CI/CD (Continuous Integration and Continuous Deployment)** using a real production environment.

---

## Live Deployment

**Production URL:**  
https://hellohome.verdsten.dev

The application is deployed on a VPS using a container-based architecture and is automatically updated whenever changes are pushed to the main branch.

---

## Technology Stack

- **Frontend**: React, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn-ui
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Version Control**: Git & GitHub
- **CI/CD & Deployment**: Coolify (Docker-based)
- **Hosting**: VPS

---

## CI/CD Pipeline

This project implements an automated CI/CD pipeline using **Coolify**.

### Pipeline Flow

```
Developer pushes code to GitHub
→ Coolify detects changes on the main branch
→ Dependencies are installed (npm ci)
→ Application is built (npm run build)
→ Container image is rebuilt
→ Container is restarted automatically
→ Application is deployed to production
```

This pipeline ensures that every code change is automatically built and deployed without manual intervention.

---

## Local Development

### Prerequisites
- Node.js (recommended via nvm)
- npm

### Setup

```bash
git clone https://github.com/VerdyNordsten/hellohome.git
cd hellohome
npm install
npm run dev
```

The application will be available locally with hot-reloading enabled.

---

## Environment Variables & Security

Sensitive configuration such as:

- Database credentials
- JWT secrets
- Storage access keys

are managed using **environment variables** and are not hardcoded in the source code.

This approach improves application security and prevents credential leakage.

---

## Monitoring & Logging

Application build logs and runtime logs are monitored through the Coolify dashboard.  
These logs are used to:

- Track deployment status
- Debug application errors
- Monitor container restarts

---

## Scalability

The application runs inside a containerized environment, allowing it to be scaled horizontally by adding additional container replicas if needed. Resource limits can also be configured at the container level.

---

## Conclusion

HelloHome demonstrates a complete real-world implementation of a modern web application with:

- Automated CI/CD pipeline
- Container-based deployment
- Secure environment configuration
- Live production monitoring

This setup ensures faster development cycles, reliable deployments, and maintainable production infrastructure.
