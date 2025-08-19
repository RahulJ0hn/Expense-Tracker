# ExpenseTracker AI

A modern, AI-powered expense tracking web application tailored for bachelors in India. Effortlessly track your expenses, manage your monthly income, and gain actionable insights to improve your financial health.

---

## Features

- **AI-Powered Insights:** Get personalized, actionable financial advice and smart expense categorization using OpenAI.
- **Indian Standards:** Track expenses in rupees (₹), set your monthly income, and use categories relevant to Indian bachelors (food, rent, alcohol, cigarettes, etc.).
- **Health & Balance Tracking:** Monitor high-risk spending (alcohol, cigarettes), get advice to reduce unhealthy habits, and always know your balance and daily spend limit.
- **Authentication:** Secure sign-in and user management with Clerk.
- **Responsive UI:** Beautiful, modern, and mobile-friendly interface with light/dark mode toggle.
- **Analytics Dashboard:** Visualize your spending patterns, see stats, and review your expense history.
- **Server Actions:** Fast, secure data operations using Next.js App Router and server actions.

---

## Tech Stack & Libraries

- **Next.js 15** (App Router, SSR, API routes)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4** (utility-first styling)
- **Prisma ORM** (PostgreSQL database)
- **Clerk** (authentication & user management)
- **OpenAI** (AI-powered insights & categorization)
- **@clerk/themes** (custom Clerk UI)

---

## Database Schema (Prisma)

```
model User {
  id          String   @id @default(uuid())
  clerkUserId String   @unique
  email       String   @unique
  name        String?
  imageUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  Records     Record[]
}

model Record {
  id        String   @id @default(uuid())
  text      String
  amount    Float
  category  String   @default("Other")
  date      DateTime @default(now())
  userId    String
  user      User     @relation(fields: [userId], references: [clerkUserId], onDelete: Cascade)
  createdAt DateTime @default(now())
  @@index([userId])
}
```

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/RahulJ0hn/Expense-Tracker.git
cd Expense-Tracker/expense-tracker
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Set up environment variables
Create a `.env` file in the root with the following:
```
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<db_name>
OPENROUTER_API_KEY=your_openrouter_or_openai_api_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set up the database
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts
- `npm run dev` — Start the development server
- `npm run build` — Build for production
- `npm run start` — Start the production server
- `npm run lint` — Run ESLint

---

## Author & Contact

**Made by Rahul John J**  
Contact: [9994551908](tel:+919994551908) | [rahuljohn1211@gmail.com](mailto:rahuljohn1211@gmail.com)

---

## License
MIT (or specify your license)

