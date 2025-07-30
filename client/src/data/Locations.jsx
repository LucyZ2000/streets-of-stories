import SpiritedAwayImage from '../assets/img/SpiritedAway.png';
import SherlockImage from '../assets/img/Sherlock.png';
import GatsbyImage from '../assets/img/Gatsby.png';
import HarryImage from '../assets/img/Harry.png';

import GatsbyMusic from '../assets/music/Jazz.mp3';
import HarryMusic from '../assets/music/Wizard.mp3';
import SherlockMusic from '../assets/music/Mystery.mp3';
import SpiritedAwayMusic from '../assets/music/Japanese.mp3';
import MonkeyKingMusic from '../assets/music/Adventure.mp3';

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
        heading: -50,
        pitch: 0,
        text: 'Oheka Castle',
        description: 'The magnificent French Renaissance château that inspired Gatsby\'s West Egg estate, built on the highest point of Long Island\'s Gold Coast.',
        lat: 40.8290054,
        lng: -73.4486544,
        billboards: [
          {
            id: 'gatsby-mansion',
            heading: 140,
            pitch: 0,
            title: 'Gatsby\'s Mansion',
            content: 'The real-life inspiration for Jay Gatsby\'s legendary estate and extravagant parties.',
            type: 'architecture',
            details: 'Built between 1914-1919 by financier Otto Hermann Kahn, Oheka Castle is the largest private home in New York with 127 rooms spanning over 109,000 square feet. This French Renaissance-style château cost $11 million to build (equivalent to $158 million today) and sits majestically on 443 acres at Long Island\'s highest point. F. Scott Fitzgerald visited this opulent Gold Coast mansion with Zelda, drawing inspiration from Kahn\'s lavish parties for the extravagant soirées described in The Great Gatsby.',
            lat: 40.830,
            lng: -73.452,
          }
        ]
      }, {
        heading: 80,
        pitch: -5,
        text: 'Gatsby\'s Study',
        description: 'The private sanctuary where Gatsby retreated to plan his elaborate schemes and dream of recapturing the past.',
        lat: 40.8291131,
        lng: -73.4484051,
        billboards: [
          {
            id: 'gatsby-study',
            heading: 140,
            pitch: 0,
            title: 'Gatsby\'s Private Study',
            content: 'The intimate space where Jay Gatsby contemplated his past and orchestrated his future.',
            type: 'character',
            details: 'This elegant room, filled with leather-bound books that Gatsby never read, served as his private retreat from the glittering parties below. Here, surrounded by the trappings of his carefully constructed persona, Gatsby would stare across the bay toward the green light on Daisy\'s dock, planning elaborate schemes to win back his lost love and believing he could repeat the past.',
            lat: 40.8295,
            lng: -73.4474,
          }
        ]
      }
    ],
  },
  {
    id: '2',
    title: 'Harry Potter',
    lat: 51.749844,
    lng: -1.2558267,
    altitude: 100,
    description: 'Iconic filming locations from the Harry Potter series.',
    author: 'J.K. Rowling',
    year: 1997,
    genre: 'Fantasy',
    image: HarryImage,
    music: HarryMusic,
    storyPoints: [
      {
        text: 'Hogwarts Great Hall',
        description: 'Inspired the Hogwarts Great Hall.',
        lat: 51.749844,
        lng: -1.2558267,
        heading: 80,
        pitch: 10,
        billboards: [
          {
            id: 'christchurch-1',
            heading: 60,
            pitch: -8,
            title: 'Hogwarts Great Hall',
            content: 'Christ Church\'s dining hall inspired the design of the Great Hall at Hogwarts.',
            type: 'location',
            details: 'Christ Church\'s Tudor dining hall features a stunning hammerbeam roof designed by master-carpenter Humphrey Coke, with eight bays supported by stone corbels carved with Henry VIII and Cardinal Wolsey\'s arms. The walls display a collection of portraits including famous alumni, with Henry VIII\'s portrait hanging above the High Table where dons dine. While actual Great Hall scenes were filmed on a replica set at Leavesden Studios, this 16th-century hall provided the visual inspiration for Hogwarts\' magical dining experiences.',
            lat: 51.750215081072824,
            lng: -1.2547261028732304,
          },
        ]
      }, {
        text: 'Hogwards Grand Staircase',
        description: 'This staircase in Christ Church, Oxford, inspired the Hogwarts grand staircase.',
        lat: 51.7499414,
        lng: -1.2549495,
        heading: 210,
        pitch: 15,
        billboards: [
          {
            id: 'christchurch-2',
            heading: 75,
            pitch: 0,
            title: 'Stairs to the Great Hall',
            content: 'The grand staircase appears in scenes where students enter Hogwarts.',
            type: 'architecture',
            details: 'The Bodley Tower staircase at Christ Church College features stunning fan-vaulted ceilings installed in 1638. This architecture was used to film the iconic scene where Harry, Ron, and Hermione first enter Hogwarts and meet Professor McGonagall.',
            lat: 51.7498,
            lng: -1.25506,
          }]
      },

      {
        heading: 0,
        pitch: -5,
        text: 'Goathland Train Station',
        description: 'The Victorian-era heritage railway station that became Hogsmeade Station in Harry Potter and the Philosopher\'s Stone.',
        lat: 54.400607439017726,
        lng: -0.7122201435207112,
        billboards: [
          {
            id: 'goathland-1',
            heading: 120,
            pitch: -5,
            title: 'Hogsmeade Station',
            content: 'This authentic Victorian station doubled as the magical gateway to Hogwarts School.',
            type: 'transport',
            details: 'Built in 1865 by architect Thomas Prosser for the North Eastern Railway, Goathland Station retains its original Victorian charm with traditional stone buildings and period platform furnishings. The station served as Hogsmeade in the first Harry Potter film, where students disembarked from the Hogwarts Express before crossing the lake to reach the castle. Filming took place on October 2, 2000, capturing both Harry\'s arrival and Hagrid\'s farewell scene at the film\'s end.',
            lat: 54.400607439017726,
            lng: -0.7122201435207112,
          },
          {
            id: 'goathland-2',
            heading: 135,
            pitch: 0,
            title: 'Heritage Railway Magic',
            content: 'Part of the North Yorkshire Moors Railway, where steam trains still traverse the stunning moorland.',
            type: 'transport',
            details: 'Goathland Station operates as part of the North Yorkshire Moors Railway, a heritage line running through the North York Moors National Park between Pickering and Whitby. The station has remained virtually unchanged since 1865, restored to represent a typical NER country station circa 1922. Beyond Harry Potter, it also gained fame as Aidensfield Station in the long-running TV series Heartbeat, making it one of Britain\'s most recognizable railway stations.',
            lat: 54.400908,
            lng: -0.7118,
          }
        ]
      },
      {
        text: 'Alnwick Castle',
        description: 'The real-world location used for exterior shots of Hogwarts, including flying lessons.',
        lat: 55.415379,
        lng: -1.705285,
        heading: 290,
        pitch: 1,
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
            title: 'Madam Hooch\'s First Flying Lesson',
            content: 'The castle\'s courtyard was the filming location for Harry\'s first broomstick lesson.',
            type: 'scene',
            details: 'The training ground where Neville loses control and Harry\'s flying skills first emerge.',
            lat: 55.41568633289001,
            lng: -1.7059471809636777,
          }
        ]
      },

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
    music: SherlockMusic,
    storyPoints: [
      {
        heading: 90,
        pitch: 0,
        text: 'Baker Street',
        description: 'The iconic address where the world\'s greatest detective solved his cases.',
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
      {
        heading: 90,
        pitch: 0,
        text: 'Reichenbach Falls',
        description: 'The dramatic waterfall where Holmes confronted his arch-nemesis Moriarty.',
        lat: 46.7145,
        lng: 8.1828,
      },
    ],
  },
  {
    id: '5',
    title: 'Spirited Away',
    lat: 35.0116,
    lng: 135.7681,
    altitude: 80,
    description: 'Animated Japanese film by Studio Ghibli',
    author: 'Hayao Miyazaki',
    year: 2001,
    genre: 'Animated Fantasy',
    image: SpiritedAwayImage,
    music: SpiritedAwayMusic,
    storyPoints: [
      {
        heading: 45,
        pitch: -8,
        text: 'Fushimi Inari Shrine',
        description: 'The thousands of vermillion torii gates that inspired the tunnel entrance to the spirit world.',
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
            details: 'Over 10,000 torii gates donated by individuals and businesses line the mountain paths.',
            lat: 34.9671,
            lng: 135.7727,
          },
          {
            id: 'torii-2',
            heading: 60,
            pitch: -5,
            title: 'The Spirit Tunnel',
            content: 'Chihiro and her parents walked through a similar tunnel that led them to the abandoned theme park.',
            type: 'gateway',
            details: 'The entrance to the spirit world, where humans must be careful not to eat the food of the spirits.',
            lat: 34.9675,
            lng: 135.7730,
          }
        ]
      },
      {
        heading: 120,
        pitch: -5,
        text: 'Traditional Bathhouse',
        description: 'The historic bathhouses of Kyoto that inspired Yubaba\'s magical bathhouse for spirits.',
        lat: 33.8521,
        lng: 132.7864,
        billboards: [
          {
            id: 'bathhouse-1',
            heading: 120,
            pitch: -5,
            title: 'Yubaba\'s Bathhouse',
            content: 'The magnificent multi-story bathhouse where spirits come to cleanse themselves.',
            type: 'building',
            details: 'A luxurious establishment run by the witch Yubaba, employing humans and spirits alike.',
            lat: 33.8521,
            lng: 132.7864,
          },
          {
            id: 'bathhouse-2',
            heading: 140,
            pitch: 0,
            title: 'The Boiler Room',
            content: 'Kamaji\'s domain deep in the bathhouse, where he controls the magic that heats the baths.',
            type: 'workspace',
            details: 'A massive room filled with pipes, furnaces, and magical soot sprites who help with the work.',
            lat: 33.8525,
            lng: 132.7860,
          },
          {
            id: 'bathhouse-3',
            heading: 100,
            pitch: 5,
            title: 'The River Spirit\'s Bath',
            content: 'The special bath where Chihiro helped cleanse the polluted River Spirit.',
            type: 'healing',
            details: 'The most challenging customer, revealed to be a powerful river spirit covered in human pollution.',
            lat: 33.8518,
            lng: 132.7867,
          }
        ]
      },
      {
        heading: 270,
        pitch: 0,
        text: 'JR Shimonada Station',
        description: 'Beautiful seaside train station that inspired the serene train ride in Spirited Away.',
        lat: 33.6550,
        lng: 132.5892,
        billboards: [
          {
            id: 'train-station-1',
            heading: 270,
            pitch: 0,
            title: 'The Spirit Train',
            content: 'The magical train that glides over water, carrying spirits and lost souls.',
            type: 'transport',
            details: 'A transparent train that runs on tracks above the flooded landscape, connecting the spirit world.',
            lat: 33.6550,
            lng: 132.5892,
          },
          {
            id: 'train-station-2',
            heading: 290,
            pitch: -3,
            title: 'The Flooded World',
            content: 'The mystical landscape where the train travels over endless water.',
            type: 'landscape',
            details: 'A dreamlike world where telephone poles rise from water and the train glides silently above.',
            lat: 33.6547,
            lng: 132.5888,
          }
        ]
      },
      {
        heading: 45,
        pitch: -8,
        text: 'Jiu Fen Old Street',
        description: 'The charming old street that inspired the bustling spirit town in Spirited Away.',
        lat: 25.1084638,
        lng: 121.84352,
        billboards: [
          {
            id: 'old-street-1',
            heading: 45,
            pitch: -8,
            title: 'The Spirit Market',
            content: 'Narrow winding streets filled with food stalls and shops selling magical goods.',
            type: 'marketplace',
            details: 'Red lanterns illuminate the bustling streets where spirits shop and dine at night.',
            lat: 25.1099,
            lng: 121.8452,
          },
          {
            id: 'old-street-2',
            heading: 65,
            pitch: 0,
            title: 'The Abandoned Theme Park',
            content: 'Where Chihiro\'s adventure began, a seemingly empty place that comes alive at night.',
            type: 'beginning',
            details: 'What appears to be an abandoned amusement park transforms into a thriving spirit town after dark.',
            lat: 25.1102,
            lng: 121.8455,
          }
        ]
      },
    ],
  },
  {
    id: '6',
    title: 'Journey to the West (Monkey King)',
    lat: 29.520252,
    lng: 103.339445,
    altitude: 1000,
    description: 'Mount Mei, China - The legendary mountain where the Monkey King began his journey',
    author: 'Wu Cheng\'en',
    year: 1592,
    genre: 'Classical Chinese Literature',
    music: MonkeyKingMusic,
    storyPoints: [
      {
        heading: 0,
        pitch: -10,
        text: 'The Celestial Realm',
        description: 'The magnificent heavenly domain of the Jade Emperor, where immortal gods reside above the clouds.',
        lat: 29.520252,
        lng: 103.339445,
        altitude: 2000,
        range: 10000,
        billboards: [
          {
            id: 'celestial-realm-1',
            lat: 29.52035,
            lng: 103.33935,
            heading: 180,
            pitch: -10,
            title: 'Heaven\'s Sacred Domain',
            content: 'The supreme celestial palace where the Jade Emperor rules over all creation.',
            type: 'divine',
            details: 'This heavenly realm floats above the mortal world. Here dwell the immortal deities and celestial bureaucrats who govern the cosmic order under the Jade Emperor\'s supreme authority. Sun Wukong\'s appointments as Protector of the Horses and Guardian of the Peach Garden brought him into the Celestial.'
          }
        ]
      },
      {
        heading: 240,
        pitch: -15,
        text: 'Yunnan Stone Forest',
        description: 'The mystical mountain home of Sun Wukong, the Monkey King, surrounded by magical peaches and immortal springs.',
        lat: 24.8173631,
        lng: 103.3255174,
        altitude: 10000,
        range: 10000,
        billboards: [
          {
            id: 'flower-fruit-1',
            lat: 24.81707,
            lng: 103.3253,
            heading: 90,
            pitch: 2,
            title: 'The Stone Monkey\'s Birth',
            content: 'The magical stone from which Sun Wukong was born, infused with cosmic energy.',
            type: 'origin',
            quote: '"From the stone came forth a stone monkey, who could walk and run the moment he was born."',
            details: 'The stone absorbed the essence of heaven and earth for countless years before giving birth to the Monkey King.'
          },
        ]
      },
      {
        heading: 200,
        pitch: 0,
        text: 'Daoist Mountains',
        description: 'Sacred Qingcheng Mountain, where the Monkey King learned his supernatural powers from Patriarch Subodhi.',
        lat: 30.8999325,
        lng: 103.5709736,
        range: 5000,
        altitude: 1000,
        billboards: [
          {
            id: 'daoist-mountains',
            heading: 90,
            pitch: -5,
            lat: 30.8989,
            lng: 103.5710,
            title: 'Qingcheng Mountain',
            content: 'One of China\'s most sacred Daoist mountains and filming location for the 1986 Journey to the West.',
            type: 'scenery',
            details: 'Known as the "Mountain of Numinous Heart and Elixir Mind, Cave of the Slanted Moon and Three Stars," this mystical peak is where Sun Wukong learned his 72 transformations and cloud-somersaulting abilities from the immortal sage Patriarch Subodhi. The mountain\'s ancient temples and misty peaks provided the perfect backdrop for the classic 1986 television adaptation.'
          }
        ]
      }
    ],
  },
]