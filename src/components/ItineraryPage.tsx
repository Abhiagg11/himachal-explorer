
import { useState } from "react";
import { ArrowLeft, CalendarDays, MapPin, Clock, Sun } from "lucide-react";

interface ItineraryPageProps {
  onBack: () => void;
}

const days = [
  {
    date: "25 NOV",
    title: "Arrival in Dalhousie",
    subtitle: "Settle in and explore at your own pace",
    places: [
      { time: "Arrival", name: "Reach Dalhousie", note: "Check in, unpack and take some time to rest." },
      { time: "Afternoon", name: "Gandhi Chowk", note: "Explore the main market and get familiar with the town." },
      { time: "Evening", name: "Relaxed evening", note: "Enjoy dinner and prepare for the next day." },
    ],
  },
  {
    date: "26 NOV",
    title: "Dalhousie & Bakrota Hills",
    subtitle: "A slow day among the mountains",
    places: [
      { time: "Morning", name: "Bakrota Hills", note: "Enjoy a peaceful walk through the forest surroundings." },
      { time: "Afternoon", name: "Garam Sadak", note: "Take a relaxed walk and enjoy the mountain atmosphere." },
      { time: "Evening", name: "Cafe time", note: "Spend time at a local cafe or explore the town." },
    ],
  },
  {
    date: "27 NOV",
    title: "Kalatop & Dainkund",
    subtitle: "Forest scenery and mountain viewpoints",
    places: [
      { time: "Morning", name: "Kalatop Wildlife Sanctuary", note: "Explore permitted forest paths during daylight." },
      { time: "Afternoon", name: "Dainkund Peak", note: "Visit only if weather, visibility, access and trail conditions are safe." },
      { time: "Evening", name: "Return to Dalhousie", note: "Keep the evening free to rest." },
    ],
  },
  {
    date: "28 NOV",
    title: "Khajjiar",
    subtitle: "A relaxed day in the meadow",
    places: [
      { time: "Late morning", name: "Khajjiar Meadow", note: "Enjoy the open landscape without rushing." },
      { time: "Afternoon", name: "Khajjiar Lake & Temple", note: "Explore the lake surroundings and Khajji Nag Temple." },
      { time: "Evening", name: "Food stop", note: "Have a relaxed meal before returning." },
    ],
  },
  {
    date: "29 NOV",
    title: "Panchpula & Dalhousie",
    subtitle: "A lighter day with nature and local exploration",
    places: [
      { time: "Morning", name: "Panchpula", note: "Enjoy the streams and surrounding greenery." },
      { time: "Afternoon", name: "Satdhara Falls", note: "Explore if local access and conditions permit." },
      { time: "Evening", name: "Dalhousie market", note: "Keep time for shopping, snacks and dinner." },
    ],
  },
  {
    date: "30 NOV",
    title: "Chamera Lake or a free day",
    subtitle: "Choose based on weather and energy",
    places: [
      { time: "Morning", name: "Chamera Lake", note: "Consider the scenic outing if road and weather conditions are suitable." },
      { time: "Afternoon", name: "Lake surroundings", note: "Enjoy the views. Check boating availability locally." },
      { time: "Alternative", name: "Free day in Dalhousie", note: "Skip the longer outing if you prefer a slower day." },
    ],
  },
  {
    date: "1 DEC",
    title: "Departure",
    subtitle: "Wrap up the trip",
    places: [
      { time: "Morning", name: "Breakfast & checkout", note: "Pack, check your room and settle any outstanding bills." },
      { time: "Departure", name: "Leave Dalhousie", note: "Allow sufficient time for your onward journey." },
    ],
  },
];

function ItineraryPage({ onBack }: ItineraryPageProps) {
  const [selectedDay, setSelectedDay] = useState(0);

  const day = days[selectedDay];

  return (
    <main className="detail-page">
      <header className="detail-header">
        <button className="back-button" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={21} />
        </button>
        <span>YOUR TRIP PLAN</span>
        <div style={{ width: 40 }} />
      </header>

      <section className="detail-content">
        <span className="eyebrow">25 NOVEMBER – 1 DECEMBER</span>
        <h1>Trip Itinerary</h1>
        <p className="detail-description">
          Seven days in the mountains. A relaxed plan with room for
          spontaneous stops, good food and quality time together.
        </p>

        <div className="itinerary-summary">
          <div><CalendarDays size={19} /><strong>7 days</strong><span>Trip duration</span></div>
          <div><Sun size={19} /><strong>Relaxed</strong><span>Travel pace</span></div>
        </div>

        <div className="itinerary-day-selector">
          {days.map((item, index) => (
            <button
              key={item.date}
              className={`itinerary-day-chip ${selectedDay === index ? "selected" : ""}`}
              onClick={() => setSelectedDay(index)}
            >
              <span>DAY {index + 1}</span>
              <strong>{item.date}</strong>
            </button>
          ))}
        </div>

        <section className="detail-section itinerary-day-content">
          <span className="eyebrow">DAY {selectedDay + 1} · {day.date}</span>
          <h2>{day.title}</h2>
          <p className="itinerary-subtitle">{day.subtitle}</p>

          <div className="itinerary-timeline">
            {day.places.map((place, index) => (
              <div className="itinerary-stop" key={`${place.name}-${index}`}>
                <div className="itinerary-timeline-marker">
                  <span>{index + 1}</span>
                </div>
                <div className="itinerary-stop-content">
                  <span className="itinerary-time"><Clock size={13} />{place.time}</span>
                  <h3>{place.name}</h3>
                  <p>{place.note}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name}, Dalhousie, Himachal Pradesh, India`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="itinerary-map-link"
                  >
                    <MapPin size={14} /> View location
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="itinerary-reminder">
          <Sun size={21} />
          <div>
            <strong>Keep the plan flexible</strong>
            <p>November weather, snowfall, road access and daylight can affect outings. Confirm local conditions before leaving.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ItineraryPage;
