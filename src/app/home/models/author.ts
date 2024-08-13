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
    role: 'Tył-dev',
    techStack: ['aa', 'bb', 'ee', 'dd', 'ee'],
    hobbies: 'no hobbies',
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
      'computer engineering student, creating web pages and apps, practicing and watching sports',
  },
  {
    name: 'Bartłomiej Krówka',
    githubName: 'bkrowka',
    linkedinName: '',
    role: 'sztuczny dev',
    techStack: ['Pytong', 'JavaScript', 'CHasz', 'React/Next.js', 'HTML5'],
    hobbies: 'dfgdfg karola',
  },
];
