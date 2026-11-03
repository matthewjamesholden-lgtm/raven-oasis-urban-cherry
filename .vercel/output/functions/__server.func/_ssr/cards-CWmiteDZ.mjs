import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as usePlanStore } from "./router-Cf85GnlH.mjs";
import { a as buttonClass, c as ghostClass, d as prettyDate, n as PageTitle, o as fieldClass, s as gbp, t as Money } from "./bits-DpCBTmAl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cards-CWmiteDZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	"Groceries",
	"Fuel",
	"Eating out",
	"Kids",
	"Home",
	"Travel",
	"Subscriptions",
	"Other"
];
function CardsPage() {
	const cards = usePlanStore((s) => s.cards);
	const charges = usePlanStore((s) => s.charges);
	const trips = usePlanStore((s) => s.trips);
	const inputs = usePlanStore((s) => s.inputs);
	const updateCard = usePlanStore((s) => s.updateCard);
	const upsert = usePlanStore((s) => s.upsertCharge);
	const remove = usePlanStore((s) => s.removeCharge);
	const [draft, setDraft] = (0, import_react.useState)({
		date: inputs.asOf,
		cardId: "tesco",
		merchant: "",
		amount: "",
		category: "Groceries",
		tripId: ""
	});
	const byCategory = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const charge of charges) map.set(charge.category, (map.get(charge.category) ?? 0) + charge.amount);
		return [...map.entries()].sort((a, b) => b[1] - a[1]);
	}, [charges]);
	const month = inputs.asOf.slice(0, 7);
	const monthTotal = charges.filter((c) => c.date.startsWith(month)).reduce((s, c) => s + c.amount, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			kicker: "Tesco, Amex, Lloyds",
			title: "Cards",
			lede: "The spreadsheet only had the payoff leaving Ultimate. Statement balances were not in the file, so they start blank. Trip charges stay inside the card budget."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-4 text-sm text-muted",
			children: [
				"Entered in ",
				month,
				": ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-ink",
					children: gbp(monthTotal)
				}),
				" of ",
				gbp(inputs.cardBudget),
				". Everyday week guide ",
				gbp(inputs.weekSpend),
				"."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 lg:grid-cols-3",
			children: cards.map((card) => {
				const clear = monthsToClear(card.balance, card.apr, card.monthlyPayment);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-card border border-line bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: card.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: card.paidHow
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-3 block text-sm text-muted",
							children: ["Statement balance", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: `${fieldClass} mt-1`,
								inputMode: "decimal",
								value: card.balance || "",
								placeholder: "0",
								onChange: (e) => updateCard(card.id, { balance: Number(e.target.value) || 0 })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm text-muted",
								children: ["APR %", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: `${fieldClass} mt-1`,
									inputMode: "decimal",
									value: card.apr ? card.apr * 100 : "",
									placeholder: "0",
									onChange: (e) => updateCard(card.id, { apr: (Number(e.target.value) || 0) / 100 })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm text-muted",
								children: ["Paid / month", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: `${fieldClass} mt-1`,
									inputMode: "decimal",
									value: card.monthlyPayment || "",
									placeholder: "0",
									onChange: (e) => updateCard(card.id, { monthlyPayment: Number(e.target.value) || 0 })
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted",
							children: clear === null ? "Add a balance, rate and payment to see a clear date." : clear === Infinity ? "That payment does not cover the interest." : `Clears in about ${clear} months.`
						})
					]
				}, card.id);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-6 grid gap-3 rounded-card border border-line bg-card p-4 sm:grid-cols-6",
			onSubmit: (event) => {
				event.preventDefault();
				const amount = Number(draft.amount);
				if (!draft.merchant || !draft.date || !(amount > 0)) return;
				const charge = {
					id: `chg-${Date.now()}`,
					date: draft.date,
					cardId: draft.cardId,
					merchant: draft.merchant,
					amount,
					category: draft.category,
					tripId: draft.tripId || void 0
				};
				upsert(charge);
				setDraft({
					...draft,
					merchant: "",
					amount: ""
				});
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "sm:col-span-2 text-sm text-muted",
					children: ["Merchant", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: `${fieldClass} mt-1`,
						value: draft.merchant,
						onChange: (e) => setDraft({
							...draft,
							merchant: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm text-muted",
					children: ["Amount", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: `${fieldClass} mt-1`,
						inputMode: "decimal",
						value: draft.amount,
						onChange: (e) => setDraft({
							...draft,
							amount: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm text-muted",
					children: ["Card", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: `${fieldClass} mt-1`,
						value: draft.cardId,
						onChange: (e) => setDraft({
							...draft,
							cardId: e.target.value
						}),
						children: cards.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: card.id,
							children: card.name
						}, card.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm text-muted",
					children: ["Category", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: `${fieldClass} mt-1`,
						value: draft.category,
						onChange: (e) => setDraft({
							...draft,
							category: e.target.value
						}),
						children: CATEGORIES.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: category }, category))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm text-muted",
					children: ["Date", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: `${fieldClass} mt-1`,
						type: "date",
						value: draft.date,
						onChange: (e) => setDraft({
							...draft,
							date: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "sm:col-span-3 text-sm text-muted",
					children: ["Trip", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: `${fieldClass} mt-1`,
						value: draft.tripId,
						onChange: (e) => setDraft({
							...draft,
							tripId: e.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Everyday, inside the card budget"
						}), trips.map((trip) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: trip.id,
							children: [
								trip.place,
								" · ",
								trip.when
							]
						}, trip.id))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-end sm:col-span-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: buttonClass,
						type: "submit",
						children: "Add charge"
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-4 lg:grid-cols-[16rem_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "rounded-card border border-line bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "By category"
				}), byCategory.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Nothing entered yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: byCategory.map(([category, amount]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: category }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
							value: amount,
							digits: 2
						})]
					}, category))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line overflow-hidden rounded-card border border-line bg-card",
				children: charges.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "px-4 py-6 text-sm text-muted",
					children: "Charges you add stay in this browser."
				}) : [...charges].sort((a, b) => b.date.localeCompare(a.date)).map((charge) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-3 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: charge.merchant
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							prettyDate(charge.date),
							" · ",
							cards.find((c) => c.id === charge.cardId)?.name,
							" · ",
							charge.category,
							charge.tripId ? ` · ${trips.find((t) => t.id === charge.tripId)?.place ?? "Trip"}` : ""
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
							value: charge.amount,
							digits: 2
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: ghostClass,
							type: "button",
							onClick: () => remove(charge.id),
							children: "Delete"
						})]
					})]
				}, charge.id))
			})]
		})
	] });
}
function monthsToClear(balance, apr, payment) {
	if (!(balance > 0) || !(payment > 0)) return null;
	const monthly = apr / 12;
	if (monthly <= 0) return Math.ceil(balance / payment);
	if (payment <= balance * monthly) return Infinity;
	const months = -Math.log(1 - balance * monthly / payment) / Math.log(1 + monthly);
	return Math.ceil(months);
}
//#endregion
export { CardsPage as component };
