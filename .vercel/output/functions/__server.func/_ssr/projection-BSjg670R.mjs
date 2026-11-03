import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as usePlanStore } from "./router-Cf85GnlH.mjs";
import { f as years, n as PageTitle, s as gbp, t as Money } from "./bits-DpCBTmAl.mjs";
import { n as project } from "./engine-fCZjT8Jo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projection-BSjg670R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProjectionPage() {
	const inputs = usePlanStore((s) => s.inputs);
	const works = usePlanStore((s) => s.works);
	const result = (0, import_react.useMemo)(() => project(inputs), [inputs]);
	const yearly = result.rows.filter((row, index, all) => {
		if (row.period === 0) return true;
		const prev = all[index - 1];
		return Math.floor(row.age) !== Math.floor(prev.age) && row.age <= 70;
	});
	const estimate = works.reduce((s, w) => s + w.estimate, 0);
	const paid = works.reduce((s, w) => s + w.paid, 0);
	const forecast = works.reduce((s, w) => s + w.forecast, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			kicker: "Same formulas as the workbook",
			title: "Projection",
			lede: `Income target glides from ${gbp(result.fullYearIncome)} a year at 68 toward ${gbp(inputs.maxYearIncome)}, which is ${gbp(result.targetMonthIncome, 0)} a month drawn from the accessible pot after ${years(inputs.retirementAge)}. Loans clear around ${result.loanClearAge ? years(result.loanClearAge) : "—"}, the mortgage around ${result.mortgageClearAge ? years(result.mortgageClearAge) : "—"}. Cleared payments move into the investment.`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-card border border-line bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[44rem] text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
					className: "border-b border-line text-xs tracking-wide text-muted uppercase",
					children: [
						"Age",
						"Date",
						"Loans",
						"Mortgage",
						"Copperpot",
						"Investments",
						"Pension",
						"Accessible"
					].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-3 font-semibold",
						children: h
					}, h))
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: yearly.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-line last:border-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 font-semibold",
							children: years(row.age)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-muted",
							children: row.date
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: row.loan })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: row.mortgage })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: row.copperpot })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: row.investment })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: row.pension })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 font-semibold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: row.accessible })
						})
					]
				}, row.period)) })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display mt-8 text-2xl",
			children: "House works"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-1 text-sm text-muted",
			children: [
				"Estimate ",
				gbp(estimate),
				" · paid ",
				gbp(paid),
				" · still forecast ",
				gbp(forecast),
				". This does not go into the retirement pot."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 divide-y divide-line overflow-hidden rounded-card border border-line bg-card",
			children: works.map((work) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "grid grid-cols-4 gap-2 px-3 py-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: work.item
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right text-muted",
						children: gbp(work.estimate)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right",
						children: gbp(work.paid)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right",
						children: work.forecast ? gbp(work.forecast) : "—"
					})
				]
			}, work.id))
		})
	] });
}
//#endregion
export { ProjectionPage as component };
