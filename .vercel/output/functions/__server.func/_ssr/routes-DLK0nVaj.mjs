import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as usePlanStore } from "./router-Cf85GnlH.mjs";
import { d as prettyDate, f as years, l as monthLabel, n as PageTitle, r as Stat, s as gbp, u as pct } from "./bits-DpCBTmAl.mjs";
import { a as nextQuarter, i as lowsBetween, n as coverUltimate, o as runCash, r as groupHints, t as balanceAt } from "./cashflow-x2AQsW6B.mjs";
import { n as project, t as earliestSafeAge } from "./engine-fCZjT8Jo.mjs";
import { a as CartesianGrid, c as Legend, i as Line, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as LineChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DLK0nVaj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const inputs = usePlanStore((s) => s.inputs);
	const payments = usePlanStore((s) => s.payments);
	const charges = usePlanStore((s) => s.charges);
	const works = usePlanStore((s) => s.works);
	const renewals = usePlanStore((s) => s.renewals);
	const base = (0, import_react.useMemo)(() => project(inputs), [inputs]);
	const cautious = (0, import_react.useMemo)(() => project({
		...inputs,
		roi: inputs.cautiousRoi
	}), [inputs]);
	const poor = (0, import_react.useMemo)(() => project({
		...inputs,
		roi: inputs.poorRoi
	}), [inputs]);
	const safeAge = (0, import_react.useMemo)(() => earliestSafeAge(inputs), [inputs]);
	const lines = (0, import_react.useMemo)(() => runCash(payments, inputs.rewardOpen, inputs.ultimateOpen), [
		payments,
		inputs.rewardOpen,
		inputs.ultimateOpen
	]);
	const quarter = nextQuarter(inputs.asOf);
	const start = balanceAt(lines, quarter.from, inputs.rewardOpen, inputs.ultimateOpen);
	const lows = lowsBetween(lines, quarter.from, quarter.to, start);
	const hints = (0, import_react.useMemo)(() => coverUltimate(payments, inputs.rewardOpen, inputs.ultimateOpen), [
		payments,
		inputs.rewardOpen,
		inputs.ultimateOpen
	]).hints.filter((h) => h.date >= quarter.from && h.date < quarter.to);
	const byMonth = groupHints(hints);
	const chart = base.rows.filter((r) => r.period % 6 === 0 && r.age <= 70).map((r) => ({
		age: Math.round(r.age * 10) / 10,
		Accessible: Math.round(r.accessible),
		Pension: Math.round(r.pension)
	}));
	const monthKey = inputs.asOf.slice(0, 7);
	const cardSpend = charges.filter((c) => c.date.startsWith(monthKey)).reduce((sum, c) => sum + c.amount, 0);
	const tripSpend = charges.filter((c) => c.date.startsWith(monthKey) && c.tripId).reduce((sum, c) => sum + c.amount, 0);
	const worksLeft = works.reduce((sum, w) => sum + w.forecast, 0);
	const dueRenewals = renewals.filter((r) => r.status === "open" && r.startComparing && r.startComparing <= inputs.asOf);
	const short = base.lowestAccessible58to59 < inputs.safety;
	const [chartReady, setChartReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setChartReady(true), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			kicker: "As of the spreadsheet",
			title: "The plan, on one screen",
			lede: `Retirement stays at ${years(inputs.retirementAge)}. The pot and the 58–59 low are calculated the same way as the workbook, dated ${prettyDate(inputs.asOf)}.`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Retirement age",
					value: years(inputs.retirementAge),
					hint: `Now ${years(base.ageNow)}`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Pot at retirement",
					value: gbp(base.potAtRetirement),
					hint: `Pension alongside ${gbp(base.pensionAtRetirement)}`,
					tone: "pine"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Lowest pot, 58–59",
					value: gbp(base.lowestAccessible58to59),
					hint: short ? `Under the ${gbp(inputs.safety)} floor` : `Above the ${gbp(inputs.safety)} floor`,
					tone: short ? "clay" : "pine"
				})
			]
		}),
		short ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 rounded-card border border-line bg-clay-soft px-4 py-3 text-sm text-clay",
			children: [
				"At ",
				years(inputs.retirementAge),
				" the accessible pot dips to ",
				gbp(base.lowestAccessible58to59),
				" around age",
				" ",
				years(base.lowestAge58to59),
				".",
				" ",
				safeAge ? `Keeping it above ${gbp(inputs.safety)} means waiting until ${years(safeAge)}.` : `It does not clear ${gbp(inputs.safety)} before age 62 on these rates.`
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 rounded-card border border-line bg-moss px-4 py-3 text-sm text-pine",
			children: [
				"The ",
				gbp(inputs.safety),
				" floor holds at ",
				years(inputs.retirementAge),
				".",
				safeAge && safeAge < inputs.retirementAge ? safeAge <= 48 ? ` It still holds at ${years(safeAge)}, the youngest age checked.` : ` The earliest age that still holds it is ${years(safeAge)}.` : ""
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-tight",
					children: "Next three months"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						"Reward and Ultimate, in the spreadsheet’s order, from ",
						prettyDate(quarter.from),
						". Ultimate is allowed to go negative here, which is what the sheet does. Transfers are a suggestion, not yet applied."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Lowest Reward",
							value: gbp(lows.reward, 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Lowest Ultimate",
							value: gbp(lows.ultimate, 0),
							tone: lows.ultimate < 0 ? "clay" : "ink"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Lowest together",
							value: gbp(lows.total, 0),
							tone: lows.total < 0 ? "clay" : "pine"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-2",
					children: byMonth.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-muted",
						children: "No transfer needed to keep Ultimate in credit over this window."
					}) : byMonth.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-baseline justify-between gap-4 rounded-2xl border border-line bg-card px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm text-muted",
							children: ["Move from Reward to Ultimate in ", monthLabel(`${row.month}-01`)]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl",
							children: gbp(row.amount)
						})]
					}, row.month))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/cashflow",
					className: "mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-pine",
					children: "Open the cashflow"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8 grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-card border border-line bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: "Cards this month"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							"Trip spending sits inside the ",
							gbp(inputs.cardBudget),
							" card budget, so the retirement date does not move."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display mt-4 text-3xl",
						children: gbp(cardSpend)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							"of ",
							gbp(inputs.cardBudget),
							" entered · trips ",
							gbp(tripSpend),
							" · everyday ",
							gbp(cardSpend - tripSpend)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 h-2 overflow-hidden rounded-full bg-paper",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-pine",
							style: { width: `${Math.min(100, cardSpend / inputs.cardBudget * 100)}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "No card charges were in the spreadsheet. Add them on Cards and they show up here, split by trip."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-card border border-line bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: "Worth a look"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-ink",
						children: ["House works still forecast: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: gbp(worksLeft)
						})]
					}),
					dueRenewals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "No renewal has reached its “start comparing” date yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2",
						children: dueRenewals.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: r.item
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted",
								children: [" · ", r.action]
							})]
						}, r.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/inputs",
						className: "mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-pine",
						children: "Renewals and inputs"
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-tight",
					children: "Same plan, three rates"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 max-w-2xl text-sm text-muted",
					children: [
						"Base is the workbook’s ",
						pct(inputs.roi),
						". Cautious and poor only change the growth rate. Draw, contributions and the retirement age stay put."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-3 md:grid-cols-3",
					children: [
						[
							"Base",
							inputs.roi,
							base
						],
						[
							"Cautious",
							inputs.cautiousRoi,
							cautious
						],
						[
							"Poor",
							inputs.poorRoi,
							poor
						]
					].map(([name, rate, result]) => {
						const row = result;
						const under = row.lowestAccessible58to59 < inputs.safety;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-card border border-line bg-card p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs font-semibold tracking-wide text-muted uppercase",
									children: [
										String(name),
										" · ",
										pct(Number(rate))
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 text-sm text-muted",
									children: ["Pot at ", years(inputs.retirementAge)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-2xl",
									children: gbp(row.potAtRetirement)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm text-muted",
									children: "Lowest at 58–59"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `font-display text-2xl ${under ? "text-clay" : "text-pine"}`,
									children: gbp(row.lowestAccessible58to59)
								})
							]
						}, String(name));
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8 rounded-card border border-line bg-card p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-tight",
				children: "Pot to age 70"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 h-64 w-full",
				children: chartReady ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: chart,
						margin: {
							top: 8,
							right: 8,
							left: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--color-line)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "age",
								tick: {
									fill: "var(--color-muted)",
									fontSize: 12
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: {
									fill: "var(--color-muted)",
									fontSize: 12
								},
								tickFormatter: (v) => `${Math.round(v / 1e3)}k`,
								width: 40
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								formatter: (value) => gbp(Number(value ?? 0)),
								labelFormatter: (label) => `Age ${label}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "Accessible",
								stroke: "var(--color-pine)",
								strokeWidth: 2,
								dot: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "Pension",
								stroke: "var(--color-ink)",
								strokeWidth: 2,
								dot: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {})
						]
					})
				}) : null
			})]
		})
	] });
}
//#endregion
export { Dashboard as component };
