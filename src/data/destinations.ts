
export interface Destination {
  id: number;
  name: string;
  category: "Must Visit" | "Hidden Gem";
  location: string;
  description: string;
  duration: string;
  bestFor: string;
  image: string;
}

export const destinations: Destination[] = [
  {
    id: 1,
    name: "Dainkund Peak",
    category: "Must Visit",
    location: "Dalhousie",
    description:
      "A beautiful mountain viewpoint offering panoramic Himalayan views, forest trails and a peaceful atmosphere.",
    duration: "2–3 hours",
    bestFor: "Trekking and photography",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
  },
  {
    id: 2,
    name: "Khajjiar",
    category: "Must Visit",
    location: "Near Dalhousie",
    description:
      "A spectacular green meadow surrounded by deodar forests, with a lake and beautiful mountain scenery.",
    duration: "2–3 hours",
    bestFor: "Sightseeing and activities",
    image:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800",
  },
  {
    id: 3,
    name: "Kalatop Wildlife Sanctuary",
    category: "Must Visit",
    location: "Near Dalhousie",
    description:
      "Explore peaceful forest trails, tall deodar trees and the natural beauty of the Himalayan landscape.",
    duration: "2–3 hours",
    bestFor: "Nature and forest walks",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
  },
  {
    id: 4,
    name: "Panchpula",
    category: "Must Visit",
    location: "Dalhousie",
    description:
      "A popular sightseeing spot known for its streams, waterfalls and scenic surroundings.",
    duration: "1–2 hours",
    bestFor: "Relaxation and sightseeing",
    image:
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800",
  },
  {
    id: 5,
    name: "Bakrota Hills",
    category: "Hidden Gem",
    location: "Dalhousie",
    description:
      "Enjoy quiet mountain roads, forest scenery and beautiful views away from the busy town centre.",
    duration: "1–2 hours",
    bestFor: "Scenic walks and photography",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800",
  },
  {
    id: 6,
    name: "Chamera Lake",
    category: "Hidden Gem",
    location: "Chamba District",
    description:
      "A beautiful reservoir surrounded by mountains, offering scenic views and boating opportunities when available.",
    duration: "2–3 hours",
    bestFor: "Boating and photography",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
  },
];
