import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as usePlanStore } from "./router-Cf85GnlH.mjs";
import { a as buttonClass, c as ghostClass, d as prettyDate, n as PageTitle, o as fieldClass } from "./bits-DpCBTmAl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inputs-BV50Xjmo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InputsPage() {
	const inputs = usePlanStore((s) => s.inputs);
	const setInputs = usePlanStore((s) => s.setInputs);
	const renewals = usePlanStore((s) => s.renewals);
	const setStatus = usePlanStore((s) => s.setRenewalStatus);
	const restore = usePlanStore((s) => s.restoreSpreadsheet);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			kicker: "One place to type",
			title: "Inputs",
			lede: "Everything the projection reads. The spreadsheet scattered these across tabs. Restoring puts the 24 October 2026 workbook figures back."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 flex flex-wrap gap-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: ghostClass,
				type: "button",
				onClick: () => restore(),
				children: "Restore spreadsheet figures"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Dates and targets",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateField, {
					label: "Plan date",
					value: inputs.asOf,
					onChange: (asOf) => setInputs({ asOf })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateField, {
					label: "Date of birth",
					value: inputs.dob,
					onChange: (dob) => setInputs({ dob })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Retirement age",
					value: inputs.retirementAge,
					onChange: (retirementAge) => setInputs({ retirementAge })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Legal pension age",
					value: inputs.legalAge,
					onChange: (legalAge) => setInputs({ legalAge })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Safety buffer",
					value: inputs.safety,
					onChange: (safety) => setInputs({ safety })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Income cap / year",
					value: inputs.maxYearIncome,
					onChange: (maxYearIncome) => setInputs({ maxYearIncome })
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Growth",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pct, {
					label: "Base growth",
					value: inputs.roi,
					onChange: (roi) => setInputs({ roi })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pct, {
					label: "Cautious",
					value: inputs.cautiousRoi,
					onChange: (cautiousRoi) => setInputs({ cautiousRoi })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pct, {
					label: "Poor",
					value: inputs.poorRoi,
					onChange: (poorRoi) => setInputs({ poorRoi })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pct, {
					label: "Loan rate",
					value: inputs.loanRate,
					onChange: (loanRate) => setInputs({ loanRate })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pct, {
					label: "Mortgage rate",
					value: inputs.mortgageRate,
					onChange: (mortgageRate) => setInputs({ mortgageRate })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pct, {
					label: "Copperpot rate",
					value: inputs.copperpotRate,
					onChange: (copperpotRate) => setInputs({ copperpotRate })
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Monthly amounts",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Loan payment",
					value: inputs.loanPayment,
					onChange: (loanPayment) => setInputs({ loanPayment })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Mortgage payment",
					value: inputs.mortgagePayment,
					onChange: (mortgagePayment) => setInputs({ mortgagePayment })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Copperpot",
					value: inputs.savingContribution,
					onChange: (savingContribution) => setInputs({ savingContribution })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Investment",
					value: inputs.investmentContribution,
					onChange: (investmentContribution) => setInputs({ investmentContribution })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Pension",
					value: inputs.pensionContribution,
					onChange: (pensionContribution) => setInputs({ pensionContribution })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "State pension £ / week",
					value: inputs.statePensionWeekly,
					onChange: (statePensionWeekly) => setInputs({ statePensionWeekly })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Card budget",
					value: inputs.cardBudget,
					onChange: (cardBudget) => setInputs({ cardBudget })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Everyday / week",
					value: inputs.weekSpend,
					onChange: (weekSpend) => setInputs({ weekSpend })
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Balances",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Mat loan",
					value: inputs.matLoan,
					onChange: (matLoan) => setInputs({ matLoan })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Han loan",
					value: inputs.hanLoan,
					onChange: (hanLoan) => setInputs({ hanLoan })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Mortgage",
					value: inputs.mortgage,
					onChange: (mortgage) => setInputs({ mortgage })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Stocks ISA",
					value: inputs.isa,
					onChange: (isa) => setInputs({ isa })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Trading 212",
					value: inputs.trading,
					onChange: (trading) => setInputs({ trading })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Copperpot",
					value: inputs.copperpot,
					onChange: (copperpot) => setInputs({ copperpot })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Pension pot",
					value: inputs.pension,
					onChange: (pension) => setInputs({ pension })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Lump sum at 66",
					value: inputs.lumpSum,
					onChange: (lumpSum) => setInputs({ lumpSum })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Reward opening",
					value: inputs.rewardOpen,
					onChange: (rewardOpen) => setInputs({ rewardOpen })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Ultimate opening",
					value: inputs.ultimateOpen,
					onChange: (ultimateOpen) => setInputs({ ultimateOpen })
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Pension income, yearly, at those ages",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Han Aviva",
					value: inputs.hanAv,
					onChange: (hanAv) => setInputs({ hanAv })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Han final salary",
					value: inputs.hanFinal,
					onChange: (hanFinal) => setInputs({ hanFinal })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Mat USS",
					value: inputs.matUss,
					onChange: (matUss) => setInputs({ matUss })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Mat LGPS",
					value: inputs.matLgps,
					onChange: (matLgps) => setInputs({ matLgps })
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display mt-10 text-2xl",
			children: "Renewals"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-1 max-w-2xl text-sm text-muted",
			children: [
				"Mentioned once the start date has arrived. As of ",
				prettyDate(inputs.asOf),
				". New ones belong in this list, not as separate reminders."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 divide-y divide-line overflow-hidden rounded-card border border-line bg-card",
			children: renewals.map((renewal) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: renewal.item
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						renewal.renews ? `Renews ${renewal.renews}` : "Date unknown",
						renewal.startComparing ? ` · look from ${prettyDate(renewal.startComparing)}` : "",
						renewal.action ? ` · ${renewal.action}` : ""
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: renewal.status === "done" ? buttonClass : ghostClass,
					onClick: () => setStatus(renewal.id, renewal.status === "done" ? "open" : "done"),
					children: renewal.status === "done" ? "Done" : renewal.status === "ask" ? "Still need a date" : "Mark done"
				})]
			}, renewal.id))
		})
	] });
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
			children
		})]
	});
}
function Num({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
		label,
		value,
		display: (n) => String(n),
		parse: (raw) => Number(raw),
		onChange
	});
}
function Pct({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
		label,
		value,
		display: (n) => String(Math.round(n * 1e4) / 100),
		parse: (raw) => Number(raw) / 100,
		onChange
	});
}
function TextField({ label, value, display, parse, onChange }) {
	const [text, setText] = (0, import_react.useState)(() => display(value));
	const [focused, setFocused] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!focused) setText(Number.isFinite(value) ? display(value) : "");
	}, [
		value,
		focused,
		display
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "text-sm text-muted",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: `${fieldClass} mt-1`,
			inputMode: "decimal",
			value: text,
			onFocus: () => setFocused(true),
			onBlur: () => {
				setFocused(false);
				const next = parse(text);
				if (text.trim() === "" || text === "-" || Number.isNaN(next)) setText(Number.isFinite(value) ? display(value) : "");
				else onChange(next);
			},
			onChange: (e) => {
				const raw = e.target.value;
				setText(raw);
				if (raw === "" || raw === "-" || raw === "." || raw === "-." || raw.endsWith(".")) return;
				const next = parse(raw);
				if (Number.isFinite(next)) onChange(next);
			}
		})]
	});
}
function DateField({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "text-sm text-muted",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: `${fieldClass} mt-1`,
			type: "date",
			value,
			onChange: (e) => onChange(e.target.value)
		})]
	});
}
//#endregion
export { InputsPage as component };
