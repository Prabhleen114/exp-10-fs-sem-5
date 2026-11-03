# OmniSync Social – Multi-Channel Orchestration System

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev)
[![Kafka](https://img.shields.io/badge/Apache%20Kafka-3.x-black.svg)](https://kafka.apache.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-7-red.svg)](https://redis.io)

**OmniSync Social** is an enterprise-grade multi-channel social media orchestration, analytics, scheduling, and content intelligence platform. It coordinates broadcasts across **X (Twitter)**, **Instagram**, **Facebook**, **LinkedIn**, and **YouTube** with role-based access control (RBAC), Apache Kafka event streaming, AES-256-GCM authenticated credential encryption, and Redis caching.

---

## ⚡ Quick Start: Run on Your PC in 2 Minutes

### Prerequisites
Make sure you have installed on your PC:
- **Node.js**: v18.x or v20.x LTS ([Download Node.js](https://nodejs.org/))
- **npm**: v9.x or higher (included with Node.js)
- *(Optional)* **Docker & Docker Compose** (for multi-container PostgreSQL, Redis, Kafka deployment)

---

### Step-by-Step Installation

#### 1. Extract the Project ZIP
Unzip the downloaded `omnisync-social-project.zip` into a directory on your PC:
```bash
# Example on Linux / macOS
unzip omnisync-social-project.zip -d omnisync-social
cd omnisync-social

# On Windows: Right-click omnisync-social-project.zip -> "Extract All..." -> Open folder in terminal
```

#### 2. Install Dependencies
Open your terminal (Command Prompt, PowerShell, or Bash) inside the project folder:
```bash
npm install
```

#### 3. Start the Full-Stack Application
Run the integrated full-stack server (runs Express API with live Vite frontend):
```bash
npm run dev
```

#### 4. Open in Your Web Browser
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🔑 Demo Evaluation Logins

You can log in or use the **1-Click Role Switcher** buttons in the UI:

| Role | Email Address | Password | Permissions |
|---|---|---|---|
| **ADMIN** | `admin@postpulse.io` | `Pulse123!` | Full system access: alter roles, manage accounts, replay DLQ Kafka, flush Redis |
| **MANAGER** | `manager@postpulse.io` | `Pulse123!` | Campaign manager: invite members, schedule posts, manage accounts, view analytics |
| **EDITOR** | `editor@postpulse.io` | `Pulse123!` | Content creator: compose posts, edit, schedule, save drafts, publish |
| **VIEWER** | `viewer@postpulse.io` | `Pulse123!` | Read-only auditor: view dashboard, inspect calendar, review analytics |

*(Note: In the login modal and sidebar, click any role button to log in instantly without typing).*

---

## 🛠️ Available npm Commands

| Command | Description |
|---|---|
| `npm run dev` | Starts the full-stack development server on port 3000 (`tsx server.ts` with Vite middlewares) |
| `npm run build` | Compiles the production React 19 bundle into `dist/` |
| `npm run start` | Launches the production server hosting static assets and REST API |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |
| `npx vitest run` | Executes the unit and integration test suite |

---

## 🐳 Optional: Run with Docker Compose

If you have Docker Desktop installed, you can boot the complete distributed architecture (PostgreSQL 16, Redis 7, Apache Kafka, Zookeeper, Stable Backend, Canary Backend, and Nginx Gateway):

```bash
# Build and run all microservices in background
docker compose up --build -d

# Check running status
docker compose ps

# Access via Nginx Gateway
http://localhost:80
```

---

## 🌟 Key Application Features

1. **Multi-Channel Post Studio (`OmniComposer`)**:
   - Simultaneous authoring for X, Instagram, Facebook, LinkedIn, and YouTube.
   - Real-time character meters with warning thresholds.
   - **AI Hook & Tone Rewriter**: 1-click tone presets (*Engaging/Viral*, *Executive*, *Punchy*).
   - **Audience Peak Hours Assistant**: Automatically sets post time to the predicted peak engagement window.
   - **Interactive Device Mockup**: Toggle between Mobile Phone (iPhone Pro) and Desktop browser feed.
   - **Industry Template Presets**: 1-click insertion of Product Launch, Growth Milestone, Tech Deep-Dive, and Webinar templates.
   - Debounced autosave (2.5s) to PostgreSQL with live status indicators.

2. **Interactive Content Calendar (`UnifiedContentCalendar`)**:
   - Month, Week, Day, and Agenda List views.
   - HTML5 Drag-and-drop rescheduling across calendar dates.
   - Timezone converter (UTC, EST, GMT, IST, JST).
   - 1-Click **"Export Queue"** to download the scheduled calendar as a report.

3. **Multi-Theme Presentation Architecture**:
   - 🌸 **Playful Pastel**: Soft lilac mist canvas (`#FAF5FF`), mint, peach, and blush surfaces with deep ink violet typography.
   - 💼 **Clean Studio**: Crisp corporate light monochrome with slate boundaries.
   - 🌌 **Obsidian Dark**: Midnight slate (`#090D16`), glowing accents, and dark cards.
   - **Stage Presentation Mode**: Maximize view and hide navigation for live demos.

4. **Connected Channels & Security (`ConnectedChannelsHub`)**:
   - Zero-Knowledge Credential Security Model using **AES-256-GCM** authenticated encryption.
   - Real-time API rate limit quota health meters.
   - Interactive "Ping API" latency check.

5. **Analytics & Intelligence (`AnalyticsStudio`)**:
   - 30-day performance telemetry, impressions, reach, and engagement rates.
   - Redis Cache Layer telemetry banner with hit rates, active keys, and "Flush Cache" trigger.
   - Cross-Network Growth Forecaster model.

6. **Kafka Event Bus & DLQ Console (`EventStreamConsole`)**:
   - Accessible via the "Kafka Bus: Active" button in the header.
   - Inspect event topics (`post-scheduled`, `post-published`, `post-dlq`).
   - JSON payload deserializer and Dead Letter Queue (DLQ) replay button.

---

## 🔒 Security Architecture: Hashing vs Encryption

| Security Aspect | Password Management | OAuth Credential Storage |
| :--- | :--- | :--- |
| **Mechanism** | **One-Way Cryptographic Hashing** | **Two-Way Authenticated Encryption** |
| **Algorithm** | BCrypt / PBKDF2 with SHA-512 & Salt | **AES-256-GCM** (Galois/Counter Mode) |
| **Reversibility** | Irreversible by design | Reversible by authorized backend workers only |
| **Key Management** | Random per-user salt prepended to hash | 256-bit symmetric key in environment variable |
| **Integrity Check** | Timing-safe hash comparison | 128-bit GCM authentication tag |
| **Usage** | User login authentication | External API calling (X, Instagram, LinkedIn, etc.) |

---

## 📄 License
This project is licensed under the Apache License 2.0.
