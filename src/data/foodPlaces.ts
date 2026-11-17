
export interface FoodPlace {
  id: number;
  name: string;
  category: "Cafe" | "Restaurant" | "Dhaba";
  area: string;
  cuisine: string;
  description: string;
  specialities: string[];
  pricePerPerson: string;
  atmosphere: string;
  address: string;
  mapsQuery: string;
  visitNote: string;
}

export const foodPlaces: FoodPlace[] = [
  {
    id: 1,
    name: "Cafe by Mongas",
    category: "Cafe",
    area: "Dalhousie - Khajjiar Road",
    cuisine: "Cafe, Italian and Bakery",
    description:
      "A popular cafe and bakery known for its food, coffee and relaxed atmosphere.",
    specialities: [
      "Waffles and brownies",
      "Pizza and pasta",
      "Coffee and pancakes",
    ],
    pricePerPerson: "₹200–₹600 (online listing; verify)",
    atmosphere: "Cosy cafe with mountain views",
    address:
      "Dalhousie Khajjiar Road, next to Hotel Gracemount, Dalhousie, Himachal Pradesh 176304, India",
    mapsQuery:
      "Cafe by Mongas, Dalhousie, Himachal Pradesh",
    visitNote:
      "A good option for coffee, breakfast or an unhurried meal.",
  },

  {
    id: 2,
    name: "Off The Trail Cafe",
    category: "Cafe",
    area: "Bakrota Hills",
    cuisine: "Cafe and Home-style Food",
    description:
      "A peaceful cafe experience associated with the Off The Trail property, known for its scenic surroundings and relaxed atmosphere.",
    specialities: [
      "Fresh home-style meals",
      "Warm beverages",
      "Freshly prepared food",
    ],
    pricePerPerson: "Not reliably published",
    atmosphere: "Quiet, cosy and nature-oriented",
    address:
      "Bakrota Hill, Dhupguri, Dalhousie, Himachal Pradesh 176304, India",
    mapsQuery:
      "Off The Trail Cafe, Bakrota Hills, Dalhousie",
    visitNote:
      "Call ahead to confirm cafe access for non-resident visitors and current service timings.",
  },

  {
    id: 3,
    name: "Magic Tree Cafe",
    category: "Cafe",
    area: "Rikh Nali, Dalhousie",
    cuisine: "Indian and Chinese",
    description:
      "A rustic, nature-oriented cafe away from the busier town centre, appreciated for its views and relaxed outdoor setting.",
    specialities: [
      "Special tea",
      "Vegetarian food",
      "Freshly prepared meals",
    ],
    pricePerPerson: "Not reliably published",
    atmosphere: "Rustic, scenic and relaxed",
    address:
      "Jandrigarth Road, Rikh Nali, Himachal Pradesh 176304, India",
    mapsQuery:
      "Magic Tree Cafe, Dalhousie, Himachal Pradesh",
    visitNote:
      "Call ahead to confirm seasonal operation and food availability.",
  },

  {
    id: 4,
    name: "Himalaya Dhaba",
    category: "Dhaba",
    area: "Gandhi Chowk",
    cuisine: "North Indian Vegetarian",
    description:
      "A small vegetarian dhaba serving familiar North Indian comfort food near Dalhousie's main market.",
    specialities: [
      "Dal fry and dal makhani",
      "Paneer dishes",
      "Roti and parathas",
    ],
    pricePerPerson: "Approximately ₹200–₹400 (review-based estimate)",
    atmosphere: "Simple, casual and budget-friendly",
    address:
      "Gandhi Chowk, Moti Tiba, Dalhousie, Himachal Pradesh 176304, India",
    mapsQuery:
      "Himalaya Dhaba, Gandhi Chowk, Dalhousie",
    visitNote:
      "Seating is relatively limited, so avoid peak dinner hours if possible.",
  },

  {
    id: 5,
    name: "Kwality Restaurant",
    category: "Restaurant",
    area: "Gandhi Chowk",
    cuisine: "Indian and Asian",
    description:
      "An established restaurant in the heart of Dalhousie, suitable for a proper sit-down meal.",
    specialities: [
      "Indian main courses",
      "Kofta dishes",
      "Himachali apple tea",
    ],
    pricePerPerson: "Not reliably published",
    atmosphere: "Traditional sit-down restaurant",
    address:
      "Gandhi Chowk, Dalhousie, Himachal Pradesh 176304, India",
    mapsQuery:
      "Kwality Restaurant, Gandhi Chowk, Dalhousie",
    visitNote:
      "A convenient option when exploring the central market area.",
  },

  {
    id: 6,
    name: "Sharma Dhaba",
    category: "Dhaba",
    area: "Khajjiar",
    cuisine: "Indian",
    description:
      "A casual roadside restaurant near the Khajjiar meadow area, appreciated for comforting food and convenient location.",
    specialities: [
      "Fresh parathas",
      "Momos",
      "North Indian meals",
    ],
    pricePerPerson: "Budget-friendly; exact cost not verified",
    atmosphere: "Casual roadside dhaba",
    address:
      "G3X5+6XG, Dalhousie - Chamba Road, Khajjiar, Himachal Pradesh 176314, India",
    mapsQuery:
      "Sharma Dhaba, Khajjiar, Himachal Pradesh",
    visitNote:
      "A convenient food stop during your Khajjiar visit.",
  },

  {
    id: 7,
    name: "Kwality Restaurant",
    category: "Restaurant",
    area: "Khajjiar",
    cuisine: "Indian",
    description:
      "A restaurant near Khajji Nag Temple, conveniently located for visitors exploring the Khajjiar meadow.",
    specialities: [
      "Indian breads",
      "Cafe snacks",
      "Soups and desserts",
    ],
    pricePerPerson: "Not reliably published",
    atmosphere: "Casual tourist-area restaurant",
    address:
      "Near Khajjinag Mandir, Khajjiar, Himachal Pradesh 176314, India",
    mapsQuery:
      "Kwality Restaurant, Khajjiar, Himachal Pradesh",
    visitNote:
      "A practical meal option near the main Khajjiar attractions.",
  },

  {
    id: 8,
    name: "Shiva Cafe",
    category: "Cafe",
    area: "Panchpula",
    cuisine: "Tea, Snacks and Light Meals",
    description:
      "A convenient cafe stop near the Panchpula waterfall area.",
    specialities: [
      "Tea",
      "Local snacks",
      "Light meals",
    ],
    pricePerPerson: "Approximately ₹50–₹150 (online guide estimate)",
    atmosphere: "Simple, casual and convenient",
    address:
      "Panjpula, Chatryara, Dalhousie, Himachal Pradesh 176304, India",
    mapsQuery:
      "Shiva Cafe, Panchpula, Dalhousie",
    visitNote:
      "A convenient stop after exploring Panchpula.",
  },
];
