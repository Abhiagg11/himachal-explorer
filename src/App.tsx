
import { useEffect, useState } from "react";

import {
  MapPin,
  Wallet,
  CalendarDays,
  Compass,
  Users,
  ArrowRight,
  Utensils,
  Home,
  Backpack,
  Moon,
  Sun,
} from "lucide-react";

import { destinations } from "./data/destinations";
import DestinationDetail from "./components/DestinationDetail";
import FoodPage from "./components/FoodPage";
import DestinationsPage from "./components/DestinationsPage";
import ItineraryPage from "./components/ItineraryPage";
import MapsPage from "./components/MapsPage";
import EssentialsPage from "./components/EssentialsPage";
import ExpensesPage from "./components/ExpensesPage";

import type { Destination } from "./data/destinations";
import "./App.css";

type Page =
  | "home"
  | "explore"
  | "food"
  | "itinerary"
  | "maps"
  | "essentials"
  | "expenses";

function App() {
  const [page, setPage] = useState<Page>("home");

  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);

  // Theme preference
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const savedTheme = localStorage.getItem("himachal-theme");
      return savedTheme === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    try {
      localStorage.setItem("himachal-theme", theme);
    } catch {
      // Continue using the selected theme if storage is unavailable.
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  // Load saved favourites
  const [favourites, setFavourites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("himachal-favourites");
      return saved ? (JSON.parse(saved) as number[]) : [];
    } catch {
      return [];
    }
  });

  // Load saved shortlist
  const [shortlist, setShortlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("himachal-shortlist");
      return saved ? (JSON.parse(saved) as number[]) : [];
    } catch {
      return [];
    }
  });

  // Persist favourites
  useEffect(() => {
    localStorage.setItem(
      "himachal-favourites",
      JSON.stringify(favourites)
    );
  }, [favourites]);

  // Persist shortlist
  useEffect(() => {
    localStorage.setItem(
      "himachal-shortlist",
      JSON.stringify(shortlist)
    );
  }, [shortlist]);

  // Toggle favourite destination
  const toggleFavourite = (id: number) => {
    setFavourites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  // Toggle destination shortlist
  const toggleShortlist = (id: number) => {
    setShortlist((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  if (selectedDestination) {
    return (
      <DestinationDetail
        destination={selectedDestination}
        onBack={() => setSelectedDestination(null)}
        isFavourite={favourites.includes(selectedDestination.id)}
        isShortlisted={shortlist.includes(selectedDestination.id)}
        onToggleFavourite={() =>
          toggleFavourite(selectedDestination.id)
        }
        onToggleShortlist={() =>
          toggleShortlist(selectedDestination.id)
        }
      />
    );
  }

  return (
    <>
      {page === "home" && (
        <main className="app-container">
          <header className="top-header">
            <div>
              <span className="eyebrow">YOUR PRIVATE TRIP PLANNER</span>
              <h1>
                Himachal<span> Explorer.</span>
              </h1>
            </div>

            <div className="header-actions">
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label={`Switch to ${
                  theme === "light" ? "dark" : "light"
                } mode`}
                title={`Switch to ${
                  theme === "light" ? "dark" : "light"
                } mode`}
              >
                {theme === "light" ? (
                  <Moon size={19} />
                ) : (
                  <Sun size={19} />
                )}
              </button>

              <div className="profile-icon">A</div>
            </div>
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
                <h2>Plan your escape</h2>
              </div>
            </div>

            <div className="feature-grid">
              <button
                className="feature-card feature-card-button"
                onClick={() => setPage("explore")}
              >
                <div className="feature-icon green">
                  <Compass />
                </div>
                <h3>Explore</h3>
                <p>Places & hidden gems</p>
              </button>

              <button
                className="feature-card feature-card-button"
                onClick={() => setPage("itinerary")}
              >
                <div className="feature-icon purple">
                  <CalendarDays />
                </div>
                <h3>Itinerary</h3>
                <p>Your seven-day plan</p>
              </button>

              <button
                className="feature-card feature-card-button"
                onClick={() => setPage("maps")}
              >
                <div className="feature-icon blue">
                  <MapPin />
                </div>
                <h3>Maps & Routes</h3>
                <p>Find your destinations</p>
              </button>

              <button
                className="feature-card feature-card-button"
                onClick={() => setPage("essentials")}
              >
                <div className="feature-icon orange">
                  <Backpack />
                </div>
                <h3>Essentials</h3>
                <p>Get ready to travel</p>
              </button>

              <button
                className="feature-card feature-card-button"
                onClick={() => setPage("food")}
              >
                <div className="feature-icon orange">
                  <Utensils />
                </div>
                <h3>Food & Cafes</h3>
                <p>Find places to eat</p>
              </button>

              <button
                className="feature-card feature-card-button"
                onClick={() => setPage("expenses")}
              >
                <div className="feature-icon green">
                  <Wallet />
                </div>
                <h3>Expenses</h3>
                <p>Track and split trip costs</p>
              </button>
            </div>
          </section>

          <section className="section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">HANDPICKED FOR YOUR TRIP</span>
                <h2>Discover Dalhousie</h2>
              </div>

              <button
                className="text-button"
                onClick={() => setPage("explore")}
              >
                Explore all <ArrowRight size={15} />
              </button>
            </div>

            <button
              className="food-placeholder food-placeholder-button"
              onClick={() => setPage("explore")}
            >
              <Compass size={24} />

              <p>
                Explore {destinations.length} selected destinations,
                peaceful walks and mountain escapes.
              </p>

              <ArrowRight size={19} />
            </button>
          </section>

          <section className="section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">GOOD FOOD, GOOD MOOD</span>
                <h2>Food discoveries</h2>
              </div>

              <Utensils size={22} />
            </div>

            <button
              className="food-placeholder food-placeholder-button"
              onClick={() => setPage("food")}
            >
              <Utensils size={24} />

              <p>
                Find cafes, restaurants and local food around Dalhousie.
              </p>

              <ArrowRight size={19} />
            </button>
          </section>

          <section className="section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">BEFORE YOU GO</span>
                <h2>Ready for the mountains?</h2>
              </div>
            </div>

            <button
              className="food-placeholder food-placeholder-button"
              onClick={() => setPage("essentials")}
            >
              <Backpack size={24} />

              <p>
                Check your packing list and prepare for November weather.
              </p>

              <ArrowRight size={19} />
            </button>
          </section>
        </main>
      )}

      {page === "explore" && (
        <DestinationsPage
          destinations={destinations}
          onBack={() => setPage("home")}
          onSelectDestination={setSelectedDestination}
          favourites={favourites}
          shortlist={shortlist}
          onToggleFavourite={toggleFavourite}
          onToggleShortlist={toggleShortlist}
        />
      )}

      {page === "food" && (
        <FoodPage onBack={() => setPage("home")} />
      )}

      {page === "itinerary" && (
        <ItineraryPage onBack={() => setPage("home")} />
      )}

      {page === "maps" && (
        <MapsPage onBack={() => setPage("home")} />
      )}

      {page === "essentials" && (
        <EssentialsPage onBack={() => setPage("home")} />
      )}

      {page === "expenses" && (
        <ExpensesPage onBack={() => setPage("home")} />
      )}

      <nav className="bottom-nav">
        <button
          className={`nav-item ${page === "home" ? "active" : ""}`}
          onClick={() => setPage("home")}
        >
          <Home size={21} />
          <span>Home</span>
        </button>

        <button
          className={`nav-item ${page === "explore" ? "active" : ""}`}
          onClick={() => setPage("explore")}
        >
          <Compass size={21} />
          <span>Explore</span>
        </button>

        <button
          className={`nav-item ${page === "itinerary" ? "active" : ""}`}
          onClick={() => setPage("itinerary")}
        >
          <CalendarDays size={21} />
          <span>Plan</span>
        </button>

        <button
          className={`nav-item ${page === "maps" ? "active" : ""}`}
          onClick={() => setPage("maps")}
        >
          <MapPin size={21} />
          <span>Maps</span>
        </button>
      </nav>
    </>
  );
}

export default App;
