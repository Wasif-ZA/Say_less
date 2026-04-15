import type { Category } from "./types";

const partyTime = [
  "Dancing","Karaoke","Cake","Balloons","DJ","Confetti","Beer Pong","Piñata",
  "Disco Ball","Limbo","Photo Booth","Champagne","Costume","Fireworks","Toast",
  "Streamer","Bounce House","Pool Party","Bonfire","Glow Sticks","Red Cup",
  "Playlist","Shots","Keg","Dance Floor","Dare","Truth or Dare","Spin the Bottle",
  "Conga Line","Party Hat","Sparkler","Strobe Light","Fog Machine","Body Paint",
  "Midnight","Salsa","Cumbia","Merengue","Bachata","Reggaeton","Acoustic","Guitar",
  "Piano","Drums","Bass Guitar","Saxophone","Trumpet","Violin","Cello","Flute",
  "Clarinet","Oboe","Harp","Synthesizer","Crowd Surfing","Mosh Pit","Headbanging",
  "Glow Paint","Blacklight","Laser Show","VIP Section","Guest List","Bouncer",
  "Tequila", "Margarita", "Beer", "Wine", "Whiskey", "Vodka", "Cocktail", "Neon",
  "Rave", "House Party", "Frat Party", "Tailgate", "Festival", "Concert", "Jello Shots",
  "Flip Cup", "Hangover", "Afterparty", "Pre-game", "Party Bus", "Limo", "Chandelier",
  "EDM", "Hip Hop", "Dance Off", "Microphone", "Speakers", "Bass", "Turntable",
  "Mixer", "Catering", "Appetizers", "Finger Food", "Buffet", "Cupcakes", "Ice Cream Cake",
  "Brownies", "Cookies", "Helium", "Banners", "Party Favors", "Gift Bag", "Gift Wrap",
  "Ribbon", "Wrapping Paper", "Confetti Cannon", "New Year's Eve", "Birthday",
  "Anniversary", "Graduation", "Retirement", "Baby Shower", "Bridal Shower", "Bachelorette",
  "Bachelor Party", "Engagement", "Reception", "Speech", "Tuxedo", "Gown", "High Heels",
  "Dress Shoes", "Bowtie", "Cufflinks", "Makeup", "Perfume", "Cologne", "Gaye Holud",
  "Mehendi", "Biye Bari", "Dawat"
];

const celebrities = [
  "Taylor Swift","Brad Pitt","Beyonce","Tom Cruise","Lady Gaga","Drake",
  "Rihanna","Dwayne Johnson","Oprah","Leonardo DiCaprio","Kim Kardashian",
  "Elon Musk","Ariana Grande","Chris Hemsworth","Zendaya","Bad Bunny",
  "Travis Scott","Billie Eilish","Post Malone","Selena Gomez","Justin Bieber",
  "Snoop Dogg","Shakira","Will Smith","Morgan Freeman","Cardi B","The Weeknd",
  "Nicki Minaj","Ice Spice","Harry Styles", "Tom Hanks", "Meryl Streep",
  "Denzel Washington", "Julia Roberts", "Robert De Niro", "Al Pacino", "Johnny Depp",
  "Angelina Jolie", "Harrison Ford", "Samuel L. Jackson", "Scarlett Johansson",
  "Chris Evans", "Robert Downey Jr", "Mark Ruffalo", "Jeremy Renner", "Paul Rudd",
  "Brie Larson", "Tom Holland", "Chadwick Boseman", "Benedict Cumberbatch",
  "Chris Pratt", "Zoe Saldana", "Dave Bautista", "Bradley Cooper", "Vin Diesel",
  "Hugh Jackman", "Patrick Stewart", "Ian McKellen", "Ryan Reynolds", "Ryan Gosling",
  "Emma Stone", "Jennifer Lawrence", "Gwyneth Paltrow", "Anne Hathaway", "Natalie Portman",
  "Mila Kunis", "Ashton Kutcher", "Bruce Willis", "Sylvester Stallone", "Arnold Schwarzenegger",
  "Keanu Reeves", "Matt Damon", "Ben Affleck", "George Clooney", "Christian Bale",
  "Heath Ledger", "Joaquin Phoenix", "Jared Leto", "Margot Robbie", "Gal Gadot",
  "Jason Momoa", "Ezra Miller", "Henry Cavill", "Ben Stiller", "Adam Sandler",
  "Will Ferrell", "Steve Carell", "Jim Carrey", "Robin Williams", "Eddie Murphy",
  "Kevin Hart", "Jack Black", "Seth Rogen", "Jonah Hill", "Michael Cera",
  "Jesse Eisenberg", "Woody Harrelson", "Matthew McConaughey", "Channing Tatum",
  "Ryan Phillippe", "Zac Efron", "Justin Timberlake", "Bruno Mars", "Ed Sheeran",
  "Shawn Mendes", "Charlie Puth", "John Legend", "Pharrell Williams", "Kanye West",
  "Jay-Z", "Eminem", "50 Cent", "Kendrick Lamar", "J. Cole", "Future", "Lil Wayne",
  "Adele", "Katy Perry", "Miley Cyrus", "Dua Lipa", "Doja Cat", "Megan Thee Stallion",
  "Lizzo", "Olivia Rodrigo", "Billie Joe Armstrong", "Dave Grohl", "Kurt Cobain",
  "Freddie Mercury", "Elton John"
];

const christmas = [
  "Reindeer","Santa Claus","Snowman","Presents","Elf","Sleigh","Candy Cane",
  "Gingerbread","Mistletoe","Chimney","Eggnog","Nutcracker","Ornament","Tinsel",
  "Wreath","Stocking","Fruitcake","Caroling","Snow Globe","Ugly Sweater",
  "North Pole","Hot Cocoa","Ice Skating","Fireplace","Christmas Tree","Angel",
  "Scrooge","Grinch","Frosty","Rudolph", "Sledding", "Snowball Fight", "Ice Fishing",
  "Glacier", "Avalanche", "Blizzard", "Frostbite", "Icicle", "Snowplow", "Snowmobile",
  "Skiing", "Snowboarding", "Ice Hockey", "Figure Skating", "Bobsled", "Luge", "Curling",
  "Ski Jump", "Biatlon", "Speed Skating", "Yule Log", "Nutcracker Ballet", "A Christmas Carol",
  "Home Alone", "Polar Express", "Elf on the Shelf", "Advent Calendar", "Nativity Scene",
  "Manger", "Wise Men", "Star of Bethlehem", "Myrrh", "Frankincense", "Gold", "Christmas Eve",
  "Boxing Day", "New Year's Day", "Epiphany", "Twelfth Night", "Poinsettia", "Holly", "Ivy",
  "Pinecone", "Evergreen", "Fir Tree", "Spruce", "Pine", "Cedar", "Ribbon", "Wrapping Paper",
  "Gift Tag", "Tape", "Scissors", "Bow", "Gift Box", "Stocking Stuffer", "Coal", "Santa's Workshop",
  "Mrs. Claus", "Elves", "Toy Vault", "Naughty List", "Nice List", "Chimney Sweep", "Hearth",
  "Firewood", "Kindling", "Matches", "Hot Chocolate", "Marshmallow", "Peppermint", "Cinnamon",
  "Nutmeg", "Cloves", "Ginger", "Allspice", "Vanilla", "Chestnuts", "Roasting", "Open Fire",
  "Jack Frost", "Winter Wonderland", "Sleigh Bells", "Jingle Bells", "Silent Night", "Deck the Halls",
  "Joy to the World", "O Holy Night", "First Noel", "Hark the Herald", "Sugar Plum", "Fairy",
  "Magic", "Miracle", "Peace", "Love", "Joy", "Hope"
];

const foods = [
  "Pizza","Sushi","Tacos","Pasta","Burger","Ice Cream","Chocolate","Pancakes",
  "Steak","Salad","Ramen","Curry","Fried Chicken","Hot Dog","Waffles","Croissant",
  "Donut","Lobster","Pho","Burrito","Dim Sum","Fish and Chips","Gelato","Pretzel",
  "Nachos","Cheesecake","Popcorn","Spaghetti","French Fries","Avocado Toast",
  "Kebab","Pad Thai","Tiramisu","Miso Soup","Cornbread","Gumbo","Falafel",
  "Ceviche","Samosa","Baklava", "Apple", "Banana", "Orange", "Grape", "Strawberry",
  "Blueberry", "Raspberry", "Blackberry", "Watermelon", "Cantaloupe", "Honeydew",
  "Pineapple", "Mango", "Papaya", "Kiwi", "Peach", "Plum", "Cherry", "Apricot",
  "Pear", "Lemon", "Lime", "Grapefruit", "Coconut", "Pomegranate", "Fig", "Date",
  "Olive", "Tomato", "Cucumber", "Carrot", "Broccoli", "Cauliflower", "Spinach",
  "Lettuce", "Cabbage", "Kale", "Celery", "Asparagus", "Zucchini", "Eggplant",
  "Bell Pepper", "Onion", "Garlic", "Potato", "Sweet Potato", "Yam", "Radish",
  "Turnip", "Beet", "Corn", "Pea", "Green Bean", "Soybean", "Lentil", "Chickpea",
  "Black Bean", "Kidney Bean", "Pinto Bean", "Lima Bean", "Rice", "Wheat", "Oat",
  "Barley", "Quinoa", "Buckwheat", "Millet", "Sorghum", "Rye", "Spelt", "Bread",
  "Bagel", "Muffin", "Biscuit", "Scone", "Tortilla", "Pita", "Naan", "Roti",
  "Chapati", "Cheese", "Milk", "Butter", "Yogurt", "Cream", "Sour Cream", "Cottage Cheese",
  "Brie", "Cheddar", "Gouda", "Mozzarella", "Parmesan", "Swiss Cheese", "Feta",
  "Provolone", "Ricotta", "Blue Cheese", "Eggs", "Bacon", "Sausage", "Fuchka",
  "Kacchi Biryani", "Jhalmuri", "Tehari", "Chotpoti", "Singara", "Borhani", "Pitha"
];

const places = [
  "Airport","Beach","Library","Hospital","Museum","Casino","Zoo","Gym","Church",
  "Prison","School","University","Farm","Bakery","Bank","Aquarium","Theater",
  "Stadium","Submarine","Spaceship","Volcano","Desert","Jungle","Castle",
  "Lighthouse","Supermarket","Restaurant","Amusement Park","Ski Resort",
  "Cruise Ship","Pyramid","Haunted House","Observatory","Train Station",
  "Fire Station","Bowling Alley","Movie Theater","Nightclub","Wedding",
  "Funeral Home","Car Wash","Laundromat","Pet Store","Dentist","Barbershop",
  "Construction Site","Oil Rig","Space Station","North Pole","Treehouse",
  "Post Office", "Police Station", "Court House", "City Hall", "Embassy", "Consulate",
  "Passport Office", "DMV", "Toll Booth", "Border Crossing", "Bus Station", "Subway Station",
  "Taxi Stand", "Parking Garage", "Gas Station", "Mechanic", "Car Dealership",
  "Rental Car Agency", "Harbor", "Marina", "Port", "Dock", "Pier", "Boardwalk",
  "Promenade", "Boulevard", "Avenue", "Street", "Alley", "Cul-de-sac", "Intersection",
  "Roundabout", "Traffic Light", "Stop Sign", "Crosswalk", "Overpass", "Underpass",
  "Tunnel", "Bridge", "Highway", "Freeway", "Expressway", "Turnpike", "Dirt Road",
  "Trail", "Path", "Sidewalk", "Park", "Playground", "Picnic Area", "Campground",
  "RV Park", "Motel", "Hotel", "Resort", "Hostel", "Bed and Breakfast", "Cabin",
  "Cottage", "Villa", "Mansion", "Apartment", "Condominium", "Townhouse", "Duplex",
  "Penthouse", "Loft", "Studio", "Shelter", "Orphanage", "Nursing Home", "Retirement Community",
  "Hospice", "Clinic", "Pharmacy", "Veterinarian", "Groomer", "Kennel", "Pound",
  "Botanical Garden", "Greenhouse", "Nursery", "Florist", "Landscaper", "Hardware Store",
  "Lumber Yard", "Warehouse", "Factory", "Mill", "Plant", "Refinery", "Mine",
  "Quarry", "Winery", "Brewery", "Distillery", "Vineyard", "Orchard", "Grove",
  "Cox's Bazar", "Sundarbans", "Tea Garden", "TSC", "Hatirjheel", "Lalbagh Fort"
];

const animals = [
  "Elephant","Penguin","Dolphin","Eagle","Tiger","Giraffe","Octopus","Kangaroo",
  "Panda","Shark","Chameleon","Flamingo","Sloth","Hedgehog","Parrot","Wolf",
  "Whale","Cobra","Gorilla","Jellyfish","Peacock","Bat","Koala","Cheetah",
  "Seahorse","Toucan","Armadillo","Platypus","Manta Ray","Firefly","Polar Bear",
  "Red Panda","Owl","Crocodile","Hummingbird","Moose","Scorpion","Pufferfish",
  "Axolotl","Starfish", "Lion", "Leopard", "Jaguar", "Panther", "Cougar", "Puma",
  "Lynx", "Bobcat", "Ocelot", "Caracal", "Serval", "Hyena", "Jackal", "Coyote", "Fox",
  "Dingo", "Wild Dog", "Bear", "Grizzly", "Black Bear", "Brown Bear", "Sun Bear",
  "Spectacled Bear", "Chimpanzee", "Orangutan", "Bonobo", "Gibbon", "Macaque",
  "Baboon", "Mandrill", "Lemur", "Tarsier", "Bushbaby", "Anteater", "Pangolin",
  "Aardvark", "Rhinoceros", "Hippopotamus", "Zebra", "Horse", "Donkey", "Mule",
  "Camel", "Llama", "Alpaca", "Vicuna", "Guanaco", "Deer", "Elk", "Caribou",
  "Antelope", "Gazelle", "Impala", "Wildebeest", "Buffalo", "Bison", "Yak", "Cow",
  "Bull", "Ox", "Sheep", "Goat", "Ram", "Ewe", "Pig", "Boar", "Warthog", "Peccary",
  "Rabbit", "Hare", "Pika", "Squirrel", "Chipmunk", "Marmot", "Groundhog", "Prairie Dog",
  "Beaver", "Porcupine", "Capybara", "Guinea Pig", "Hamster", "Gerbil", "Mouse", "Rat",
  "Vole", "Lemming", "Shrew", "Mole", "Flying Fox", "Vampire Bat", "Fruit Bat",
  "Microbat", "Megabat"
];

const sports = [
  "Basketball","Soccer","Tennis","Baseball","Swimming","Golf","Boxing","Surfing",
  "Volleyball","Hockey","Skateboarding","Wrestling","Gymnastics","Archery",
  "Fencing","Skiing","Snowboarding","Rugby","Cricket","Karate","Table Tennis",
  "Badminton","Rock Climbing","Rowing","Diving","Water Polo","Lacrosse",
  "Bowling","Dodgeball","Arm Wrestling", "Marathon", "Triathlon", "Decathlon",
  "Heptathlon", "Pentathlon", "Sprint", "Hurdles", "Relay", "Long Jump", "High Jump",
  "Triple Jump", "Pole Vault", "Shot Put", "Discus", "Javelin", "Hammer Throw",
  "Weightlifting", "Powerlifting", "Bodybuilding", "Crossfit", "Kettlebell", "Strongman",
  "Tug of War", "Bouldering", "Ice Climbing", "Mountaineering", "Alpinism", "Hiking",
  "Trekking", "Backpacking", "Orienteering", "Geocaching", "Parkour", "Freerunning",
  "Longboarding", "Alpine Skiing", "Cross Country Skiing", "Freestyle Skiing",
  "Biathlon", "Bobsled", "Luge", "Skeleton", "Ice Skating", "Figure Skating",
  "Speed Skating", "Short Track", "Synchronized Skating", "Ice Hockey", "Bandy",
  "Curling", "Ringette", "Broomball", "Synchronized Swimming", "Open Water",
  "Bodyboarding", "Wakeboarding", "Water Skiing", "Kite Surfing", "Wind Surfing",
  "Sailing", "Yachting", "Canoeing", "Kayaking", "Rafting", "Paddleboarding",
  "Dragon Boat", "Fishing", "Angling", "Fly Fishing", "Ice Fishing", "Equestrian",
  "Dressage", "Show Jumping", "Eventing", "Polo", "Horse Racing", "Rodeo", "Bull Riding",
  "Barrel Racing", "Vaulting", "Cycling", "Road Cycling", "Track Cycling", "Mountain Biking",
  "BMX", "Cyclo-cross", "Motorcycle Racing", "Motocross", "Supercross", "Speedway"
];

const spicy = [
  "Kiss","Secret","Scandal","Crush","Ex","Gossip","Skinny Dipping","Dare",
  "Flirting","Blind Date","Love Letter","Jealousy","Rumor","Confession",
  "Heartbreak","Rebound","Catfish","Ghost","Situationship","Walk of Shame",
  "Pickup Line","Wingman","Friend Zone","Drama","Breakup Text","Stalker",
  "Hickey","Side Eye","Hot Take","Caught in the Act", "Tinder", "Bumble", "Hinge",
  "Raya", "Late Night Text", "Sneaking Out", "Cover Up", "Alibi", "White Lie",
  "Betrayal", "Double Life", "Affair", "Temptation", "Forbidden", "Taboo", "Naughty",
  "Guilty Pleasure", "Secret Santa", "Eavesdrop", "Overheard", "Exposed", "Cancelled",
  "Receipts", "Screenshot", "DM Slide", "Thirst Trap", "OnlyFans", "Sugar Daddy",
  "Sugar Baby", "Trophy Wife", "Gold Digger", "Prenup", "Divorce", "Alimony",
  "Child Support", "Custody", "Paternity Test", "DNA", "Lie Detector", "Polygraph",
  "Investigation", "Private Eye", "Surveillance", "Wiretap", "Blackmail", "Extortion",
  "Bribery", "Corruption", "Scam", "Fraud", "Embezzlement", "Money Laundering",
  "Tax Evasion", "Offshore Account", "Shell Company", "Cayman Islands", "Swiss Bank",
  "Hush Money", "NDA", "Gag Order", "Lawsuit", "Settlement", "Class Action",
  "Subpoena", "Deposition", "Testimony", "Perjury", "Contempt", "Verdict", "Guilty",
  "Innocent", "Acquitted", "Pardon", "Parole", "Probation", "Community Service",
  "House Arrest", "Ankle Monitor", "Bail", "Bond", "Jail", "Prison", "Inmate",
  "Warden", "Guard", "Smuggle", "Contraband", "Shank", "Solitary", "Riot", "Escape",
  "Fugitive", "Manhunt", "Bounty", "Most Wanted", "Interpol", "Extradition",
  "Asylum", "Refugee", "Deportation", "Para'r Aunty", "Biye Bari Drama", "Secret Prem",
  "Chhaad Date", "Coaching Bunker", "Caught by Abba", "Bhabi Gossip", "Rishta",
  "Cousin Drama", "Chapa Mara"
];

const bangladeshi = [
  // Food & Drinks
  "Biryani","Panta Bhat","Hilsa","Fuchka","Chotpoti","Jilapi","Mishti Doi",
  "Roshogolla","Singara","Pitha","Haleem","Kacchi","Bhuna Khichuri","Lassi",
  "Borhani","Doi Chira","Shondesh","Chanachur","Nimki","Paratha",
  // Places & Landmarks
  "Cox's Bazar","Sundarbans","Lalbagh Fort","Ahsan Manzil","Hatirjheel","Dhaka",
  "Sylhet","Chittagong","Sajek Valley","Bandarban","Kuakata","Rangamati",
  "Srimangal","Sonargaon","Mohasthangarh",
  // Culture & Traditions
  "Pohela Boishakh","Rickshaw Art","Nakshi Kantha","Baul","Ekushey February",
  "Salwar Kameez","Mehndi","Alpona","Durga Puja","Eid Jamat","Gaye Holud",
  "Muslin","Lungi","Gamcha","Dhol",
  // People & Entertainment
  "Shakib Al Hasan","Mashrafe","Manna","Humayun Ahmed","Lalon",
  "Kazi Nazrul Islam","Rabindranath","Moushumi",
  // Everyday Life & Slang
  "CNG","Tempo","Bhodro Lok","Adda","Hartal","Cha","Mama","Bhai","Taka",
  "Onek Boro Bappar Pola"
];

export const CATEGORIES: Category[] = [
  { id: "party_time", name: "Party Time", emoji: "🪩", description: "Easygoing fun with laughs and a bit of chaos — perfect for any group.", words: partyTime },
  { id: "celebrities", name: "Celebrities", emoji: "⭐", description: "Famous names from movies, music, and more. Act like you're in the loop!", words: celebrities },
  { id: "christmas", name: "Christmas", emoji: "🎅", description: "Festive vibes and winter magic — cozy up and see who's naughty or nice!", words: christmas },
  { id: "foods", name: "Food", emoji: "🍣", description: "Tasty topics, but say the wrong thing and you're toast!", words: foods },
  { id: "places", name: "Places", emoji: "🗽", description: "Countries, landmarks, cities — just act like you've been there!", words: places },
  { id: "animals", name: "Animals", emoji: "🐶", description: "From pets to wild beasts — can you blend in without giving yourself away?", words: animals },
  { id: "sports", name: "Sports", emoji: "🏀", description: "Whether you're a fan or faking it, you'll need to keep a straight face.", words: sports },
  { id: "spicy", name: "Spicy", emoji: "🌶️", description: "Bold, cheeky, a little risky — perfect for stirring up tension and laughs.", words: spicy },
  { id: "bangladeshi", name: "Bangladeshi", emoji: "🇧🇩", description: "Deshi through and through — if you know, you know. Imposters won't survive this one.", words: bangladeshi },
];

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

// Word-specific hints — gives the imposter a fighting chance without giving the word away
const HINTS: Record<string, string> = {
  // Party Time
  "Dancing":"Moving your body","Karaoke":"Singing on stage","Cake":"Sweet dessert","Balloons":"Floating decorations","DJ":"Plays music","Confetti":"Tiny paper pieces","Beer Pong":"Cups and balls","Piñata":"Hit it with a stick","Disco Ball":"Shiny spinning sphere","Limbo":"How low can you go","Photo Booth":"Say cheese","Champagne":"Bubbly drink","Costume":"Dress up as someone else","Fireworks":"Explodes in the sky","Toast":"Raise your glass","Streamer":"Long colorful paper","Bounce House":"Jump inside it","Pool Party":"Swimsuits required","Bonfire":"Outdoor flames","Glow Sticks":"Snap and shine","Red Cup":"Iconic party drink holder","Playlist":"List of songs","Shots":"Small strong drinks","Keg":"Big barrel of beer","Dance Floor":"Where you move","Dare":"I dare you","Truth or Dare":"Pick one","Spin the Bottle":"Round and round","Conga Line":"Follow the leader","Party Hat":"Pointy head decoration","Sparkler":"Handheld firework","Strobe Light":"Flash flash flash","Fog Machine":"Makes it hazy","Body Paint":"Art on skin",
  // Celebrities
  "Taylor Swift":"Pop singer songwriter","Brad Pitt":"Hollywood leading man","Beyonce":"Queen of R&B","Tom Cruise":"Action movie star","Lady Gaga":"Born this way","Drake":"Started from the bottom","Rihanna":"Umbrella singer","Dwayne Johnson":"The Rock","Oprah":"Talk show queen","Leonardo DiCaprio":"Titanic actor","Kim Kardashian":"Reality TV mogul","Elon Musk":"Tech billionaire","Ariana Grande":"Thank u next","Chris Hemsworth":"Thor actor","Zendaya":"Euphoria star","Bad Bunny":"Latin reggaeton","Travis Scott":"Astroworld rapper","Billie Eilish":"Bad guy singer","Post Malone":"Tattoo face rapper","Selena Gomez":"Disney to pop","Justin Bieber":"Canadian pop star","Snoop Dogg":"West coast rapper","Shakira":"Hips don't lie","Will Smith":"Fresh prince","Morgan Freeman":"Narrator voice","Cardi B":"Bodak Yellow","The Weeknd":"Blinding Lights","Nicki Minaj":"Super Bass","Ice Spice":"Munch rapper","Harry Styles":"One Direction solo",
  // Christmas
  "Reindeer":"Pulls the sleigh","Santa Claus":"Ho ho ho","Snowman":"Made of three balls","Presents":"Wrapped surprises","Elf":"Small holiday helper","Sleigh":"Rides through snow","Candy Cane":"Red and white striped","Gingerbread":"Decorated cookie","Mistletoe":"Kiss underneath it","Chimney":"He comes down this","Eggnog":"Creamy holiday drink","Nutcracker":"Wooden soldier","Ornament":"Hangs on a tree","Tinsel":"Shiny tree strands","Wreath":"Hangs on the door","Stocking":"Hung by the fireplace","Fruitcake":"Nobody wants it","Caroling":"Singing door to door","Snow Globe":"Shake it up","Ugly Sweater":"Festive fashion","North Pole":"Top of the world","Hot Cocoa":"Warm chocolate drink","Ice Skating":"Glide on frozen water","Fireplace":"Warm and cozy","Christmas Tree":"Decorated evergreen","Angel":"Top of the tree","Scrooge":"Bah humbug","Grinch":"Green holiday villain","Frosty":"Happy snowman","Rudolph":"Red-nosed guide",
  // Foods
  "Pizza":"Cheesy Italian pie","Sushi":"Raw fish and rice","Tacos":"Mexican shell filling","Pasta":"Italian noodles","Burger":"Bun and patty","Ice Cream":"Frozen sweet treat","Chocolate":"Brown sweet candy","Pancakes":"Flat breakfast stack","Steak":"Grilled red meat","Salad":"Bowl of greens","Ramen":"Japanese noodle soup","Curry":"Spiced sauce dish","Fried Chicken":"Crispy poultry","Hot Dog":"Bun and sausage","Waffles":"Grid pattern breakfast","Croissant":"French flaky pastry","Donut":"Round with a hole","Lobster":"Fancy red seafood","Pho":"Vietnamese soup","Burrito":"Wrapped Mexican meal","Dim Sum":"Small Chinese bites","Fish and Chips":"British fried duo","Gelato":"Italian ice cream","Pretzel":"Twisted salty bread","Nachos":"Chips with cheese","Cheesecake":"Creamy dessert","Popcorn":"Movie snack","Spaghetti":"Long thin noodles","French Fries":"Crispy potato sticks","Avocado Toast":"Millennial breakfast","Kebab":"Meat on a stick","Pad Thai":"Thai stir-fry noodles","Tiramisu":"Coffee Italian dessert","Miso Soup":"Japanese bean broth","Cornbread":"Southern side bread","Gumbo":"Louisiana stew","Falafel":"Fried chickpea balls","Ceviche":"Raw fish citrus","Samosa":"Indian fried pastry","Baklava":"Sweet layered pastry",
  // Places
  "Airport":"Planes take off here","Beach":"Sand and waves","Library":"Quiet book place","Hospital":"Where doctors work","Museum":"Art and history","Casino":"Gambling tables","Zoo":"Caged animals","Gym":"Lift weights here","Church":"Sunday worship","Prison":"Behind bars","School":"Kids learn here","University":"Higher education","Farm":"Crops and livestock","Bakery":"Fresh bread smell","Bank":"Store your money","Aquarium":"Fish behind glass","Theater":"Live performances","Stadium":"Big sports venue","Submarine":"Underwater vessel","Spaceship":"Flies to space","Volcano":"Erupting mountain","Desert":"Hot and sandy","Jungle":"Dense tropical forest","Castle":"Medieval fortress","Lighthouse":"Guides ships at night","Supermarket":"Grocery shopping","Restaurant":"Eat a meal out","Amusement Park":"Roller coasters","Ski Resort":"Snow and slopes","Cruise Ship":"Floating vacation","Pyramid":"Ancient Egyptian tomb","Haunted House":"Scary attraction","Observatory":"Watch the stars","Train Station":"All aboard","Fire Station":"Red trucks here","Bowling Alley":"Roll a strike","Movie Theater":"Big screen popcorn","Nightclub":"Dance until late","Wedding":"Bride and groom","Funeral Home":"Final goodbye","Car Wash":"Soap and rinse","Laundromat":"Wash your clothes","Pet Store":"Buy a puppy","Dentist":"Open your mouth","Barbershop":"Get a haircut","Construction Site":"Hard hats required","Oil Rig":"Ocean drilling platform","Space Station":"Orbiting lab","Treehouse":"Up in the branches","Cox's Bazar":"Longest sea beach","Sundarbans":"Mangrove forest with tigers","Tea Garden":"Green leaves in Sylhet","TSC":"Dhaka University hangout","Hatirjheel":"Dhaka lake and bridge area","Lalbagh Fort":"Mughal fort in Dhaka",
  // Animals
  "Elephant":"Big gray trunk","Penguin":"Waddles on ice","Dolphin":"Smart ocean mammal","Eagle":"American bird of prey","Tiger":"Orange with stripes","Giraffe":"Tallest on land","Octopus":"Eight arms","Kangaroo":"Hops with a pouch","Panda":"Black and white bear","Shark":"Ocean predator teeth","Chameleon":"Changes color","Flamingo":"Pink and stands on one leg","Sloth":"Very very slow","Hedgehog":"Tiny and spiky","Parrot":"Talks back to you","Wolf":"Howls at the moon","Whale":"Biggest in the ocean","Cobra":"Hooded snake","Gorilla":"Large jungle ape","Jellyfish":"Transparent and stings","Peacock":"Beautiful tail feathers","Bat":"Flies at night","Koala":"Sleepy tree hugger","Cheetah":"Fastest on land","Seahorse":"Tiny ocean horse","Toucan":"Big colorful beak","Armadillo":"Armored shell mammal","Platypus":"Duck bill mammal","Manta Ray":"Flat ocean glider","Firefly":"Glows in the dark","Polar Bear":"White arctic hunter","Red Panda":"Small and reddish","Owl":"Who who at night","Crocodile":"Snappy river reptile","Hummingbird":"Tiny fast wings","Moose":"Large antler deer","Scorpion":"Desert stinger tail","Pufferfish":"Inflates when scared","Axolotl":"Smiling water salamander","Starfish":"Five-armed sea creature",
  // Sports
  "Basketball":"Dribble and dunk","Soccer":"Kick the ball into the net","Tennis":"Racket and a net","Baseball":"Hit a home run","Swimming":"Laps in the pool","Golf":"Hole in one","Boxing":"Punch in a ring","Surfing":"Ride a wave","Volleyball":"Hit over the net","Hockey":"Puck on ice","Skateboarding":"Tricks on a board","Wrestling":"Grapple on the mat","Gymnastics":"Flips and balance beam","Archery":"Bow and arrow","Fencing":"Sword fighting sport","Skiing":"Down the snowy mountain","Snowboarding":"One board on snow","Rugby":"Tackle with an oval ball","Cricket":"Bat and wickets","Karate":"Martial arts kicks","Table Tennis":"Tiny racket tiny ball","Badminton":"Shuttlecock sport","Rock Climbing":"Scale the wall","Rowing":"Oars in water","Diving":"Jump into the pool","Water Polo":"Swimming and throwing","Lacrosse":"Net on a stick","Bowling":"Roll a heavy ball","Dodgeball":"Throw and dodge","Arm Wrestling":"Hand strength contest",
  // Bangladeshi
  "Biryani":"Spiced layered rice dish","Panta Bhat":"Fermented leftover rice","Hilsa":"National fish of Bangladesh","Fuchka":"Crispy shell with tangy water","Chotpoti":"Spicy chickpea street snack","Jilapi":"Orange spiral sweet","Mishti Doi":"Sweet set yogurt","Roshogolla":"Spongy milk ball in syrup","Singara":"Fried triangular pastry","Pitha":"Traditional rice cake","Haleem":"Slow-cooked meat porridge","Kacchi":"Dum-cooked mutton biryani","Bhuna Khichuri":"Spiced lentil rice mix","Lassi":"Yogurt drink sweet or salty","Borhani":"Spiced yogurt drink at weddings","Doi Chira":"Flattened rice with yogurt","Shondesh":"Bengali milk sweet","Chanachur":"Crunchy spicy snack mix","Nimki":"Crispy fried flour snack","Paratha":"Layered fried flatbread","Ahsan Manzil":"Pink palace of the Nawabs","Dhaka":"Capital city of Bangladesh","Sylhet":"Land of tea gardens","Chittagong":"Port city and hills","Sajek Valley":"Cloud-covered hilltop destination","Bandarban":"Hill district in the southeast","Kuakata":"Daughter of the sea","Rangamati":"Lake and hills in CHT","Srimangal":"Tea capital of Bangladesh","Sonargaon":"Ancient capital of Bengal","Mohasthangarh":"Oldest archaeological site","Pohela Boishakh":"Bengali New Year celebration","Rickshaw Art":"Colorful paintings on rickshaws","Nakshi Kantha":"Embroidered quilt tradition","Baul":"Mystic folk singers of Bengal","Ekushey February":"Language movement day","Salwar Kameez":"Traditional tunic and pants","Mehndi":"Henna art on hands","Alpona":"White rice paste floor art","Durga Puja":"Hindu festival of the goddess","Eid Jamat":"Congregational Eid prayer","Gaye Holud":"Turmeric ceremony before wedding","Muslin":"Famous fine Dhaka fabric","Lungi":"Wrapped lower garment for men","Gamcha":"Thin cotton towel","Dhol":"Double-sided drum","Shakib Al Hasan":"Bangladesh cricket all-rounder","Mashrafe":"Beloved cricket captain","Manna":"Legendary Dhallywood hero","Humayun Ahmed":"Iconic Bengali novelist","Lalon":"Mystic Baul philosopher","Kazi Nazrul Islam":"Rebel poet of Bengal","Rabindranath":"Nobel laureate Bengali poet","Moushumi":"Popular Dhallywood actress","CNG":"Auto-rickshaw three-wheeler","Tempo":"Shared minibus transport","Bhodro Lok":"Gentleman or respectable person","Adda":"Casual hangout and chat","Hartal":"Political strike day","Cha":"Tea that fuels everything","Mama":"Universal term for any dude","Bhai":"Brother or close friend","Taka":"Bangladeshi currency","Onek Boro Bappar Pola":"Rich kid flexing attitude",
  // Spicy
  "Kiss":"Lips meet lips","Secret":"Don't tell anyone","Scandal":"Shocking news","Crush":"Butterflies for someone","Ex":"Used to date them","Gossip":"Spilling the tea","Skinny Dipping":"Swimming without clothes","Flirting":"Playful teasing","Blind Date":"Meeting a stranger","Love Letter":"Written feelings","Jealousy":"Green-eyed monster","Rumor":"Unverified story","Confession":"Admitting the truth","Heartbreak":"Love gone wrong","Rebound":"Too soon after","Catfish":"Fake online person","Ghost":"Disappear on someone","Situationship":"More than friends less than dating","Walk of Shame":"Morning after trip home","Pickup Line":"Cheesy opener","Wingman":"Helps you score","Friend Zone":"Just friends forever","Drama":"So much chaos","Breakup Text":"Ended by message","Stalker":"Won't stop following","Hickey":"Mark on the neck","Side Eye":"Suspicious glance","Hot Take":"Controversial opinion","Caught in the Act":"Busted red-handed","Para'r Aunty":"Neighborhood gossip lady","Biye Bari Drama":"Chaos at a wedding","Secret Prem":"Hidden romance","Chhaad Date":"Romance on the roof","Coaching Bunker":"Skipping class to hang out","Caught by Abba":"Dad caught you","Bhabi Gossip":"Sister-in-law spilling tea","Rishta":"Marriage proposal","Cousin Drama":"Family politics","Chapa Mara":"Flexing or exaggerating",
};

export function getHintForWord(word: string): string {
  return HINTS[word] || "No hint available";
}
