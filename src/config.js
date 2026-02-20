const config = {
  developer: {
    name: "Yuvraj",
    fullName: "Yuvraj Purbia",
    title: "AI-Focused Full-Stack Developer",
    description:
      "AI-focused Full-Stack Developer building intelligent, scalable web and mobile applications. Passionate about LLMs, NLP pipelines, and creating AI-powered products.",
  },

  social: {
    github: "https://github.com/yuvrajpurbia",
    linkedin: "https://www.linkedin.com/in/yuvraj-purbia-464355210/",
    twitter: "https://x.com/yuvrajpurbia23",
    email: "purbiayuvraj23@gmail.com",
    location: "Jaipur, India",
  },

  about: {
    title: "About Me",
    description:
      "I am an AI-focused Full-Stack Developer from Jaipur, India. I build intelligent, scalable web and mobile applications by integrating Large Language Models, NLP pipelines like BERT and Sentence Transformers, and OpenAI APIs into production systems. Proficient in the MERN stack and modern JavaScript, with hands-on experience in prompt engineering, AI-driven analytics, and deploying smart applications across Microsoft Store, Apple App Store, and Shopify ecosystems.",
  },

  experiences: [
    {
      position: "Application Developer",
      company: "Sabai Innovations",
      period: "Nov 2025 – Present",
      location: "Jaipur, India",
      description:
        "Leading development of PWAs and iOS apps, shipping to the Microsoft Store and Apple App Store. Building AI-integrated features and managing end-to-end application lifecycle.",
      responsibilities: [
        "Developing cross-platform PWAs and native iOS apps",
        "Integrating AI features into production applications",
        "Shipping apps to Microsoft Store and Apple App Store",
        "Managing Shopify ecosystem integrations",
      ],
      technologies: [
        "React",
        "Node.js",
        "PWA",
        "iOS",
        "Shopify",
        "AI Integration",
      ],
    },
    {
      position: "MERN Stack Developer",
      company: "Cuvette",
      period: "May 2025 – Oct 2025",
      location: "Remote",
      description:
        "Built scalable full-stack applications using the MERN stack. Developed RESTful APIs, implemented complex frontend features, and optimized application performance.",
      responsibilities: [
        "Building full-stack MERN applications",
        "Developing RESTful APIs with Express.js",
        "Implementing responsive React frontends",
        "Optimizing MongoDB queries and application performance",
      ],
      technologies: [
        "React",
        "Node.js",
        "Express.js",
        "MongoDB",
        "REST APIs",
        "JavaScript",
      ],
    },
    {
      position: "Angular Developer (Intern)",
      company: "Brandspark Technologies",
      period: "Jul 2024 – Jan 2025",
      location: "Pune, India",
      description:
        "Developed and optimized frontend performance for Angular-based web applications. Gained hands-on experience in component architecture and state management.",
      responsibilities: [
        "Building Angular components and modules",
        "Optimizing frontend performance",
        "Implementing responsive UI designs",
        "Working with RxJS and state management",
      ],
      technologies: [
        "Angular",
        "TypeScript",
        "RxJS",
        "HTML/CSS",
        "REST APIs",
      ],
    },
  ],

  projects: [
    {
      id: 1,
      title: "BlitzScale",
      category: "High-Concurrency / Backend",
      technologies:
        "React, Node.js, Express.js, MongoDB, Redis, BullMQ, Artillery, Docker",
      description:
        "High-Concurrency Flash Sale Engine handling 10,000+ concurrent users. Features Redis-based distributed locking and BullMQ async processing for bulletproof flash sale transactions.",
      thumbnail: "/projects/blitzscale.png",
    },
    {
      id: 2,
      title: "MockMind",
      category: "AI / NLP",
      technologies:
        "React, Node.js, Python, OpenAI API, BERT, NLP, Sentence Transformers, MongoDB",
      description:
        "AI-Powered Interview Simulator with LLM-driven AI interviewer, NLP scoring engine using BERT and Sentence Transformers, AI-driven skill gap detection, and company-specific interview simulations.",
      thumbnail: "/projects/mockmind.png",
    },
    {
      id: 3,
      title: "SpeedSense",
      category: "SaaS / Performance",
      technologies:
        "MERN Stack, Puppeteer, Lighthouse API, Recharts, Tailwind CSS",
      description:
        "Web Performance Intelligence SaaS with automated Lighthouse audits, AI-driven optimization suggestions, competitor benchmarking, and exportable PDF performance reports.",
      thumbnail: "/projects/speedsense.png",
    },
    {
      id: 4,
      title: "YouTube Clone",
      category: "Frontend / UI",
      technologies:
        "React.js, Redux Toolkit, JavaScript, Tailwind CSS",
      description:
        "Dynamic YouTube clone with video playback, search functionality, and responsive UI. Leverages Redux Toolkit for state management and Tailwind CSS for modern styling.",
      thumbnail: "/projects/youtube-clone.png",
    },
  ],

  education: {
    degree: "B.Tech in Computer Science and Engineering",
    institution: "Maharashtra Institute of Technology WPU, Pune, MH",
    cgpa: "8.10",
    duration: "2020 – 2024",
  },

  contact: {
    email: "purbiayuvraj23@gmail.com",
    phone: "+91 9024015370",
    github: "https://github.com/yuvrajpurbia",
    linkedin: "https://www.linkedin.com/in/yuvraj-purbia-464355210/",
    twitter: "https://x.com/yuvrajpurbia23",
    location: "Jaipur, India",
  },

  skills: {
    develop: {
      title: "AI & BACKEND",
      description: "Building intelligent systems & scalable APIs",
      details:
        "Integrating LLMs, NLP pipelines (BERT, Sentence Transformers), and OpenAI APIs into production systems. Building robust Node.js/Express backends with MongoDB and Redis.",
      tools: [
        "Node.js",
        "Express.js",
        "Python",
        "OpenAI API",
        "LLM Integration",
        "MongoDB",
        "Redis",
        "Docker",
        "DSA",
        "OOPs",
      ],
    },
    design: {
      title: "FULL-STACK",
      description: "Modern web applications & interactive UIs",
      details:
        "Building responsive, performant web applications using React, Next.js, and modern JavaScript (ES6+). Creating seamless user experiences with TypeScript and modern UI frameworks.",
      tools: [
        "JavaScript (ES6+)",
        "TypeScript",
        "React.js",
        "Next.js",
        "MongoDB",
        "Redis",
        "Tailwind CSS",
        "REST APIs",
        "Docker",
        "Git",
      ],
    },
    webApps: {
      title: "WEB APPS",
      description: "Cross-platform apps & production deployment",
      details:
        "Shipping PWAs, iOS apps, and Shopify integrations to production. Building cross-platform experiences with real-time features, push notifications, and offline-first architecture.",
      tools: [
        "PWA",
        "iOS",
        "Shopify",
        "Firebase",
        "Vercel",
        "CI/CD",
        "Puppeteer",
        "Lighthouse",
        "Recharts",
        "REST APIs",
      ],
    },
  },

  techStack: [
    { name: "JavaScript", icon: "SiJavascript" },
    { name: "TypeScript", icon: "SiTypescript" },
    { name: "Python", icon: "SiPython" },
    { name: "React", icon: "SiReact" },
    { name: "Next.js", icon: "SiNextdotjs" },
    { name: "Node.js", icon: "SiNodedotjs" },
    { name: "Express", icon: "SiExpress" },
    { name: "MongoDB", icon: "SiMongodb" },
    { name: "Redis", icon: "SiRedis" },
    { name: "Docker", icon: "SiDocker" },
    { name: "OpenAI", icon: "SiOpenai" },
    { name: "Git", icon: "SiGit" },
    { name: "Tailwind", icon: "SiTailwindcss" },
    { name: "HTML5", icon: "SiHtml5" },
    { name: "CSS3", icon: "SiCss3" },
    { name: "PostgreSQL", icon: "SiPostgresql" },
    { name: "React Native", icon: "SiReact" },
    { name: "BullMQ", icon: "FaBolt" },
    { name: "REST API", icon: "FaServer" },
    { name: "DSA", icon: "FaProjectDiagram" },
    { name: "Ollama", icon: "FaRobot" },
    { name: "ES6", icon: "SiJavascript" },
    { name: "Firebase", icon: "SiFirebase" },
    { name: "Vercel", icon: "SiVercel" },
    { name: "Vite", icon: "SiVite" },
    { name: "Shopify", icon: "SiShopify" },
    { name: "Angular", icon: "SiAngular" },
    { name: "Redux", icon: "SiRedux" },
  ],
};

export { config as c };
export default config;
