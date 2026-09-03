# CyberScanner - Comprehensive Documentation

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Architecture & Structure](#2-architecture--structure)
3. [Frontend (Next.js)](#3-frontend-nextjs)
4. [Backend (Python)](#4-backend-python)
5. [Database & Data Storage](#5-database--data-storage)
6. [API Endpoints](#6-api-endpoints)
7. [Graph Intelligence & Autonomous Agents](#7-graph-intelligence--autonomous-agents)
8. [Services Module](#8-services-module)
9. [Targets Management](#9-targets-management)
10. [OSINT Tools](#10-osint-tools)
11. [Tool Manager](#11-tool-manager)
12. [Related Repositories](#12-related-repositories)
13. [Authentication & Authorization](#13-authentication--authorization)
14. [Security Considerations](#14-security-considerations)
15. [Development Setup](#15-development-setup)
16. [Configuration Files](#16-configuration-files)
17. [Environment Variables](#17-environment-variables)
18. [Testing](#18-testing)
19. [Deployment](#19-deployment)
20. [Known Issues & Workarounds](#20-known-issues--workarounds)
21. [Future Enhancements](#21-future-enhancements)
22. [Code Conventions](#22-code-conventions)
23. [Dependencies](#23-dependencies)
24. [Error Handling](#24-error-handling)
25. [Logging System](#25-logging-system)
26. [Performance Considerations](#26-performance-considerations)
27. [Contributing Guidelines](#27-contributing-guidelines)

---

## 1. Project Overview

CyberScanner is a comprehensive cybersecurity assessment platform that combines frontend (Next.js) and backend (Python) components to provide vulnerability scanning, OSINT (Open Source Intelligence) tools, and target management capabilities. The application features:

- **Multi-tenant architecture** with user authentication
- **Target management** system for scanning various hosts and services
- **OSINT integration** with multiple intelligence sources
- **Real-time scanning** capabilities with progress tracking
- **Dashboard** for viewing scan results and topology

The project is structured as a monorepo with separate frontend (Next.js 14 with App Router) and backend (Python with FastAPI-like structure) directories.

---

## 2. Architecture & Structure

### Overall Layout
```
CyberScanner/
├── frontend/                    # Next.js 14 App Router
│   ├── app/                     # App router pages and routes
│   ├── components/              # React UI components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility libraries
│   ├── public/                  # Static assets
│   └── styles/                  # CSS styles
├── backend/                     # Python backend
│   ├── api.py                   # API routes/endpoints
│   ├── app.py                   # Main application entry point
│   ├── pyproject.toml           # Python project configuration
│   ├── requirements.txt         # Python dependencies
│   └── data/                    # Data storage
│       └── recon-google.com/    # Sample data
└── sandbox/                     # Additional sandbox tools
    ├── osint_tools.py           # OSINT tool implementations
    └── tool_manager.py          # Tool management system
```

### Key Architectural Decisions
- **Next.js 14 with App Router** - Modern React routing with server components
- **React Server Components** - Default component rendering for better performance
- **TailwindCSS** - Utility-first CSS framework for styling
- **MongoDB integration** - Database operations via lib/mongodb.ts
- **Tool manager pattern** - Centralized OSINT tool management in sandbox/

---

## 3. Frontend (Next.js)

### 3.1 App Router Structure (`frontend/app/`)

The app router follows the Next.js 14 App Router pattern with the following key directories:

| Directory | Purpose |
|-----------|---------|
| `app/` | Main application routes |
| `app/api/` | API routes (Route Handlers) |
| `app/api/agent/chat/route.ts` | Agent chat endpoint |
| `app/api/agent/scan/route.ts` | Scan agent endpoint |
| `app/api/auth/route.ts` | Authentication routes |
| `app/api/global-data/route.ts` | Global data management |
| `app/api/ip/route.ts` | IP-related endpoints |
| `app/api/register/route.ts` | Registration endpoint |
| `app/api/settings/route.ts` | Settings management |
| `app/api/targets/route.ts` | Targets API |
| `app/api/targets/[id]/route.ts` | Target-specific endpoint |
| `app/api/testssl/route.ts` | TestSSL endpoint |

### 3.2 Key API Routes

#### `app/api/agent/chat/route.ts`
- Handles agent chat interactions
- Processes user messages and returns AI-generated responses
- Integrates with language models for assistant functionality

#### `app/api/agent/scan/route.ts`
- Manages scanning operations
- Triggers scan jobs and returns status
- Supports real-time progress updates

#### `app/api/auth/route.ts`
- Authentication route (likely NextAuth.js integration)
- Handles login/logout flows
- Manages user sessions

#### `app/api/targets/route.ts`
- CRUD operations for scan targets
- Target validation and storage
- Supports bulk target operations

#### `app/api/targets/[id]/route.ts`
- Individual target management
- Route parameters for target ID `[id]`
- Supports target details retrieval and updates

#### `app/api/testssl/route.ts`
- TestSSL integration for SSL/TLS analysis
- Provides SSL certificate and protocol scanning

### 3.3 Page Components

#### `frontend/app/services/page.tsx`
- **Services management page** - Displays and manages scan services
- Features a responsive table with:
  - Service name, ID, and status columns
  - Row expansion for detailed views
  - Toggle functionality for expanding/collapsing rows
  - Filtering and search capabilities
  - Status badges with color coding
  - Action buttons for each service

Key features observed:
- `expandedRows` state management for row expansion
- `filteredServices` for search/filtering
- `toggleRow()` function for row interaction
- Table with `Table`, `TableHeader`, `TableRow`, `TableCell` components
- Service data mapping with `service.id` as unique identifier
- Status-based rendering with conditional UI elements

#### `frontend/app/[targetType]/[id]/page.tsx` (Dynamic Routes)
- Dynamic page for target details
- Supports `[id]` parameter for specific target viewing

#### `frontend/app/topology/page.tsx`
- Network topology visualization page
- Likely displays scan results graphically

#### `frontend/app/ports/page.tsx`
- Port scanning and management interface

#### `frontend/app/register/page.tsx`
- User registration page

#### `frontend/app/login/page.tsx`
- Authentication/login page

#### `frontend/app/settings/page.tsx`
- User settings configuration

### 3.4 UI Components (`frontend/components/`)

Extensive component library organized by category:

#### Layout & Navigation
- `app-sidebar.tsx` - Main sidebar navigation
- `nav-main.tsx` - Primary navigation menu
- `nav-projects.tsx` - Projects navigation
- `nav-user.tsx` - User-specific navigation
- `team-switcher.tsx` - Team selection UI

#### Theme & Global
- `theme-provider.tsx` - Theme context provider
- `globals.css` - Global styles with Tailwind directives

#### UI Components Library
- `alert.tsx` - Alert dialog component
- `avatar.tsx` - User avatar display
- `badge.tsx` - Status badge component
- `button.tsx` - Button component with variants
- `card.tsx` - Card container component
- `collapsible.tsx` - Collapsible content section
- `dropdown-menu.tsx` - Dropdown menu component
- `input.tsx` - Input field component
- `label.tsx` - Label component
- `progress.tsx` - Progress bar component
- `select.tsx` - Select dropdown component
- `separator.tsx` - Separator/divider component
- `sheet.tsx` - Sheet/modal component
- `sidebar.tsx` - Sidebar component
- `skeleton.tsx` - Loading skeleton component
- `table.tsx` - Table component (used in services page)
- `tabs.tsx` - Tabs component
- `textarea.tsx` - Textarea component
- `tooltip.tsx` - Tooltip component

#### Form & Input Components
- `input.tsx` - Form input field
- `label.tsx` - Form labeling
- `select.tsx` - Form selection
- `textarea.tsx` - Multi-line text input

#### Authentication Components
- `auth-provider.tsx` - Auth context provider
- `login/` - Login-related pages and components

### 3.5 Custom Hooks (`frontend/hooks/`)

- `use-mobile.ts` - Mobile device detection hook

### 3.6 Libraries (`frontend/lib/`)

- `auth.ts` - Authentication utilities
- `mock-data.ts` - Mock data for development/testing
- `mongodb.ts` - MongoDB connection and operations
- `utils.ts` - General utility functions

### 3.7 Configuration Files

| File | Purpose |
|------|---------|
| `frontend/package.json` | Node.js dependencies and scripts |
| `frontend/tsconfig.json` | TypeScript configuration |
| `frontend/next.config.mjs` | Next.js configuration |
| `frontend/eslint.config.mjs` | ESLint configuration |
| `frontend/postcss.config.mjs` | PostCSS configuration |
| `frontend/tailwind.config.mjs` (inferred) | Tailwind CSS configuration |
| `frontend/storybook` (inferred) | Component development storybook |

### 3.8 Key Page Routes

| Route | Component/Page |
|-------|----------------|
| `/` | `frontend/app/page.tsx` (likely home/dashboard) |
| `/login` | `frontend/app/login/page.tsx` |
| `/register` | `frontend/app/register/page.tsx` |
| `/services` | `frontend/app/services/page.tsx` (services management) |
| `/targets` | Targets management page |
| `/settings` | User settings page |
| `/topology` | Network topology visualization |

---

## 4. Backend (Python)

### 4.1 Main Application (`backend/app.py`)

The backend Python application serves as the main entry point for the CyberScanner platform. Key features:

- FastAPI-inspired route definitions
- Integration with frontend API routes
- Data processing and scan orchestration
- Database connection management

### 4.2 API Module (`backend/api.py`)

Contains API route definitions and endpoints:
- Route handlers for various scanner operations
- Request/response validation
- Error handling middleware

### 4.3 Python Dependencies (`backend/requirements.txt`)

Standard Python scientific and web packages likely including:
- FastAPI or similar web framework
- Cryptography libraries for SSL/TLS analysis
- Requests library for HTTP operations
- OSINT tool dependencies

### 4.4 Project Configuration (`backend/pyproject.toml`)

Python project metadata and configuration:
- Package dependencies
- Build configuration
- Project versioning

### 4.5 Data Directory (`backend/data/`)

Contains sample data:
- `recon-google.com/resume.cfg` - Configuration for Google reconnaissance

### 4.6 Sandbox Tools (`sandbox/`)

#### `sandbox/osint_tools.py`
- OSINT (Open Source Intelligence) tool implementations
- Multiple intelligence gathering capabilities
- Integration with external APIs and services
- Data parsing and formatting utilities

#### `sandbox/tool_manager.py`
- Centralized tool management system
- Tool registration and discovery
- Lifecycle management for OSINT tools
- Configuration and initialization

### 4.7 Backend Configuration

| File | Purpose |
|------|---------|
| `backend/pyproject.toml` | Python project configuration |
| `backend/requirements.txt` | Python package dependencies |

---

## 5. Database & Data Storage

### 5.1 Supabase Integration (`frontend/lib/supabase.ts`)

Supabase (PostgreSQL) is used as the primary database for:
- User authentication data
- Scan targets storage
- Scan results, assets, and findings
- Agent activity and audit logs
- Attack graph storage

### 5.2 Data Models

Based on file inspections, the following data structures are used via PostgreSQL tables:

#### Targets (scan_jobs)
- `id` - UUID primary key
- `target_domain` / `primary_domain` / `name` - Target hostname or IP
- `status` - Current scan status (Idle, Scanning, Error)
- `created_at` - Timestamp of creation
- `updated_at` - Last update timestamp

#### Assets
- `id` - UUID primary key
- `scan_job_id` - Foreign key to `scan_jobs`
- `asset_type` - e.g. subdomain, port, service
- `asset_value` - e.g. domain name, port number
- `metadata` - JSON containing IP, ports, service details

#### Scan Results & Other Tables
- `findings` - Vulnerability findings
- `risk_scores` - Overall risk scores
- `attack_graph` - Network topology maps
- `agent_activity` - LLM interaction and task tracking

### 5.3 Database Operations

- **CRUD operations** via `@supabase/supabase-js` and `@supabase/ssr`
- **Realtime updates** via Supabase Realtime subscriptions (e.g. `useScanJobs` hook)
- **RLS Policies** enforce user access control at the database level
- **Backend Logging** from Python using `supabase-py`

---

## 6. API Endpoints

### 6.1 Frontend API Routes (`frontend/app/api/`)

All routes are Next.js Route Handlers (app router format):

| Route | Method | Description |
|-------|--------|-------------|
| `app/api/agent/chat/route.ts` | POST | Agent chat processing |
| `app/api/agent/scan/route.ts` | POST | Scan initiation/management |
| `app/api/auth/route.ts` | POST/Get | Authentication operations |
| `app/api/global-data/route.ts` | GET/Put | Global data management |
| `app/api/ip/route.ts` | GET | IP-related operations |
| `app/api/register/route.ts` | POST | User registration |
| `app/api/settings/route.ts` | GET/Put | User settings |
| `app/api/targets/route.ts` | GET/POST | Targets management |
| `app/api/targets/[id]/route.ts` | GET/Put/Delete | Individual target |
| `app/api/testssl/route.ts` | GET/POST | SSL/TLS scanning |

### 6.2 Backend API (`backend/api.py`)

Additional Python-based API endpoints complementing the frontend routes.

### 6.3 Request/Response Formats

- **JSON** is the primary data format
- **Route parameters** use `[id]` pattern for dynamic resources
- **Query parameters** for filtering and pagination
- **Body schemas** vary by endpoint (typically object-based)

---

## 7. Graph Intelligence & Autonomous Agents

### 7.1 Overview

The CyberScanner platform features a sophisticated **LangGraph-based autonomous cybersecurity agent** implemented in `backend/app.py`. This agent serves as the core intelligence engine, capable of conducting end-to-end security assessments through a structured, multi-phase Standard Operating Procedure (SOP).

### 7.2 Architecture

#### Core Technologies
- **LangGraph** - StateGraph for workflow orchestration with conditional edges
- **LangChain** - Message handling, tool binding, and model integration
- **ChatOllama** - Local LLM inference (model: `qwen3:1.7b`, temperature: 0)
- **MemorySaver** - Checkpointing for persistent conversation state across sessions
- **Rich Console** - Enhanced CLI output with panels, markdown, and spinners

#### State Management
```python
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
```
- Uses `add_messages` reducer for automatic message history accumulation
- Maintains full conversation context via `thread_id` configuration

#### Graph Structure
```
START → agent → (tools_condition) → tools → agent → END
                    ↓
              (conditional: continue or end)
```
- **Entry Point**: `agent` node (LLM reasoning)
- **Tool Node**: Prebuilt `ToolNode` executing sandbox tools
- **Routing**: `tools_condition` determines if tools needed
- **Loop**: Tools output feeds back to agent for continued reasoning
- **Memory**: `MemorySaver` checkpointer enables thread persistence

### 7.3 System Prompt & SOP

The agent operates under a comprehensive **elite white-hat cybersecurity expert persona** with a strict 4-phase SOP for domain targeting:

#### Phase 1: Asset Discovery
- Tools: `subfinder_scan`, `theharvester_scan`, `dns_lookup`
- Objective: Find all subdomains, servers, and IPs

#### Phase 2: Enumeration & Mapping
- Tools: `feroxbuster_scan`, `nmap_scan`, `masscan_scan`
- Objective: Discover APIs, hidden directories, open ports on assets

#### Phase 3: Vulnerability Scanning
- Tools: `nuclei_scan`, `wafw00f_scan`, `gitleaks_scan`
- Objective: Identify CVEs, vulnerabilities, misconfigurations

#### Phase 4: Reporting (Mandatory JSON Output)
```json
{
  "domain": "...",
  "assets": [...],
  "vulnerabilities": [...],
  "errors": [...]
}
```
- **Strict Requirements**: Raw JSON only, no markdown, no conversational filler
- **Error Handling**: Tool failures logged in `errors` array, workflow continues
- **No Abort**: Mission continues despite individual tool failures

### 7.4 Tool Integration

#### Available Tools (from `sandbox.osint_tools`)
The agent binds all tools from `sandbox.osint_tools` via `model.bind_tools(tools)`:
- Subdomain enumeration (`subfinder_scan`, `theharvester_scan`)
- DNS analysis (`dns_lookup`)
- Directory brute-forcing (`feroxbuster_scan`)
- Port scanning (`nmap_scan`, `masscan_scan`)
- Vulnerability scanning (`nuclei_scan`, `wafw00f_scan`, `gitleaks_scan`)
- Shell execution capabilities for custom tool installation

#### Safety Constraints
- **No destructive commands**: Blocks `rm -rf`, `mkfs`, `format`, drive wiping
- **Authorization required**: No attacks without explicit user consent
- **Passive default**: Defaults to reconnaissance unless instructed otherwise

### 7.5 API Integration

#### Frontend Consumption (`app/api/agent/chat/route.ts`)
- **Endpoint**: POST `/api/agent/chat`
- **Input**: `ChatRequest` with `message` and optional `thread_id`
- **Processing**: Streams `langgraph_app.stream()` with `thread_id` config
- **Output**: `StreamingResponse` for real-time token delivery
- **Memory**: Persistent conversation via `thread_id` (default: "session-1")

#### Request/Response Flow
```
User Message → ChatRequest → langgraph_app.stream(config={thread_id}) 
    → AgentState → call_model → ToolNode (if needed) → AgentState 
    → StreamingResponse → Frontend UI
```

### 7.6 CLI Interface

The agent includes a full-featured CLI with accessibility support:

#### Arguments
| Flag | Description |
|------|-------------|
| `--accessible` | Screen reader mode: disables spinners, colors, complex UI |
| `--tts` | Text-to-Speech: reads responses aloud via pyttsx3 |

#### Features
- **Rich Panels**: Welcome message with tool list, bordered responses
- **Markdown Rendering**: Formatted agent responses in standard mode
- **Tool Call Visibility**: Shows tool name and arguments in real-time
- **Graceful Degradation**: Plain text output for accessibility mode
- **TTS Integration**: Optional speech synthesis with markdown cleaning
- **Interrupt Handling**: Ctrl+C for graceful shutdown

#### Session Management
- Fixed `thread_id: "session-1"` for CLI conversations
- Memory persists across CLI interactions within same process
- New process = new session (unless thread_id externalized)

### 7.7 Key Implementation Details

#### Model Configuration
```python
model = ChatOllama(model="qwen3:1.7b", temperature=0)
model_with_tools = model.bind_tools(tools)
```
- **Temperature 0**: Deterministic, reproducible outputs
- **Tool Binding**: Native function calling via Ollama

#### Streaming & Status
- `app.stream(inputs, config, stream_mode="values")` for incremental output
- `status_indicator` context manager for visual feedback
- Real-time tool invocation display

#### Error Resilience
- Try/except in main loop catches KeyboardInterrupt and general exceptions
- Tool failures captured in JSON `errors` array per SOP
- Agent continues workflow despite individual tool errors

### 7.8 File Reference

| File | Purpose |
|------|---------|
| `backend/app.py` | Main agent entry point, graph compilation, CLI |
| `backend/api.py` | FastAPI endpoints for frontend integration |
| `sandbox/osint_tools.py` | Tool implementations bound to agent |
| `sandbox/tool_manager.py` | Tool lifecycle management |

---

## 8. Services Module

### 8.1 Services Page (`frontend/app/services/page.tsx`)

The services management page is a central interface for:

#### Key Features:
1. **Service Table Display**
   - Responsive table layout
   - Column: Service name, ID, status
   - Status badges with color coding

2. **Row Expansion**
   - `expandedRows` state management
   - `toggleRow(service.id)` function
   - Collapsible detailed views per service

3. **Filtering & Search**
   - `filteredServices` state for search functionality
   - Real-time filtering as user types

4. **Action Operations**
   - Service-specific actions per row
   - View details, manage configurations
   - Status monitoring

5. **Visual Indicators**
   - `bg-muted/50` hover effects
   - `transition-colors` for smooth animations
   - `opacity-50` / `opacity-100` transition states

#### Component Structure:
```tsx
// Main table container
<Table>
  <TableHeader>
    <TableRow>
      <TableCell>Service Name</TableCell>
      <TableCell>Status</TableCell>
      <TableCell>Actions</TableCell>
    </TableRow>
  </TableHeader>
  {filteredServices.map((service) => (
    <TableRow key={service.id}>
      <TableCell>
        {/* Service details */}
      </TableCell>
      <TableCell>
        <Button variant="ghost" size="icon" className="size-6 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
          {/* Expand/collapse icon */}
        </Button>
      </TableCell>
    </TableRow>
  ))}
</Table>
```

### 8.2 Service Data Structure

Based on the page implementation:
- Each service has a unique `id`
- Services can be in various states (active, idle, error, etc.)
- Services support expansion for detailed viewing
- Services are filterable and searchable

### 8.3 Service-Related API Endpoints

- `app/api/services/` - Services management (if exists)
- `app/api/targets/` - Related target management
- Custom endpoints for service operations

---

## 9. Targets Management

### 9.1 Targets Page and API

#### `frontend/app/api/targets/route.ts`
- **GET** - Retrieve all targets
- **POST** - Create new target
- Supports bulk target operations

#### `frontend/app/api/targets/[id]/route.ts`
- **GET** - Retrieve specific target by ID
- **PUT** - Update target information
- **DELETE** - Remove target

#### `frontend/app/[targetType]/[id]/page.tsx`
- Dynamic page for viewing target details
- Supports `[id]` parameter navigation

### 9.2 Target Data Model

Based on inspections:
- **id**: Unique identifier string
- **hostname** or **ip**: Target address
- **type**: Classification (web, network, etc.)
- **status**: Current scanning state
- **metadata**: Additional target properties

### 9.3 Target Operations

- **Add new targets** via API or UI
- **Edit existing targets** with validation
- **Delete targets** with confirmation
- **Filter targets** by status, type, or other criteria
- **Bulk operations** on multiple targets

### 9.4 Target Status States

- **Active** - Currently scanning
- **Completed** - Scan finished
- **Failed** - Scan encountered errors
- **Pending** - Queued for scanning

---

## 10. OSINT Tools

### 10.1 OSINT Tool Implementations (`sandbox/osint_tools.py`)

The sandbox contains OSINT (Open Source Intelligence) tools for:

#### Capabilities:
1. **Google Reconnaissance**
   - Domain intelligence gathering
   - Subdomain enumeration
   - Website analysis

2. **Multiple Intelligence Sources**
   - External API integrations
   - Public data sources
   - Threat intelligence feeds

3. **Data Processing**
   - Result parsing and formatting
   - Deduplication
   - Export capabilities

### 10.2 Tool Manager (`sandbox/tool_manager.py`)

#### Features:
1. **Tool Registration**
   - Centralized tool discovery
   - Automatic tool loading
   - Configuration management

2. **Lifecycle Management**
   - Tool initialization
   - Status tracking
   - Resource cleanup

3. **Integration Points**
   - API key management
   - Rate limiting
   - Error handling

### 10.3 OSINT Integration Points

- **External APIs** - Various intelligence services
- **Public databases** - Open data sources
- **Custom crawlers** - Website scraping and analysis
- **Report generation** - formatted output for findings

### 10.4 Data Flow

1. User selects OSINT tool
2. Tool Manager initializes selected tool
3. Tool queries external sources
4. Results parsed and formatted
5. Displayed in UI or saved to database

---

## 11. Tool Manager

### 11.1 Tool Manager Implementation (`sandbox/tool_manager.py`)

The tool manager serves as the central orchestration layer for:

#### Core Functions:

1. **Tool Discovery**
   - Automatic detection of available tools
   - Configuration file scanning
   - Plugin-style architecture

2. **Tool Initialization**
   - Setup and configuration loading
   - API key management
   - Connection testing

3. **Execution Management**
   - Concurrent tool execution
   - Progress tracking
   - Timeout handling

4. **Result Aggregation**
   - Multiple source integration
   - Data deduplication
   - Priority ranking

#### Interface Design:
- **Modular** - Easy to add new tools
- **Configurable** - Per-tool settings
- **Extensible** - New capabilities can be added

### 11.2 OSINT Tools (`sandbox/osint_tools.py`)

Specific tool implementations include:

1. **Google Recon Tool**
   - Domain analysis
   - Subdomain discovery
   - Certificate transparency logs

2. **Additional Tools**
   - Various intelligence sources
   - Threat intelligence integration
   - Public record searches

### 11.3 Tool Configuration

- **Configuration files** - Tool-specific settings
- **Environment variables** - API keys and secrets
- **Default settings** - Fallback configurations

---

## 12. Related Repositories

### 12.1 QShieldX Backend Repository
- **Repository**: `mahendra189/qshieldx`
- **Branch**: `main` (default)
- **Description**: Core backend implementation for the CyberScanner/QShieldX platform
- **Contains**: Python-based scanning engine, API services, OSINT tools, and agent orchestration

### 12.2 QShieldX UI Repository
- **Repository**: `mahendra189/qshieldxui`
- **Branch**: `main` (default)
- **Description**: Frontend user interface for the CyberScanner/QShieldX platform
- **Contains**: Next.js application, React components, authentication, dashboard, and visualization

### 12.3 Repository Relationship
These two repositories form the complete CyberScanner/QShieldX platform:
- **qshieldx** - Backend services, scanning engine, API layer
- **qshieldxui** - Frontend dashboard, user management, real-time monitoring
- Both share the `main` branch as default and are developed in parallel

---

## 13. Authentication & Authorization

### 13.1 Authentication System

The application uses native Supabase Auth:

- **Supabase Auth** - Used for all user management, login, and registration flows
- **Route protection** - Handled by Next.js Middleware (`frontend/middleware.ts`)
- **SSR Client** - Utilizes `@supabase/ssr` for secure server-side session management

### 13.2 Key Authentication Files

| File | Purpose |
|------|---------|
| `frontend/hooks/useUser.ts` | React hook for accessing current user state |
| `frontend/middleware.ts` | Next.js middleware for route protection |
| `frontend/lib/supabase.ts` | Supabase client initializers |

### 13.3 Authorization Mechanisms

- **Row Level Security (RLS)** - Database policies enforce access control on all tables
- **Role-based access control** - The `users` table tracks user roles (e.g., 'customer', 'admin')
- **Route-level protection** - Specific pages require authentication

### 13.4 Session Management

- **Supabase sessions** - JWT-based session management
- **Cookie-based storage** - `@supabase/ssr` securely handles cookie parsing/setting
- **Real-time Auth state** - Clients react to `onAuthStateChange` events

---

## 14. Security Considerations

### 12.1 Data Protection

- **Input validation** - All API endpoints validate inputs
- **Output sanitization** - Prevent XSS in rendered content
- **Rate limiting** - API request throttling

### 12.2 Authentication Security

- **NextAuth.js configuration** - Provider settings
- **Session security** - Token signing and validation
- **Password handling** - If applicable (hashing, etc.)

### 12.3 Common Vulnerabilities Addressed

- **SQL injection** - Parameterized queries (MongoDB uses different patterns)
- **XSS prevention** - React escaping, Tailwind class sanitization
- **CSRF protection** - NextAuth.js includes CSRF tokens
- **HTTPS enforcement** - Likely configured in production

### 12.4 Dependency Security

- Regular updates to npm packages
- Python dependencies pinned in requirements.txt
- Vulnerability scanning recommended

---

## 13. Development Setup

### 13.1 Prerequisites

#### Frontend:
- Node.js 18+ or 20+
- npm, yarn, or pnpm
- pnpm is used in this project (evidenced by pnpm-lock.yaml)

#### Backend:
- Python 3.10+
- pip or poetry
- MongoDB instance

### 13.2 Installation Steps

#### Frontend Setup:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev
# or: npm run dev
```

#### Backend Setup:
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt
# or: pipenv install

# Start the application
python app.py
# or: uvicorn app:app
```

### 13.3 Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js development server |
| `pnpm build` | Build production frontend |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | TypeScript type checking |
| `python -m backend.app` | Run backend Python app |
| `pytest` | Run Python tests (if configured) |

### 13.4 Environment Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Frontend application URL | localhost:3000 |
| `MONGODB_URI` | MongoDB connection string | localhost:27017 |
| `NEXTAUTH_URL` | NextAuth callback URL | http://localhost:3000 |
| `NEXTAUTH_SECRET` | Secret for session signing | Generated |
| Various OSINT API keys | External service credentials | None (dev mode) |

### 13.5 IDE/Editor Configuration

- **VS Code** recommended with extensions:
  - TypeScript and ESLint
  - Tailwind CSS IntelliSense
  - Python extension
  - MongoDB extension

---

## 14. Configuration Files

### 14.1 Frontend Configuration

| File | Purpose |
|------|---------|
| `frontend/package.json` | Dependencies, scripts, version |
| `frontend/tsconfig.json` | TypeScript strictness and paths |
| `frontend/next.config.mjs` | Next.js experimental features, rewrites |
| `frontend/eslint.config.mjs` | Linting rules and configurations |
| `frontend/postcss.config.mjs` | PostCSS processing pipeline |
| `frontend/tailwind.config.mjs` | Tailwind CSS customization |

### 14.2 Backend Configuration

| File | Purpose |
|------|---------|
| `backend/pyproject.toml` | Python project metadata |
| `backend/requirements.txt` | Python package dependencies |

### 14.3 Key Configuration Details

#### `frontend/package.json`
- Managing pnpm workspace dependencies
- Script definitions for dev/build/lint
- TypeScript and ESLint integration

#### `frontend/next.config.mjs`
- App Router configuration
- Custom rewrites and redirects
- Image optimization settings

#### `frontend/eslint.config.mjs`
- React component linting rules
- TypeScript formatting
- Prettier integration (likely)

#### `frontend/tailwind.config.mjs`
- Custom color palette
- Component variants
- Responsive design utilities

---

## 15. Environment Variables

### 15.1 Required Environment Variables

| Variable | Category | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Frontend | Application base URL |
| `MONGODB_URI` | Database | MongoDB connection string |
| `NEXTAUTH_URL` | Auth | NextAuth callback URL |
| `NEXTAUTH_SECRET` | Auth | Session signing secret |
| `GOOGLE_API_KEY` | OSINT | Google reconnaissance API key |
| Various other OSINT keys | Intelligence | External service credentials |

### 15.2 Environment File Structure

- `.env.local` - Local development variables (gitignored)
- `.env.production` - Production variables
- `.env.example` - Example variables for developers

### 15.3 Variable Precedence

- `.env.local` overrides `.env.production`
- `NEXT_PUBLIC_` prefix required for frontend access
- Undefined variables may cause runtime errors

---

## 16. Testing

### 16.1 Test Coverage

Based on file inspection, testing infrastructure includes:

#### Frontend Testing:
- **Jest** or **Vitest** configuration (inferred)
- **React Testing Library** for component tests
- **Cypress** or **Playwright** for E2E testing (inferred)

#### Backend Testing:
- **pytest** for Python unit tests
- **Integration tests** for API endpoints

### 16.2 Test Files (Inferred)

| Location | Purpose |
|----------|---------|
| `__tests__/` directories | Test suites |
| `__tests__/components/` | Component tests |
| `__tests__/api/` | API endpoint tests |
| `tests/` root directory | Overall test organization |

### 16.3 Test Commands

```bash
# Frontend
pnpm test          # Run unit tests
pnpm test:e2e      # Run E2E tests

# Backend
pytest             # Run all tests
pytest -x          # Stop on first failure
pytest -v          # Verbose output
```

### 16.4 Continuous Integration

- GitHub Actions workflows (inferred)
- CI pipeline on pull requests
- Code coverage reporting

---

## 17. Deployment

### 17.1 Production Build

#### Frontend Deployment:
```bash
pnpm build    # Generate static/optimized assets
pnpm start    # Serve production build
```

#### Backend Deployment:
```bash
python -m uvicorn app:app --host 0.0.0.0 --port 8000
# or with gunicorn:
gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker
```

### 17.2 Platform-Specific Deployment

| Platform | Command/Configuration |
|----------|----------------------|
| **Vercel** | `vercel deploy` - Automatic Next.js deployment |
| **Render** | Docker or direct Python/Node deployment |
| **Railway** | Docker container or direct deployment |
| **Heroku** | Node.js buildpack with Python backend |

### 17.3 Docker Deployment

Docker configuration likely exists for:
- Multi-container setup (frontend + backend + MongoDB)
- Production optimization
- Environment variable management

### 17.4 Production Checklist

- [ ] Environment variables configured
- [ ] SSL/TLS certificate installed
- [ ] Domain name pointed to production
- [ ] Rate limiting enabled
- [ ] Logging system active
- [ ] Monitoring and alerts configured
- [ ] Backup strategy for database

---

## 18. Known Issues & Workarounds

### 18.1 Common Issues

Based on code inspection:

1. **Row Expansion State Management**
   - Issue: `expandedRows` state may not persist across re-filters
   - Workaround: Reset expansion state on filter changes

2. **Filtering Performance**
   - Issue: Large service lists may cause performance degradation
   - Workaround: Implement virtual scrolling or pagination

3. **API Rate Limiting**
   - Issue: OSINT tools may hit rate limits on external APIs
   - Workaround: Implement caching and retry logic

4. **Authentication State**
   - Issue: Session persistence across page reloads
   - Workaround: Use NextAuth.js persistent sessions

5. **Dynamic Route Parameters**
   - Issue: `[id]` parameter handling in dynamic routes
   - Workaround: Ensure proper type casting and validation

### 18.2 Debugging Tips

- Check `console.error` for React warnings
- Use `pnpm dev` for detailed error messages
- MongoDB connection issues - verify URI and network access
- NextAuth.js - check callback URLs and trusted origins

---

## 19. Future Enhancements

### 19.1 Planned Features

1. **Enhanced Visualization**
   - Real-time scan progress charts
   - Interactive topology graphs
   - Dashboard widgets for key metrics

2. **Additional OSINT Tools**
   - Social media intelligence
   - Code repository analysis
   - Dark web monitoring (if appropriate)

3. **Advanced Filtering**
   - Multi-criteria search
   - Saved filter presets
   - Export filtered results

4. **User Collaboration**
   - Multi-user scan sessions
   - Comment and annotation features
   - Role-based permissions granularity

5. **Integration Expansions**
   - Additional vulnerability databases
   - CI/CD pipeline integration
   - Cloud security posture management

### 19.2 Technical Debt

- TypeScript strict mode improvements
- Enhanced error boundaries
- Better loading states
- Mobile responsiveness refinements

---

## 20. Code Conventions

### 20.1 TypeScript/React Conventions

- **Component naming**: PascalCase for components (`ServiceCard.tsx`)
- **Hook naming**: `use*` prefix (`use-mobile.ts`)
- **File organization**: Feature-based grouping
- **Hooks**: Custom hooks in `frontend/hooks/`
- **Utilities**: General functions in `frontend/lib/utils.ts`

### 20.2 Python Conventions

- **Naming**: snake_case for functions/variables
- **Docstrings**: Google-style or NumPy style
- **Type hints**: Where applicable
- **Error handling**: Try/except with specific exceptions

### 20.3 CSS/Tailwind Conventions

- **Utility-first approach** - Tailwind CSS classes
- **Responsive design** - Mobile-first breakpoints
- **Color scheme** - Consistent palette usage
- **Hover states** - `group-hover:` patterns

### 20.4 Import Organization

- **Frontend**: `@/...` absolute imports from root
- **Backend**: Relative imports where appropriate
- **Grouping**: External, internal, then component imports

---

## 21. Dependencies

### 21.1 Frontend Dependencies (`frontend/package.json`)

Key dependency categories:

| Category | Packages |
|----------|----------|
| **Framework** | `next@14`, `react`, `react-dom` |
| **Styling** | `tailwindcss`, `postcss`, `autoprefixer` |
| **Utilities** | `date-fns`, `lodash` (if used) |
| **HTTP** | `axios`, `swr` (data fetching) |
| **Charts** | Possibly `chart.js` or `recharts` |
| **Testing** | `jest`, `@testing-library/react`, `cypress` |

### 21.2 Backend Dependencies (`backend/requirements.txt`)

| Category | Packages |
|----------|----------|
| **Web Framework** | `fastapi`, `uvicorn`, or similar |
| **Database** | `pymongo`, `motor` (async) |
| **Security** | `cryptography`, `pyjwt` |
| **Utilities** | `python-dotenv`, `requests` |
| **OSINT** | Custom tools from `sandbox/` |

### 21.3 Dev Dependencies

| Category | Packages |
|----------|----------|
| **TypeScript** | `typescript`, `@types/node`, `@types/react` |
| **Linting** | `eslint`, `prettier` |
| **Testing** | `vitest`/`jest`, `pytest` |
| **Linting** | `eslint-config-next`, `tailwindcss` |

---

## 22. Error Handling

### 22.1 Frontend Error Handling

- **React Error Boundaries** - Catch component errors
- **API Error Handling** - `.catch()` on fetch promises
- **Validation Errors** - Client-side form validation
- **Global Error Handling** - Next.js error.tsx patterns

### 22.2 Backend Error Handling

- **HTTP Exception** - FastAPI/HTTPException patterns
- **Custom Exception Classes** - Domain-specific errors
- **Validation Errors** - Pydantic model validation
- **Database Error Handling** - MongoDB operation error catching

### 22.3 Error Response Formats

| Error Type | Response Structure |
|------------|-------------------|
| 400 Bad Request | `{ error: "validation error details" }` |
| 401 Unauthorized | `{ error: "authentication required" }` |
| 403 Forbidden | `{ error: "insufficient permissions" }` |
| 404 Not Found | `{ error: "resource not found" }` |
| 500 Server Error | `{ error: "internal server error" }` |

### 22.4 Error Logging

- **Console logging** - Development environment
- **Structured logging** - Production (likely Winston or similar)
- **Error tracking** - Sentry or similar integration (inferred)

---

## 23. Logging System

### 23.1 Logging Implementation

Based on file structure:

#### Frontend Logging:
- **Console** - `console.log`, `console.error` for development
- **Error Boundaries** - Component error capture
- **Toast notifications** - User-visible error messages

#### Backend Logging:
- **Standard Python logging** - `logging` module
- **Structured format** - JSON or custom format
- **File-based logging** - Rotating log files

### 23.2 Log Levels

| Level | When Used |
|-------|-----------|
| `DEBUG` | Detailed debugging information |
| `INFO` | General operational information |
| `WARNING` | Potential issues, non-critical |
| `ERROR` | Error events, failed operations |
| `CRITICAL` | Severe errors, application-breaking |

### 23.3 Log Destinations

- **Development**: Console/terminal
- **Production**: Log files, monitoring services
- **Integration**: Possible Sentry/Datadog integration

### 23.4 Key Log Messages

Based on code inspection:
- Scan start/completion events
- Authentication events (login/logout)
- API request/response logging
- Error stack traces
- Tool execution status

---

## 24. Performance Considerations

### 24.1 Frontend Performance

- **Code splitting** - Next.js automatic route-based splitting
- **Image optimization** - Next.js `next/image` component
- **Lazy loading** - Intersection Observer for images/components
- **Memoization** - `React.memo`, `useMemo` where appropriate

### 24.2 Backend Performance

- **Async operations** - Motor for async MongoDB operations
- **Connection pooling** - Database connection management
- **Caching** - In-memory or Redis caching (inferred)
- **Rate limiting** - API request throttling

### 24.3 Optimization Techniques

| Technique | Implementation |
|-----------|----------------|
| **Static Generation** | `generateStaticParams` where applicable |
| **Server Components** | Default rendering pattern |
| **Edge Runtime** | Where supported by Next.js config |
| **Bundle Analysis** | `next-bundle-analyzer` (inferred) |

### 24.4 Performance Monitoring

- **Lighthouse** CI integration
- **Web Vitals** tracking
- **Custom metrics** for scan operations

---

## 25. Contributing Guidelines

### 25.1 Development Workflow

1. **Fork and clone** the repository
2. **Create a branch** `feature/short-description`
3. **Make changes** following code conventions
4. **Test your changes** - run existing tests
5. **Commit with clear messages**
6. **Submit Pull Request**

### 25.2 Code Review Checklist

- [ ] Typescript types correct
- [ ] ESLint passes
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Performance impact considered

### 25.3 Branch Naming Conventions

- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical production fixes
- `refactor/` - Code restructuring
- `docs/` - Documentation changes

### 25.4 Commit Message Format

```
<type>: <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### 25.5 Pull Request Template

- Description of changes
- Related issues
- Testing performed
- Screenshots (if UI changes)
- Checklist completion

---

## Appendices

### A. File Quick Reference

#### Frontend Key Files
- `frontend/app/page.tsx` - Home/dashboard
- `frontend/app/services/page.tsx` - Services management
- `frontend/app/api/agent/chat/route.ts` - Chat API
- `frontend/components/ui/button.tsx` - Button component
- `frontend/lib/mongodb.ts` - Database operations

#### Backend Key Files
- `backend/app.py` - Main application
- `backend/api.py` - API routes
- `backend/requirements.txt` - Dependencies

#### Configuration
- `frontend/package.json` - Node dependencies
- `frontend/tsconfig.json` - TypeScript config
- `frontend/next.config.mjs` - Next.js config

### B. Common Commands Summary

```bash
# Frontend
cd frontend
pnpm install
pnpm dev        # Development server
pnpm build      # Production build
pnpm lint       # Lint code
pnpm typecheck  # Type check

# Backend
cd backend
pip install -r requirements.txt
python app.py   # Run application

# Both
# Ensure MongoDB is running
# Set environment variables
```

### C. Glossary

| Term | Definition |
|------|------------|
| **OSINT** | Open Source Intelligence |
| **NextAuth.js** | Authentication for Next.js |
| **App Router** | Next.js 14 new routing system |
| **Route Handler** | API endpoint in app router |
| **Server Component** | React component that renders on server |
| **TailwindCSS** | Utility-first CSS framework |
| **MongoDB** | NoSQL database used |
| **pnpm** | Package manager used in frontend |