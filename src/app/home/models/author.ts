export interface IAuthor {
  name: string;
  githubName: string;
  linkedinName: string;
  role: string;
  techStack: string[];
  hobbies: string;
}

export const authorsData: IAuthor[] = [
  {
    name: 'Marcin Bator',
    githubName: 'marcinbator',
    linkedinName: 'marcin-bator-ofc',
    role: 'Fullstack Developer',
    techStack: [
      'Java/Spring Boot',
      'C#/.NET',
      'C++',
      'TypeScript',
      'Angular',
      'SQL/PostgreSQL',
    ],
    hobbies: 'mountains, bike, skiing, programming',
  },
  {
    name: 'Paweł Buczek',
    githubName: 'pablitoo1',
    linkedinName: 'pbuczek',
    role: 'Frontend Developer',
    techStack: [
      'TypeScript',
      'JavaScript',
      'Angular',
      'React/Next.js',
      'Babylon.js',
      'CSS/TailwindCSS',
    ],
    hobbies:
      'studying computer science, creating web pages and apps, practicing and watching sports',
  },
  {
    name: 'Bartłomiej Krówka',
    githubName: 'bkrowka',
    linkedinName: 'bartłomiej-krówka-b45262342',
    role: 'AI Engineer',
    techStack: ['Python', 'Matplotlib', 'OpenAI Gym', 'Stable Baselines 3'],
    hobbies: 'programming, playing video games, listening to music',
  },
];
