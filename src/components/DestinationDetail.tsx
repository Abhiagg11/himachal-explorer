
import {
  ArrowLeft,
  Clock,
  MapPin,
  Camera,
  Heart,
  Navigation,
  CheckCircle2,
  Compass,
  Lightbulb,
  Sun,
  CalendarDays,
} from "lucide-react";

import type { Destination } from "../data/destinations";

interface DestinationDetailProps {
  destination: Destination;
  onBack: () => void;
}

function DestinationDetail({
  destination,
  onBack,
}: DestinationDetailProps) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${destination.name}, ${destination.location}, Himachal Pradesh, India`
  )}`;

  return (
    <main className="detail-page">
      <header className="detail-header">
        <button className="back-button" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={21} />
        </button>

        <span>DESTINATION GUIDE</span>

        <button className="back-button" aria-label="Favourite destination">
          <Heart size={21} />
        </button>
      </header>

      <div className="detail-hero">
        <img src={destination.image} alt={destination.name} />
        <span className="destination-badge">{destination.category}</span>
      </div>

      <section className="detail-content">
        <span className="eyebrow">{destination.location}</span>

        <h1>{destination.name}</h1>

        <p className="detail-description">
          {destination.description}
        </p>

        <div className="detail-info-grid">
          <div className="detail-info-card">
            <Clock size={21} />
            <span>VISIT DURATION</span>
            <strong>{destination.duration}</strong>
          </div>

          <div className="detail-info-card">
            <Camera size={21} />
            <span>BEST EXPERIENCE</span>
            <strong>{destination.bestFor}</strong>
          </div>
        </div>

        <div className="best-time-card">
          <div className="best-time-icon">
            <Sun size={23} />
          </div>
          <div className="best-time-content">
            <span>RECOMMENDED VISITING TIME</span>
            <strong>{destination.bestTime}</strong>
            <p>
              Suggested timing. Check local weather and conditions before heading out.
            </p>
          </div>
        </div>

        <div className="november-note-card">
          <div className="november-note-icon">
            <CalendarDays size={23} />
          </div>
          <div className="november-note-content">
            <span>SEASONAL TRAVEL GUIDE</span>
            <h3>November Travel Note</h3>
            <p>{destination.novemberNote}</p>
          </div>
        </div>

        <section className="detail-section">
          <h2>About this place</h2>
          <p>{destination.description}</p>
        </section>

        <section className="detail-section">
          <div className="detail-section-heading">
            <div>
              <span className="eyebrow">MAKE THE MOST OF YOUR VISIT</span>
              <h2>Things to do</h2>
            </div>
            <Compass size={23} />
          </div>

          <div className="activity-list">
            {destination.thingsToDo.map((activity, index) => (
              <div className="activity-card" key={index}>
                <div className="activity-icon">
                  <CheckCircle2 size={19} />
                </div>
                <p>{activity}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="detail-section">
          <div className="detail-section-heading">
            <div>
              <span className="eyebrow">A FEW USEFUL POINTERS</span>
              <h2>Travel tips</h2>
            </div>
            <Lightbulb size={23} />
          </div>

          <div className="activity-list">
            {destination.travelTips.map((tip, index) => (
              <div className="activity-card" key={index}>
                <div className="activity-icon">
                  <Lightbulb size={18} />
                </div>
                <p>{tip}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="detail-section">
          <h2>Location</h2>

          <div className="location-card">
            <MapPin size={23} />
            <div>
              <strong>{destination.name}</strong>
              <p>
                {destination.location}, Himachal Pradesh, India
              </p>
            </div>
          </div>
        </section>

        <a
          className="directions-button"
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Navigation size={19} />
          Get Directions
        </a>
      </section>
    </main>
  );
}

export default DestinationDetail;
