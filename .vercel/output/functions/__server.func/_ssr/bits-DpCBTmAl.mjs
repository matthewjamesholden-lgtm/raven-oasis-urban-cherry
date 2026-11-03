import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bits-DpCBTmAl.js
var import_jsx_runtime = require_jsx_runtime();
function gbp(value, digits = 0) {
	const formatted = Math.abs(value).toLocaleString("en-GB", {
		style: "currency",
		currency: "GBP",
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	});
	return value < -.004 ? `−${formatted}` : formatted;
}
function years(age) {
	return age.toLocaleString("en-GB", {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1
	});
}
function prettyDate(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
		timeZone: "UTC"
	});
}
function monthLabel(iso) {
	const [y, m] = iso.split("-").map(Number);
	return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-GB", {
		month: "long",
		year: "numeric",
		timeZone: "UTC"
	});
}
function addMonths(iso, count) {
	const [y, m, d] = iso.split("-").map(Number);
	const first = new Date(Date.UTC(y, m - 1 + count, 1));
	const dim = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
	const day = Math.min(d, dim);
	const yy = first.getUTCFullYear();
	const mm = first.getUTCMonth() + 1;
	return `${yy}-${String(mm).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
function pct(rate) {
	return `${(rate * 100).toLocaleString("en-GB", { maximumFractionDigits: 2 })}%`;
}
function PageTitle({ kicker, title, lede }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-6 max-w-2xl",
		children: [
			kicker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-widest text-pine uppercase",
				children: kicker
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-1 text-3xl tracking-tight text-ink sm:text-4xl",
				children: title
			}),
			lede ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-base leading-relaxed text-muted",
				children: lede
			}) : null
		]
	});
}
function Stat({ label, value, hint, tone = "ink" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-card border border-line bg-card px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-wide text-muted uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `font-display mt-2 text-3xl tracking-tight ${tone === "pine" ? "text-pine" : tone === "clay" ? "text-clay" : "text-ink"}`,
				children: value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: hint
			}) : null
		]
	});
}
function Money({ value, digits = 0 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: value < -.004 ? "text-clay" : "text-ink",
		children: gbp(value, digits)
	});
}
var fieldClass = "min-h-11 w-full rounded-xl border border-line bg-paper px-3 py-2 text-ink outline-none focus:border-pine";
var buttonClass = "inline-flex min-h-11 items-center justify-center rounded-full bg-pine px-4 py-2 text-sm font-semibold text-pine-ink hover:opacity-90";
var ghostClass = "inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-card px-4 py-2 text-sm font-semibold text-ink hover:bg-paper";
//#endregion
export { buttonClass as a, ghostClass as c, prettyDate as d, years as f, addMonths as i, monthLabel as l, PageTitle as n, fieldClass as o, Stat as r, gbp as s, Money as t, pct as u };
