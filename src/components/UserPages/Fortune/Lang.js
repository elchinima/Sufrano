export const translations = {
	az: {
		"hero_title": "🎡 Uğur Çarxı",
		"hey_user": "Salam, {name}!",
		"hero_desc": "Çarxı fırladın və Süfrano-dan eksklüziv hədiyyə qazanın!",
		"btn_spinning": "Fırladılır...",
		"btn_loading": "Yüklənir...",
		"btn_spin": "Çarxı fırladın!",
		"btn_cooldown_active": "Promokod artıq aktivdir!",
		"btn_cooldown_weekly": "Həftədə 1 dəfə fırlatmaq olar",
		"note_active_promo": "Aktiv promokodunuz var ✨",
		"note_already_spun": "Bu həftə artıq çarxı fırlatmısınız.",
		"btn_copy": "Kopyala",
		"btn_copied": "Kopyalandı!",
		"prize_congratulations": "Təbriklər!",
		"prize_your_code": "Sizin promokodunuz",
		"prize_copy_tooltip": "Kopyalamaq üçün klikləyin",
		"prize_valid_until": "Bitmə tarixi: ",
		"prize_fallback_heading": "Uğurlar!",
		"prize_fallback_desc": "Narahat olmayın — növbəti həftə çarxı yenidən fırlada bilərsiniz!",
		"prize_btn_view_promos": "Promokodlarıma bax",
		"prize_btn_close": "Bağla",
		"time_days": "g",
		"time_hours": "s",
		"time_minutes": "d",
		"time_seconds": "s"
	},
	ru: {
		"hero_title": "🎡 Колесо Фортуны",
		"hey_user": "Привет, {name}!",
		"hero_desc": "Вращайте колесо и выигрывайте эксклюзивные награды от Süfrano!",
		"btn_spinning": "Вращение...",
		"btn_loading": "Загрузка...",
		"btn_spin": "Вращать колесо!",
		"btn_cooldown_active": "Промокод уже активен!",
		"btn_cooldown_weekly": "1 вращение в неделю",
		"note_active_promo": "У вас есть активный промокод ✨",
		"note_already_spun": "Вы уже крутили колесо на этой неделе.",
		"btn_copy": "Копировать",
		"btn_copied": "Скопировано!",
		"prize_congratulations": "Поздравляем!",
		"prize_your_code": "Ваш промокод",
		"prize_copy_tooltip": "Нажмите, чтобы скопировать",
		"prize_valid_until": "Действует до: ",
		"prize_fallback_heading": "Удачи в следующий раз!",
		"prize_fallback_desc": "Не расстраивайтесь — на следующей неделе вас ждёт новое вращение!",
		"prize_btn_view_promos": "Мои промокоды",
		"prize_btn_close": "Закрыть",
		"time_days": "д",
		"time_hours": "ч",
		"time_minutes": "м",
		"time_seconds": "с"
	},
	en: {
		"hero_title": "🎡 Wheel of Fortune",
		"hey_user": "Hey, {name}!",
		"hero_desc": "Spin the wheel and win an exclusive Süfrano reward!",
		"btn_spinning": "Spinning...",
		"btn_loading": "Loading...",
		"btn_spin": "Spin the Wheel!",
		"btn_cooldown_active": "Promo already active!",
		"btn_cooldown_weekly": "1 spin per week",
		"note_active_promo": "You have an active promo code ✨",
		"note_already_spun": "You have already spun the wheel this week.",
		"btn_copy": "Copy",
		"btn_copied": "Copied!",
		"prize_congratulations": "Congratulations!",
		"prize_your_code": "Your promo code",
		"prize_copy_tooltip": "Click to copy",
		"prize_valid_until": "Valid until ",
		"prize_fallback_heading": "Better luck next time!",
		"prize_fallback_desc": "Don't worry — there is always another spin waiting for you next week!",
		"prize_btn_view_promos": "View My Promos",
		"prize_btn_close": "Close",
		"time_days": "d",
		"time_hours": "h",
		"time_minutes": "m",
		"time_seconds": "s"
	}
};

export const getFortuneTranslation = (lang, key, params = {}) => {
	const currentLang = lang || "az";
	const dict = translations[currentLang] || translations.az || translations.ru || translations.en;
	let text = dict[key] || (translations.en && translations.en[key]) || key;
	if (params) {
		Object.keys(params).forEach((paramKey) => {
			text = text.replace(new RegExp(`\\{${paramKey}\\}`, "g"), params[paramKey]);
		});
	}
	return text;
};
