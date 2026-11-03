# CHANGELOG.md

All notable changes and architectural redesign notes for **OmniSync Social** (formerly PostPulse) are documented here.

---

## [Presentation & Feature Expansion v4.3.0] – 2026-11-03

### 1. Presentation & Multi-Theme Architecture
- **Interactive Multi-Theme Switcher (`ThemeProvider`)**:
  - **🌸 Playful Pastel Studio**: Airy lilac wash (`#FAF5FF`), soft peach, mint, and blush accents with deep ink violet typography.
  - **💼 Clean Studio Light**: Ultra-clean executive monochrome slate and snow white for corporate evaluations.
  - **🌌 Obsidian Dark Glass**: Deep slate (`#090D16`), glowing accents, and dark surfaces with WCAG AA compliance.
- **Stage Presentation Mode**: Added one-click fullscreen stage mode (`isPresentationMode`) to hide navigation distractions for live demos, viva presentations, and client reviews.

### 2. High-Impact Feature Enhancements (100% Backward Compatible)
- **AI Tone Rewriter & Hook Generator Toolbar**:
  - Instant caption refinement with 3 stylistic formulas: *Engaging/Viral*, *Executive Leadership*, and *Punchy/Direct*.
- **Audience Peak Hours / Optimal Timing Intelligence**:
  - Analyzes per-channel engagement windows (X: 1:30 PM, IG: 6:45 PM, LinkedIn: 8:45 AM) with 1-click auto-scheduling to the predicted peak.
- **Interactive Device Mockup Switcher**:
  - Real-time toggle in `OmniChannelPreview` between **Mobile Phone Frame (iPhone Pro)** and **Desktop Browser Viewport**.
- **Industry Template Presets Library**:
  - 1-Click insertion of ready-made templates (*Product Launch*, *Growth Milestone*, *Tech Architecture*, *Webinar Invitation*).
- **Calendar Queue JSON/CSV Exporter**:
  - Instant client-side download of scheduled events queue as a structured report.
- **API Quota & Rate Limit Diagnostics**:
  - Live API rate consumption progress bars on connected channel cards, plus an interactive "Ping API" latency check.
- **Channel Focus Dashboard Filter**:
  - Filter operational KPIs and scheduled posts by target network (All, X, Instagram, LinkedIn, Facebook, YouTube).
- **Drafts Vault Tag Filters**:
  - Quick-filter drafts by tags (`#Roadmap`, `#CaseStudy`, `#Culture`).
- **Cross-Network Growth Forecaster**:
  - Audience reach projection model based on historical click-through rates and weekly posting cadence.

---

## [Rebrand & Redesign v4.2.0] – 2026-11-03

### 1. Rebranding & Identity
- **New Name**: **OmniSync Social** (Short: *OmniSync*).
- **New Tagline**: *"Precision Multi-Channel Social Orchestration & Content Intelligence"*.
- **Application Metadata & Page Head**:
  - Synchronized `<title>`, `<meta name="description">`, `og:title`, and `og:description` in `/index.html`.
  - Updated `/metadata.json` with new name and description.
  - Updated `package.json` package name to `omnisync-social`.
  - Updated `/README.md` and server logging tags to `[OmniSync]`.

### 2. UI/UX Redesign – Playful Pastel Studio Theme
- **Centralized Design System Tokens** (`src/theme/tokens.ts`):
  - Theme: Modern Minimalist Neo-Pastel.
  - Palette: Soft pastel lilac canvas (`#FAF5FF`), crisp white cards with pastel borders (`#F3E8FF`), and deep ink-violet typography (`#1E1B4B`) achieving WCAG AAA contrast.
  - Accent Tints: Violet (`#8B5CF6`), Cyan (`#06B6D4`), Mint (`#10B981`), Blush (`#F472B6`), Sunflower (`#F59E0B`).
  - Strict Typography Pairings: `Plus Jakarta Sans` for clean structural display and navigation, `JetBrains Mono` with `tabular-nums` for all telemetry, timestamps, offsets, and character meters.
- **Component Restructuring & Visual Polish**:
  - `src/components/layout/NavigationSidebar.tsx`: Redesigned collapsible sidebar with brand gradient icon, accessible role indicator, and quick Kafka/Redis broker launcher.
  - `src/components/layout/AppHeader.tsx`: Clean 3-zone header following the constitution (single-line wordmark, search & live status pulse, notification dropdown with unread badge, and primary "Create Post" action).
  - `src/components/dashboard/`:
    - `MetricCardsGrid.tsx`: 8 distinct pastel-tinted KPI cards with bold tabular figures and status icons.
    - `PerformanceChartSuite.tsx`: SVG area chart with soft violet gradient wash, channel performance bars, and weekly publication distribution.
    - `ScheduledQueuePanel.tsx`: Polished release queue with instant "Publish Now" button.
    - `SystemActivityStream.tsx`: Audit stream with correlation ID tags and action badges.
    - `OverviewDashboard.tsx`: Hero pastel gradient banner with Redis cache indicators.
  - `src/components/composer/`:
    - `OmniComposer.tsx`: Full-featured authoring studio with debounced autosave (2.5s) to PostgreSQL, schedule modal, and instant syndication.
    - `PlatformMatrixSelector.tsx`: Multi-channel selection buttons with per-channel character limits.
    - `CharacterMeter.tsx`: Circular countdown meter with warning thresholds.
    - `MediaVaultUploader.tsx`: Attached assets preview with quick sample asset picker drawer and custom upload.
    - `HashtagManager.tsx`: Interactive chips with quick suggested hashtags.
    - `OmniChannelPreview.tsx`: Real-time device previews for X, Instagram, LinkedIn, Facebook, and YouTube.
  - `src/components/calendar/UnifiedContentCalendar.tsx`:
    - Month, Week, Day, and Agenda List views.
    - HTML5 Drag-and-drop rescheduling across calendar dates.
    - Timezone conversion selector (UTC, EST, GMT, IST, JST).
    - Event inspector drawer with "Publish Now", "Reschedule", and "Cancel Schedule".
  - `src/components/drafts/DraftsVault.tsx`:
    - Responsive card grid with keyword/tag search, platform filter, and sorting.
    - Duplicate draft and permanent delete with confirmation modal.
  - `src/components/platforms/ConnectedChannelsHub.tsx`:
    - Displays connected channels with follower metrics and status.
    - Zero-Knowledge Credential Security Model banner.
    - Simulated OAuth 2.0 connection modal and disconnect action.
  - `src/components/analytics/AnalyticsStudio.tsx`:
    - Date range filter (7d, 30d, 90d, 1y).
    - Redis Cache Layer telemetry banner with hit rate, active keys, and "Flush Cache" trigger.
    - Cross-channel breakdown table with tabular numbers.
    - Top publications showcase cards.
  - `src/components/users/TeamAccessDirectory.tsx`:
    - RBAC Privilege Hierarchy matrix (ADMIN, MANAGER, EDITOR, VIEWER).
    - Team directory with active status and role dropdown (secured to ADMIN accounts).
    - Invite member modal.
  - `src/components/users/ForensicAuditInspector.tsx`:
    - Searchable immutable audit trail with correlation IDs and IP traceability.
  - `src/components/kafka/EventStreamConsole.tsx`:
    - Live Apache Kafka broker inspector with topic switcher, partition/offset logs, JSON payload viewer, and Dead Letter Queue (DLQ) replay execution.
  - `src/components/auth/SessionAuthModal.tsx`:
    - Sign in / Sign up with JWT Bearer tokens.
    - 1-Click Role Switcher buttons for testing (ADMIN, MANAGER, EDITOR, VIEWER).
  - `src/components/common/Badges.tsx`:
    - Zero-pill compliance: unboxed clean text metadata with subtle color dots, no garish pill sandwiches.
  - `src/components/common/ToastCenter.tsx`:
    - Accessible toast notification feedback.

---

## Confirmation of Hard Constraints & Backend Behavior

- **Backend API Routes**: 100% untouched. All 24 endpoints (`/api/auth/*`, `/api/posts/*`, `/api/drafts/*`, `/api/calendar/*`, `/api/platforms/*`, `/api/analytics/*`, `/api/users/*`, `/api/kafka/*`, `/api/health`) retain identical request/response contracts.
- **Business Logic & Validation**: All platform rules (e.g. 280-char limit on X, image requirement on Instagram, 63,206-char limit on Facebook) and RBAC role restrictions are strictly preserved.
- **Database Schema**: PostgreSQL 16 schema and in-memory model definitions remain unaltered.
- **Kafka & Redis Caching**: Partitioning, deduplication keys, DLQ routing, retry backoff, and `@Cacheable`/`@CacheEvict` logic are fully active.
- **Authentication**: Stateless JWT access and refresh token flow preserved, with backward-compatible local storage handling.
