export interface IPost {
  title: string;
  date: string;
  author: string;
  excerpt: string;
  project: boolean;
  tags: string[];
  comments: boolean;
  id: string;
  filename: string;
}

export const posts: IPost[] = [
  {
    title: 'NTP Server Configuration',
    date: '2014-08-04',
    author: 'Keith Wade',
    excerpt:
      'A brief guide to the Network Time Protocol and its configuration.',
    project: false,
    tags: [
      'Linux',
      'CentOS',
      'Network',
      'Configuration',
      'NTP',
      'Network Time Protocol',
    ],
    comments: true,
    id: '0001',
    filename: '2014-08-04-NTP_Configuration',
  },
  {
    title: 'Configuring a Hyper-V Cluster',
    date: '2015-07-04',
    author: 'Keith Wade',
    excerpt:
      'A step by step guide to configuring a basic Hyper-V Cluster on Windows Server 2012.',
    project: false,
    tags: ['Windows', 'Server 2012', 'Configuration', 'Hyper-V', 'Clustering'],
    comments: true,
    id: '0002',
    filename: '2015-07-04-Configuring_a_Hyper-V_Cluster',
  },
  {
    title: 'Advent of Code: Not Quite Lisp',
    date: '2015-12-27',
    author: 'Keith Wade',
    excerpt:
      'My solutions and approach to the first Advent of Code challenge for 2015.',
    project: false,
    tags: ['Node.js', 'Python', 'programming', 'Advent of Code'],
    comments: true,
    id: '0003',
    filename: '2015-12-27-Advent_of_Code',
  },
  {
    title: 'Advent of Code: I Was Told There Would Be No Math',
    date: '2015-12-28',
    author: 'Keith Wade',
    excerpt:
      'My solutions and approach to the second Advent of Code challenge for 2015.',
    project: false,
    tags: ['Node.js', 'Python', 'programming', 'Advent of Code'],
    comments: true,
    id: '0004',
    filename: '2015-12-28-Advent_of_Code',
  },
  {
    title: 'Cuddly Weasel',
    date: '2016-01-21',
    author: 'Keith Wade',
    excerpt: 'A calculated adventure in DOM manipulation for calculators.',
    project: true,
    tags: ['javascript', 'dom', 'web development', 'browser'],
    comments: true,
    id: '0005',
    filename: '2016-01-21-cuddly-weasel',
  },
  {
    title: 'PokéData',
    date: '2016-07-12',
    author: 'Keith Wade',
    excerpt: 'Pokémon strengths and weaknesses Pokédex built with React/Redux.',
    project: true,
    tags: ['pokemon', 'javascript', 'react', 'redux'],
    comments: true,
    id: '0006',
    filename: '2016-07-12-Pokedata',
  },
  {
    title: 'PokéData Improved',
    date: '2016-09-06',
    author: 'Keith Wade',
    excerpt: 'Pokémon strengths and weaknesses Pokédex built with React.',
    project: true,
    tags: ['pokemon', 'javascript', 'react'],
    comments: true,
    id: '0007',
    filename: '2016-09-06-Pokedata_Improved',
  },
  {
    title: 'PokéData Vue',
    date: '2017-01-22',
    author: 'Keith Wade',
    excerpt: 'Pokémon strengths and weaknesses Pokédex built with Vue!',
    project: true,
    tags: ['pokemon', 'javascript', 'vue'],
    comments: true,
    id: '0007',
    filename: '2017-01-22-Pokedata_Vue',
  },
  {
    title: 'Development Environment Opinions',
    date: '2019-12-11',
    author: 'Keith Wade',
    excerpt: 'Opinionated list of software I recommend.',
    project: true,
    tags: ['software', 'development', 'tools'],
    comments: true,
    id: '0008',
    filename: '2019-12-11-Development_Environment_Opinions',
  },
];
