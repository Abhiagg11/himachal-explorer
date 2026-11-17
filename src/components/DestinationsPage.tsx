import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Compass,
  Heart,
  Search,
} from "lucide-react";

import type { Destination } from "../data/destinations";

interface DestinationsPageProps {
  destinations: Destination[];
  onBack: () => void;
  onSelectDestination: (destination: Destination) => void;
}

function DestinationsPage({
  destinations,
  onBack,
  onSelectDestination,
}: DestinationsPageProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredDestinations = useMemo(() => {
    return destinations.filter((place) => {
      const matchesFilter =
        filter === "All" || place.category === filter;

      const query = search.toLowerCase();
      const matchesSearch =
        place.name.toLowerCase().includes(query) ||
        place.location.toLowerCase().includes(query) ||
        place.description.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [destinations, filter, search]);

  return (
    <main className="detail-page">
      <header className="detail-header">
        <button className="back-button" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={21} />
        </button>
        <span>EXPLORE HIMACHAL</span>
        <div style={{ width: 40 }} />
      </header>

      <section className="detail-content">
        <span className="eyebrow">FIND YOUR NEXT ESCAPE</span>
        <h1>Explore Destinations</h1>
        <p className="detail-description">
          A collection of mountain escapes, forest walks and peaceful
          places selected for your Dalhousie trip.
        </p>

        <div className="page-search">
          <Search size={19} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search destinations..."
            aria-label="Search destinations"
          />
        </div>

        <div className="filter-row">
          {["All", "Must Visit", "Hidden Gem"].map((item) => (
            <button
              key={item}
              className={`filter-chip ${filter === item ? "selected" : ""}`}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="detail-section">
          <div className="detail-section-heading">
            <div>
              <span className="eyebrow">HANDPICKED FOR YOUR TRIP</span>
              <h2>{filteredDestinations.length} places to explore</h2>
            </div>
            <Compass size={23} />
          </div>

          <div className="destination-list">
            {filteredDestinations.map((place) => (
              <button
                className="destination-card destination-card-button"
                key={place.id}
                onClick={() => onSelectDestination(place)}
              >
                <div
                  className="destination-image"
                  style={{ backgroundImage: `url(${place.image})` }}
                >
                  <span className="destination-badge">{place.category}</span>
                </div>

                <div className="destination-info">
                  <div>
                    <span className="destination-category">{place.location}</span>
                    <h3>{place.name}</h3>
                    <p>{place.description}</p>
                    <div className="destination-meta">
                      <span>{place.duration}</span>
                      <span>{place.bestFor}</span>
                    </div>
                  </div>
                  <Heart size={20} />
                </div>
              </button>
            ))}
          </div>

          {filteredDestinations.length === 0 && (
            <div className="empty-state">
              <Compass size={28} />
              <strong>No destinations found</strong>
              <p>Try another search or category.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default DestinationsPage;
