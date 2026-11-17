
export interface Destination {
  id: number;
  name: string;
  category: "Must Visit" | "Hidden Gem";
  location: string;
  description: string;
  duration: string;
  bestFor: string;
  bestTime: string;
  novemberNote: string;
  image: string;

  thingsToDo: string[];
  nearbyPlaces: string[];
  travelTips: string[];
}

export const destinations: Destination[] = [
  {
    id: 1,
    name: "Dainkund Peak",
    category: "Must Visit",
    location: "Dalhousie",
    description:
      "A scenic mountain viewpoint above Dalhousie, known for its sweeping Himalayan views and peaceful mountain surroundings. A lovely choice if you enjoy a little walk followed by time soaking in the scenery.",
    duration: "Around 2 hours",
    bestFor: "Mountain views and peaceful walks",
    bestTime: "Late morning (10 AM – 12 PM)",
    novemberNote:
      "November can bring chilly winds, frost and reduced visibility. Check the latest weather and road conditions before setting out, and avoid exposed or icy trails.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/9/92/Dainkund_Peak.jpg?utm_campaign=index&utm_content=original&utm_source=commons.wikimedia.org",
    thingsToDo: [
      "Take a relaxed walk towards the viewpoint.",
      "Spend some quiet time enjoying the mountain views.",
      "Visit Pohlani Mata Temple if you feel like exploring further.",
    ],
    nearbyPlaces: [
      "Lakkar Mandi",
      "Kalatop Wildlife Sanctuary",
      "Khajjiar",
    ],
    travelTips: [
      "Wear warm clothes and comfortable walking shoes.",
      "Check the weather and road conditions before leaving.",
      "Try visiting earlier in the day for better chances of clear views.",
      "Avoid the walk if the trail is icy or conditions are unsafe.",
    ],
  },

  {
    id: 2,
    name: "Khajjiar",
    category: "Must Visit",
    location: "Near Dalhousie",
    description:
      "A beautiful open meadow surrounded by dense deodar forests, with a small lake and the historic Khajji Nag Temple. One of the best places around Dalhousie to slow down, enjoy the landscape and spend an unhurried afternoon.",
    duration: "2–3 hours",
    bestFor: "Relaxing in nature and photography",
    bestTime: "Late morning to early afternoon (11 AM – 2 PM)",
    novemberNote:
      "The open meadow can feel considerably colder than Dalhousie. Carry warm layers and check the road conditions, especially if snowfall has occurred.",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
    thingsToDo: [
      "Find a peaceful spot in the meadow and enjoy the surroundings.",
      "Take a leisurely walk around Khajjiar Lake.",
      "Visit the historic Khajji Nag Temple.",
      "Enjoy the forest and mountain views without rushing.",
    ],
    nearbyPlaces: [
      "Khajji Nag Temple",
      "Kalatop Wildlife Sanctuary",
      "Dainkund Peak",
    ],
    travelTips: [
      "Keep a few relaxed hours rather than rushing through the visit.",
      "Carry some cash for local shops and refreshments.",
      "Check road conditions before travelling, especially in winter.",
      "Carry warm layers as the meadow can feel quite cold.",
    ],
  },

  {
    id: 3,
    name: "Kalatop Wildlife Sanctuary",
    category: "Must Visit",
    location: "Near Dalhousie",
    description:
      "A beautiful forest area filled with deodar trees and mountain scenery. Ideal for anyone who enjoys quiet surroundings, fresh mountain air and spending time away from busy tourist spots.",
    duration: "2–3 hours",
    bestFor: "Forest walks and nature",
    bestTime: "Morning (9 AM – 11 AM)",
    novemberNote:
      "Plan your forest visit during daylight hours. Confirm sanctuary access, local permissions and road conditions before travelling, particularly after snowfall.",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
    thingsToDo: [
      "Enjoy a slow walk through the forest surroundings.",
      "Listen to the sounds of nature and look out for birds.",
      "Take photographs of the tall trees and mountain scenery.",
    ],
    nearbyPlaces: [
      "Lakkar Mandi",
      "Khajjiar",
      "Dainkund Peak",
    ],
    travelTips: [
      "Wear shoes suitable for uneven forest paths.",
      "Check forest access, local conditions and timings before visiting.",
      "Stay on permitted paths and do not disturb wildlife.",
      "Winter snowfall can affect road access, so confirm locally before travelling.",
    ],
  },

  {
    id: 4,
    name: "Panchpula",
    category: "Must Visit",
    location: "Dalhousie",
    description:
      "A pleasant spot where mountain streams come together, surrounded by greenery and scenic views. A simple outing if you want to enjoy flowing water and spend a little time outdoors.",
    duration: "1–1.5 hours",
    bestFor: "Streams and a short nature outing",
    bestTime: "Late morning to afternoon (11 AM – 2 PM)",
    novemberNote:
      "A good option for a shorter daytime outing. Expect chilly conditions and check local access and water levels before visiting.",
    image:
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800",
    thingsToDo: [
      "Enjoy the sound and views of the flowing streams.",
      "Take a short, relaxed walk around the surroundings.",
      "Visit the memorial dedicated to Sardar Ajit Singh.",
    ],
    nearbyPlaces: [
      "Satdhara Falls",
      "Subhash Baoli",
      "Dalhousie Town",
    ],
    travelTips: [
      "Water flow can vary depending on the season.",
      "Wear shoes with a good grip around wet areas.",
      "Avoid stepping into unsafe water or slippery sections.",
      "This can be a short stop rather than a full-day outing.",
    ],
  },

  {
    id: 5,
    name: "Bakrota Hills",
    category: "Hidden Gem",
    location: "Dalhousie",
    description:
      "A peaceful stretch of forest roads and walking paths surrounded by deodar, pine and oak trees. A lovely option for a quiet morning walk, fresh air and beautiful views without planning a busy sightseeing day.",
    duration: "1–2 hours",
    bestFor: "Quiet walks and mountain scenery",
    bestTime: "Morning (8 AM – 10 AM)",
    novemberNote:
      "A lovely choice for a crisp morning walk. Dress warmly, watch out for frost on shaded paths and stay alert to vehicles on shared roads.",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800",
    thingsToDo: [
      "Enjoy a peaceful walk along the Bakrota surroundings.",
      "Take in the forest views and fresh mountain air.",
      "Pause along the route for photographs and scenery.",
    ],
    nearbyPlaces: [
      "Garam Sadak",
      "Subhash Baoli",
      "Dalhousie Town",
    ],
    travelTips: [
      "A morning walk is a lovely way to experience the area.",
      "Carry a warm jacket, especially during November and winter.",
      "Stay aware of traffic on shared roads and walking paths.",
      "You do not need to cover the entire walking circuit to enjoy the area.",
    ],
  },

  {
    id: 6,
    name: "Chamera Lake",
    category: "Hidden Gem",
    location: "Chamba District",
    description:
      "A scenic reservoir surrounded by mountains, offering beautiful views of the water and surrounding landscape. A good choice for a relaxed outing, enjoying the drive and spending time beside the lake.",
    duration: "2–3 hours",
    bestFor: "Lake views and a scenic drive",
    bestTime: "Early afternoon (12 PM – 3 PM)",
    novemberNote:
      "Start early enough to enjoy the drive in daylight. Confirm boating availability and road conditions locally before making the trip.",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
    thingsToDo: [
      "Spend some quiet time enjoying the lake and mountain views.",
      "Take photographs of the surrounding landscape.",
      "Enjoy a scenic drive through the area.",
      "Try boating only if services are operating and weather permits.",
    ],
    nearbyPlaces: [
      "Chamera Dam",
      "Chamba Town",
      "Bhuri Singh Museum",
    ],
    travelTips: [
      "Check boating availability before making the trip.",
      "Confirm road and weather conditions before departure.",
      "Allow enough time for the drive back to Dalhousie.",
      "Carry warm clothing and follow local safety instructions near the water.",
    ],
  },
];
