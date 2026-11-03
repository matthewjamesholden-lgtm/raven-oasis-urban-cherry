import { i as addMonths } from "./bits-DpCBTmAl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cashflow-x2AQsW6B.js
function sortPayments(payments) {
	return [...payments].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
}
function runCash(payments, rewardOpen, ultimateOpen) {
	let reward = rewardOpen;
	let ultimate = ultimateOpen;
	const lines = [];
	for (const payment of sortPayments(payments)) {
		if (payment.account === "reward") reward += payment.amount;
		else ultimate += payment.amount;
		lines.push({
			...payment,
			reward,
			ultimate,
			total: reward + ultimate
		});
	}
	return lines;
}
/** Transfers that would stop Ultimate going overdrawn, taken from Reward the same day. */
function coverUltimate(payments, rewardOpen, ultimateOpen) {
	let reward = rewardOpen;
	let ultimate = ultimateOpen;
	const hints = [];
	const lines = [];
	for (const payment of sortPayments(payments)) {
		if (payment.account === "ultimate" && ultimate + payment.amount < -.005) {
			const need = -(ultimate + payment.amount);
			const move = Math.min(need, Math.max(reward, 0));
			if (move > .5) {
				hints.push({
					date: payment.date,
					amount: move,
					item: payment.item
				});
				reward -= move;
				ultimate += move;
			}
		}
		if (payment.account === "reward") reward += payment.amount;
		else ultimate += payment.amount;
		lines.push({
			...payment,
			reward,
			ultimate,
			total: reward + ultimate
		});
	}
	return {
		hints,
		lines
	};
}
function lowsBetween(lines, from, to, start) {
	let reward = start.reward;
	let ultimate = start.ultimate;
	let total = reward + ultimate;
	let seen = false;
	for (const line of lines) {
		if (line.date < from || line.date >= to) continue;
		seen = true;
		reward = Math.min(reward, line.reward);
		ultimate = Math.min(ultimate, line.ultimate);
		total = Math.min(total, line.total);
	}
	if (!seen) return {
		reward: start.reward,
		ultimate: start.ultimate,
		total: start.reward + start.ultimate
	};
	return {
		reward,
		ultimate,
		total
	};
}
function balanceAt(lines, beforeDate, rewardOpen, ultimateOpen) {
	let reward = rewardOpen;
	let ultimate = ultimateOpen;
	for (const line of lines) {
		if (line.date >= beforeDate) break;
		reward = line.reward;
		ultimate = line.ultimate;
	}
	return {
		reward,
		ultimate
	};
}
function nextQuarter(asOf) {
	return {
		from: asOf,
		to: addMonths(asOf, 3)
	};
}
function groupHints(hints) {
	const map = /* @__PURE__ */ new Map();
	for (const hint of hints) {
		const key = hint.date.slice(0, 7);
		map.set(key, (map.get(key) ?? 0) + hint.amount);
	}
	return [...map.entries()].map(([month, amount]) => ({
		month,
		amount
	}));
}
//#endregion
export { nextQuarter as a, lowsBetween as i, coverUltimate as n, runCash as o, groupHints as r, balanceAt as t };
