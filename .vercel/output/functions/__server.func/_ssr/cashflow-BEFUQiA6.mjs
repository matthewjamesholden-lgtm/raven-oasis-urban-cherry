import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as usePlanStore } from "./router-Cf85GnlH.mjs";
import { a as buttonClass, c as ghostClass, l as monthLabel, n as PageTitle, o as fieldClass, t as Money } from "./bits-DpCBTmAl.mjs";
import { o as runCash } from "./cashflow-x2AQsW6B.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cashflow-BEFUQiA6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CashflowPage() {
	const inputs = usePlanStore((s) => s.inputs);
	const payments = usePlanStore((s) => s.payments);
	const trips = usePlanStore((s) => s.trips);
	const upsert = usePlanStore((s) => s.upsertPayment);
	const remove = usePlanStore((s) => s.removePayment);
	const [showOld, setShowOld] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)({
		item: "",
		amount: "",
		account: "ultimate",
		date: inputs.asOf,
		tripId: ""
	});
	const lines = (0, import_react.useMemo)(() => runCash(payments, inputs.rewardOpen, inputs.ultimateOpen), [
		payments,
		inputs.rewardOpen,
		inputs.ultimateOpen
	]);
	const cutoff = shiftDays(inputs.asOf, -30);
	const visible = lines.filter((line) => showOld || line.status !== "actual" || line.date >= cutoff);
	const hidden = lines.length - visible.length;
	const lowest = lines.reduce((min, line) => Math.min(min, line.total), Number.POSITIVE_INFINITY);
	const groups = [];
	for (const line of visible) {
		const month = line.date.slice(0, 7);
		const last = groups[groups.length - 1];
		if (!last || last.month !== month) groups.push({
			month,
			rows: [line]
		});
		else last.rows.push(line);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			kicker: "Date order",
			title: "Cashflow",
			lede: "Each row is a real date, so the low is the worst balance, not the worst row. Days follow the spreadsheet’s order until you change them. Paid rows drop off a month after the plan date."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-4 text-sm text-muted",
			children: [
				"Lowest combined balance on this list:",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-ink",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						value: Number.isFinite(lowest) ? lowest : 0,
						digits: 2
					})
				}),
				". Opening balances are Reward ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
					value: inputs.rewardOpen,
					digits: 2
				}),
				" and Ultimate",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
					value: inputs.ultimateOpen,
					digits: 2
				}),
				"."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mb-6 grid gap-3 rounded-card border border-line bg-card p-4 sm:grid-cols-6",
			onSubmit: (event) => {
				event.preventDefault();
				const amount = Number(draft.amount);
				if (!draft.item || !draft.date || Number.isNaN(amount)) return;
				upsert({
					id: `pay-${Date.now()}`,
					item: draft.item,
					amount,
					account: draft.account,
					date: draft.date,
					status: "estimate",
					tripId: draft.tripId || void 0
				});
				setDraft({
					...draft,
					item: "",
					amount: ""
				});
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "sm:col-span-2 text-sm text-muted",
					children: ["Item", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: `${fieldClass} mt-1`,
						value: draft.item,
						onChange: (e) => setDraft({
							...draft,
							item: e.target.value
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
						}),
						placeholder: "-200"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm text-muted",
					children: ["Account", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: `${fieldClass} mt-1`,
						value: draft.account,
						onChange: (e) => setDraft({
							...draft,
							account: e.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "ultimate",
							children: "Ultimate"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "reward",
							children: "Reward"
						})]
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: `${buttonClass} w-full`,
						type: "submit",
						children: "Add"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "sm:col-span-3 text-sm text-muted",
					children: ["Trip, if this is holiday spending", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: `${fieldClass} mt-1`,
						value: draft.tripId,
						onChange: (e) => setDraft({
							...draft,
							tripId: e.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Everyday"
						}), trips.map((trip) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: trip.id,
							children: [
								trip.code,
								" · ",
								trip.place
							]
						}, trip.id))]
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: hidden > 0 ? `${hidden} paid rows hidden` : "Nothing paid and old enough to hide"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: ghostClass,
				type: "button",
				onClick: () => setShowOld((v) => !v),
				children: showOld ? "Hide old paid rows" : "Show history"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-6",
			children: groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: monthLabel(`${group.month}-01`)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 divide-y divide-line overflow-hidden rounded-card border border-line bg-card",
				children: group.rows.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CashRow, {
					line,
					onChange: upsert,
					onRemove: remove
				}, line.id))
			})] }, group.month))
		})
	] });
}
function CashRow({ line, onChange, onRemove }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "grid grid-cols-[1fr_auto] gap-2 px-3 py-3 sm:grid-cols-[11rem_1fr_6rem_6rem_6rem_auto] sm:items-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm text-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					type: "date",
					"aria-label": `Date for ${line.item}`,
					value: line.date,
					onChange: (e) => onChange(commit(line, { date: e.target.value }))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `font-semibold ${line.status === "actual" ? "text-muted line-through" : "text-ink"}`,
				children: line.item
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: [
					line.account === "reward" ? "Reward" : "Ultimate",
					" · ",
					line.status
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-right text-sm font-semibold",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
					value: line.amount,
					digits: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "hidden text-right text-sm sm:block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted",
					children: "R "
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
					value: line.reward,
					digits: 0
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "hidden text-right text-sm sm:block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted",
					children: "U "
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
					value: line.ultimate,
					digits: 0
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "col-span-2 flex justify-end gap-2 sm:col-span-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: ghostClass,
					onClick: () => onChange(commit(line, { status: line.status === "actual" ? "estimate" : "actual" })),
					children: line.status === "actual" ? "Undo" : "Paid"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: ghostClass,
					onClick: () => onRemove(line.id),
					children: "Delete"
				})]
			})
		]
	});
}
function commit(line, patch) {
	return {
		id: line.id,
		date: patch.date ?? line.date,
		item: line.item,
		amount: line.amount,
		account: line.account,
		status: patch.status ?? line.status,
		tripId: line.tripId
	};
}
function shiftDays(iso, days) {
	const [y, m, d] = iso.split("-").map(Number);
	return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}
//#endregion
export { CashflowPage as component };
