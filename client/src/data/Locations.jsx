import SpiritedAwayImage from '../assets/img/SpiritedAway.png';
import SherlockImage from '../assets/img/Sherlock.png';
import GatsbyImage from '../assets/img/Gatsby.png';
import HarryImage from '../assets/img/Harry.png';
import GatsbyMusic from '../assets/music/Jazz.mp3';

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
    image: GatsbyImage,
    music: GatsbyMusic,
    storyPoints: [
      {
        heading: 165,
        pitch: -5,
        text: 'Gatsby\'s Mansion View',
        description: 'The opulent mansion where Jay Gatsby threw his legendary parties, hoping to catch the attention of his lost love.',
        image: 'https://via.placeholder.com/200x120/4f46e5/ffffff?text=Gatsby+Mansion',
        lat: 40.8287377346249,
        lng: -73.44819177401407,
        billboards: [
          {
            id: 'gatsby-mansion-1',
            heading: 165,
            pitch: -5,
            title: 'The Grand Entrance',
            content: 'Gatsby\'s mansion featured a marble entrance hall with a staircase that curved upward into the shadowy heights.',
            type: 'info',
            quote: '"I spent my Saturday nights in New York because those gleaming, dazzling parties of his were with me so vividly that I could still hear the music and the laughter."',
            details: 'The mansion was modeled after a Normandy château, complete with a tower and ivy-covered walls.',
            lat: 40.8287377346,
            lng: -73.4481917740,
          },
          {
            id: 'gatsby-mansion-2',
            heading: 180,
            pitch: -10,
            title: 'The Party Grounds',
            content: 'The lawn and gardens where hundreds of guests danced under colored lights every weekend.',
            type: 'scene',
            quote: '"In his blue gardens men and girls came and went like moths among the whisperings and the champagne and the stars."',
            details: 'Orchestra platforms, buffet tables, and a floating stage on the bay for entertainment.',
            lat: 40.8287377346300,
            lng: -73.44819177401500,
          },
          {
            id: 'gatsby-mansion-3',
            heading: 140,
            pitch: 0,
            title: 'Gatsby\'s Study',
            content: 'The private room where Gatsby planned his elaborate schemes to win back Daisy.',
            type: 'character',
            quote: '"He had come a long way to this blue lawn, and his dream must have seemed so close that he could hardly fail to grasp it."',
            details: 'Filled with books Gatsby never read, but kept to maintain his carefully constructed image.',
            lat: 40.8287377346259,
            lng: -73.44819177401200,
          }
        ]
      },
    ],
  },
  {
    id: '2',
    title: 'Harry Potter',
    lat: 55.41568633289001,
    lng: -1.7059471809636777,
    altitude: 100,
    description: 'Iconic filming locations from the Harry Potter series.',
    author: 'J.K. Rowling',
    year: 1997,
    genre: 'Fantasy',
    image: HarryImage,
    storyPoints: [
      {
        heading: 90,
        pitch: -5,
        text: 'Alnwick Castle',
        description: 'The real-world location used for exterior shots of Hogwarts, including flying lessons.',
        image: 'https://via.placeholder.com/200x120/2563eb/ffffff?text=Alnwick+Castle',
        lat: 55.415379,
        lng: -1.705285,
        billboards: [
          {
            id: 'alnwick-1',
            heading: 90,
            pitch: -5,
            title: 'Hogwarts Castle',
            content: 'Alnwick Castle served as the iconic Hogwarts exterior in early Harry Potter films.',
            type: 'location',
            quote: '"Welcome to Hogwarts School of Witchcraft and Wizardry!"',
            details: 'Used for scenes such as students arriving by carriage and walking into the castle.',
            lat: 55.41568633288,
            lng: -1.705947180963670,
          },
          {
            id: 'alnwick-2',
            heading: 100,
            pitch: 0,
            title: 'Madam Hooch’s First Flying Lesson',
            content: 'The castle’s courtyard was the filming location for Harry’s first broomstick lesson.',
            type: 'scene',
            quote: '"Up! Everyone mount their brooms!"',
            details: 'The training ground where Neville loses control and Harry’s flying skills first emerge.',
            lat: 55.41568633289001,
            lng: -1.7059471809636777,
          }
        ]
      },
      {
        // 51.749844,-1.2558267
        heading: 60,
        pitch: -8,
        text: 'Christ Church, Oxford',
        description: 'Inspired the Hogwarts Great Hall and grand staircase.',
        image: 'https://via.placeholder.com/200x120/f59e0b/ffffff?text=Christ+Church',
        lat: 51.749844,
        lng: -1.2558267,
        billboards: [
          {
            id: 'christchurch-1',
            heading: 60,
            pitch: -8,
            title: 'Hogwarts Great Hall',
            content: 'Christ Church’s dining hall inspired the design of the Great Hall at Hogwarts.',
            type: 'location',
            quote: '"The enchanted ceiling mirrored the night sky above."',
            details: 'A real-life inspiration for countless sorting ceremonies and feasts.',
            lat: 51.750215081072824,
            lng: -1.2547261028732304,
          },
          {
            id: 'christchurch-2',
            heading: 75,
            pitch: 0,
            title: 'Stairs to the Great Hall',
            content: 'The grand staircase appears in scenes where students enter Hogwarts.',
            type: 'architecture',
            quote: '"Harry climbed the stone stairs, wide-eyed with wonder."',
            details: 'Used multiple times throughout the films for dramatic entrances and transitions.',
            lat: 51.75,
            lng: -1.25,
          }
        ]
      },
      {
        heading: 120,
        pitch: -5,
        text: 'Goathland Train Station',
        description: 'The real station behind Hogsmeade and the Hogwarts Express arrival.',
        image: 'https://via.placeholder.com/200x120/10b981/ffffff?text=Goathland+Station',
        lat: 54.400607439017726,
        lng: -0.7122201435207112,
        billboards: [
          {
            id: 'goathland-1',
            heading: 120,
            pitch: -5,
            title: 'Hogsmeade Station',
            content: 'Goathland Station was used as Hogsmeade in the Harry Potter films.',
            type: 'transport',
            quote: '"The train slowed as it approached the tiny station surrounded by mist."',
            details: 'Students disembarked here before being ferried across the lake to Hogwarts.',
            lat: 54.400607439017726,
            lng: -0.7122201435207112,
          },
          {
            id: 'goathland-2',
            heading: 135,
            pitch: 0,
            title: 'Hogwarts Express',
            content: 'The iconic red train featured in nearly every Harry Potter film.',
            type: 'icon',
            quote: '"It was a scarlet steam engine, puffing smoke into the sky."',
            details: 'Filmed using the Jacobite Steam Train on the West Highland Line.',
            lat: 54.400607439017726,
            lng: -0.7122201435207112,
          }
        ]
      }
    ]
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
    image: SherlockImage,
    storyPoints: [
      {
        heading: 90,
        pitch: 0,
        text: 'Baker Street',
        description: 'The iconic address where the world\'s greatest detective solved his cases.',
        image: 'https://via.placeholder.com/200x120/8b5cf6/ffffff?text=Baker+Street',
        lat: 51.5237,
        lng: -0.1585,
        billboards: [
          {
            id: 'baker-street-1',
            heading: 90,
            pitch: 0,
            title: 'The Front Door',
            content: 'The famous black door of 221B Baker Street, entrance to the world\'s most famous detective\'s flat.',
            type: 'location',
            quote: '"Come, Watson, come! The game is afoot!"',
            details: 'Mrs. Hudson, the landlady, lived downstairs and often brought up visitors.'
          },
          {
            id: 'baker-street-2',
            heading: 110,
            pitch: 10,
            title: 'Holmes\' Study',
            content: 'The cluttered study where Holmes conducted his investigations and received clients.',
            type: 'scene',
            quote: '"You see, but you do not observe."',
            details: 'Filled with chemical apparatus, case files, and Holmes\' famous pipe and violin.'
          },
          {
            id: 'baker-street-3',
            heading: 70,
            pitch: -5,
            title: 'The Gaslight',
            content: 'The Victorian gas lamp that illuminated the foggy London street.',
            type: 'atmosphere',
            quote: '"The gas-lamps shone dimly through the fog, and the ground was greasy with moisture."',
            details: 'Baker Street was lit by gas lamps, creating the perfect atmosphere for mysterious encounters.'
          }
        ]
      },
    ],
  },
  // {
  //   id: '4',
  //   title: 'Lion King',
  //   lat: -0.915404,
  //   lng: 36.316911,
  //   altitude: 60,
  //   description: 'Hells Gate Gorge – The dramatic red cliffs that inspired Pride Rock in *The Lion King*',
  //   author: 'Disney (inspired by East African landscapes)',
  //   year: 1994,
  //   genre: 'Animated Adventure',
  //   image: LionKingImage,
  //   storyPoints: [
  //     {
  //       heading: 90,
  //       pitch: -10,
  //       text: "Hell's Gate",
  //       description: 'Hells Gate Gorge – The dramatic red cliffs that inspired Pride Rock in *The Lion King*',
  //       image: 'https://via.placeholder.com/200x120/8b5cf6/ffffff?',
  //       lat: -0.915404,
  //       lng: 36.316911,
  //       billboards: [
  //         {
  //           id: 'pride-rock-1',
  //           heading: 90,
  //           pitch: -10,
  //           title: 'Pride Rock Summit',
  //           content: 'The majestic peak where the Lion King surveys his kingdom and presents his heir.',
  //           type: 'location',
  //           icon: '🦁',
  //           quote: '"Everything the light touches is our kingdom."',
  //           details: 'The highest point of Pride Rock, offering a commanding view of the African savanna.'
  //         },
  //         {
  //           id: 'pride-rock-2',
  //           heading: 120,
  //           pitch: 0,
  //           title: 'The Presentation Circle',
  //           content: 'The sacred spot where newborn cubs are presented to the pride and the animal kingdom.',
  //           type: 'ceremony',
  //           icon: '🌅',
  //           quote: '"The Circle of Life moves us all."',
  //           details: 'All the animals of the Pride Lands gather below to witness the presentation ceremony.'
  //         },
  //         {
  //           id: 'pride-rock-3',
  //           heading: 60,
  //           pitch: 5,
  //           title: 'The King\'s Den',
  //           content: 'The royal family\'s dwelling within the rock formation.',
  //           type: 'home',
  //           icon: '🏔️',
  //           quote: '"A king\'s time as ruler rises and falls like the sun."',
  //           details: 'Carved chambers within Pride Rock that serve as the royal family\'s home.'
  //         }
  //       ]
  //     }
  //   ],
  // },
  {
    id: '5',
    title: 'Spirited Away',
    lat: 35.0116,
    lng: 135.7681,
    altitude: 80,
    description: 'Kyoto, Japan - The historic city that inspired the magical world of Spirited Away',
    author: 'Hayao Miyazaki',
    year: 2001,
    genre: 'Animated Fantasy',
    image: SpiritedAwayImage,
    storyPoints: [
      {
        heading: 45,
        pitch: -8,
        text: 'Fushimi Inari Shrine',
        description: 'The thousands of vermillion torii gates that inspired the tunnel entrance to the spirit world.',
        image: 'https://via.placeholder.com/200x120/dc2626/ffffff?text=Torii+Gates',
        lat: 34.9671,
        lng: 135.7727,
        billboards: [
          {
            id: 'torii-1',
            heading: 45,
            pitch: -8,
            title: 'The Thousand Gates',
            content: 'Endless vermillion torii gates that create a tunnel between the human and spirit worlds.',
            type: 'portal',
            quote: '"The tunnel seemed to go on forever, lit by the warm glow of vermillion."',
            details: 'Over 10,000 torii gates donated by individuals and businesses line the mountain paths.'
          },
          {
            id: 'torii-2',
            heading: 60,
            pitch: 0,
            title: 'The Spirit Passage',
            content: 'The mystical pathway where Chihiro first entered the world of spirits.',
            type: 'journey',
            quote: '"Don\'t look back, no matter what happens."',
            details: 'The passage that transforms from a mundane tunnel into a magical gateway.'
          }
        ]
      },
      {
        heading: 120,
        pitch: -5,
        text: 'Traditional Bathhouse',
        description: 'The historic bathhouses of Kyoto that inspired Yubaba\'s magical bathhouse for spirits.',
        image: 'https://via.placeholder.com/200x120/7c2d12/ffffff?text=Bathhouse',
        lat: 33.8521,
        lng: 132.7864,
        billboards: [
          {
            id: 'bathhouse-1',
            heading: 120,
            pitch: -5,
            title: 'The Boiler Room',
            content: 'Kamaji\'s domain where the bathhouse\'s magic is powered by coal and ancient spirits.',
            type: 'workshop',
            quote: '"These coal pieces are the bathhouse\'s life force."',
            details: 'Six-armed Kamaji tends to the boilers with help from soot sprites carrying coal.'
          },
          {
            id: 'bathhouse-2',
            heading: 140,
            pitch: 0,
            title: 'The Main Bath',
            content: 'The grand bathing hall where spirits come to cleanse themselves.',
            type: 'sanctuary',
            quote: '"Welcome to the bathhouse. Enjoy your stay."',
            details: 'Ornate baths filled with healing waters, tended by bathhouse workers.'
          }
        ]
      },
      {
        heading: 270,
        pitch: 0,
        text: 'Bamboo Forest',
        description: 'The enchanted bamboo groves where spirits roam and magic comes alive.',
        image: 'https://via.placeholder.com/200x120/10b981/ffffff?text=Bamboo+Forest',
        lat: 35.0170,
        lng: 135.6711,
        billboards: [
          {
            id: 'bamboo-1',
            heading: 270,
            pitch: 0,
            title: 'The Whispering Grove',
            content: 'Ancient bamboo stalks that whisper secrets and guide lost souls.',
            type: 'mystical',
            quote: '"The bamboo speaks to those who listen with their hearts."',
            details: 'The rustling bamboo creates a natural symphony that spirits find comforting.'
          },
          {
            id: 'bamboo-2',
            heading: 290,
            pitch: -10,
            title: 'The Hidden Path',
            content: 'Secret pathways through the bamboo that lead to magical destinations.',
            type: 'secret',
            quote: '"Follow the path, but be careful not to lose your way."',
            details: 'Narrow paths wind through the bamboo, known only to spirits and forest guardians.'
          }
        ]
      },
      {
        heading: 45,
        pitch: -8,
        text: 'Fushimi Inari Shrine',
        description: 'The thousands of vermillion torii gates that inspired the tunnel entrance to the spirit world.',
        image: 'https://via.placeholder.com/200x120/dc2626/ffffff?text=Torii+Gates',
        lat: 25.1099,
        lng: 121.8452,
      }
    ],
  },
  {
    id: '6',
    title: 'Journey to the West (Monkey King)',
    lat: 34.35,
    lng: 119.20,
    altitude: 120,
    description: 'Mount Huashan, China - The legendary mountain where the Monkey King began his journey',
    author: 'Wu Cheng\'en',
    year: 1592,
    genre: 'Classical Chinese Literature',
    storyPoints: [
      {
        heading: 0,
        pitch: -15,
        text: 'Flower Fruit Mountain',
        description: 'The mystical mountain home of Sun Wukong, the Monkey King, surrounded by magical peaches and immortal springs.',
        image: 'https://via.placeholder.com/200x120/f59e0b/ffffff?text=Flower+Fruit+Mountain',
        lat: 34.3416,
        lng: 108.9398,
        billboards: [
          {
            id: 'flower-fruit-1',
            heading: 0,
            pitch: -15,
            title: 'The Stone Monkey\'s Birth',
            content: 'The magical stone from which Sun Wukong was born, infused with cosmic energy.',
            type: 'origin',
            quote: '"From the stone came forth a stone monkey, who could walk and run the moment he was born."',
            details: 'The stone absorbed the essence of heaven and earth for countless years before giving birth to the Monkey King.'
          },
          {
            id: 'flower-fruit-2',
            heading: 20,
            pitch: -5,
            title: 'The Immortal Peach Grove',
            content: 'Magical peach trees that grant immortality to those who eat their fruit.',
            type: 'treasure',
            quote: '"These peaches ripen once every 3,000 years and grant eternal life."',
            details: 'The most precious treasure of Flower Fruit Mountain, coveted by gods and demons alike.'
          },
          {
            id: 'flower-fruit-3',
            heading: 340,
            pitch: 0,
            title: 'The Water Curtain Cave',
            content: 'The hidden paradise behind the waterfall where the Monkey King established his throne.',
            type: 'palace',
            quote: '"Behind the waterfall lies a cave of wonders, fit for a king."',
            details: 'A magnificent cave palace hidden behind a waterfall, serving as the Monkey King\'s royal court.'
          }
        ]
      },
      {
        heading: 180,
        pitch: -10,
        text: 'Heavenly Peach Garden',
        description: 'The celestial garden where the Monkey King caused havoc by eating the immortal peaches.',
        image: 'https://via.placeholder.com/200x120/ec4899/ffffff?text=Peach+Garden',
        lat: 34.3500,
        lng: 108.9450,
        billboards: [
          {
            id: 'peach-garden-1',
            heading: 180,
            pitch: -10,
            title: 'The Jade Emperor\'s Garden',
            content: 'The most sacred garden in heaven, tended by immortal gardeners.',
            type: 'divine',
            quote: '"Even in heaven, no garden was more beautiful than this."',
            details: 'The crown jewel of the celestial realm, where the gods\' most precious peaches grow.'
          },
          {
            id: 'peach-garden-2',
            heading: 200,
            pitch: 0,
            title: 'The Great Feast Preparation',
            content: 'Where the immortal peaches were prepared for the Jade Emperor\'s grand banquet.',
            type: 'event',
            quote: '"The peaches were being prepared for the grandest feast in heaven."',
            details: 'The Monkey King discovered he wasn\'t invited to the feast and decided to eat all the peaches himself.'
          }
        ]
      },
      {
        heading: 90,
        pitch: -5,
        text: 'Five Elements Mountain',
        description: 'The sacred mountain where Buddha imprisoned the Monkey King for 500 years under a rock.',
        image: 'https://via.placeholder.com/200x120/6b7280/ffffff?text=Five+Elements+Mountain',
        lat: 34.3300,
        lng: 108.9300,
        billboards: [
          {
            id: 'five-elements-1',
            heading: 90,
            pitch: -5,
            title: 'Buddha\'s Prison',
            content: 'The massive rock seal that held the Monkey King captive for five centuries.',
            type: 'prison',
            quote: '"Not even your 72 transformations can free you from this mountain."',
            details: 'Buddha\'s hand transformed into a mountain, trapping the rebellious Monkey King beneath.'
          },
          {
            id: 'five-elements-2',
            heading: 110,
            pitch: 5,
            title: 'The Liberation',
            content: 'Where Tang Sanzang freed the Monkey King to begin their journey to the west.',
            type: 'freedom',
            quote: '"Master, you have freed me from my 500-year imprisonment!"',
            details: 'The monk\'s compassion and mission freed the Monkey King, beginning their epic journey.'
          }
        ]
      },
    ],
  },
];