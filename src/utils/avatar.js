export const DEFAULT_USER_AVATAR = "/assets/images/user_default_avatar.webp";

export function isDefaultAvatarUrl(url) {
	if (typeof url !== "string") return true;
	const trimmed = url.trim();
	if (!trimmed) return true;
	const pathWithoutQuery = trimmed.split(/[?#]/)[0].toLowerCase();
	return pathWithoutQuery === DEFAULT_USER_AVATAR || pathWithoutQuery.endsWith("/user_default_avatar.webp");
}

export function getUserAvatarUrl(url) {
	return isDefaultAvatarUrl(url) ? DEFAULT_USER_AVATAR : url.trim();
}

export function handleAvatarError(e) {
	const img = e?.currentTarget;
	if (!img || isDefaultAvatarUrl(img.getAttribute("src")) || isDefaultAvatarUrl(img.src)) return;
	img.src = DEFAULT_USER_AVATAR;
}
