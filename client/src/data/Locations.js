export const LOCATIONS = [
  {
    id: '1',
    title: 'The Great Gatsby',
    lat: 40.8281,
    lng: -73.4473,
    altitude: 60,
    description: 'Long Island mansion where Jay Gatsby threw his legendary parties',
    author: 'F. Scott Fitzgerald',
    year: 1925,
    genre: 'Classic Literature',
    storyPoints: [
      {
        heading: 165,
        pitch: -5,
        text: 'Gatsby\'s Mansion View',
        description: 'The opulent mansion where Jay Gatsby threw his legendary parties, hoping to catch the attention of his lost love.',
        image: 'https://via.placeholder.com/200x120/4f46e5/ffffff?text=Gatsby+Mansion',
        lat: 40.8287377346249, // Main mansion location
        lng: -73.44819177401407,

      },
      {
        heading: 95,
        pitch: -5,
        text: 'The Green Light',
        description: 'The mysterious green light at the end of Daisy\'s dock, symbolizing hope and the American Dream.',
        image: 'https://via.placeholder.com/200x120/10b981/ffffff?text=Green+Light',
        lat: 40.8295, // Slightly east across the water (Daisy's dock)
        lng: -73.4470,
      },
    ],
  },
  {
    id: '2',
    title: 'Harry Potter',
    lat: 51.531,
    lng: -0.124,
    altitude: 100,
    description: 'King\'s Cross Station - Gateway to the wizarding world',
    author: 'J.K. Rowling',
    year: 1997,
    genre: 'Fantasy',
    storyPoints: [
      {
        heading: 45,
        pitch: 0,
        text: 'Platform 9¾',
        description: 'The magical platform where young witches and wizards board the Hogwarts Express to begin their journey.',
        image: 'https://via.placeholder.com/200x120/dc2626/ffffff?text=Platform+9%C2%BE',
        lat: 51.5318, // Inside King's Cross Station
        lng: -0.1239,
      },
      {
        heading: 180,
        pitch: -10,
        text: 'Entrance to Hogwarts Express',
        description: 'The legendary scarlet steam engine that transports students to the magical world of Hogwarts.',
        image: 'https://via.placeholder.com/200x120/7c2d12/ffffff?text=Hogwarts+Express',
        lat: 51.5315, // Platform area
        lng: -0.1245,
      },
    ],
  },
  {
    id: '3',
    title: 'Sherlock Holmes',
    lat: 51.5237,
    lng: -0.1585,
    altitude: 50,
    description: '221B Baker Street - The famous detective\'s residence',
    author: 'Arthur Conan Doyle',
    year: 1887,
    genre: 'Mystery',
    storyPoints: [
      {
        heading: 90,
        pitch: 0,
        text: 'Baker Street',
        description: 'The iconic address where the world\'s greatest detective solved his cases.',
        image: 'https://via.placeholder.com/200x120/8b5cf6/ffffff?text=Baker+Street',
        lat: 51.5237, // 221B Baker Street
        lng: -0.1585,
      },
    ],
  },
  {
    id: '4',
    title: 'Lion King',
    lat: -0.915404,
    lng: 36.316911,
    altitude: 60,
    description: 'Hell’s Gate Gorge – The dramatic red cliffs that inspired Pride Rock in *The Lion King*',
    author: 'Disney (inspired by East African landscapes)',
    year: 1994,
    genre: 'Animated Adventure',
    storyPoints: [
      {
        heading: 90,
        pitch: -10,
        text: "Hell's Gate",
        description: 'Hell’s Gate Gorge – The dramatic red cliffs that inspired Pride Rock in *The Lion King*',
        image: 'https://via.placeholder.com/200x120/8b5cf6/ffffff?',
        lat: -0.915404,
        lng: 36.316911,
      }
    ],
  }
];