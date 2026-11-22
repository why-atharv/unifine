# UniFine · KR Mangalam University

A centralized web-based fine management system for KR Mangalam University. UniFine streamlines student verification, transparent fine tracking, approved offence catalogues, audit trails, and proctorial notifications.

## Features

- **Role-Based Access**: Specialized portals for **Students**, **Faculty**, and **Administrators**.
- **Student Portal**: View personal fine records, status (Pending, Paid, Overdue), payment history, and rule book.
- **Faculty Portal**: Search students by roll number, verify academic details, and issue fines strictly matching the official offence catalogue.
- **Admin Portal**: Manage the offence catalogue, handle fine corrections with audit notes, review university-wide analytics/reports, and broadcast notifications.
- **Auditing & Transparency**: Complete audit trail logging every fine creation, status change, and correction.
- **Responsive & Interactive**: Optimized for desktop and mobile devices with fluid transitions.

## Quick Start (Local Development)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

For demonstration and testing, use the quick-fill buttons on the sign-in screen, or enter:

| Role | Email / Roll Number | Password | Profile |
|---|---|---|---|
| **Admin** | `admin@krmu.edu.in` | `Admin@123` | Dr. Meera Kapoor · Dean, Student Affairs |
| **Faculty** | `rajesh.choudhary@krmangalam.edu.in` | `Faculty@123` | Prof. Rajesh Choudhary · SOET |
| **Student** | `2201560042@krmu.edu.in` *(or `2201560042`)* | `Student@123` | Aarav Choudhary · B.Tech CSE (3rd Year) |

## Tech Stack

- **Framework**: Next.js (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Radix UI
- **Icons & Motion**: Lucide React & Framer Motion
- **Architecture**: Self-contained client-side data store with `localStorage` persistence
