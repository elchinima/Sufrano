import { getStoredLanguage } from "./useLang.js";

let cachedHints = {
	platformVersion: null,
	model: null
};
let hintsPromise = null;
if (typeof navigator !== "undefined" && navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
	hintsPromise = navigator.userAgentData.getHighEntropyValues(["platformVersion", "model"]).then((hints) => {
		if (hints) {
			if (hints.platformVersion) cachedHints.platformVersion = hints.platformVersion;
			if (hints.model) cachedHints.model = hints.model;
		}
		return cachedHints;
	}).catch(() => cachedHints);
}
export function getClientHintsHeaders() {
	const currentLang = getStoredLanguage() || "az";
	const headers = {
		"Accept-Language": currentLang,
		"X-Language": currentLang
	};
	if (cachedHints.platformVersion) {
		headers["X-Platform-Version"] = cachedHints.platformVersion;
	}
	if (cachedHints.model) {
		headers["X-Device-Model"] = cachedHints.model;
	}
	return headers;
}
export async function ensureClientHintsHeaders() {
	if (hintsPromise) {
		try {
			await hintsPromise;
		} catch {}
	}
	return getClientHintsHeaders();
}
