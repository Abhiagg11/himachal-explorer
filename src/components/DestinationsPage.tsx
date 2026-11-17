import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Compass,
  Heart,
  Search,
} from "lucide-react";

import type { Destination } from "../data/destinations";

interface DestinationsPageProps {
  destinations: Destination[];
  onBack: () => void;
  onSelectDestination: (destination: Destination) => void;
  favourites: number[];
  shortlist: number[];
  onToggleFavourite: (id: number) => void;
  onToggleShortlist: (id: number) => void;
}

function DestinationsPage({
  destinations,
  onBack,
  onSelectDestination,
  favourites,
  shortlist,
  onToggleFavourite,
  onToggleShortlist,
}: DestinationsPageProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filters = [
    "All",
    "Must Visit",
    "Hidden Gem",
    "Favourites",
    "Shortlist",
  ];

  const filteredDestinations = useMemo(() => {
    return destinations.filter((place) => {
      let matchesFilter = true;

      if (filter === "Must Visit" || filter === "Hidden Gem") {
        matchesFilter = place.category === filter;
      } else if (filter === "Favourites") {
        matchesFilter = favourites.includes(place.id);
      } else if (filter === "Shortlist") {
        matchesFilter = shortlist.includes(place.id);
      }

      const query = search.toLowerCase();

      const matchesSearch =
        place.name.toLowerCase().includes(query) ||
        place.location.toLowerCase().includes(query) ||
        place.description.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [destinations, filter, search, favourites, shortlist]);

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
          {filters.map((item) => (
            <button
              key={item}
              className={`filter-chip ${filter === item ? "selected" : ""}`}
              onClick={() => setFilter(item)}
            >
              {item}
              {item === "Favourites" && ` (${favourites.length})`}
              {item === "Shortlist" && ` (${shortlist.length})`}
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
            {filteredDestinations.map((place) => {
              const isFavourite = favourites.includes(place.id);
              const isShortlisted = shortlist.includes(place.id);

              return (
                <div className="destination-card" key={place.id}>
                  <button
                    className="destination-card-main"
                    onClick={() => onSelectDestination(place)}
                    aria-label={`View ${place.name}`}
                  >
                    <div
                      className="destination-image"
                      style={{
                        backgroundImage: `url(${place.image})`,
                      }}
                    >
                      <span className="destination-badge">
                        {place.category}
                      </span>
                    </div>

                    <div className="destination-info">
                      <div>
                        <span className="destination-category">
                          {place.location}
                        </span>

                        <h3>{place.name}</h3>

                        <p>{place.description}</p>

                        <div className="destination-meta">
                          <span>{place.duration}</span>
                          <span>{place.bestFor}</span>
                        </div>
                      </div>
                    </div>
                  </button>

                  <div className="destination-actions">
                    <button
                      className={`destination-action ${
                        isFavourite ? "active" : ""
                      }`}
                      onClick={() => onToggleFavourite(place.id)}
                      aria-label={
                        isFavourite
                          ? `Remove ${place.name} from favourites`
                          : `Add ${place.name} to favourites`
                      }
                      aria-pressed={isFavourite}
                    >
                      <Heart
                        size={19}
                        fill={isFavourite ? "currentColor" : "none"}
                      />
                    </button>

                    <button
                      className={`destination-action ${
                        isShortlisted ? "active" : ""
                      }`}
                      onClick={() => onToggleShortlist(place.id)}
                      aria-label={
                        isShortlisted
                          ? `Remove ${place.name} from shortlist`
                          : `Add ${place.name} to shortlist`
                      }
                      aria-pressed={isShortlisted}
                    >
                      {isShortlisted ? (
                        <BookmarkCheck size={19} />
                      ) : (
                        <Bookmark size={19} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredDestinations.length === 0 && (
            <div className="empty-state">
              <Compass size={28} />

              <strong>No destinations found</strong>

              <p>
                {filter === "Favourites" || filter === "Shortlist"
                  ? "Save some destinations and they will appear here."
                  : "Try another search or category."}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default DestinationsPage;
