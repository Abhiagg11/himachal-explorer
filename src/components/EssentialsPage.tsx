
import { useState } from "react";
import {
  ArrowLeft,
  Backpack,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Thermometer,
  ClipboardList,
} from "lucide-react";

interface EssentialsPageProps {
  onBack: () => void;
}

const checklist = [
  {
    title: "Clothing & winter wear",
    icon: Thermometer,
    items: [
      "Warm jackets",
      "Sweaters or thermal layers",
      "Comfortable trousers",
      "Warm socks",
      "Gloves",
      "Woollen cap",
      "Comfortable walking shoes",
      "Extra clothes",
    ],
  },
  {
    title: "Travel essentials",
    icon: Backpack,
    items: [
      "Phone and charger",
      "Power bank",
      "Earphones",
      "Wallet and cash",
      "Water bottle",
      "Sunglasses",
      "Small day backpack",
      "Toiletries",
    ],
  },
  {
    title: "Documents",
    icon: FileText,
    items: [
      "Government ID",
      "Hotel booking details",
      "Travel tickets",
      "Driving licence, if applicable",
      "Emergency contact details",
    ],
  },
  {
    title: "Health & safety",
    icon: ShieldCheck,
    items: [
      "Personal medicines",
      "Basic first-aid kit",
      "Lip balm and moisturiser",
      "Sunscreen",
      "Hand sanitiser",
      "Basic motion sickness supplies, if needed",
    ],
  },
];

const storageKey = "himachal-explorer-packing-checklist";

function readSavedItems(): string[] {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) as string[] : [];
  } catch {
    return [];
  }
}

function EssentialsPage({ onBack }: EssentialsPageProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>(readSavedItems);

  const totalItems = checklist.reduce(
    (total, group) => total + group.items.length,
    0
  );

  const toggleItem = (item: string) => {
    setCheckedItems((current) => {
      const next = current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item];

      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Checklist remains usable if browser storage is unavailable.
      }

      return next;
    });
  };

  const progress = Math.round((checkedItems.length / totalItems) * 100);

  return (
    <main className="detail-page">
      <header className="detail-header">
        <button className="back-button" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={21} />
        </button>
        <span>TRAVEL ESSENTIALS</span>
        <div style={{ width: 40 }} />
      </header>

      <section className="detail-content">
        <span className="eyebrow">BE READY FOR THE MOUNTAINS</span>
        <h1>Packing checklist</h1>
        <p className="detail-description">
          A practical checklist for your late-November Dalhousie trip.
          Tick items as you pack.
        </p>

        <div className="packing-progress-card">
          <div className="packing-progress-heading">
            <div>
              <span>YOUR PACKING PROGRESS</span>
              <strong>{checkedItems.length} of {totalItems} items packed</strong>
            </div>
            <div className="packing-progress-number">{progress}%</div>
          </div>
          <div className="packing-progress-track">
            <div
              className="packing-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {checklist.map((group) => {
          const Icon = group.icon;
          const completed = group.items.filter((item) =>
            checkedItems.includes(item)
          ).length;

          return (
            <section className="detail-section packing-section" key={group.title}>
              <div className="packing-section-heading">
                <div className="packing-section-icon"><Icon size={21} /></div>
                <div>
                  <h2>{group.title}</h2>
                  <span>{completed} / {group.items.length} completed</span>
                </div>
              </div>

              <div className="packing-items">
                {group.items.map((item) => {
                  const checked = checkedItems.includes(item);

                  return (
                    <label className={`packing-item ${checked ? "checked" : ""}`} key={item}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleItem(item)}
                      />
                      <span className="packing-checkbox">
                        {checked && <CheckCircle2 size={17} />}
                      </span>
                      <span className="packing-item-label">{item}</span>
                    </label>
                  );
                })}
              </div>
            </section>
          );
        })}

        <div className="itinerary-reminder">
          <ClipboardList size={21} />
          <div>
            <strong>November mountain reminder</strong>
            <p>Temperatures can drop significantly, especially in the evenings and at exposed viewpoints. Check the forecast shortly before departure and pack layers accordingly.</p>
          </div>
        </div>

        <button
          className="packing-reset-button"
          onClick={() => {
            setCheckedItems([]);
            try {
              localStorage.removeItem(storageKey);
            } catch {
              // No action needed.
            }
          }}
        >
          Reset checklist
        </button>
      </section>
    </main>
  );
}

export default EssentialsPage;
