# ARCHITECTURE_NOTES.md

## 1. Project Overview & Tech Stack
The project is **PostPulse** (being rebranded to **OmniSync**), an enterprise-grade multi-platform social media management and syndication system designed to schedule, validate, preview, and syndicate content across five major social platforms: **X (Twitter)**, **Instagram**, **Facebook**, **LinkedIn**, and **YouTube**.

### Tech Stack:
- **Frontend SPA**:
  - React 19 (`react`, `react-dom`)
  - TypeScript 5.8+ (`typescript`)
  - Redux Toolkit (`@reduxjs/toolkit`, `react-redux`) with 8 domain slices
  - Styling: Tailwind CSS v4 (`@tailwindcss/vite`, `tailwindcss`), Plus Jakarta Sans, JetBrains Mono
  - Icons: Lucide React (`lucide-react`)
  - Motion: Motion (`motion`)
  - HTTP Client: Axios (`axios`) with JWT Bearer interceptor, automatic token refresh queue, and `X-Correlation-Id` propagation
  - Build Tool: Vite 8 (`vite`, `@vitejs/plugin-react`)
- **Backend API & Execution Engine**:
  - Full-Stack Express Server (`server.ts`, Node.js with `tsx`) hosting the REST API matching Spring Boot specifications
  - Native Spring Boot 3.3.4 Java Backend (`backend/`) with Spring Data JPA, Spring Security 6, Spring Kafka, and Redis Cache
  - Persistence: PostgreSQL 16 (Flyway migrations `V1__init_schema.sql`, `V2__seed_data.sql`), In-Memory DB fallback (`server/db.ts`)
  - Cache: Redis 7 (`server/cache.ts` with `@Cacheable` and `@CacheEvict` simulation)
  - Message Broker: Apache Kafka 3.x simulator (`server/kafkaSimulator.ts`) with topic partitioning, idempotency checks, exponential backoff, and Dead Letter Queue (DLQ)
  - Security & Cryptography: PBKDF2/BCrypt password hashing, stateless HMAC-SHA256 JWT access & refresh tokens, AES-256-GCM authenticated encryption for third-party OAuth access credentials
- **DevOps & Infrastructure**:
  - Multi-container Docker Compose (`docker-compose.yml`) running Postgres, Redis, Kafka, Zookeeper, Backend Stable (90%), Backend Canary (10%), Frontend, and Nginx Gateway
  - Nginx canary traffic split configuration (`deploy/nginx/canary.conf`) and management scripts (`deploy/scripts/`)
  - GitHub Actions CI/CD workflows (`.github/workflows/ci.yml`, `.github/workflows/cd.yml`)

---

## 2. Directory & Folder Structure

```
/
├── .github/workflows/          # CI/CD pipelines (ci.yml, cd.yml)
├── backend/                    # Spring Boot 3.3.4 Java enterprise backend
│   ├── src/main/java/com/postpulse/
│   │   ├── cache/              # RedisCacheConfig
│   │   ├── controller/         # PostController, AnalyticsController, etc.
│   │   ├── entity/             # Post, User, SocialPlatform JPA entities
│   │   ├── event/              # Kafka producer, consumer, DLQ handlers
│   │   ├── exception/          # GlobalExceptionHandler, ApiErrorResponse
│   │   └── security/           # JwtTokenProvider, SecurityConfig, Filters
│   └── src/main/resources/     # application.yml, db/migration (Flyway V1, V2)
├── deploy/                     # Infrastructure & Canary deployment scripts
│   ├── nginx/canary.conf       # Upstream traffic split (90% stable / 10% canary)
│   └── scripts/                # canary-promote.sh, canary-rollback.sh, etc.
├── server/                     # Full-stack Node.js / Express backend services
│   ├── cache.ts                # In-memory Redis cache simulator
│   ├── db.ts                   # In-memory database with pre-seeded data & audit logger
│   ├── kafkaSimulator.ts       # Kafka broker simulator (partitioning, DLQ, replay)
│   ├── middleware.ts           # Correlation ID, JWT auth, RBAC authorization, error handling
│   ├── security.ts             # Password hash/verify, AES-256-GCM, JWT generation/verification
│   ├── types.ts                # TypeScript types & DTO definitions
│   └── routes/                 # Express API routes
│       ├── analytics.routes.ts # Analytics & performance endpoints
│       ├── auth.routes.ts      # Auth (register, login, refresh, logout, me)
│       ├── calendar.routes.ts  # Calendar view & scheduling endpoints
│       ├── drafts.routes.ts    # Draft management endpoints
│       ├── kafka.routes.ts     # Kafka event stream & DLQ replay endpoints
│       ├── platforms.routes.ts # Connected accounts & OAuth credential management
│       ├── posts.routes.ts     # Post CRUD, publish simulation & pagination
│       └── users.routes.ts     # Team users, RBAC roles, audit logs, notifications
├── src/                        # React 19 Frontend
│   ├── App.tsx                 # Main layout & tab router
│   ├── index.css               # Tailwind CSS setup & fonts
│   ├── main.tsx                # React root mount
│   ├── components/             # UI components organized by module
│   │   ├── auth/               # AuthModal with 1-click role switcher
│   │   ├── calendar/           # ContentCalendar (Month, Week, Day, List views, drag & drop)
│   │   ├── common/             # Badges, ToastContainer
│   │   ├── composer/           # PostComposer, PlatformSelector, Previews, Counter, Media
│   │   ├── dashboard/          # DashboardView, StatCards, Charts, UpcomingQueue, RecentActivity
│   │   ├── drafts/             # DraftManagement, filters, cards, duplicate, delete
│   │   ├── kafka/              # KafkaInspectorModal (Broker logs, partitions, DLQ replay)
│   │   ├── layout/             # Sidebar, TopNavbar
│   │   ├── platforms/          # ConnectedAccounts, AES-256-GCM encryption badges
│   │   └── users/              # UserManagement, AuditLogViewer
│   ├── services/api.ts         # Axios client and endpoint definitions
│   ├── store/                  # Redux Toolkit store and 8 slices
│   └── types/index.ts          # Frontend domain models
├── docker-compose.yml          # Microservices orchestration
├── package.json                # Frontend/server package configuration
├── README.md                   # Full documentation & viva guide
├── server.ts                   # Express server entry point mounting Vite middleware
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite build setup
```

---

## 3. Database Models & Entities

1. **User**:
   - `id`: String (e.g., `usr_admin`)
   - `name`: String
   - `email`: String (unique)
   - `passwordHash`: String (PBKDF2/BCrypt hash with salt)
   - `role`: Enum (`ADMIN` | `MANAGER` | `EDITOR` | `VIEWER`)
   - `department`: String
   - `avatarUrl`: String
   - `isActive`: Boolean
   - `createdAt`, `updatedAt`: ISO Timestamps

2. **SocialPlatformConfig**:
   - `id`: `twitter` | `instagram` | `facebook` | `linkedin` | `youtube`
   - `name`: Display name
   - `icon`: Icon identifier
   - `color`: Brand color hex
   - `characterLimit`: Strict char length (e.g. 280 for X, 2200 for Instagram, 63206 for Facebook)
   - `maxMediaCount`: Maximum allowed media items
   - `mediaRequired`: Boolean (true for Instagram)
   - `maxHashtags`: Max hashtag count
   - `supportsLinks`: Boolean (false for Instagram feed)
   - `linkCountsAgainstLength`: Boolean
   - `allowedMediaTypes`: Array of `image` | `video` | `gif`

3. **ConnectedAccount**:
   - `id`: String (e.g., `acc_x`)
   - `platformId`: `SocialPlatformId`
   - `accountName`: String
   - `handle`: String
   - `avatarUrl`: String
   - `connectedAt`: ISO Timestamp
   - `encryptedCredentialBlob`: AES-256-GCM encrypted token string (never exposed to client)
   - `authStatus`: `CONNECTED` | `EXPIRING_SOON` | `ERROR`
   - `followersCount`: Number

4. **Post**:
   - `id`: String (e.g., `post_101`)
   - `content`: Text
   - `platforms`: Array of `SocialPlatformId`
   - `media`: Array of `MediaAsset` (`id`, `url`, `type`, `name`, `sizeBytes`, `dimensions`)
   - `hashtags`: Array of strings
   - `links`: Array of URL strings
   - `status`: `DRAFT` | `SCHEDULED` | `PUBLISHED` | `FAILED` | `CANCELLED`
   - `scheduledTime`: ISO Timestamp (optional)
   - `publishedTime`: ISO Timestamp (optional)
   - `authorId`, `authorName`: Author info
   - `publishResult`: Per-platform success/failure and external IDs
   - `analytics`: `{ likes, shares, comments, clicks, impressions }`
   - `createdAt`, `updatedAt`: ISO Timestamps

5. **Draft**:
   - `id`, `content`, `platforms`, `media`, `hashtags`, `links`, `tags`, `authorId`, `authorName`, `createdAt`, `updatedAt`

6. **AuditLog**:
   - `id`, `timestamp`, `userId`, `userEmail`, `action`, `targetEntity`, `entityId`, `details`, `correlationId`, `ipAddress`

7. **NotificationItem**:
   - `id`, `title`, `message`, `type` (`INFO` | `SUCCESS` | `WARNING` | `ERROR`), `read`, `createdAt`, `link`

8. **KafkaMessage**:
   - `eventId`, `topic` (`post-scheduled` | `post-published` | `post-failed` | `post-notifications` | `post-dlq`), `partition` (0–2), `offset`, `timestamp`, `key` (`postId`), `payload`, `correlationId`, `attempts`, `status` (`PENDING` | `PROCESSED` | `FAILED` | `ROUTED_TO_DLQ`)

---

## 4. Authentication & Authorization Flow
- **Authentication**:
  - Stateless JSON Web Token (JWT) architecture.
  - User submits credentials (`email`, `password`) to `POST /api/auth/login`.
  - Passwords are verified against stored salt/hash with timing-safe comparison.
  - Server issues signed HMAC-SHA256 `accessToken` (1 hour expiry) and an encrypted random `refreshToken` (7 days expiry).
  - Client stores tokens in `localStorage` and automatically attaches `Authorization: Bearer <accessToken>` to all outgoing requests.
  - When a 401 error occurs, Axios response interceptor uses `POST /api/auth/refresh` with queueing to seamlessly refresh the access token without user disruption.
- **Authorization (RBAC Matrix)**:
  - `ADMIN`: Unrestricted access. Can invite/modify team roles, manage accounts, clear cache, view all logs, and replay Kafka Dead Letter Queue (DLQ) messages.
  - `MANAGER`: Can invite operators, manage connected accounts, create/edit/schedule/publish posts, view analytics and audit logs.
  - `EDITOR`: Can create/edit/schedule posts, save drafts, publish instantly. Cannot modify team roles, disconnect accounts, or access DLQ replay.
  - `VIEWER`: Read-only access to operational dashboard, calendar, and performance metrics. Cannot create or edit content.
- **Demo Quick Switcher**:
  - Four 1-click evaluation buttons (`ADMIN`, `MANAGER`, `EDITOR`, `VIEWER`) available in the Auth Modal and the sidebar for instant evaluation.

---

## 5. API Endpoints Catalog (Must NOT be modified)

| Group | Method & Route | RBAC Requirement | Description |
|---|---|---|---|
| **Health** | `GET /api/health` | Public | System status, DB, Redis, Kafka readiness |
| **Auth** | `POST /api/auth/login` | Public | Sign in with email/password, issues JWT pair |
| | `POST /api/auth/register` | Public | Sign up with default EDITOR role |
| | `POST /api/auth/refresh` | Public | Refresh expired access token |
| | `POST /api/auth/logout` | Public | Revoke active refresh token |
| | `GET /api/auth/me` | Authenticated | Retrieve authenticated user profile |
| **Posts** | `GET /api/posts` | Authenticated | Paginated posts (page, size, sort, status, platform, search) |
| | `GET /api/posts/:id` | Authenticated | Single post by ID |
| | `POST /api/posts` | ADMIN, MANAGER, EDITOR | Create post (SCHEDULED / PUBLISHED), triggers Kafka & evicts cache |
| | `PUT /api/posts/:id` | ADMIN, MANAGER, EDITOR | Update existing post |
| | `DELETE /api/posts/:id` | ADMIN, MANAGER | Delete post permanently |
| | `POST /api/posts/:id/publish` | ADMIN, MANAGER, EDITOR | Instant syndication execution |
| **Drafts** | `GET /api/drafts` | Authenticated | List drafts (search, platform, sort) |
| | `GET /api/drafts/:id` | Authenticated | Retrieve draft |
| | `POST /api/drafts` | ADMIN, MANAGER, EDITOR | Create or autosave draft |
| | `PUT /api/drafts/:id` | ADMIN, MANAGER, EDITOR | Update draft |
| | `DELETE /api/drafts/:id` | ADMIN, MANAGER, EDITOR | Delete draft |
| | `POST /api/drafts/:id/duplicate` | ADMIN, MANAGER, EDITOR | Duplicate existing draft |
| **Calendar** | `GET /api/calendar` | Authenticated | Calendar event list (startDate, endDate, platform, status) |
| | `POST /api/calendar/schedule` | ADMIN, MANAGER, EDITOR | Schedule post from calendar interface |
| | `PUT /api/calendar/:id` | ADMIN, MANAGER, EDITOR | Reschedule post (drag-and-drop or modal) |
| | `DELETE /api/calendar/:id` | ADMIN, MANAGER | Cancel scheduled post |
| **Platforms** | `GET /api/platforms` | Authenticated | Supported platform configs & connected accounts |
| | `GET /api/platforms/:id` | Authenticated | Single platform details & connected account |
| | `POST /api/platforms/:id/connect` | ADMIN, MANAGER | Connect social channel with AES-256 encrypted credential |
| | `POST /api/platforms/:id/disconnect` | ADMIN, MANAGER | Disconnect platform |
| **Analytics** | `GET /api/analytics/overview` | Authenticated | Cache-accelerated overview metrics & trends |
| | `GET /api/analytics/platforms` | Authenticated | Platform breakdown metrics |
| | `GET /api/analytics/engagement` | Authenticated | Top performing publications |
| **Users** | `GET /api/users` | ADMIN, MANAGER | Team member list |
| | `POST /api/users` | ADMIN, MANAGER | Invite new team member |
| | `GET /api/users/:id` | Authenticated | Get user profile |
| | `PUT /api/users/:id` | ADMIN | Update user role or active status |
| | `GET /api/users/audit-logs` | ADMIN, MANAGER | Security audit logs with correlation IDs |
| | `GET /api/users/notifications` | Authenticated | System notifications |
| | `PUT /api/users/notifications/:id/read` | Authenticated | Mark notification read |
| **Kafka & Cache** | `GET /api/kafka/events` | Authenticated | Query Kafka event stream by topic |
| | `GET /api/kafka/topics` | Authenticated | Topic message counts & partition metadata |
| | `POST /api/kafka/replay/:eventId` | ADMIN | Replay Dead Letter Queue (DLQ) event |
| | `GET /api/kafka/cache/stats` | Authenticated | Redis cache hit/miss statistics |
| | `POST /api/kafka/cache/clear` | ADMIN, MANAGER | Flush cache entries |

---

## 6. User-Facing Pages & Features

1. **Operational Dashboard**:
   - 8 KPI cards: Published Posts, Scheduled Queue, Active Drafts, Failed/Alerts, Connected Accounts, Avg Engagement Rate, Total Impressions, Estimated Reach.
   - SVG Area Chart: Impressions & Audience Growth over time.
   - Platform Performance bar breakdown.
   - Weekly Cadence bar chart: Scheduled vs Published distributions.
   - Upcoming Scheduled Queue card with "Publish Now" shortcut.
   - Recent System Activities card with live audit preview.
2. **Multi-Platform Post Composer**:
   - Multi-channel selector (X, Instagram, Facebook, LinkedIn, YouTube).
   - Real-time character counter per platform with warning rings.
   - Media attachments manager with quick sample asset picker drawer and custom upload.
   - Hashtag manager with quick suggestion chips.
   - Target web links manager.
   - Platform-specific validation banner (e.g. Instagram image requirement, X character limits).
   - Debounced auto-save to drafts (2.5s) with live indicator.
   - Real-time preview panels: Twitter/X tweet card, Instagram feed card, LinkedIn update, Facebook post, YouTube community update.
   - Actions: Save to Drafts, Schedule Post (datetime picker modal), Publish Now.
3. **Interactive Content Calendar**:
   - Multi-view: **Month**, **Week**, **Day**, and **List/Agenda** views.
   - Month grid with previous/next month navigation and "Today" button.
   - HTML5 Drag-and-drop rescheduling across calendar dates.
   - Filters by Social Platform and Post Status.
   - Timezone selector (UTC, EST, GMT, IST, JST).
   - Event inspection drawer/modal with instant "Publish Now", "Reschedule", and "Cancel".
4. **Draft Management**:
   - Grid of draft cards with platform badges, modified timestamp, content preview, and hashtags.
   - Search by keyword/tag and filter by platform.
   - Sorting by Recently Modified, Oldest Modified, Newest Created, Oldest Created.
   - Quick actions: Edit in Composer, Duplicate Draft, Delete Draft (with confirmation modal).
5. **Connected Social Accounts**:
   - Platform connection cards with followers count, handle, and status.
   - Zero-Knowledge Credential Security Model explanation banner.
   - AES-256-GCM authenticated encryption seal badge.
   - Connect modal (simulating OAuth 2.0 flow) and Disconnect action.
6. **Analytics & Performance**:
   - Date range selector (7d, 30d, 90d, 1y).
   - Redis Cache Layer telemetry bar with live hit rate, active keys, and "Flush Cache" trigger.
   - Platform performance table with published count, followers, impressions, reach, and engagement rate.
   - Top-performing publications showcase cards.
7. **Team & RBAC Management**:
   - RBAC Privilege Hierarchy matrix (ADMIN, MANAGER, EDITOR, VIEWER).
   - Team operator directory with active status and role changer dropdown (restricted to ADMIN).
   - Invite Team Member modal with name, email, department, and role assignment.
8. **Forensic Security & Audit Trail**:
   - Real-time search by Correlation ID, action, user email, or entity.
   - Structured table with timestamp, action badge, user email, entity, details, correlation ID, and IP address.
9. **Kafka & Redis Broker Inspector Modal**:
   - Accessible via sidebar or top navbar "Kafka Bus: Active" button.
   - Topic selector (`all`, `post-scheduled`, `post-published`, `post-failed`, `post-notifications`, `post-dlq`).
   - Real-time event log stream with partition, offset, key, and status.
   - Live JSON payload viewer with syntax coloring and correlation ID tracking.
   - Dead Letter Queue (DLQ) replay button to re-enqueue failed events into the consumer pipeline.
10. **Authentication Modal & Role Switcher**:
    - Sign in / Sign up tabbed modal.
    - 1-click role switcher buttons for test evaluators (ADMIN, MANAGER, EDITOR, VIEWER).
