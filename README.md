# FinancialAppFrontend 💵

A React + TypeScript single-page app for managing personal finance. This frontend interacts with a RESTful backend to provide users with budgeting, transaction tracking, and analytics.

### Features

- User authentication (login/signup)
- Dashboard of recent transactions & account balances
- Forms to add/edit financial entries (income, expenses)
- Interactive charts summarizing spending trends
- Responsive Material-UI design

### Tech Stack

- React (w/ Hooks)
- TypeScript
- Context API for state
- Axios for API calls
- Recharts
- Material-UI

### Getting Started

1. Clone:
   git clone https://github.com/jordanasano/FinancialAppFrontend.git
   cd FinancialAppFrontend

2. Install:
   npm install

3. Configure API:
   Add .env:
   REACT_APP_API_BASE_URL=http://localhost:3001

4. Run:
   npm start

5. Build for production:
   npm run build

6. Tests:
   npm test

Folder Structure
graphql
Copy
Edit
src/
├─ components/      # Reusable UI
├─ pages/           # Dashboard, Login, Signup, etc.
├─ services/        # API calls via Axios
├─ context/         # Auth & finance state
└─ utils/           # Helpers & validation
