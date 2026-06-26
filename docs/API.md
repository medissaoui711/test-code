# 🔌 API Documentation

> **Note:** TestPilot is currently functioning as a Client-Side Single Page Application (SPA) utilizing an anonymous-first, browser-isolated architecture. The analysis algorithms are currently simulated client-side for the Beta phase.

When moving to a full-stack production architecture, the following API contract will be implemented.

## Authentication & Sessions

TestPilot uses stateless anonymous sessions. The client generates a Session ID and passes it via headers to ensure isolated temporary processing.

**Header Requirement:**

```http
X-Session-ID: <cryptographic-uuid>
```

---

## Endpoints (Proposed Backend Implementation)

### 1. `POST /api/scan/url`

Initiates an automated security and quality scan of a public Git repository.

**Request:**

```json
{
  "repositoryUrl": "https://github.com/user/project",
  "branch": "main" // Optional
}
```

**Response (202 Accepted):**

```json
{
  "jobId": "scn_987654321",
  "status": "pending",
  "message": "Scan initiated successfully."
}
```

### 2. `POST /api/scan/private`

Initiates a scan of a private GitHub repository.

**Request:**

```json
{
  "repositoryUrl": "https://github.com/user/private-project",
  "branch": "main", // Optional
  "token": "github_pat_11A..." // Ephemeral read-only PAT or GitHub App context
}
```

_Note: The `token` is used immediately to clone the repository into volatile memory and is never stored permanently._

**Response (202 Accepted):**

```json
{
  "jobId": "scn_112233445",
  "status": "pending",
  "message": "Scan initiated successfully."
}
```

### 3. `POST /api/scan/upload`

Uploads a ZIP archive for automated analysis. This endpoint requires `multipart/form-data`.

**Request:**

- `file`: (binary ZIP payload) maximum 50MB.

**Response (202 Accepted):**

```json
{
  "jobId": "scn_123456789",
  "status": "pending",
  "message": "File uploaded and scan initiated."
}
```

### 3. `GET /api/scan/status/:jobId`

Polls the status of an ongoing scan.

**Response (200 OK):**

```json
{
  "jobId": "scn_123456789",
  "status": "completed", // "pending", "processing", "completed", "failed"
  "progress": 100,
  "reportId": "rep_abc123" // Included if status === "completed"
}
```

### 4. `GET /api/reports/:reportId`

Retrieves the structured analysis report. **Requires the `X-Session-ID` header matching the creator of the report.**

**Response (200 OK):**

```json
{
  "id": "rep_abc123",
  "url": "my-uploaded-project.zip",
  "date": "2026-06-26T14:00:00Z",
  "scores": {
    "security": 85,
    "architecture": 90,
    "codeQuality": 75,
    "dependencies": 88
  },
  "issues": [
    {
      "id": "iss_001",
      "title": "Hardcoded API Key",
      "severity": "Critical",
      "category": "Security",
      "description": "Found potential API key in src/config.ts",
      "file": "src/config.ts",
      "line": 42
    }
  ],
  "overview": {
    "projectType": "React SPA",
    "fileCount": 120,
    "linesOfCode": 4500,
    "languages": ["TypeScript", "HTML", "CSS"]
  },
  "missingParts": ["No unit tests detected."],
  "plan": {
    "fixNow": ["Remove hardcoded API Key"],
    "next": ["Add Error Boundaries"],
    "later": ["Refactor large components"]
  }
}
```

## Data Lifecycle & Cleanup

- Processing artifacts (ZIP files, cloned repos) are deleted from the server immediately after report generation.
- The generated reports (`/api/reports`) are cached in Redis/Memory associated with the `X-Session-ID`.
- A background worker purges all reports and artifacts older than 24 hours.
