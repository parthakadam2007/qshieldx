# CYB Infrastructure Dashboard

This is the Next.js frontend and API layer for the CYB Infrastructure Dashboard. It interfaces with MongoDB to present structured data regarding monitoring targets, assets, exposed services, and network topologies.

## Information Architecture

The application is structured using the Next.js App Router. The diagram below illustrates the hierarchical layout of the pages and their core functions.

```mermaid
graph TD
    A[Dashboard Root & Auth] --> B[Authentication]
    B --> B1["/login"]
    B --> B2["/register"]
    
    A --> C[Core Data Views]
    C --> C1["/targets : Monitoring Scopes"]
    C --> C2["/assets : Discovered Assets"]
    C --> C3["/services : Exposed Services"]
    C --> C4["/ports : Open Ports"]
    
    A --> D[Visualizations & Settings]
    D --> D1["/topology : Network Map"]
    D --> D2["/settings : Configurations"]
    
    C1 --> C1a["/targets/new : Onboard Target"]
    C1 --> C1b["/targets/[id] : Target Details"]
    C2 --> C2a["/assets/[id] : Asset Details"]
```

## Database Schema (MongoDB)

The data is persisted in MongoDB (`cyb_dashboard` database). The entity relationships below describe how targets own assets, which in turn expose services and bind to specific ports.

```mermaid
erDiagram
    TARGET {
        string _id PK "e.g. TGT-001"
        string organizationName
        string primaryDomain
        string[] additionalDomains
        string[] ipRanges
        string status "Scanning, Idle, Paused"
        int assetsDiscovered 
    }
    
    ASSET {
        string _id PK "e.g. AST-001"
        string targetId FK "Links to TARGET"
        string name 
        string type "Server, Gateway, DB..."
        string internalIp
        string externalIp
        int overallScore
    }
    
    SERVICE {
        string _id PK "e.g. SRV-HTTP"
        string name 
        string type "HTTP, MQTT..."
        string version
        int aggregateRiskScore
    }
    
    PORT {
        string _id PK "e.g. PRT-3389"
        int portNumber
        string protocol "TCP, UDP"
        string description
        int exposureSeverity
    }

    TARGET ||--o{ ASSET : "owns"
    ASSET ||--o{ SERVICE : "exposes"
    ASSET }|--|| PORT : "listens on"
```

## App Routes & API Workings

The diagram below details how the frontend interacts with the Next.js API Routes and the underlying Database to fetch data and trigger scan agents.

```mermaid
sequenceDiagram
    participant User
    participant AppRouter as Next.js UI Router
    participant API as Next.js API (/api)
    participant DB as MongoDB

    User->>AppRouter: Navigates to /targets
    AppRouter->>API: GET /api/targets
    API->>DB: db.collection('targets').find()
    DB-->>API: JSON Targets Array
    API-->>AppRouter: Returns data
    AppRouter-->>User: Renders targets datatable

    User->>AppRouter: Adds New Target (/targets/new)
    AppRouter->>API: POST /api/targets { domain, org }
    API->>DB: db.collection('targets').insertOne()
    DB-->>API: Returns Success (_id)
    API-->>AppRouter: Target created response
    AppRouter->>API: POST /api/agent/scan (Initialize Scanning)
    AppRouter-->>User: Redirects to /targets
```

## Setup & Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Environment variables required:
- `MONGODB_URI`: Pointer to your MongoDB cluster instance for backend data persistence.

