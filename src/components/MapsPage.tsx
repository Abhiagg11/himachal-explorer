
import { ArrowLeft, MapPin, Navigation, ExternalLink } from "lucide-react";
import { destinations } from "../data/destinations";
import { foodPlaces } from "../data/foodPlaces";

interface MapsPageProps {
  onBack: () => void;
}

function MapsPage({ onBack }: MapsPageProps) {
  
  return (
    <main className="detail-page">
      <header className="detail-header">
        <button className="back-button" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={21} />
        </button>
        <span>MAPS & ROUTES</span>
        <div style={{ width: 40 }} />
      </header>

      <section className="detail-content">
        <span className="eyebrow">FIND YOUR WAY</span>
        <h1>Explore the region</h1>
        <p className="detail-description">
          Open locations and directions in Google Maps when you're ready
          to head out.
        </p>

        <a
          className="maps-route-card"
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent("Dalhousie, Himachal Pradesh, India")}&travelmode=driving`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="maps-route-icon"><Navigation size={24} /></div>
          <div>
            <strong>Open Dalhousie in Google Maps</strong>
            <p>Explore the area and plan your own route.</p>
          </div>
          <ExternalLink size={17} />
        </a>

        <section className="detail-section">
          <div className="detail-section-heading">
            <div>
              <span className="eyebrow">YOUR DESTINATIONS</span>
              <h2>Places on your trip</h2>
            </div>
            <MapPin size={22} />
          </div>

          <div className="maps-place-list">
            {destinations.map((place) => {
              const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name}, ${place.location}, Himachal Pradesh, India`)}`;

              return (
                <a
                  className="maps-place-card"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={place.id}
                >
                  <div className="maps-place-icon"><MapPin size={19} /></div>
                  <div className="maps-place-info">
                    <strong>{place.name}</strong>
                    <span>{place.location}</span>
                  </div>
                  <ExternalLink size={16} />
                </a>
              );
            })}
          </div>
        </section>

        <section className="detail-section">
          <div className="detail-section-heading">
            <div>
              <span className="eyebrow">FOOD STOPS</span>
              <h2>Cafes & restaurants</h2>
            </div>
          </div>

          <div className="maps-place-list">
            {foodPlaces.map((place) => (
              <a
                className="maps-place-card"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.mapsQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                key={place.id}
              >
                <div className="maps-place-icon food-map-icon"><MapPin size={19} /></div>
                <div className="maps-place-info">
                  <strong>{place.name}</strong>
                  <span>{place.area} · {place.category}</span>
                </div>
                <ExternalLink size={16} />
              </a>
            ))}
          </div>
        </section>

        <p className="maps-disclaimer">
          Locations open in Google Maps. Check the suggested route, road
          conditions and local access before travelling. Route order and
          travel times are not verified here.
        </p>
      </section>
    </main>
  );
}

export default MapsPage;
