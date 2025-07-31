import SpiritedAwayImage from '../assets/img/SpiritedAway.png';
import SherlockImage from '../assets/img/Sherlock.png';
import GatsbyImage from '../assets/img/Gatsby.png';
import HarryImage from '../assets/img/Harry.png';
import MonkeyImage from '../assets/img/Monkey.png';

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
    ]
  },
  {
  id: '3',
  title: 'Sherlock Holmes',
  lat: 51.5237,
  lng: -0.1585,
  altitude: 50,
  description: 'Journey through Victorian London and beyond to explore the authentic locations that inspired Arthur Conan Doyle\'s legendary detective stories. From Holmes\'s iconic Baker Street residence to the dramatic Swiss Alps where he faced his greatest nemesis, experience the real places behind literature\'s most famous consulting detective.',
  author: 'Arthur Conan Doyle',
  year: 1887,
  genre: 'Mystery',
  image: SherlockImage,
  music: SherlockMusic,
  storyPoints: [
    {
      heading: 90,
      pitch: 0,
      text: '221B Baker Street',
      description: 'The world\'s most famous fictional address, immortalized as Sherlock Holmes\'s residence from 1881-1903. This Georgian townhouse in Marylebone served as both home and office for the consulting detective, where he received clients, conducted experiments, and planned his investigations with Dr. Watson.',
      lat: 51.5238494,
      lng: -0.1582883,
      billboards: [
        {
          id: 'baker-street-museum',
          heading: 90,
          pitch: 0,
          title: 'The Sherlock Holmes Museum',
          content: 'Step into the Victorian world of literature\'s greatest detective',
          details: 'Established in 1990, this museum recreates Holmes\'s study exactly as Doyle described it, complete with his chemistry set, violin, and collection of tobacco ash samples. The three-story Georgian house features period furniture, Holmes\'s iconic deerstalker hat and pipe, and exhibits showcasing the detective\'s methods of deduction and forensic science.',
          tags: ['viewpoint'],
          lat: 51.5237679,
          lng: -0.1585471,
        },
        {
          id: 'baker-street-station',
          heading: 120,
          pitch: -10,
          title: 'Baker Street Underground Station',
          content: 'The world\'s first underground railway station, opened in 1863',
          details: 'This Metropolitan Railway station was already 18 years old when Holmes first moved to Baker Street. The station\'s Victorian tilework features silhouettes of the famous detective, making it a pilgrimage site for Holmes enthusiasts. Doyle would have used this very station during his visits to London.',
          tags: ['transport', 'Victorian', 'historical'],
          lat: 51.5226844,
          lng: -0.1571359,
        }
      ]
    },
    {
      heading: 90,
      pitch: 0,
      text: '23 Montague Street',
      description: 'Holmes\'s first known London address before his partnership with Dr. Watson. Located near the British Museum in Bloomsbury, this was where the young detective established his practice as the world\'s first consulting detective. Doyle himself lived nearby and drew inspiration from this scholarly neighborhood for Holmes\'s early cases.',
      lat: 51.5196268,
      lng: -0.1251738,
      billboards: [
        {
          id: 'british-museum',
          heading: 45,
          pitch: 0,
          title: 'The British Museum',
          content: 'Where Holmes researched obscure historical cases',
          details: 'Founded in 1753, the British Museum\'s vast collection provided Holmes with resources for his most challenging cases. The Reading Room, where Karl Marx and Charles Darwin also worked, was likely frequented by the detective when researching historical precedents for unusual crimes.',
          tags: ['research', 'Victorian', 'knowledge'],
          lat: 51.5194133,
          lng: -0.1269566,
        }
      ]
    },
    {
      heading: 90,
      pitch: 0,
      text: 'Reichenbach Falls',
      description: 'The spectacular 250-meter waterfall in the Swiss Alps where Doyle staged Holmes\'s apparent death in "The Final Problem" (1893). Located near Meiringen, these falls were chosen by Doyle during his 1893 visit to Switzerland, believing them sufficiently dramatic and remote for literature\'s most famous fictional death.',
      lat: 46.7143745,
      lng: 8.1828709,
      billboards: [
        {
          id: 'reichenbach-falls',
          heading: 90,
          pitch: 0,
          title: 'The Reichenbach Falls',
          content: 'Where Holmes and Moriarty fought their final battle',
          details: 'On May 4th, 1891, Holmes and Professor Moriarty grappled at the edge of these thundering falls. Doyle wrote: "The roar of water fills the air with a ceaseless clamour." The funicular railway, built in 1899, now carries visitors to the upper falls where a memorial plaque commemorates the fictional struggle.',
          tags: ['climax', 'waterfall', 'memorial'],
          type: 'climax',
          lat: 46.7143745,
          lng: 8.1828709,
        },
        {
          id: 'meiringen-museum',
          heading: 180,
          pitch: -15,
          title: 'Sherlock Holmes Museum, Meiringen',
          content: 'Dedicated to the detective\'s final case in Switzerland',
          details: 'Located in the basement of the English Church where Doyle stayed, this museum displays original manuscripts and explores the real-world inspiration behind "The Final Problem." The museum also examines how Doyle\'s temporary "killing" of Holmes led to unprecedented public outcry and the detective\'s eventual resurrection.',
          tags: ['museum', 'manuscripts', 'history'],
          lat: 46.7294, 
          lng: 8.1826,
        }
      ]
    },
    {
      heading: 180,
      pitch: -5,
      text: 'Scotland Yard',
      description: 'The headquarters of London\'s Metropolitan Police since 1829, located on the Victoria Embankment since 1967 (originally on Whitehall Place). This was where Inspector Lestrade and other officials reluctantly sought Holmes\'s expertise on their most baffling cases, representing the tension between traditional police methods and Holmes\'s revolutionary scientific approach to crime solving.',
      lat: 51.5027733,
      lng: -0.1237526,
      billboards: [
        {
          id: 'new-scotland-yard',
          heading: 180,
          pitch: -5,
          title: 'New Scotland Yard',
          content: 'The nerve center of Victorian London\'s crime fighting',
          details: 'Established in 1829 by Sir Robert Peel, the Metropolitan Police represented modern law enforcement. Inspector Lestrade, described by Holmes as "the best of the professionals," embodied the dedicated but methodical approach that contrasted with Holmes\'s brilliant intuition and scientific methods.',
          tags: ['police', 'Victorian', 'law enforcement'],
          type: 'location',
          lat: 51.5027733,
          lng: -0.1237526,
        },
        {
          id: 'thames-embankment',
          heading: 200,
          pitch: 0,
          title: 'Victoria Embankment',
          content: 'The Thames riverside where many Holmes adventures began',
          details: 'Completed in 1870, this Victorian engineering marvel provided the backdrop for numerous Holmes cases. The gaslit embankment, with its fog-shrouded atmosphere, epitomized the mysterious London that Doyle portrayed in his stories. Many of Holmes\'s nighttime pursuits began along these Thames-side streets.',
          tags: ['Victorian engineering', 'atmosphere', 'Thames'],
          type: 'scene',
          lat: 51.5033,
          lng: -0.1235,
        }
      ]
    },
    {
      heading: 270,
      pitch: 10,
      text: 'The Diogenes Club',
      description: 'The ultra-exclusive gentlemen\'s club on Pall Mall where Mycroft Holmes, Sherlock\'s older brother, spent his days. Founded as the quietest club in London where members were forbidden from speaking, it served as a meeting place for government officials and represented the pinnacle of Victorian establishment power.',
      lat: 51.5049,
      lng: -0.1357,
      billboards: [
        {
          id: 'diogenes-club',
          heading: 270,
          pitch: 10,
          title: 'The Diogenes Club',
          content: 'The strangest club in London - silence mandatory',
          details: 'Mycroft Holmes, described as possessing even greater deductive powers than Sherlock, used this club as his unofficial office. The club\'s rule of absolute silence made it perfect for government work, and its Stranger\'s Room was where the Holmes brothers would meet to discuss cases of national importance.',
          tags: ['exclusive', 'government', 'mystery'],
          lat: 51.5049,
          lng: -0.1357,
        }
      ]
    },
  ]
},
  {
  id: '5',
  title: 'Spirited Away',
  lat: 35.0116,
  lng: 135.7681,
  altitude: 80,
  description: 'Journey through the real-world locations across Japan and Taiwan that inspired Hayao Miyazaki\'s Academy Award-winning masterpiece. From ancient Shinto shrines to traditional bathhouses, explore how Miyazaki transformed authentic cultural landmarks into the magical spirit world that captivated audiences worldwide and became the highest-grossing film in Japanese cinema history.',
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
      description: 'The head shrine of the Shinto deity Inari, established in 711 CE on Mount Inari in southern Kyoto. Famous for its thousands of vermillion torii gates that create mystical tunnels up the mountainside, this sacred site directly inspired the portal entrance to the spirit world in Spirited Away. The shrine represents the intersection between the physical and spiritual realms in Japanese Shinto belief.',
      lat: 34.9671,
      lng: 135.7727,
      billboards: [
        {
          id: 'fushimi-main-shrine',
          heading: 0,
          pitch: -15,
          title: 'Fushimi Inari Taisha Main Shrine',
          content: 'The spiritual heart where fox messengers serve Inari, deity of rice and prosperity',
          details: 'Founded over 1,300 years ago, this shrine complex houses the spirit of Inari, often depicted as a fox. The main buildings showcase traditional Japanese architecture with their distinctive orange-red color, which Miyazaki replicated in his spirit world designs. Thousands of pilgrims visit daily to pray for business success and good harvests.',
          tags: ['shrine', 'Shinto', 'spiritual'],
          lat: 34.9671,
          lng: 135.7727,
        },
        {
          id: 'torii-tunnel',
          heading: 45,
          pitch: -8,
          title: 'The Thousand Torii Gates',
          content: 'Over 10,000 vermillion gates creating mystical pathways between worlds',
          type: 'portal',
          details: 'Each torii gate is donated by individuals or businesses, with the donor\'s name inscribed on the back. The gates create a tunnel-like effect as they wind up the mountain, filtering sunlight into an otherworldly orange glow that directly inspired Chihiro\'s entrance to the spirit realm.',
          tags: ['viewpoint'],
          lat: 34.9670429,
          lng: 135.7746595,
        },
      ]
    },
    {
      heading: 120,
      pitch: -5,
      text: 'Dogo Onsen Honkan',
      description: 'Japan\'s oldest hot spring bathhouse, built in 1894 in Matsuyama, Ehime Prefecture. This three-story wooden structure with its distinctive architecture and traditional bathing culture served as the primary inspiration for Yubaba\'s bathhouse. The building is a designated Important Cultural Property and represents over 3,000 years of Japanese bathing tradition dating back to ancient imperial visits.',
      lat: 33.8520748,
      lng: 132.7864098,
      billboards: [
        {
          id: 'dogo-onsen-exterior',
          heading: 120,
          pitch: -5,
          title: 'Dogo Onsen Honkan',
          content: 'The ancient bathhouse that inspired Yubaba\'s spirit realm establishment',
          type: 'building',
          details: 'Built in 1894, this iconic wooden bathhouse features traditional Japanese architecture with multiple levels, ornate rooflines, and a distinctive drum tower. The building operates exactly as it did over a century ago, with separate baths for different social classes, traditional tatami rest areas, and ceremonial tea service - all elements Miyazaki incorporated into his magical bathhouse.',
          tags: ['viewpoint'],
          lat: 33.8521,
          lng: 132.7864,
        },
      ]
    },
    {
      heading: 270,
      pitch: 0,
      text: 'Shimonada Station',
      description: 'A small unmanned railway station on the JR Yosan Line in Ehime Prefecture, renowned as one of Japan\'s most scenic train stops. Built in 1935, this seaside station sits just meters from the Seto Inland Sea, offering breathtaking views that inspired the ethereal train journey across flooded landscapes in Spirited Away. The station represents the nostalgic romance of rural Japanese rail travel.',
      lat: 33.6551644,
      lng: 132.5893398,
      billboards: [
        {
          id: 'shimonada-platform',
          heading: 270,
          pitch: 0,
          title: 'Shimonada Station Platform',
          content: 'The closest train station to the sea in all of Japan',
          type: 'transport',
          details: 'This tiny two-car platform sits so close to the Seto Inland Sea that waves sometimes splash onto the tracks during storms. The station\'s intimate scale and dramatic coastal setting inspired the magical train sequence where Chihiro travels across endless water to reach Zeniba\'s cottage, representing her journey toward independence and understanding.',
          tags: ['railway', 'coastal', 'scenic'],
          lat: 33.6550,
          lng: 132.5892,
        },
      ]
    },
    {
      heading: 45,
      pitch: -8,
      text: 'Jiufen Old Street',
      description: 'A historic gold mining town in northern Taiwan that flourished during Japanese colonial rule (1895-1945). Built on steep mountain slopes overlooking the Pacific Ocean, Jiufen\'s narrow stone steps, traditional teahouses, and red lantern-lit alleyways provided the atmospheric inspiration for the spirit world\'s bustling marketplace where Chihiro\'s parents are transformed after eating forbidden food.',
      lat: 25.1086101,
      lng: 121.8435693,
      billboards: [
        {
          id: 'jiufen-main-street',
          heading: 45,
          pitch: -8,
          title: 'Jiufen Old Street Market',
          content: 'The winding mountain market that inspired the spirit world\'s food stalls',
          type: 'marketplace',
          details: 'This narrow stepped street winds through the mountainside, packed with traditional food vendors selling local specialties like taro balls, fish ball soup, and peanut ice cream rolls. The covered market\'s intimate scale, diverse aromas, and constant bustle directly inspired the spirit world market where Chihiro\'s parents gorge themselves on mysterious spirit food.',
          tags: ['viewpoint'],
          lat: 25.1084638,
          lng: 121.84352,
        },
        {
          id: 'red-lanterns',
          heading: 60,
          pitch: 0,
          title: 'Traditional Red Lanterns',
          content: 'Hundreds of lanterns creating magical evening atmospheres',
          type: 'atmosphere',
          details: 'Every evening, hundreds of red paper lanterns illuminate Jiufen\'s narrow alleys, creating the warm, mystical glow that Miyazaki replicated in the spirit world\'s nighttime scenes. These lanterns, traditional symbols of prosperity and good fortune, transform the mountain town into a magical realm that blurs the line between reality and fantasy.',
          tags: ['lanterns', 'evening', 'magical atmosphere'],
          lat: 25.1087,
          lng: 121.8440,
        },
        {
          id: 'gold-mining-history',
          heading: 80,
          pitch: -5,
          title: 'Gold Rush Heritage',
          content: 'The boom-and-bust history that shaped Taiwan\'s mountain communities',
          type: 'history',
          details: 'Jiufen\'s gold rush era (1890s-1930s) created a cosmopolitan mountain community with diverse cultural influences. The town\'s later decline and preservation as a tourist destination mirrors themes in Spirited Away about places caught between past and present, tradition and modernity - central concerns in Miyazaki\'s environmental and cultural philosophy.',
          tags: ['gold mining', 'history', 'cultural preservation'],
          lat: 25.1082,
          lng: 121.8433,
        }
      ]
    },
  ]
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
    image: MonkeyImage,
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