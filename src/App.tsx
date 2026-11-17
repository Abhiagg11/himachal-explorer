import {
  MapPin,
  Wallet,
  CalendarDays,
  Compass,
  Mountain,
  Users,
  ArrowRight,
  Navigation,
  Utensils,
  Heart,
} from "lucide-react";

import { destinations } from "./data/destinations";
import "./App.css";

function App() {
  return (
    <main className="app-container">
      <header className="top-header">
        <div>
          <span className="eyebrow">YOUR PERSONAL TRAVEL GUIDE</span>
          <h1>
            Himachal<span> Explorer.</span>
          </h1>
        </div>
        <div className="profile-icon">A</div>
      </header>

      <section className="hero-section">
        <div className="hero-overlay">
          <span className="trip-badge">YOUR NEXT ESCAPE</span>
          <h2>
            Mountains are
            <br />
            calling.
          </h2>
          <p>Dalhousie, Himachal Pradesh</p>

          <div className="trip-details">
            <div>
              <CalendarDays size={17} />
              <span>25 Nov – 1 Dec</span>
            </div>
            <div>
              <Users size={17} />
              <span>3 Travellers</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">YOUR TRIP</span>
            <h2>Explore everything</h2>
          </div>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon green">
              <Compass />
            </div>
            <h3>Explore</h3>
            <p>Places &amp; hidden gems</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon orange">
              <Wallet />
            </div>
            <h3>Expenses</h3>
            <p>Track &amp; split bills</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon blue">
              <MapPin />
            </div>
            <h3>Maps</h3>
            <p>Find your way around</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon purple">
              <CalendarDays />
            </div>
            <h3>Itinerary</h3>
            <p>Your daily travel plan</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">HANDPICKED FOR YOU</span>
            <h2>Discover Dalhousie</h2>
          </div>
          <button className="text-button" type="button">
            View all <ArrowRight size={15} />
          </button>
        </div>

        <div className="destination-list">
          {destinations.map((place) => (
            <article className="destination-card" key={place.id}>
              <div
                className="destination-image"
                style={{ backgroundImage: `url("${place.image}")` }}
                role="img"
                aria-label={place.name}
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
                <Heart size={21} aria-label="Save destination" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">GOOD FOOD, GOOD MOOD</span>
            <h2>Food discoveries</h2>
          </div>
          <Utensils size={22} />
        </div>
        <div className="food-placeholder">
          <Utensils size={24} />
          <p>Discover the best cafes and local food in Dalhousie.</p>
        </div>
      </section>

      <nav className="bottom-nav" aria-label="Main navigation">
        <div className="nav-item active">
          <Compass size={21} />
          <span>Home</span>
        </div>
        <div className="nav-item">
          <MapPin size={21} />
          <span>Explore</span>
        </div>
        <div className="nav-item">
          <Wallet size={21} />
          <span>Expenses</span>
        </div>
        <div className="nav-item">
          <Navigation size={21} />
          <span>Maps</span>
        </div>
      </nav>
    </main>
  );
}

export default App;
