# CivicSense - AI-Powered Civic Reporting

CivicSense is a modern, AI-powered platform for community members to report and track infrastructure issues, from potholes to waste management.

## Features

- **AI-Powered Reporting**: Intelligent triage and categorization of reports.
- **Dual Flow**: Specialized interfaces for Citizens and Authorities.
- **Interactive Dashboard**: Real-time visualization of city-wide issues.
- **Authentic Access**: Secure login with role verification.

## Getting Started

### 1. Prerequisites

- Node.js 18+ 
- npm or yarn

### 2. Installation

```bash
git clone https://github.com/Charanraot2006/AI-powered-CIvIc-Sense.git
cd AI-powered-CIvIc-Sense
npm install
```

### 3. Environment Setup

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

### 4. Database Initialization

```bash
npx prisma generate
npx prisma db push
npm run seed  # Optional: Seed test accounts
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Database**: SQLite with Prisma ORM
- **Auth**: NextAuth.js
- **Styling**: Vanilla CSS with Next.js Glassmorphism
- **Icons**: Lucide React
