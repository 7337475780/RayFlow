# RayFlow - Contracts Management System

RayFlow is a production-quality Contracts Management System designed for tracking, reviewing, and auditing agreement lifecycles. It features a modern, non-blocking App Router frontend, a Clean Architecture REST API backend, and an optimized PostgreSQL storage engine.

---

## 1. Project Overview & Architecture

The project is structured as a monorepo separated into backend and frontend services:

```
RayFlow/
├── db/                    # Baseline SQL schemas and sample seeds
├── backend/               # Spring Boot 3 & Java 21 API Service
├── frontend/              # Next.js 15 & TypeScript Client App
├── docker-compose.yml     # Orchestration for containerized deployments
├── architecture.md        # Technical analysis document
└── README.md              # Submission guide (this file)
```

### Key Technical Achievements
*   **Database Search Optimizations:** Utilizes the PostgreSQL `pg_trgm` extension GIN index on contract titles to execute fast partial-match searches (`LIKE '%search%'`) in logarithmic time.
*   **URL-Driven Frontend State:** Maps all client-side search terms, status filters, and pagination offsets directly to the URL Query String, making pages fully bookmarkable and history-navigable.
*   **Safe API Parameter Whitelisting:** The backend restricts input sorting to a whitelist of columns to prevent query crashes and SQL injection.
*   **Multi-Stage Docker Pipeline:** Compiles and runs backend services inside Alpine containers, reducing container sizes by over ~70% and enforcing non-root user execution permissions.

---

## 2. Technology Stack

*   **Frontend:** Next.js 15 (TypeScript, App Router, React Server Components)
*   **Backend:** Spring Boot 3.3.0 (Java 21, Spring Data JPA, Jakarta Validation)
*   **Database:** PostgreSQL 16
*   **Migration Engine:** Flyway Database Migrations
*   **API Docs:** Springdoc OpenAPI / Swagger UI
*   **Orchestration:** Docker Compose
*   **Testing:** Jest & React Testing Library (Frontend), JUnit 5, Mockito & MockMvc (Backend)

---

## 3. Quick Start (Docker Compose - Recommended)

Docker Compose builds the Spring Boot app and launches the PostgreSQL container. The database schema and sample seed records are loaded automatically on first boot.

### Prerequisites
*   Ensure [Docker Desktop](https://www.docker.com/products/docker-desktop/) is installed and running.

### Launch Commands
1.  Navigate to the project root directory:
    ```bash
    cd RayFlow
    ```
2.  Duplicate the template environment file and customize your credentials:
    ```bash
    cp .env.example .env
    # Or on Windows CMD: copy .env.example .env
    ```
3.  Build and launch the services in the background:
    ```bash
    docker-compose up --build
    ```
4.  Verify container health statuses. Once the database health checks pass, the Spring Boot backend service starts automatically on port `8080`.

### Exposed Interfaces
*   **Backend REST API:** `http://localhost:8080`
*   **Interactive Swagger Documentation:** `http://localhost:8080/swagger-ui/index.html`
*   **Raw OpenAPI Spec JSON:** `http://localhost:8080/v3/api-docs`

*Note: Since Next.js setup runs locally, continue to the Next.js Quick Start below to launch the dashboard user interface.*

---

## 4. Local Developer Execution (Manual Setup)

To run backend and database services natively on your machine:

### 4.1 Database Setup
1.  Install PostgreSQL and create a database named `rayflow_db`.
2.  Execute the baseline tables configuration from [db/schema.sql](file:///c:/Users/tharu/RayFlow/db/schema.sql).
3.  Inject mock database data from [db/sample_data.sql](file:///c:/Users/tharu/RayFlow/db/sample_data.sql).

### 4.2 Run Backend Service (Spring Boot)
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Compile and start the API server:
    ```bash
    mvn spring-boot:run
    ```
    *(Defaults to `http://localhost:8080`)*

### 4.3 Run Frontend Dashboard (Next.js)
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Next.js local development server:
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:3000` in your browser to access the contracts dashboard.

---

## 5. Running Test Suites

### 5.1 Backend Tests (JUnit 5 & Mockito)
Backend unit tests run in isolation without database dependencies:
```bash
cd backend
mvn test
```

### 5.2 Frontend Tests (Jest & React Testing Library)
Frontend test suites evaluate contract lists, badge configurations, and empty states:
```bash
cd frontend
npm test
```

---

## 6. Assumptions & Architectural Boundaries

1.  **Read-Only Focus:** Authentication mechanisms are mocked for this technical assessment. CORS is configured to allow `*` origins in dev environments to simplify local client consumption.
2.  **Date-Time Precision:** Timestamps are managed as UTC zones (`TIMESTAMPTZ` / `Instant`), and the UI translates values to the local browser timezone.
3.  **Audits Immutability:** Audit records are write-once logs referencing contract IDs via foreign keys with `ON DELETE RESTRICT` constraints to prevent deletion of legal history records.
