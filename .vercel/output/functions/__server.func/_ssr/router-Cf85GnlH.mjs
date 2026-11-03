import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, x as useRouter, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Cf85GnlH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var SEED_INPUTS = {
	asOf: "2026-10-24",
	dob: "1987-04-12",
	retirementAge: 52.9,
	legalAge: 58,
	safety: 5e3,
	maxYearIncome: 60600,
	roi: .065,
	cautiousRoi: .04,
	poorRoi: .02,
	loanRate: .062,
	mortgageRate: .0389,
	copperpotRate: .035,
	loanPayment: 1353.58,
	mortgagePayment: 1128.29,
	savingContribution: 200,
	investmentContribution: 550,
	pensionContribution: 618.46,
	statePensionWeekly: 241.3,
	lumpSum: 29799.07,
	hanAv: 11886.65,
	hanFinal: 4469.11,
	matUss: 9933.02,
	matLgps: 2481.29,
	matLoan: -32111.98,
	hanLoan: -23230.59,
	mortgage: -227232.21,
	isa: 5907.68,
	copperpot: 482.26,
	pension: 59033.28,
	trading: 2981.64,
	rewardOpen: 561.81,
	ultimateOpen: 3959.6,
	cardBudget: 2200,
	weekSpend: 480
};
var MONTHS = {
	"2026-10": [
		[
			"Netball",
			-20,
			"U"
		],
		[
			"Car",
			-405.09,
			"R"
		],
		[
			"Lloyds",
			-400,
			"U"
		],
		[
			"Credit card",
			-2500,
			"U"
		],
		[
			"Mat pay",
			3583.41,
			"R"
		],
		[
			"Sky",
			-75,
			"U"
		],
		[
			"Car small",
			-12.979,
			"U"
		],
		[
			"Servicing",
			-16,
			"U"
		],
		[
			"Investment",
			-250,
			"R"
		],
		[
			"Netball",
			-180,
			"U"
		],
		[
			"Chairs",
			-85,
			"U"
		],
		[
			"Water",
			-131.61,
			"U"
		],
		[
			"Villa",
			-170,
			"U"
		]
	],
	"2026-11": [
		[
			"Life insurance",
			-38.79,
			"U"
		],
		[
			"Council",
			-320,
			"U"
		],
		[
			"Sofa",
			-41.6,
			"U"
		],
		[
			"Mortgage",
			-1128.29,
			"U"
		],
		[
			"Bulb",
			-200,
			"U"
		],
		[
			"Loan",
			-953.58,
			"U"
		],
		[
			"Child benefit",
			179.8,
			"U"
		],
		[
			"TV",
			-12.97,
			"U"
		],
		[
			"Credit union",
			-200,
			"R"
		],
		[
			"Han pay",
			3343,
			"U"
		],
		[
			"Car",
			-405.09,
			"R"
		],
		[
			"Lloyds",
			-400,
			"U"
		],
		[
			"Credit card",
			-2200,
			"U"
		],
		[
			"Mat pay",
			3583.41,
			"R"
		],
		[
			"Sky",
			-75,
			"U"
		],
		[
			"Car small",
			-12.979,
			"U"
		],
		[
			"Servicing",
			-16,
			"U"
		]
	],
	"2026-12": [
		[
			"Investment",
			-550,
			"R"
		],
		[
			"Netball",
			-180,
			"U"
		],
		[
			"Water",
			-131.61,
			"U"
		],
		[
			"Villa",
			-170,
			"U"
		],
		[
			"Life insurance",
			-38.79,
			"U"
		],
		[
			"Council",
			-320,
			"U"
		],
		[
			"Mortgage",
			-1128.29,
			"U"
		],
		[
			"Bulb",
			-200,
			"U"
		],
		[
			"Loan",
			-953.58,
			"U"
		],
		[
			"Child benefit",
			179.8,
			"U"
		],
		[
			"TV",
			-12.97,
			"U"
		],
		[
			"Credit union",
			-200,
			"R"
		],
		[
			"Han pay",
			3343,
			"U"
		],
		[
			"Car",
			-405.09,
			"R"
		],
		[
			"Lloyds",
			-400,
			"U"
		],
		[
			"Credit card",
			-2200,
			"U"
		],
		[
			"Mat pay",
			3583.41,
			"R"
		],
		[
			"Sky",
			-75,
			"U"
		],
		[
			"Car small",
			-12.979,
			"U"
		]
	],
	"2027-01": [
		[
			"Servicing",
			-16,
			"U"
		],
		[
			"Investment",
			-550,
			"R"
		],
		[
			"Netball",
			-180,
			"U"
		],
		[
			"Water",
			-131.61,
			"U"
		],
		[
			"Villa",
			-170,
			"U"
		],
		[
			"Life insurance",
			-38.79,
			"U"
		],
		[
			"Council",
			-320,
			"U"
		],
		[
			"Mortgage",
			-1128.29,
			"U"
		],
		[
			"Bulb",
			-200,
			"U"
		],
		[
			"Loan",
			-953.58,
			"U"
		],
		[
			"Child benefit",
			179.8,
			"U"
		],
		[
			"TV",
			-12.97,
			"U"
		],
		[
			"Credit union",
			-200,
			"R"
		],
		[
			"Han pay",
			3343,
			"U"
		],
		[
			"Car",
			-405.09,
			"R"
		],
		[
			"Lloyds",
			-400,
			"U"
		],
		[
			"Credit card",
			-2200,
			"U"
		],
		[
			"Mat pay",
			3583.41,
			"R"
		],
		[
			"Sky",
			-75,
			"U"
		]
	],
	"2027-02": [
		[
			"Car small",
			-12.979,
			"U"
		],
		[
			"Servicing",
			-16,
			"U"
		],
		[
			"Investment",
			-550,
			"R"
		],
		[
			"Netball",
			-180,
			"U"
		],
		[
			"Water",
			-131.61,
			"U"
		],
		[
			"Villa",
			-170,
			"U"
		],
		[
			"Life insurance",
			-38.79,
			"U"
		],
		[
			"Mortgage",
			-1128.29,
			"U"
		],
		[
			"Bulb",
			-200,
			"U"
		],
		[
			"Loan",
			-953.58,
			"U"
		],
		[
			"Child benefit",
			179.8,
			"U"
		],
		[
			"TV",
			-12.97,
			"U"
		],
		[
			"Credit union",
			-200,
			"R"
		],
		[
			"Han pay",
			3343,
			"U"
		],
		[
			"Car",
			-405.09,
			"R"
		],
		[
			"Lloyds",
			-400,
			"U"
		],
		[
			"Credit card",
			-2200,
			"U"
		]
	],
	"2027-03": [
		[
			"Mat pay",
			3583.41,
			"R"
		],
		[
			"Sky",
			-75,
			"U"
		],
		[
			"Car small",
			-12.979,
			"U"
		],
		[
			"Servicing",
			-16,
			"U"
		],
		[
			"Investment",
			-550,
			"R"
		],
		[
			"Netball",
			-180,
			"U"
		],
		[
			"Water",
			-131.61,
			"U"
		],
		[
			"Villa",
			-170,
			"U"
		],
		[
			"Life insurance",
			-38.79,
			"U"
		],
		[
			"Mortgage",
			-1128.29,
			"U"
		],
		[
			"Bulb",
			-200,
			"U"
		],
		[
			"Loan",
			-953.58,
			"U"
		],
		[
			"Child benefit",
			179.8,
			"U"
		],
		[
			"TV",
			-12.97,
			"U"
		],
		[
			"Credit union",
			-200,
			"R"
		],
		[
			"Han pay",
			3343,
			"U"
		],
		[
			"Car",
			-405.09,
			"R"
		],
		[
			"Lloyds",
			-400,
			"U"
		],
		[
			"Credit card",
			-2200,
			"U"
		],
		[
			"Mat pay",
			3583.41,
			"R"
		]
	]
};
function seedPayments() {
	const out = [];
	let n = 1;
	for (const month of Object.keys(MONTHS)) MONTHS[month].forEach((row, index) => {
		const day = String(index + 1).padStart(2, "0");
		out.push({
			id: `pay-${n++}`,
			date: `${month}-${day}`,
			item: row[0],
			amount: row[1],
			account: row[2] === "R" ? "reward" : "ultimate",
			status: "estimate"
		});
	});
	return out;
}
var SEED_CARDS = [
	{
		id: "tesco",
		name: "Tesco",
		paidHow: "Direct debit",
		balance: 0,
		apr: 0,
		monthlyPayment: 0,
		statementDay: null,
		dueDay: null
	},
	{
		id: "amex",
		name: "Amex",
		paidHow: "Paid by hand",
		balance: 0,
		apr: 0,
		monthlyPayment: 0,
		statementDay: null,
		dueDay: null
	},
	{
		id: "lloyds",
		name: "Lloyds",
		paidHow: "Monthly payment from Ultimate",
		balance: 0,
		apr: 0,
		monthlyPayment: 400,
		statementDay: null,
		dueDay: null
	}
];
var SEED_TRIPS = [
	{
		id: "xat-2026-easter",
		code: "XAT-2026-E",
		place: "Xativa",
		when: "Easter 2026",
		flights: 0,
		stay: 0,
		car: 0,
		spend: 0
	},
	{
		id: "dl-2026-may",
		code: "DL-2026-05",
		place: "Disneyland / Xativa",
		when: "May 2026",
		flights: 0,
		stay: 0,
		car: 0,
		spend: 0
	},
	{
		id: "xat-2026-summer",
		code: "XAT-2026-S",
		place: "Xativa",
		when: "Summer 2026",
		flights: 0,
		stay: 0,
		car: 0,
		spend: 0
	},
	{
		id: "xat-2026-oct",
		code: "XAT-2026-10",
		place: "Xativa",
		when: "October 2026",
		flights: 0,
		stay: 0,
		car: 0,
		spend: 0
	},
	{
		id: "car-2026-xmas",
		code: "CAR-2026-12",
		place: "Caribbean",
		when: "Christmas 2026",
		flights: 0,
		stay: 0,
		car: 0,
		spend: 0
	},
	{
		id: "xat-2027-easter",
		code: "XAT-2027-E",
		place: "Xativa",
		when: "Easter 2027",
		flights: 0,
		stay: 0,
		car: 0,
		spend: 0
	},
	{
		id: "xat-2027-summer",
		code: "XAT-2027-S",
		place: "Xativa",
		when: "Summer 2027",
		flights: 0,
		stay: 0,
		car: 0,
		spend: 0
	}
];
var HOLIDAY_ROWS = [
	[
		2007,
		"",
		"",
		"",
		"Tunisia",
		"",
		""
	],
	[
		2012,
		"",
		"",
		"",
		"",
		"",
		"Cruise"
	],
	[
		2013,
		"",
		"",
		"",
		"",
		"",
		"Wales"
	],
	[
		2014,
		"",
		"Fuerteventura",
		"",
		"Javea — Casa Ignaz",
		"",
		""
	],
	[
		2015,
		"",
		"Javea — Villa Paulina",
		"",
		"",
		"",
		"Robin Hood's"
	],
	[
		2016,
		"",
		"Greece — Laguna",
		"",
		"",
		"",
		""
	],
	[
		2017,
		"",
		"Javea — Chimenas",
		"",
		"",
		"",
		""
	],
	[
		2018,
		"",
		"Disney",
		"",
		"Javea — Villa Nina",
		"",
		"France"
	],
	[
		2019,
		"",
		"Greece — Rinela",
		"Italy",
		"France",
		"",
		"Disney"
	],
	[
		2020,
		"Telford",
		"",
		"",
		"Gandia",
		"",
		""
	],
	[
		2021,
		"",
		"",
		"",
		"Xativa",
		"Xativa",
		""
	],
	[
		2022,
		"Disney",
		"Greece — Laguna",
		"Xativa",
		"Xativa",
		"Xativa",
		"Cruise"
	],
	[
		2023,
		"Paris / Xativa",
		"Xativa",
		"Xativa",
		"Xativa",
		"Xativa",
		"Xativa"
	],
	[
		2024,
		"Xativa",
		"Xativa",
		"Xativa",
		"Xativa",
		"Xativa",
		"Disney"
	],
	[
		2025,
		"Xativa",
		"Xativa / Heraklion",
		"Xativa",
		"Xativa / US",
		"Xativa",
		""
	],
	[
		2026,
		"",
		"Xativa",
		"DL / Xativa",
		"Xativa",
		"Xativa",
		"Caribbean"
	],
	[
		2027,
		"",
		"Xativa",
		"Xativa",
		"Xativa",
		"Xativa",
		""
	]
];
var TERMS = [
	"February",
	"Easter",
	"May",
	"Summer",
	"October",
	"Christmas"
];
function seedHolidays() {
	const out = [];
	for (const row of HOLIDAY_ROWS) {
		const year = row[0];
		TERMS.forEach((term, index) => {
			const place = row[index + 1];
			if (typeof place === "string" && place) out.push({
				year,
				term,
				place
			});
		});
	}
	return out;
}
var SEED_WORKS = [
	{
		id: "beam",
		item: "Beam",
		estimate: 8500,
		forecast: 0,
		paid: 3e3
	},
	{
		id: "plumbing",
		item: "Plumbing",
		estimate: 500,
		forecast: 0,
		paid: 2070
	},
	{
		id: "ufh",
		item: "Underfloor heating",
		estimate: 6360,
		forecast: 0,
		paid: 6360
	},
	{
		id: "kitchen",
		item: "Kitchen",
		estimate: 500,
		forecast: 500,
		paid: 0
	},
	{
		id: "skirting",
		item: "Skirting",
		estimate: 920,
		forecast: 0,
		paid: 920
	},
	{
		id: "joinery",
		item: "Joinery",
		estimate: 600,
		forecast: 0,
		paid: 480
	},
	{
		id: "plaster",
		item: "Plastering",
		estimate: 2e3,
		forecast: 0,
		paid: 755
	},
	{
		id: "window",
		item: "Window",
		estimate: 500,
		forecast: 0,
		paid: 370
	},
	{
		id: "floor",
		item: "Flooring",
		estimate: 5500,
		forecast: 0,
		paid: 6632
	},
	{
		id: "council",
		item: "Council",
		estimate: 450,
		forecast: 0,
		paid: 438.9
	},
	{
		id: "wardrobes",
		item: "Wardrobes",
		estimate: 5400,
		forecast: 0,
		paid: 4400
	},
	{
		id: "ovens",
		item: "Ovens",
		estimate: 650,
		forecast: 0,
		paid: 620
	}
];
var SEED_RENEWALS = [
	{
		id: "aureli",
		item: "Aureli Pro",
		provider: "Aureli",
		cost: "",
		renews: "Ask",
		startComparing: "2026-10-31",
		action: "Check the renewal price",
		status: "open"
	},
	{
		id: "play",
		item: "Google Play",
		provider: "Google",
		cost: "",
		renews: "Ask",
		startComparing: "2026-11-16",
		action: "Check the subscription",
		status: "open"
	},
	{
		id: "tucson",
		item: "Tucson insurance",
		provider: "",
		cost: "",
		renews: "2026-12-14",
		startComparing: "2026-11-20",
		action: "Flag only. Home compares the quotes.",
		status: "open"
	},
	{
		id: "puma",
		item: "Puma insurance",
		provider: "",
		cost: "",
		renews: "2027",
		startComparing: "2027-02-15",
		action: "Compare before renewal",
		status: "open"
	},
	{
		id: "puma-xs",
		item: "Puma excess",
		provider: "",
		cost: "",
		renews: "2027",
		startComparing: "2027-02-15",
		action: "Compare before renewal",
		status: "open"
	},
	{
		id: "tsb",
		item: "TSB mortgage",
		provider: "TSB",
		cost: "",
		renews: "2027-07",
		startComparing: "2027-01-04",
		action: "Compare remortgage and product transfer. Fix ends around July 2027.",
		status: "open"
	},
	{
		id: "gas",
		item: "Gas fix",
		provider: "",
		cost: "",
		renews: "2027",
		startComparing: "2027-08-01",
		action: "Compare tariffs",
		status: "open"
	},
	{
		id: "hire-xs",
		item: "Car hire excess",
		provider: "",
		cost: "",
		renews: "2027",
		startComparing: "2027-09-12",
		action: "Compare before renewal",
		status: "open"
	},
	{
		id: "home",
		item: "Home insurance",
		provider: "Policy Expert",
		cost: "",
		renews: "2027-10-22",
		startComparing: "2027-09-15",
		action: "Payment is taken about 5 days before renewal. Compare in mid-September.",
		status: "open"
	},
	{
		id: "hyundai",
		item: "Hyundai plan",
		provider: "",
		cost: "",
		renews: "2028",
		startComparing: "2028-04-01",
		action: "Compare before renewal",
		status: "open"
	},
	{
		id: "sky",
		item: "Sky",
		provider: "Sky",
		cost: "",
		renews: "Ask",
		startComparing: "",
		action: "End date still needed",
		status: "ask"
	},
	{
		id: "hcp",
		item: "HCP",
		provider: "",
		cost: "",
		renews: "Ask",
		startComparing: "",
		action: "End date still needed",
		status: "ask"
	},
	{
		id: "ald",
		item: "ALD",
		provider: "",
		cost: "",
		renews: "Ask",
		startComparing: "",
		action: "End date still needed",
		status: "ask"
	},
	{
		id: "life",
		item: "Life cover",
		provider: "",
		cost: "",
		renews: "Ask",
		startComparing: "",
		action: "End date still needed",
		status: "ask"
	}
];
function fresh() {
	return {
		inputs: SEED_INPUTS,
		payments: seedPayments(),
		cards: SEED_CARDS,
		charges: [],
		trips: SEED_TRIPS,
		holidays: seedHolidays(),
		works: SEED_WORKS,
		renewals: SEED_RENEWALS
	};
}
var usePlanStore = create()(persist((set) => ({
	...fresh(),
	setInputs: (patch) => set((s) => ({ inputs: {
		...s.inputs,
		...patch
	} })),
	upsertPayment: (payment) => set((s) => ({ payments: s.payments.some((p) => p.id === payment.id) ? s.payments.map((p) => p.id === payment.id ? payment : p) : [...s.payments, payment] })),
	removePayment: (id) => set((s) => ({ payments: s.payments.filter((p) => p.id !== id) })),
	upsertCharge: (charge) => set((s) => ({ charges: s.charges.some((c) => c.id === charge.id) ? s.charges.map((c) => c.id === charge.id ? charge : c) : [...s.charges, charge] })),
	removeCharge: (id) => set((s) => ({ charges: s.charges.filter((c) => c.id !== id) })),
	updateCard: (id, patch) => set((s) => ({ cards: s.cards.map((c) => c.id === id ? {
		...c,
		...patch
	} : c) })),
	updateTrip: (id, patch) => set((s) => ({ trips: s.trips.map((t) => t.id === id ? {
		...t,
		...patch
	} : t) })),
	addTrip: (trip) => set((s) => ({ trips: [...s.trips, trip] })),
	setRenewalStatus: (id, status) => set((s) => ({ renewals: s.renewals.map((r) => r.id === id ? {
		...r,
		status
	} : r) })),
	updateWork: (id, patch) => set((s) => ({ works: s.works.map((w) => w.id === id ? {
		...w,
		...patch
	} : w) })),
	restoreSpreadsheet: () => set(fresh())
}), {
	name: "hearth-plan-v1",
	skipHydration: true
}));
var LINKS = [
	{
		to: "/",
		label: "Plan"
	},
	{
		to: "/cashflow",
		label: "Cashflow"
	},
	{
		to: "/cards",
		label: "Cards"
	},
	{
		to: "/trips",
		label: "Trips"
	},
	{
		to: "/projection",
		label: "Projection"
	},
	{
		to: "/inputs",
		label: "Inputs"
	}
];
function Shell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		usePlanStore.persist.rehydrate();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-line bg-card/80 backdrop-blur",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "font-display text-2xl tracking-tight text-ink",
						children: "Hearth"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Saved in this browser"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex gap-1 overflow-x-auto pb-1",
					"aria-label": "Sections",
					children: LINKS.map((link) => {
						const active = pathname === link.to;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: link.to,
							className: `min-h-11 shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${active ? "bg-ink text-paper" : "text-muted hover:bg-paper hover:text-ink"}`,
							children: link.label
						}, link.to);
					})
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8",
			children
		})]
	});
}
var styles_default = "/assets/styles-BAR4hAIP.css";
var Route$6 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Hearth" },
			{
				name: "theme-color",
				content: "#f3efe6"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,520;9..144,640&family=Source+Sans+3:wght@400;600;700&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$5 = () => import("./routes-DLK0nVaj.mjs");
var Route$5 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./cards-CWmiteDZ.mjs");
var Route$4 = createFileRoute("/cards")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./cashflow-BEFUQiA6.mjs");
var Route$3 = createFileRoute("/cashflow")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./inputs-BV50Xjmo.mjs");
var Route$2 = createFileRoute("/inputs")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./projection-BSjg670R.mjs");
var Route$1 = createFileRoute("/projection")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./trips-DBBpilHG.mjs");
var Route = createFileRoute("/trips")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$5.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$6
	}),
	CardsRoute: Route$4.update({
		id: "/cards",
		path: "/cards",
		getParentRoute: () => Route$6
	}),
	CashflowRoute: Route$3.update({
		id: "/cashflow",
		path: "/cashflow",
		getParentRoute: () => Route$6
	}),
	InputsRoute: Route$2.update({
		id: "/inputs",
		path: "/inputs",
		getParentRoute: () => Route$6
	}),
	ProjectionRoute: Route$1.update({
		id: "/projection",
		path: "/projection",
		getParentRoute: () => Route$6
	}),
	TripsRoute: Route.update({
		id: "/trips",
		path: "/trips",
		getParentRoute: () => Route$6
	})
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { usePlanStore as n, router_exports as t };
