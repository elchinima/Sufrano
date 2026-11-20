export const translations = {
	ru: {
		"subnav_advert": "Объявление",
		"subnav_review": "Отзывы",
		"advert_hero_title": "Объявление",
		"advert_hero_subtitle": "Актуальные акции, новости и специальные предложения от Süfrano.",
		"advert_count_singular": "активное объявление",
		"advert_count_plural": "активных объявлений",
		"advert_loading": "Загрузка объявлений...",
		"advert_empty_title": "Активных объявлений пока нет",
		"advert_empty_desc": "Следите за обновлениями — скоро здесь появятся новые акции и специальные предложения от Süfrano!",
		"advert_open_link": "Перейти",
		"advert_like": "Нравится"
	},
	en: {
		"subnav_advert": "Advert",
		"subnav_review": "Review",
		"advert_hero_title": "Advert",
		"advert_hero_subtitle": "Discover the latest promotions, news, and special offers from Süfrano.",
		"advert_count_singular": "active advert",
		"advert_count_plural": "active adverts",
		"advert_loading": "Loading adverts...",
		"advert_empty_title": "No active adverts yet",
		"advert_empty_desc": "Stay tuned — new promotions and special offers from Süfrano will appear here soon!",
		"advert_open_link": "Explore",
		"advert_like": "Like"
	},
	az: {
		"subnav_advert": "Elanlar",
		"subnav_review": "Rəylər",
		"advert_hero_title": "Elanlar",
		"advert_hero_subtitle": "Süfrano-dan ən son aksiyalar, xəbərlər və xüsusi təkliflərlə tanış olun.",
		"advert_count_singular": "aktiv elan",
		"advert_count_plural": "aktiv elan",
		"advert_loading": "Elanlar yüklənir...",
		"advert_empty_title": "Hələlik aktiv elan yoxdur",
		"advert_empty_desc": "Yenilikləri izləyin — tezliklə burada Süfrano-dan yeni aksiyalar və xüsusi təkliflər paylaşılacaq!",
		"advert_open_link": "Keçid et",
		"advert_like": "Bəyən"
	}
};

export const getAdvertTranslation = (lang, dataId) => {
	const dict = translations[lang] || translations.ru;
	return dict[dataId] || translations.en[dataId] || dataId;
};
