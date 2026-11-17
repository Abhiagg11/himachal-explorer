import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { FormEvent } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Wallet,
  Receipt,
  IndianRupee,
  Users,
  Pencil,
  X,
  RefreshCw,
} from "lucide-react";
import { supabase } from "../lib/supabase";

const TRIP_ID = "11111111-1111-4111-8111-111111111111";

const PEOPLE = ["Ashish", "Ayush", "Abhishek"] as const;
type Person = (typeof PEOPLE)[number];

interface Member {
  id: string;
  display_name: Person;
}

interface Expense {
  id: string;
  trip_id: string;
  paid_by_member_id: string;
  description: string;
  amount: number;
  expense_date: string;
  created_at: string;
}

function getToday() {
  const today = new Date();
  const offset = today.getTimezoneOffset();

  return new Date(today.getTime() - offset * 60000)
    .toISOString()
    .slice(0, 10);
}

function formatMoney(paise: number) {
  return (paise / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
}

function getErrorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}

function ExpensesPage({ onBack }: { onBack: () => void }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activePerson, setActivePerson] = useState<Person>("Ashish");

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(getToday());

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const mountedRef = useRef(false);
  const refreshInFlightRef = useRef(false);

  const loadData = useCallback(async () => {
    if (!mountedRef.current || refreshInFlightRef.current) return;

    refreshInFlightRef.current = true;

    try {
      const [membersResult, expensesResult] = await Promise.all([
        supabase
          .from("trip_members")
          .select("id, display_name")
          .eq("trip_id", TRIP_ID),

        supabase
          .from("expenses")
          .select(
            "id, trip_id, paid_by_member_id, description, amount, expense_date, created_at"
          )
          .eq("trip_id", TRIP_ID)
          .order("expense_date", { ascending: false })
          .order("created_at", { ascending: false }),
      ]);

      if (membersResult.error) throw membersResult.error;
      if (expensesResult.error) throw expensesResult.error;

      if (mountedRef.current) {
        setMembers((membersResult.data ?? []) as Member[]);
        setExpenses((expensesResult.data ?? []) as Expense[]);
        setError("");
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(getErrorMessage(err, "Unable to load trip expenses."));
      }
      throw err;
    } finally {
      refreshInFlightRef.current = false;

      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    async function initialise() {
      try {
        await loadData();
      } catch {
        // loadData already reports the error to the page.
      }
    }

    void initialise();

    const channel = supabase
      .channel("shared-trip-expenses")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "expenses",
          filter: `trip_id=eq.${TRIP_ID}`,
        },
        () => {
          void loadData().catch(() => {
            // loadData already reports the refresh error.
          });
        }
      )
      .subscribe((status) => {
        if (
          mountedRef.current &&
          (status === "CHANNEL_ERROR" || status === "TIMED_OUT")
        ) {
          setError(
            "Live expense updates are temporarily unavailable. Automatic refresh will continue."
          );
        }
      });

    const refreshInterval = window.setInterval(() => {
      void loadData().catch(() => {
        // The error is displayed by loadData.
      });
    }, 15000);

    return () => {
      mountedRef.current = false;
      window.clearInterval(refreshInterval);
      void supabase.removeChannel(channel);
    };
  }, [loadData]);

  const memberByName = useMemo(
    () => new Map(members.map((member) => [member.display_name, member])),
    [members]
  );

  const memberById = useMemo(
    () => new Map(members.map((member) => [member.id, member])),
    [members]
  );

  const totalPaid = useMemo(
    () =>
      expenses.reduce(
        (sum, expense) => sum + Math.round(Number(expense.amount) * 100),
        0
      ),
    [expenses]
  );

  const summary = useMemo(() => {
    const result = PEOPLE.map((person) => ({
      person,
      paid: 0,
      share: 0,
      balance: 0,
    }));

    expenses.forEach((expense, expenseIndex) => {
      const paise = Math.round(Number(expense.amount) * 100);
      const payer = memberById.get(expense.paid_by_member_id);

      const payerRow = result.find(
        (row) => row.person === payer?.display_name
      );

      if (payerRow) payerRow.paid += paise;

      const baseShare = Math.floor(paise / 3);
      const remainder = paise % 3;

      result.forEach((row, index) => {
        row.share += baseShare;

        if ((index - (expenseIndex % 3) + 3) % 3 < remainder) {
          row.share += 1;
        }
      });
    });

    return result.map((row) => ({
      ...row,
      balance: row.paid - row.share,
    }));
  }, [expenses, memberById]);

  const settlements = useMemo(() => {
    const creditors = summary
      .filter((person) => person.balance > 0)
      .map((person) => ({
        person: person.person,
        amount: person.balance,
      }));

    const debtors = summary
      .filter((person) => person.balance < 0)
      .map((person) => ({
        person: person.person,
        amount: -person.balance,
      }));

    const transfers: {
      from: Person;
      to: Person;
      amount: number;
    }[] = [];

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const transferAmount = Math.min(
        debtors[i].amount,
        creditors[j].amount
      );

      if (transferAmount > 0) {
        transfers.push({
          from: debtors[i].person,
          to: creditors[j].person,
          amount: transferAmount,
        });
      }

      debtors[i].amount -= transferAmount;
      creditors[j].amount -= transferAmount;

      if (debtors[i].amount === 0) i++;
      if (creditors[j].amount === 0) j++;
    }

    return transfers;
  }, [summary]);

  const personExpenses = useMemo(() => {
    const selectedMember = memberByName.get(activePerson);

    if (!selectedMember) return [];

    return expenses.filter(
      (expense) => expense.paid_by_member_id === selectedMember.id
    );
  }, [expenses, activePerson, memberByName]);

  function resetForm() {
    setDescription("");
    setAmount("");
    setDate(getToday());
    setEditingId(null);
  }

  async function saveExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    setError("");

    const parsedAmount = Number(amount);
    const selectedMember = memberByName.get(activePerson);

    if (!selectedMember) {
      setError("Traveller details are missing. Please refresh the page.");
      return;
    }

    if (
      !description.trim() ||
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0 ||
      !date
    ) {
      setError("Please enter a valid description, amount and date.");
      return;
    }

    setSaving(true);

    const expenseData = {
      trip_id: TRIP_ID,
      paid_by_member_id: selectedMember.id,
      description: description.trim(),
      amount: Math.round(parsedAmount * 100) / 100,
      expense_date: date,
      created_by: null,
    };

    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from("expenses")
          .update({
            paid_by_member_id: expenseData.paid_by_member_id,
            description: expenseData.description,
            amount: expenseData.amount,
            expense_date: expenseData.expense_date,
          })
          .eq("id", editingId)
          .eq("trip_id", TRIP_ID);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("expenses")
          .insert(expenseData);

        if (insertError) throw insertError;
      }

      if (mountedRef.current) resetForm();

      await loadData();
    } catch (err) {
      if (mountedRef.current) {
        setError(getErrorMessage(err, "Unable to save expense."));
      }
    } finally {
      if (mountedRef.current) setSaving(false);
    }
  }

  function startEditing(expense: Expense) {
    const payer = memberById.get(expense.paid_by_member_id);

    if (!payer) return;

    setActivePerson(payer.display_name);
    setDescription(expense.description);
    setAmount(String(expense.amount));
    setDate(expense.expense_date);
    setEditingId(expense.id);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteExpense(id: string) {
    if (deletingIds.includes(id)) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) return;

    setError("");
    setDeletingIds((current) => [...current, id]);

    try {
      const { error: deleteError } = await supabase
        .from("expenses")
        .delete()
        .eq("id", id)
        .eq("trip_id", TRIP_ID);

      if (deleteError) throw deleteError;

      if (mountedRef.current && editingId === id) {
        resetForm();
      }

      await loadData();
    } catch (err) {
      if (mountedRef.current) {
        setError(getErrorMessage(err, "Unable to delete expense."));
      }
    } finally {
      if (mountedRef.current) {
        setDeletingIds((current) => current.filter((item) => item !== id));
      }
    }
  }

  return (
    <main className="app-container expenses-page">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={18} />
        Back
      </button>

      <header className="top-header">
        <div>
          <span className="eyebrow">TRIP MONEY MANAGER</span>
          <h1>
            Trip <span>Expenses.</span>
          </h1>
          <p>Keep track of who paid for what.</p>
        </div>
        <div className="profile-icon">
          <Wallet size={20} />
        </div>
      </header>

      {error && (
        <div className="expense-error" role="alert">
          {error}
          <button type="button" onClick={() => setError("")}>
            <X size={15} />
          </button>
        </div>
      )}

      <section className="expense-total-card">
        <div className="expense-total-icon">
          <Wallet size={21} />
        </div>
        <span>Total trip expenditure</span>
        <h2>{formatMoney(totalPaid)}</h2>
        <p>{expenses.length} expenses recorded</p>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ADD EXPENSE</span>
            <h2>Who paid?</h2>
          </div>
        </div>

        <div className="expense-person-tabs">
          {PEOPLE.map((person) => (
            <button
              key={person}
              className={`expense-person-tab ${
                activePerson === person ? "active" : ""
              }`}
              onClick={() => setActivePerson(person)}
              type="button"
            >
              {person}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="expense-empty">
            <RefreshCw size={24} />
            <p>Loading shared expenses...</p>
          </div>
        ) : (
          <form className="expense-form" onSubmit={saveExpense}>
            <label htmlFor="expense-description">
              Expense description
            </label>
            <input
              id="expense-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="e.g. Dinner, Hotel, Petrol"
              required
            />

            <label htmlFor="expense-amount">Amount (₹)</label>
            <div className="expense-amount-input">
              <IndianRupee size={17} />
              <input
                id="expense-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Enter amount"
                required
              />
            </div>

            <label htmlFor="expense-date">Date</label>
            <input
              id="expense-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />

            <button
              className="expense-add-button"
              type="submit"
              disabled={saving}
            >
              {saving ? (
                <RefreshCw size={17} />
              ) : editingId ? (
                <Pencil size={17} />
              ) : (
                <Plus size={18} />
              )}
              {saving
                ? "Saving..."
                : editingId
                  ? "Update expense"
                  : `Add expense for ${activePerson}`}
            </button>

            {editingId && (
              <button
                className="expense-cancel-button"
                type="button"
                onClick={resetForm}
              >
                Cancel editing
              </button>
            )}
          </form>
        )}
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">PAYMENT HISTORY</span>
            <h2>{activePerson}'s expenses</h2>
          </div>
          <Receipt size={21} />
        </div>

        {loading ? (
          <div className="expense-empty">
            <RefreshCw size={24} />
            <p>Loading...</p>
          </div>
        ) : personExpenses.length === 0 ? (
          <div className="expense-empty">
            <Receipt size={28} />
            <p>No expenses recorded yet.</p>
            <span>Add the first expense above.</span>
          </div>
        ) : (
          <div className="expense-list">
            {personExpenses.map((expense) => (
              <div className="expense-entry" key={expense.id}>
                <div className="expense-entry-icon">
                  <IndianRupee size={18} />
                </div>

                <div className="expense-entry-details">
                  <strong>{expense.description}</strong>
                  <span>{expense.expense_date}</span>
                  <small>
                    Paid by{" "}
                    {memberById.get(expense.paid_by_member_id)?.display_name}
                  </small>
                </div>

                <div className="expense-entry-right">
                  <strong>
                    {formatMoney(Math.round(Number(expense.amount) * 100))}
                  </strong>

                  <div className="expense-actions">
                    <button
                      className="expense-edit-button"
                      onClick={() => startEditing(expense)}
                      aria-label={`Edit ${expense.description}`}
                      type="button"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      className="expense-delete-button"
                      onClick={() => void deleteExpense(expense.id)}
                      aria-label={`Delete ${expense.description}`}
                      type="button"
                      disabled={deletingIds.includes(expense.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">AUTOMATIC CALCULATION</span>
            <h2>Expense summary</h2>
          </div>
          <Users size={21} />
        </div>

        <p className="expense-summary-note">
          All expenses are split equally between the three travellers.
        </p>

        <div className="expense-summary-list">
          {summary.map((person) => (
            <div className="expense-summary-person" key={person.person}>
              <strong>{person.person}</strong>

              <div>
                <span>Paid: {formatMoney(person.paid)}</span>
                <span>Share: {formatMoney(person.share)}</span>
              </div>

              <strong
                className={
                  person.balance >= 0
                    ? "expense-positive"
                    : "expense-negative"
                }
              >
                {person.balance > 0 ? "+" : ""}
                {formatMoney(person.balance)}
              </strong>

              <small>
                {person.balance > 0
                  ? "Should receive"
                  : person.balance < 0
                    ? "Needs to pay"
                    : "Settled"}
              </small>
            </div>
          ))}
        </div>

        <div className="expense-settlement">
          <h3>Who owes whom?</h3>

          {settlements.length === 0 ? (
            <p>Everyone is settled up!</p>
          ) : (
            settlements.map((settlement, index) => (
              <div className="settlement-row" key={index}>
                <span>{settlement.from}</span>
                <span className="settlement-arrow">→</span>
                <span>{settlement.to}</span>
                <strong>{formatMoney(settlement.amount)}</strong>
              </div>
            ))
          )}
        </div>
      </section>

      <style>{`
        .expenses-page {
          padding-bottom: 110px;
        }

        .expenses-page .top-header {
          margin-top: 20px;
        }

        .expenses-page .top-header h1 {
          font-size: 27px;
          margin: 7px 0;
        }

        .expenses-page .top-header h1 span {
          color: var(--green);
        }

        .expenses-page .top-header p {
          color: var(--muted);
          font-size: 12px;
          margin: 0;
        }

        .expense-total-card {
          background: #e9f0e8;
          color: #234d3b;
          padding: 21px;
          border-radius: 19px;
          margin: 24px 0;
          border: 1px solid #dce8dc;
        }

        .expense-total-icon {
          width: 42px;
          height: 42px;
          border-radius: 13px;
          display: grid;
          place-items: center;
          background: rgba(35,77,59,.09);
          color: var(--green);
        }

        .expense-total-card > span {
          display: block;
          font-size: 12px;
          color: #617968;
          margin-top: 15px;
        }

        .expense-total-card h2 {
          font-size: 30px;
          margin: 5px 0;
          color: #234d3b;
        }

        .expense-total-card p {
          font-size: 11px;
          color: #718477;
          margin: 0;
        }

        .expense-person-tabs {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 8px;
          margin: 16px 0;
        }

        .expense-person-tab {
          padding: 12px 5px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: #fff;
          color: var(--text);
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .expense-person-tab.active {
          background: var(--green);
          color: #fff;
          border-color: var(--green);
        }

        .expense-form {
          display: flex;
          flex-direction: column;
          gap: 9px;
          padding: 17px;
          border: 1px solid var(--border);
          border-radius: 17px;
          background: #fff;
        }

        .expense-form label {
          font-size: 11px;
          font-weight: 600;
          color: var(--text);
          margin-top: 5px;
        }

        .expense-form input {
          width: 100%;
          box-sizing: border-box;
          padding: 12px;
          border: 1px solid var(--border);
          border-radius: 10px;
          background: #fafaf7;
          color: var(--text);
          font-family: inherit;
          font-size: 13px;
          outline: none;
        }

        .expense-form input:focus {
          border-color: var(--green);
          background: #fff;
        }

        .expense-amount-input {
          display: flex;
          align-items: center;
          gap: 7px;
          padding-left: 11px;
          border: 1px solid var(--border);
          border-radius: 10px;
          background: #fafaf7;
          color: var(--green);
        }

        .expense-amount-input input {
          border: none;
          background: transparent;
        }

        .expense-add-button {
          margin-top: 10px;
          border: none;
          border-radius: 11px;
          background: var(--green);
          color: white;
          padding: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .expense-add-button:disabled {
          opacity: .6;
          cursor: wait;
        }

        .expense-cancel-button {
          border: 1px solid var(--border);
          border-radius: 11px;
          background: #fff;
          color: var(--muted);
          padding: 11px;
          font-family: inherit;
          font-size: 12px;
          cursor: pointer;
        }

        .expense-empty {
          background: #fafaf7;
          border: 1px dashed var(--border);
          border-radius: 15px;
          padding: 28px 15px;
          text-align: center;
          color: var(--muted);
        }

        .expense-empty p {
          margin: 10px 0 4px;
          color: var(--text);
          font-size: 13px;
          font-weight: 600;
        }

        .expense-empty span {
          font-size: 11px;
        }

        .expense-list {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .expense-entry {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 13px;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 14px;
        }

        .expense-entry-icon {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: #edf3ed;
          color: var(--green);
        }

        .expense-entry-details {
          display: flex;
          flex: 1;
          min-width: 0;
          flex-direction: column;
          gap: 4px;
        }

        .expense-entry-details strong {
          font-size: 13px;
          color: var(--text);
          overflow-wrap: anywhere;
        }

        .expense-entry-details span,
        .expense-entry-details small {
          font-size: 10px;
          color: var(--muted);
        }

        .expense-entry-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .expense-entry-right > strong {
          font-size: 13px;
          color: var(--text);
          white-space: nowrap;
        }

        .expense-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .expense-edit-button,
        .expense-delete-button {
          border: none;
          background: transparent;
          padding: 4px;
          cursor: pointer;
        }

        .expense-edit-button {
          color: var(--green);
        }

        .expense-delete-button {
          color: #a36c63;
        }

        .expense-summary-note {
          font-size: 11px;
          color: var(--muted);
          line-height: 1.5;
          margin-bottom: 13px;
        }

        .expense-summary-list {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .expense-summary-person {
          padding: 15px;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 14px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 7px;
        }

        .expense-summary-person > strong:first-child {
          font-size: 13px;
          color: var(--text);
        }

        .expense-summary-person div {
          grid-column: 1 / -1;
          display: flex;
          justify-content: space-between;
          gap: 8px;
          color: var(--muted);
          font-size: 11px;
        }

        .expense-summary-person > strong:nth-of-type(2) {
          font-size: 13px;
        }

        .expense-summary-person small {
          color: var(--muted);
          font-size: 10px;
          text-align: right;
        }

        .expense-positive {
          color: #28764b;
        }

        .expense-negative {
          color: #b34e43;
        }

        .expense-settlement {
          margin-top: 15px;
          padding: 17px;
          background: #edf3ed;
          border: 1px solid #e0e9df;
          border-radius: 15px;
        }

        .expense-settlement h3 {
          margin: 0 0 12px;
          font-size: 14px;
          color: var(--green);
        }

        .expense-settlement p {
          font-size: 12px;
          color: var(--muted);
          margin-bottom: 0;
        }

        .settlement-row {
          display: grid;
          grid-template-columns: 1fr auto 1fr auto;
          gap: 7px;
          align-items: center;
          padding: 11px 0;
          border-top: 1px solid rgba(35,77,59,.12);
          font-size: 11px;
          color: var(--text);
        }

        .settlement-row strong {
          text-align: right;
          white-space: nowrap;
          color: var(--green);
        }

        .settlement-arrow {
          color: var(--green);
          font-weight: 700;
        }

        .expense-error {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin: 15px 0;
          padding: 12px;
          border-radius: 12px;
          background: #fff0ed;
          color: #a33f32;
          font-size: 12px;
          overflow-wrap: anywhere;
        }

        .expense-error button {
          flex-shrink: 0;
          border: none;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }
      `}</style>
    </main>
  );
}

export default ExpensesPage;
