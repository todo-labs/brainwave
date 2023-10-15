<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">
  <a href="https://github.com/todo-labs/brainwave">
    <img src="public/logo.svg" alt="Logo" width="80" height="80">
  </a>

<h1 align="center">Brainwave</h1>
  <p align="center">
    <a href="https://brainwave.quest">View Demo</a>
    ·
    <a href="https://github.com/todo-labs/brainwave/issues/new?assignees=&labels=&projects=&template=bug_report.md&title=">Report Bug</a>
    ·
    <a href="https://github.com/todo-labs/brainwave/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

[![Product Name Screen Shot][product-screenshot]][app-url]

Introducing Brainwave, an innovative quiz platform that harnesses the capabilities of OpenAI to generate real-time practice exams. Our vision is to establish an accessible and engaging hub for learning and self-challenge through quizzes. By capitalizing on OpenAI's potential, we strive to offer a distinctive and dynamic learning journey that adjusts to individual users' knowledge levels. With Brainwave, users can explore quizzes in diverse subjects, obtaining instant performance feedback for an enriched educational experience.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🌎 New Languages Supported

We're excited to announce that we now support multiple languages! Thanks to the power of [next-i18next](https://www.npmjs.com/package/next-i18next) & [Open Ai](https://openai.com/), we've added E2E support for the following languages:

- 🇦🇪 Arabic
- 🇨🇳 Chinese
- 🇩🇪 German
- 🇺🇸 English (default)
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇮🇳 Hindi
- 🇮🇹 Italian
- 🇯🇵 Japanese
- 🇰🇷 Korean
- 🇳🇬 Yorùbá
- 🇵🇹 Portuguese
- 🇷🇺 Russian

To switch to a different language, simply click on the language selector on the profile page and choose your preferred language. We hope this new feature makes Brainwave more accessible and user-friendly for everyone!

### Built With

- [![Next][Next.js]][Next-url]
- [![React][React.js]][React-url]
- [![Prisma][Prisma]][Prisma-url]
- [![Tailwind CSS][Tailwind CSS]][Tailwind CSS-url]
- [![Vercel][Vercel]][Verce-url]
- [![OpenAi][OpenAi]][OpenAi-url]
- [Next Auth](https://next-auth.js.org/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Langchain](https://js.langchain.com/docs/get_started/introduction)
- [shadcn/ui](https://ui.shadcn.com/docs)
- [TRPC](https://trpc.io/)

### Features

- Email Magic Link Authentication
- Quiz Generation
- Results Breakdown

### What I Learned ?

- How to use NextAuth.js to implement authentication and authorization
- Langchain API integration
- How to use tRPC to implement a GraphQL-like API
- How to use Tailwind CSS & Radix UI to build a responsive and engaging UI
- How to setup an embedding vector database

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🧩 Integrations

**Mixpanel**

we prioritize data-driven decision-making to enhance the user experience and continuously improve our services.
To achieve this, we have integrated Mixpanel, a powerful analytics and user engagement platform, into our application.

**Sentry**

We have integrated Sentry, an open-source error tracking tool, into our application using 
[Sentry's Next.js SDK](https://docs.sentry.io/platforms/javascript/guides/nextjs/). 
This allows us to monitor and fix crashes in real-time, as well as monitor our application's performance and identify potential bottlenecks. 
Sentry's session replay feature also allows us to see exactly what our users are experiencing, which helps us to improve our application's usability.

### Prerequisites

To get started with Brainwave, you will need to set up your development environment. You will need the following tools:

- [Node.js](https://nodejs.org/) (Recommended version: 18)
- [Pnpm](https://pnpm.io/) (Recommended version: 6)
- [Postgresql](https://www.postgresql.org/) (Recommended version: 15)

### Installation

1. Get an Open AI API Key at [Open AI Platform](https://platform.openai.com/)
2. Clone the repo
   ```bash
    git clone https://github.com/todo-labs/brainwave.git
   ```
3. Install NPM packages
   ```bash
    pnpm i
   ```
4. Copy over your env file
   ```bash
    cp .env.example .env
   ```
5. Push the prisma schema to your database
   ```bash
    pnpm db:push
   ```
6. Run the development server
   ```bash
    pnpm dev
   ```
7. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

8. This project uses a git hook to enforce [conventional commits](https://github.com/qoomon/git-conventional-commits). To install the git hook, run the following command in the root directory of the project:

```sh
brew install pre-commit
pre-commit install -t commit-msg
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [ ] Setup the vector database
  - [ ] Pre load a dataset of past SAT Practice Exams
  - [ ] Link vector db to quiz generation query
  - [ ] Setup a cron job to update the database with new exams
- [ ] Enhance the quiz generation procedure
  - [ ] Add support for different question types
- [x] Enhance results breakdown UI and functionality
- [x] Add a leader board and ranking system
- [ ] Enhance the mobile experience

See the [open issues](https://github.com/todo-labs/brainwave/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat(scope): Add some AmazingFeature (fixes #123)'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

David Ojo - [@conceptcodes](https://github.com/conceptcodes) - conceptcodes@gmail.com

Project Link: [https://brainwave.quest](https://brainwave.quest)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/todo-labs/brainwave.svg?style=for-the-badge
[contributors-url]: https://github.com/todo-labs/brainwave/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/todo-labs/brainwave.svg?style=for-the-badge
[forks-url]: https://github.com/todo-labs/brainwave/network/members
[stars-shield]: https://img.shields.io/github/stars/todo-labs/brainwave.svg?style=for-the-badge
[stars-url]: https://github.com/todo-labs/brainwave/stargazers
[issues-shield]: https://img.shields.io/github/issues/todo-labs/brainwave.svg?style=for-the-badge
[issues-url]: https://github.com/todo-labs/brainwave/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/david-ojo-66a12a147
[product-screenshot]: public/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Prisma]: https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/
[app-url]: https://brainwave.quest
[Verce-url]: https://vercel.com/
[Vercel]: https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white
[Tailwind CSS]: https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind CSS-url]: https://tailwindcss.com/
[OpenAi]: https://img.shields.io/badge/chatGPT-74aa9c?style=for-the-badge&logo=openai&logoColor=white
[OpenAi-url]: https://openai.com/
