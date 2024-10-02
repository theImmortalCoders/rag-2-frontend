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
    role: 'Fullstack engineer',
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
    linkedinName: '',
    role: 'AI Engineer',
    techStack: [
      'Python',
      'TensorFlow/PyTorch',
      'JavaScript',
      'React/Next.js',
      'CSS/TailwindCSS',
    ],
    hobbies: 'programming, playing video games, listening to music',
  },
];
