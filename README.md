# ATV-PWOA — Emergency Room Workforce Optimizer

A research dashboard for **"Applying Probability Distributions to Model Emergency Room Patient Arrival Patterns for Workforce Optimization"** using the **Adaptive Time-Varying Poisson Workforce Optimization Algorithm (ATV-PWOA)**.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS v3
- Recharts
- Lucide React
- React Router v6

## Installation & Running

```bash
# 1. Navigate to the project folder
cd atv-pwoa

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Pages

| Route | Page |
|-------|------|
| `/` | Home / Overview |
| `/dashboard` | Dashboard |
| `/analysis` | Patient Arrival Analysis |
| `/prediction` | Prediction & Probability |
| `/workforce` | Workforce Optimization |
| `/reports` | Reports & About |

## Notes

- All data is **sample/demo data** — not real hospital records.
- Poisson distribution calculations and M/M/c queueing model are computed client-side.
- CSV export works for all three report types.
- No backend required — fully self-contained.
