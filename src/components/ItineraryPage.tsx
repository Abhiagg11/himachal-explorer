
import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Clock,
  Sun,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  LoaderCircle,
} from "lucide-react";
import { supabase } from "../lib/supabase";

interface ItineraryPageProps {
  onBack: () => void;
}

interface Activity {
  id: string;
  trip_id: string;
  day_number: number;
  activity_date: string;
  time_label: string;
  name: string;
  note: string;
  is_completed: boolean;
  sort_order: number;
}

const TRIP_ID = "11111111-1111-4111-8111-111111111111";

const days = [
  {
    date: "25 NOV",
    title: "Arrival in Dalhousie",
    subtitle: "Settle in and explore at your own pace",
  },
  {
    date: "26 NOV",
    title: "Dalhousie & Bakrota Hills",
    subtitle: "A slow day among the mountains",
  },
  {
    date: "27 NOV",
    title: "Kalatop & Dainkund",
    subtitle: "Forest scenery and mountain viewpoints",
  },
  {
    date: "28 NOV",
    title: "Khajjiar",
    subtitle: "A relaxed day in the meadow",
  },
  {
    date: "29 NOV",
    title: "Panchpula & Dalhousie",
    subtitle: "A lighter day with nature and local exploration",
  },
  {
    date: "30 NOV",
    title: "Chamera Lake or a free day",
    subtitle: "Choose based on weather and energy",
  },
  {
    date: "1 DEC",
    title: "Departure",
    subtitle: "Wrap up the trip",
  },
];

const DAY_DATES = [
  "2026-11-25",
  "2026-11-26",
  "2026-11-27",
  "2026-11-28",
  "2026-11-29",
  "2026-11-30",
  "2026-12-01",
];

function ItineraryPage({ onBack }: ItineraryPageProps) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [formName, setFormName] = useState("");
  const [formTime, setFormTime] = useState("Flexible");
  const [formNote, setFormNote] = useState("");

  const day = days[selectedDay];

  const fetchActivities = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from("trip_activities")
      .select("*")
      .eq("trip_id", TRIP_ID)
      .order("day_number", { ascending: true })
      .order("sort_order", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      return;
    }

    setActivities((data ?? []) as Activity[]);
    setError("");
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchActivities();

    const channel = supabase
      .channel("shared-trip-itinerary")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trip_activities",
          filter: `trip_id=eq.${TRIP_ID}`,
        },
        () => {
          fetchActivities();
        }
      )
      .subscribe();

    const polling = window.setInterval(fetchActivities, 15000);

    return () => {
      window.clearInterval(polling);
      supabase.removeChannel(channel);
    };
  }, [fetchActivities]);

  const openAddForm = () => {
    setEditingId(null);
    setFormName("");
    setFormTime("Flexible");
    setFormNote("");
    setShowForm(true);
  };

  const openEditForm = (activity: Activity) => {
    setEditingId(activity.id);
    setFormName(activity.name);
    setFormTime(activity.time_label);
    setFormNote(activity.note || "");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormName("");
    setFormTime("Flexible");
    setFormNote("");
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formName.trim()) return;

    setSaving(true);
    setError("");

    if (editingId) {
      const { error: updateError } = await supabase
        .from("trip_activities")
        .update({
          name: formName.trim(),
          time_label: formTime.trim() || "Flexible",
          note: formNote.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingId)
        .eq("trip_id", TRIP_ID);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    } else {
      const dayActivities = activities.filter(
        (activity) => activity.day_number === selectedDay + 1
      );

      const nextOrder =
        Math.max(0, ...dayActivities.map((activity) => activity.sort_order)) + 1;

      const { error: insertError } = await supabase
        .from("trip_activities")
        .insert({
          trip_id: TRIP_ID,
          day_number: selectedDay + 1,
          activity_date: DAY_DATES[selectedDay],
          time_label: formTime.trim() || "Flexible",
          name: formName.trim(),
          note: formNote.trim(),
          is_completed: false,
          sort_order: nextOrder,
        });

      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
    }

    closeForm();
    setSaving(false);
    await fetchActivities();
  };

  const toggleCompleted = async (activity: Activity) => {
    const { error: updateError } = await supabase
      .from("trip_activities")
      .update({
        is_completed: !activity.is_completed,
        updated_at: new Date().toISOString(),
      })
      .eq("id", activity.id)
      .eq("trip_id", TRIP_ID);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setActivities((current) =>
      current.map((item) =>
        item.id === activity.id
          ? { ...item, is_completed: !item.is_completed }
          : item
      )
    );
  };

  const deleteActivity = async (activity: Activity) => {
    const confirmed = window.confirm(
      `Delete "${activity.name}" from the itinerary?`
    );

    if (!confirmed) return;

    const { error: deleteError } = await supabase
      .from("trip_activities")
      .delete()
      .eq("id", activity.id)
      .eq("trip_id", TRIP_ID);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setActivities((current) =>
      current.filter((item) => item.id !== activity.id)
    );
  };

  const dayActivities = activities.filter(
    (activity) => activity.day_number === selectedDay + 1
  );

  const completedCount = activities.filter(
    (activity) => activity.is_completed
  ).length;

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
          <div>
            <CalendarDays size={19} />
            <strong>7 days</strong>
            <span>Trip duration</span>
          </div>
          <div>
            <Sun size={19} />
            <strong>Relaxed</strong>
            <span>Travel pace</span>
          </div>
        </div>

        <div
          style={{
            margin: "16px 0",
            padding: "12px 15px",
            borderRadius: 14,
            background: "var(--card-bg, #f2f0e8)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 13,
          }}
        >
          <span>Shared trip progress</span>
          <strong>
            {completedCount}/{activities.length} completed
          </strong>
        </div>

        <div className="itinerary-day-selector">
          {days.map((item, index) => (
            <button
              key={item.date}
              className={`itinerary-day-chip ${
                selectedDay === index ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedDay(index);
                closeForm();
              }}
            >
              <span>DAY {index + 1}</span>
              <strong>{item.date}</strong>
            </button>
          ))}
        </div>

        <section className="detail-section itinerary-day-content">
          <span className="eyebrow">
            DAY {selectedDay + 1} · {day.date}
          </span>
          <h2>{day.title}</h2>
          <p className="itinerary-subtitle">{day.subtitle}</p>

          {error && (
            <div
              style={{
                padding: 12,
                margin: "14px 0",
                borderRadius: 10,
                background: "#fff0ed",
                color: "#a33322",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ padding: 30, textAlign: "center" }}>
              <LoaderCircle size={22} />
              <p>Loading shared itinerary...</p>
            </div>
          ) : (
            <>
              <div className="itinerary-timeline">
                {dayActivities.map((activity, index) => (
                  <div
                    className="itinerary-stop"
                    key={activity.id}
                    style={{
                      opacity: activity.is_completed ? 0.65 : 1,
                    }}
                  >
                    <div className="itinerary-timeline-marker">
                      <span>
                        {activity.is_completed ? (
                          <Check size={15} />
                        ) : (
                          index + 1
                        )}
                      </span>
                    </div>

                    <div className="itinerary-stop-content">
                      <span className="itinerary-time">
                        <Clock size={13} />
                        {activity.time_label}
                      </span>

                      <h3
                        style={{
                          textDecoration: activity.is_completed
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {activity.name}
                      </h3>

                      {activity.note && <p>{activity.note}</p>}

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${activity.name}, Dalhousie, Himachal Pradesh, India`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="itinerary-map-link"
                      >
                        <MapPin size={14} /> View location
                      </a>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                          marginTop: 12,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => toggleCompleted(activity)}
                          style={actionButtonStyle}
                        >
                          <Check size={14} />
                          {activity.is_completed ? "Undo" : "Complete"}
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditForm(activity)}
                          style={actionButtonStyle}
                        >
                          <Pencil size={14} /> Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteActivity(activity)}
                          style={{
                            ...actionButtonStyle,
                            color: "#a33322",
                          }}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {dayActivities.length === 0 && (
                <p style={{ padding: 20, textAlign: "center" }}>
                  No activities planned for this day yet.
                </p>
              )}
            </>
          )}

          <button
            type="button"
            onClick={openAddForm}
            style={addButtonStyle}
          >
            <Plus size={17} /> Add activity
          </button>

          {showForm && (
            <form
              onSubmit={handleSave}
              style={{
                marginTop: 18,
                padding: 16,
                borderRadius: 16,
                background: "var(--card-bg, #f2f0e8)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <strong>
                  {editingId ? "Edit activity" : "New activity"}
                </strong>
                <button type="button" onClick={closeForm} style={iconButtonStyle}>
                  <X size={18} />
                </button>
              </div>

              <label style={fieldLabelStyle}>
                Activity name
                <input
                  value={formName}
                  onChange={(event) => setFormName(event.target.value)}
                  placeholder="e.g. Visit a viewpoint"
                  required
                  style={inputStyle}
                />
              </label>

              <label style={fieldLabelStyle}>
                Time
                <input
                  value={formTime}
                  onChange={(event) => setFormTime(event.target.value)}
                  placeholder="e.g. Morning"
                  style={inputStyle}
                />
              </label>

              <label style={fieldLabelStyle}>
                Notes
                <textarea
                  value={formNote}
                  onChange={(event) => setFormNote(event.target.value)}
                  placeholder="Add some details..."
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </label>

              <button type="submit" disabled={saving} style={addButtonStyle}>
                {saving ? "Saving..." : editingId ? "Save changes" : "Add to itinerary"}
              </button>
            </form>
          )}
        </section>

        <div className="itinerary-reminder">
          <Sun size={21} />
          <div>
            <strong>Keep the plan flexible</strong>
            <p>
              November weather, snowfall, road access and daylight can affect
              outings. Confirm local conditions before leaving.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

const actionButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  padding: "7px 10px",
  borderRadius: 9,
  border: "1px solid #d8d8cf",
  background: "transparent",
  color: "inherit",
  fontSize: 12,
  cursor: "pointer",
};

const addButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  width: "100%",
  padding: 13,
  marginTop: 16,
  border: "none",
  borderRadius: 12,
  background: "#315b46",
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

const iconButtonStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  padding: 4,
};

const fieldLabelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  fontSize: 13,
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: 11,
  borderRadius: 9,
  border: "1px solid #d8d8cf",
  background: "#ffffff",
  color: "#26352d",
  font: "inherit",
  fontSize: 14,
};

export default ItineraryPage;
