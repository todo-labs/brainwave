# Brainwave

Brainwave is a quiz platform that uses OpenAI to generate questions and answers in real-time. 
The platform offers users the opportunity to take quizzes in a wide range of subjects and receive instant feedback on their performance.

## Vision

Our vision is to create an accessible and engaging platform for anyone who wants to learn and challenge themselves through quizzes. 
By leveraging the power of OpenAI, we aim to provide a unique and dynamic learning experience that adapts to each user's knowledge level.

## Getting Started

To get started with Brainwave, you will need to set up your development environment. Here's how:

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL
- Yarn

### Installing

1. Clone the repository:

```bash
git clone 
```

2. Install dependencies:

```bash
yarn install
```

3. Create a `.env` file in the root directory and add the following environment variables:

```bash
DATABASE_URL=postgres://<username>:<password>@localhost:5432/brainwave
```

4. Create a database:

```bash
createdb brainwave
```

5. Run the migrations:

```bash
npm run migrate
```

6. Seed the database:

```bash
psql -U <username> -d brainwave -f ./seeds/seed.quiz_tables.sql
```

7. Start the server:

```bash
npm run dev
```

8. Open the app in your browser:

```bash
open http://localhost:3000
```

## Built With

- [Nextjs](https://nextjs.org/) - Front-end framework
- [PostgreSQL](https://www.postgresql.org/) - Database
- [OpenAI](https://openai.com/) - AI-powered question generation
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vercel](https://vercel.com/) - Deployment
- [TRPC](https://trpc.io/) - RPC framework
