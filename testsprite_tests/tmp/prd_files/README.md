# Premium CGPA Calculator

A modern, full-stack GPA & CGPA Calculator designed for university students. Built with Next.js, it offers a premium user experience with advanced analytics, target tracking, and seamless cloud synchronization.

## ✨ Features

- **Dual Authentication**: Sign in securely using Email/Password (with OTP verification) or Google OAuth.
- **Real-Time Calculation**: Instantly calculates your SGPA and Cumulative GPA as you type.
- **🎯 Target Tracker**: Set your dream CGPA and the predictor will tell you exactly how many credits and what grades you need to achieve it.
- **📊 Grade Analytics**: Visual donut charts (via Recharts) breaking down your grade distribution.
- **☁️ Cloud Auto-Save**: Never lose your data. Background sync automatically saves your progress securely to the cloud.
- **📄 PDF Export**: Generate and download a polished academic transcript of all your semesters with a single click.
- **Dark Mode Design**: A premium, glassmorphism-inspired UI tailored for modern aesthetics.

## 🛠 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org) (App Router), React, Vanilla CSS (Glassmorphism UI)
- **Backend/Database**: [InsForge](https://insforge.dev) (PostgreSQL BaaS)
- **Authentication**: InsForge Auth (Google OAuth & OTP Email Verification)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

## 🚀 Getting Started

### Prerequisites

You need Node.js installed, and an InsForge project linked to the repository.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd gpa-Calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Link your InsForge backend:
   ```bash
   npx @insforge/cli login
   npx @insforge/cli link --project-id <your-project-id>
   ```

4. Set up the local environment variables. The InsForge CLI will automatically manage your `.env.local` upon linking.

### Running the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔒 Database & Security

This project relies on InsForge's PostgreSQL database with **Row Level Security (RLS)**.
The `user_data` table ensures that every user can only `SELECT`, `INSERT`, `UPDATE`, and `DELETE` their own academic records.

Authentication requires a 6-digit verification code to ensure secure sign-ups.

## 🤝 Contributing

Contributions, issues and feature requests are welcome! Feel free to check the issues page if you want to contribute.
