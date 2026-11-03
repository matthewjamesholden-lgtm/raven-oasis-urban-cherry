import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as usePlanStore } from "./router-Cf85GnlH.mjs";
import { a as buttonClass, n as PageTitle, o as fieldClass, t as Money } from "./bits-DpCBTmAl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trips-DBBpilHG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TERMS = [
	"February",
	"Easter",
	"May",
	"Summer",
	"October",
	"Christmas"
];
function TripsPage() {
	const holidays = usePlanStore((s) => s.holidays);
	const trips = usePlanStore((s) => s.trips);
	const charges = usePlanStore((s) => s.charges);
	const updateTrip = usePlanStore((s) => s.updateTrip);
	const addTrip = usePlanStore((s) => s.addTrip);
	const [place, setPlace] = (0, import_react.useState)("");
	const [when, setWhen] = (0, import_react.useState)("");
	const years = (0, import_react.useMemo)(() => [...new Set(holidays.map((h) => h.year))].sort((a, b) => a - b), [holidays]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			kicker: "Where, then what it cost",
			title: "Trips",
			lede: "The holiday grid is only a record of where you went. It does not feed the cashflow. Spending sits on the trip, from card charges tagged to it, and still counts inside the card budget."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-card border border-line bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[40rem] text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-line text-xs tracking-wide text-muted uppercase",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-3 font-semibold",
						children: "Year"
					}), TERMS.map((term) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-3 font-semibold",
						children: term
					}, term))]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: years.map((year) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-line last:border-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-3 font-display text-base font-semibold",
						children: year
					}), TERMS.map((term) => {
						const hit = holidays.find((h) => h.year === year && h.term === term);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-3 text-ink",
							children: hit?.place ?? ""
						}, term);
					})]
				}, year)) })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display mt-8 text-2xl",
			children: "Trip budgets"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 max-w-2xl text-sm text-muted",
			children: "Fuel stays everyday. Villa running costs stay on the cashflow, not here. Actuals are card charges with this trip selected."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 space-y-3",
			children: trips.map((trip) => {
				const actual = charges.filter((c) => c.tripId === trip.id).reduce((s, c) => s + c.amount, 0);
				const budget = trip.flights + trip.stay + trip.car + trip.spend;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-card border border-line bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-baseline justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-wide text-muted uppercase",
							children: trip.code
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display text-xl",
							children: [
								trip.place,
								" · ",
								trip.when
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								"Spent ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
									value: actual,
									digits: 2
								}),
								" of ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: budget })
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4",
						children: [
							["flights", "Flights"],
							["stay", "Stay"],
							["car", "Car hire"],
							["spend", "Spending"]
						].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm text-muted",
							children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: `${fieldClass} mt-1`,
								inputMode: "decimal",
								value: trip[key] || "",
								placeholder: "0",
								onChange: (e) => updateTrip(trip.id, { [key]: Number(e.target.value) || 0 })
							})]
						}, key))
					})]
				}, trip.id);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-4 flex flex-col gap-2 rounded-card border border-line bg-card p-4 sm:flex-row",
			onSubmit: (event) => {
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
					spend: 0
				});
				setPlace("");
				setWhen("");
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					placeholder: "Place",
					value: place,
					onChange: (e) => setPlace(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					placeholder: "When",
					value: when,
					onChange: (e) => setWhen(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: buttonClass,
					type: "submit",
					children: "Add trip"
				})
			]
		})
	] });
}
//#endregion
export { TripsPage as component };
