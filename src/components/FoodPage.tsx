import { useMemo, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Search,
  Utensils,
  ExternalLink,
} from "lucide-react";

import { foodPlaces } from "../data/foodPlaces";

interface FoodPageProps {
  onBack: () => void;
}

function FoodPage({ onBack }: FoodPageProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredPlaces = useMemo(() => {
    return foodPlaces.filter((place) => {
      const matchesFilter =
        filter === "All" || place.category === filter;

      const query = search.toLowerCase();
      const matchesSearch =
        place.name.toLowerCase().includes(query) ||
        place.area.toLowerCase().includes(query) ||
        place.cuisine.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [search, filter]);

  return (
    <main className="detail-page">
      <header className="detail-header">
        <button className="back-button" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={21} />
        </button>
        <span>FOOD & CAFES</span>
        <div style={{ width: 40 }} />
      </header>

      <section className="detail-content">
        <span className="eyebrow">GOOD FOOD, GOOD MOOD</span>
        <h1>Food & Cafes</h1>
        <p className="detail-description">
          Find convenient food stops, cosy cafes and restaurants
          around the places you're exploring.
        </p>

        <div className="page-search">
          <Search size={19} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search cafes, food or areas..."
            aria-label="Search food places"
          />
        </div>

        <div className="filter-row">
          {["All", "Cafe", "Restaurant", "Dhaba"].map((item) => (
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
              <span className="eyebrow">LOCAL FOOD OPTIONS</span>
              <h2>{filteredPlaces.length} places listed</h2>
            </div>
            <Utensils size={23} />
          </div>

          <div className="food-list">
            {filteredPlaces.map((place) => {
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                place.mapsQuery
              )}`;

              return (
                <article className="food-card" key={place.id}>
                  <div className="food-card-top">
                    <span className="food-category">{place.category}</span>
                    <span className="food-price">{place.pricePerPerson}</span>
                  </div>

                  <h3>{place.name}</h3>

                  <div className="food-location">
                    <MapPin size={14} />
                    {place.area}
                  </div>

                  <p className="food-description">{place.description}</p>

                  <div className="food-detail-line">
                    <strong>Cuisine:</strong> {place.cuisine}
                  </div>

                  <div className="food-detail-line">
                    <strong>Atmosphere:</strong> {place.atmosphere}
                  </div>

                  <div className="food-specialities">
                    <strong>What to try</strong>
                    <div className="food-tags">
                      {place.specialities.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>

                  <p className="food-visit-note">{place.visitNote}</p>

                  <a
                    className="food-map-link"
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin size={16} />
                    View on Google Maps
                    <ExternalLink size={14} />
                  </a>
                </article>
              );
            })}
          </div>

          {filteredPlaces.length === 0 && (
            <div className="empty-state">
              <Utensils size={28} />
              <strong>No places found</strong>
              <p>Try a different search or category.</p>
            </div>
          )}

          <p className="food-disclaimer">
            Listings and prices are preliminary research. Confirm current
            opening hours, availability, prices and visitor access locally
            before travelling.
          </p>
        </div>
      </section>
    </main>
  );
}

export default FoodPage;
