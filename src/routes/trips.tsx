import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Money, PageTitle, buttonClass, fieldClass, ghostClass } from "@/components/bits";
import { usePlanStore } from "@/lib/plan/store";

export const Route = createFileRoute("/trips")({ component: TripsPage });

function TripsPage() {
  const trips = usePlanStore((s) => s.trips);
  const charges = usePlanStore((s) => s.charges);
  const updateTrip = usePlanStore((s) => s.updateTrip);
  const addTrip = usePlanStore((s) => s.addTrip);
  const removeTrip = usePlanStore((s) => s.removeTrip);
  const [place, setPlace] = useState("");
  const [when, setWhen] = useState("");

  return (
    <div>
      <PageTitle
        kicker="What it cost"
        title="Trips"
        lede="Each trip is a budget. Card charges that fall on its dates come out of the holiday pot, not the everyday card budget. Fuel stays everyday."
      />

      <div className="space-y-3">
        {trips.length === 0 ? <p className="text-sm text-muted">No trips yet.</p> : null}
        {trips.map((trip) => {
          const actual = charges.filter((c) => c.tripId === trip.id).reduce((s, c) => s + c.amount, 0);
          const budget = trip.flights + trip.stay + trip.car + trip.spend;
          return (
            <article key={trip.id} className="rounded-card border border-line bg-card p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold tracking-wide text-muted uppercase">{trip.code}</p>
                  <h3 className="font-display text-xl">
                    {trip.place} · {trip.when}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-muted">
                    Spent <Money value={actual} digits={2} /> of <Money value={budget} />
                  </p>
                  <button className={ghostClass} type="button" aria-label={`Delete ${trip.place}`} onClick={() => removeTrip(trip.id)}>
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <label className="text-sm text-muted">
                  From
                  <input className={`${fieldClass} mt-1`} type="date" value={trip.from ?? ""} onChange={(e) => updateTrip(trip.id, { from: e.target.value })} />
                </label>
                <label className="text-sm text-muted">
                  To
                  <input className={`${fieldClass} mt-1`} type="date" value={trip.to ?? ""} onChange={(e) => updateTrip(trip.id, { to: e.target.value })} />
                </label>
                <label className="text-sm text-muted sm:col-span-2">
                  Code
                  <input className={`${fieldClass} mt-1`} value={trip.code} onChange={(e) => updateTrip(trip.id, { code: e.target.value })} />
                </label>
                {(
                  [
                    ["flights", "Flights"],
                    ["stay", "Stay"],
                    ["car", "Car hire"],
                    ["spend", "Spending"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="text-sm text-muted">
                    {label}
                    <input
                      className={`${fieldClass} mt-1`}
                      inputMode="decimal"
                      value={trip[key] || ""}
                      placeholder="0"
                      onChange={(e) => updateTrip(trip.id, { [key]: Number(e.target.value) || 0 })}
                    />
                  </label>
                ))}
              </div>
            </article>
          );
        })}
      </div>

      <form
        className="mt-4 flex flex-col gap-2 rounded-card border border-line bg-card p-4 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          if (!place || !when) return;
          const code = place.slice(0, 3).toUpperCase();
          addTrip({
            id: `trip-${Date.now()}`,
            code: `${code}-${Date.now().toString().slice(-4)}`,
            place,
            when,
            flights: 0,
            stay: 0,
            car: 0,
            spend: 0,
          });
          setPlace("");
          setWhen("");
        }}
      >
        <input className={fieldClass} placeholder="Place" value={place} onChange={(e) => setPlace(e.target.value)} />
        <input className={fieldClass} placeholder="When" value={when} onChange={(e) => setWhen(e.target.value)} />
        <button className={buttonClass} type="submit" aria-label="Add trip">
          Add trip
        </button>
      </form>
    </div>
  );
}
